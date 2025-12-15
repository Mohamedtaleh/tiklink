'use server';

import { callGeminiDirect } from '@/ai/genkit';

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
  console.log('[predictViralScore] Called with:', input.videoTitle);
  
  const prompt = `Analyze this TikTok video for viral potential:

Title: "${input.videoTitle}"
Author: ${input.videoAuthor}
Likes: ${input.likes}
Duration: ${input.duration}
Mode: ${input.mode}

Score from 0-100 and provide analysis.
${input.mode === 'roast' ? 'Include a funny Gen-Z style roast.' : ''}

IMPORTANT: Return ONLY valid JSON:
{"score":75,"verdict":"High Potential","analysis":{"hook":{"score":80,"feedback":"text"},"content":{"score":70,"feedback":"text"},"engagement":{"score":75,"feedback":"text"},"trending":{"score":72,"feedback":"text"}},"improvements":["tip1","tip2","tip3","tip4","tip5"]${input.mode === 'roast' ? ',"roast":"roast text"' : ''}}`;

  try {
    console.log('[predictViralScore] Calling Gemini API...');
    const text = await callGeminiDirect(prompt);
    console.log('[predictViralScore] Response received');

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return { ...result, debug: { usedFallback: false } };
  } catch (error: any) {
    console.error('[predictViralScore] Error:', error.message);
    return createFallbackResponse(input, error.message);
  }
}

function createFallbackResponse(input: PredictViralScoreInput, errorMessage?: string): PredictViralScoreOutput {
  const likesNum = parseInt(input.likes.replace(/[^0-9]/g, '')) || 1000;
  const baseScore = Math.min(85, Math.max(35, Math.floor(Math.log10(likesNum + 1) * 18)));
  
  return {
    score: baseScore,
    verdict: baseScore >= 70 ? "High Potential 🔥" : baseScore >= 50 ? "Average 📊" : "Needs Work 💪",
    analysis: {
      hook: { 
        score: baseScore + 5, 
        feedback: "The first 3 seconds are crucial - make sure you hook viewers immediately with something unexpected or intriguing." 
      },
      content: { 
        score: baseScore, 
        feedback: "Content quality looks solid. Consider improving lighting and adding dynamic transitions." 
      },
      engagement: { 
        score: baseScore - 3, 
        feedback: "Add a clear call-to-action. Ask questions or encourage duets to boost engagement." 
      },
      trending: { 
        score: baseScore + 2, 
        feedback: "Try incorporating trending sounds and effects to boost discoverability." 
      },
    },
    improvements: [
      "🎯 Start with a pattern interrupt in the first second",
      "🎵 Use trending sounds from the TikTok audio library",
      "💬 End with a question to encourage comments",
      "⏰ Post between 6-10 PM in your target timezone",
      "🔄 Create content that encourages duets or stitches",
    ],
    roast: input.mode === 'roast' 
      ? `Bestie really said "let me post this" without checking if the vibes were immaculate 💀 The algorithm is literally crying rn. But ngl, with some tweaks this could lowkey slap. Just needs that ✨main character energy✨ fr fr` 
      : undefined,
    debug: {
      error: errorMessage,
      usedFallback: true,
    }
  };
}
