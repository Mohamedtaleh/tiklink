'use server';

import { callAI } from '@/ai/genkit';

export interface GenerateShareableCaptionInput {
  videoTitle: string;
  videoAuthor: string;
  originalCaption: string;
}

export interface GenerateShareableCaptionOutput {
  shareableCaption: string;
}

export async function generateShareableCaption(input: GenerateShareableCaptionInput): Promise<GenerateShareableCaptionOutput> {
  const prompt = `Create a catchy social media caption for sharing this TikTok:
Title: "${input.videoTitle}"
Author: @${input.videoAuthor}
Original: "${input.originalCaption}"

Return JSON: {"shareableCaption": "your caption under 150 chars, no hashtags"}`;

  try {
    const text = await callAI(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return result;
    }
    
    return { shareableCaption: text.trim().substring(0, 150) };
  } catch (error: any) {
    console.error('[generateShareableCaption] Error:', error.message);
    return {
      shareableCaption: `Check out this amazing video by @${input.videoAuthor}! 🔥`,
    };
  }
}
