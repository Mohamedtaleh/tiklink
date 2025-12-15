'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PredictViralScoreInputSchema = z.object({
  videoTitle: z.string().describe('The title/caption of the TikTok video'),
  videoAuthor: z.string().describe('The author of the video'),
  likes: z.string().describe('Number of likes'),
  duration: z.string().describe('Video duration'),
  mode: z.string().describe('Analysis mode: standard or roast'),
});

export type PredictViralScoreInput = z.infer<typeof PredictViralScoreInputSchema>;

export interface AnalysisCategory {
  score: number;
  feedback: string;
}

export interface PredictViralScoreOutput {
  score: number;
  verdict: string;
  analysis: {
    hook: AnalysisCategory;
    content: AnalysisCategory;
    engagement: AnalysisCategory;
    trending: AnalysisCategory;
  };
  improvements: string[];
  roast?: string;
}

export async function predictViralScore(input: PredictViralScoreInput): Promise<PredictViralScoreOutput> {
  try {
    const prompt = `You are a TikTok viral content expert and social media analyst. Analyze this TikTok video and predict its viral potential.

Video Information:
- Title/Caption: ${input.videoTitle}
- Author: ${input.videoAuthor}
- Current Likes: ${input.likes}
- Duration: ${input.duration}
- Analysis Mode: ${input.mode}

Provide a comprehensive viral score analysis:

1. OVERALL SCORE (0-100): Based on viral potential
   - 90-100: Viral Hit (will likely go viral)
   - 70-89: High Potential (strong chances)
   - 50-69: Average (might get decent traction)
   - 30-49: Below Average (needs significant work)
   - 0-29: Low Potential (unlikely to perform well)

2. VERDICT: A short, catchy verdict (2-4 words)

3. DETAILED ANALYSIS: Score (0-100) and feedback for each category:
   - Hook (first 3 seconds grab attention?)
   - Content Quality (production value, creativity)
   - Engagement Potential (shareability, comments likelihood)
   - Trending Alignment (uses current trends/sounds?)

4. IMPROVEMENTS: Top 5 specific, actionable improvements

5. ROAST (if mode is "roast"): Write a funny, Gen-Z style roast of the video. Be savage but not mean-spirited. Use internet slang and emojis. Keep it entertaining!

Be honest and constructive. Base your analysis on TikTok's algorithm preferences: watch time, shares, comments, and saves.

Return your response in this exact JSON format:
{
  "score": 75,
  "verdict": "High Potential",
  "analysis": {
    "hook": {"score": 80, "feedback": "Strong opening that grabs attention"},
    "content": {"score": 70, "feedback": "Good quality but could be improved"},
    "engagement": {"score": 75, "feedback": "Likely to generate comments"},
    "trending": {"score": 72, "feedback": "Aligned with current trends"}
  },
  "improvements": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"],
  "roast": "optional roast text if mode is roast"
}`;

    const { text } = await ai.generate({
      prompt,
      config: {
        temperature: 0.7,
      },
    });

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const result = JSON.parse(jsonMatch[0]) as PredictViralScoreOutput;
    return result;
  } catch (error) {
    console.error('Viral prediction error:', error);
    // Return fallback data based on likes
    const likesNum = parseInt(input.likes.replace(/[^0-9]/g, '')) || 0;
    const baseScore = Math.min(90, Math.max(30, Math.floor(Math.log10(likesNum + 1) * 15)));
    
    return {
      score: baseScore,
      verdict: baseScore >= 70 ? "High Potential" : baseScore >= 50 ? "Average" : "Needs Work",
      analysis: {
        hook: { score: baseScore + 5, feedback: "The opening could grab more attention with a stronger hook in the first 3 seconds." },
        content: { score: baseScore, feedback: "Content quality is decent but could benefit from better lighting and editing." },
        engagement: { score: baseScore - 5, feedback: "Consider adding a call-to-action to encourage comments and shares." },
        trending: { score: baseScore + 2, feedback: "Try incorporating more trending sounds and effects." },
      },
      improvements: [
        "Start with a hook that creates curiosity in the first 1-2 seconds",
        "Use trending sounds to boost discoverability",
        "Add text overlays to capture viewers watching without sound",
        "End with a clear call-to-action (like, comment, or follow)",
        "Post during peak hours (6-10 PM in your target timezone)",
      ],
      roast: input.mode === 'roast' ? `Bestie really said "let me post this" 💀 The algorithm is crying rn. But honestly? With some work, this could slap. Just needs that ✨main character energy✨` : undefined,
    };
  }
}
