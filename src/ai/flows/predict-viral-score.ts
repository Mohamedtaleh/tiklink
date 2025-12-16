'use server';

import { callAI } from '@/ai/genkit';

export interface AnalysisCategory {
  score: number;
  feedback: string;
}

export interface PredictViralScoreInput {
  videoTitle: string;
  videoAuthor: string;
  likes: string;
  duration: string;
  mode: string;
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
  debug?: {
    error?: string;
    usedFallback: boolean;
  };
}

export async function predictViralScore(input: PredictViralScoreInput): Promise<PredictViralScoreOutput> {
  const prompt = `Analyze this TikTok video for viral potential:
Title: "${input.videoTitle}"
Creator: @${input.videoAuthor}
Likes: ${input.likes}
Duration: ${input.duration}
Mode: ${input.mode}

Return JSON:
{
  "score": 75,
  "verdict": "High Potential 🔥",
  "analysis": {
    "hook": {"score": 80, "feedback": "specific feedback about the hook"},
    "content": {"score": 70, "feedback": "specific feedback about content"},
    "engagement": {"score": 75, "feedback": "specific feedback about engagement"},
    "trending": {"score": 72, "feedback": "specific feedback about trends"}
  },
  "improvements": ["tip1", "tip2", "tip3", "tip4", "tip5"]${input.mode === 'roast' ? ',\n  "roast": "funny Gen-Z style roast of this content"' : ''}
}

Score 0-100 based on: hook strength, content quality, engagement potential, trend alignment.
Give 5 specific, actionable improvements. ${input.mode === 'roast' ? 'Include a funny but helpful roast.' : ''}`;

  try {
    const text = await callAI(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    return { ...result, debug: { usedFallback: false } };
  } catch (error: any) {
    console.error('[predictViralScore] Error:', error.message);
    return createFallbackResponse(input, error.message);
  }
}

function createFallbackResponse(input: PredictViralScoreInput, errorMessage?: string): PredictViralScoreOutput {
  const likesNum = parseInt(input.likes.replace(/[^0-9]/g, '')) || 1000;
  const durationNum = parseInt(input.duration) || 30;
  const hasQuestion = input.videoTitle.includes('?');
  const hasEmoji = /[\u{1F600}-\u{1F64F}]/u.test(input.videoTitle);
  
  let baseScore = 50;
  baseScore += Math.min(25, Math.floor(Math.log10(likesNum + 1) * 5));
  if (durationNum >= 15 && durationNum <= 45) baseScore += 10;
  if (hasQuestion) baseScore += 5;
  if (hasEmoji) baseScore += 3;
  baseScore = Math.min(95, Math.max(25, baseScore));

  const verdict = baseScore >= 70 ? "🔥 High Viral Potential" : baseScore >= 50 ? "📈 Good Growth Potential" : "💪 Needs Optimization";

  return {
    score: baseScore,
    verdict,
    analysis: {
      hook: { 
        score: Math.min(100, baseScore + 5), 
        feedback: "Start with a pattern interrupt - movement, text overlay, or unexpected visual in the first 0.5 seconds to stop the scroll."
      },
      content: { 
        score: baseScore, 
        feedback: "Focus on delivering value quickly. The best TikToks have a clear payoff that viewers want to share."
      },
      engagement: { 
        score: Math.min(100, baseScore + 3), 
        feedback: `With ${input.likes} likes, add a clear call-to-action. Ask a question or encourage duets to boost comments.`
      },
      trending: { 
        score: Math.min(100, baseScore + 2), 
        feedback: `${durationNum}s is ${durationNum <= 45 ? 'within the sweet spot' : 'a bit long'}. Pair with trending sounds for algorithm boost.`
      },
    },
    improvements: [
      "🎯 Add text overlay in the first frame that creates curiosity",
      "🎵 Use a trending sound from the past 7 days",
      "💬 End with 'Comment if you agree' or ask viewers to guess",
      "⏰ Post between 7-9 PM in your target timezone",
      "🔄 Create a series with cliffhangers to build retention",
    ],
    roast: input.mode === 'roast' 
      ? `Bestie really said 'let me post this' without checking if the vibes were immaculate 💀 The algorithm is sitting there like 🤨 But lowkey, with some tweaks this could actually eat. Just needs that ✨main character energy✨ fr fr`
      : undefined,
    debug: {
      error: errorMessage,
      usedFallback: true,
    }
  };
}
