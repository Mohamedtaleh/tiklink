'use server';

import { callGeminiDirect } from '@/ai/genkit';

export interface GenerateShareableCaptionInput {
  videoTitle: string;
  videoAuthor: string;
  originalCaption: string;
}

export interface GenerateShareableCaptionOutput {
  shareableCaption: string;
}

export async function generateShareableCaption(input: GenerateShareableCaptionInput): Promise<GenerateShareableCaptionOutput> {
  console.log('[generateShareableCaption] Called');
  
  const prompt = `Create an engaging social media caption for sharing this TikTok video:

Title: "${input.videoTitle}"
Author: ${input.videoAuthor}
Original: "${input.originalCaption}"

Make it catchy, suitable for Instagram/Twitter. No hashtags. Under 150 characters.

IMPORTANT: Return ONLY valid JSON:
{"shareableCaption":"Your caption here"}`;

  try {
    const text = await callGeminiDirect(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return result;
    }
    
    // If no JSON, use the text directly
    return { shareableCaption: text.trim().substring(0, 150) };
  } catch (error: any) {
    console.error('[generateShareableCaption] Error:', error.message);
    return {
      shareableCaption: `Check out this amazing video by ${input.videoAuthor}! 🔥 You won't believe what happens!`,
    };
  }
}
