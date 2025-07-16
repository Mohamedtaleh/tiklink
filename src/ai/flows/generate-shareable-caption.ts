// src/ai/flows/generate-shareable-caption.ts
'use server';

/**
 * @fileOverview Generates alternative, engaging captions for TikTok videos using AI.
 *
 * This file exports:
 * - `generateShareableCaption`: The main function to generate captions.
 * - `GenerateShareableCaptionInput`: The input type for the function.
 * - `GenerateShareableCaptionOutput`: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShareableCaptionInputSchema = z.object({
  videoTitle: z.string().describe('The title of the TikTok video.'),
  videoAuthor: z.string().describe('The author of the TikTok video.'),
  originalCaption: z.string().describe('The original caption of the TikTok video.'),
});
export type GenerateShareableCaptionInput = z.infer<typeof GenerateShareableCaptionInputSchema>;

const GenerateShareableCaptionOutputSchema = z.object({
  shareableCaption: z.string().describe('An alternative, engaging caption for sharing the TikTok video on other social media platforms.'),
});
export type GenerateShareableCaptionOutput = z.infer<typeof GenerateShareableCaptionOutputSchema>;

export async function generateShareableCaption(input: GenerateShareableCaptionInput): Promise<GenerateShareableCaptionOutput> {
  return generateShareableCaptionFlow(input);
}

const generateShareableCaptionPrompt = ai.definePrompt({
  name: 'generateShareableCaptionPrompt',
  input: {schema: GenerateShareableCaptionInputSchema},
  output: {schema: GenerateShareableCaptionOutputSchema},
  prompt: `You are a social media expert. Generate an alternative, engaging caption for a TikTok video to be shared on other social media platforms like Instagram, Twitter, and Facebook.

Consider the following information about the video:

Video Title: {{{videoTitle}}}
Video Author: {{{videoAuthor}}}
Original Caption: {{{originalCaption}}}

Your generated caption should be creative, attention-grabbing, and suitable for a broad audience. Keep it concise and optimized for social sharing.  Do not include hashtags.
`,
});

const generateShareableCaptionFlow = ai.defineFlow(
  {
    name: 'generateShareableCaptionFlow',
    inputSchema: GenerateShareableCaptionInputSchema,
    outputSchema: GenerateShareableCaptionOutputSchema,
  },
  async input => {
    const {output} = await generateShareableCaptionPrompt(input);
    return output!;
  }
);
