// src/ai/flows/generate-shareable-caption.ts
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateShareableCaptionInputSchema = z.object({
  videoTitle: z.string().describe('The title of the TikTok video.'),
  videoAuthor: z.string().describe('The author of the TikTok video.'),
  originalCaption: z.string().describe('The original caption of the TikTok video.'),
});
export type GenerateShareableCaptionInput = z.infer<typeof GenerateShareableCaptionInputSchema>;

export interface GenerateShareableCaptionOutput {
  shareableCaption: string;
}

export async function generateShareableCaption(input: GenerateShareableCaptionInput): Promise<GenerateShareableCaptionOutput> {
  try {
    const prompt = `You are a social media expert. Generate an alternative, engaging caption for a TikTok video to be shared on other social media platforms like Instagram, Twitter, and Facebook.

Consider the following information about the video:

Video Title: ${input.videoTitle}
Video Author: ${input.videoAuthor}
Original Caption: ${input.originalCaption}

Your generated caption should be creative, attention-grabbing, and suitable for a broad audience. Keep it concise and optimized for social sharing. Do not include hashtags.

Return your response in this exact JSON format:
{"shareableCaption": "Your creative caption here"}`;

    const { text } = await ai.generate({
      prompt,
      config: {
        temperature: 0.8,
      },
    });

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]) as GenerateShareableCaptionOutput;
      return result;
    }
    
    // If no JSON found, use the text directly
    return { shareableCaption: text.trim() };
  } catch (error) {
    console.error('Caption generation error:', error);
    // Return fallback
    return {
      shareableCaption: `Check out this amazing video by ${input.videoAuthor}! 🔥`,
    };
  }
}
