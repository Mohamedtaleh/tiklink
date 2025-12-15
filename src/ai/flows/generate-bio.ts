'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBioInputSchema = z.object({
  niche: z.string().describe('The content niche/category'),
  vibe: z.string().describe('The personality vibe (funny, professional, mysterious, etc)'),
  keywords: z.string().describe('Optional keywords to include'),
  language: z.string().describe('Target language code'),
});

export type GenerateBioInput = z.infer<typeof GenerateBioInputSchema>;

const GenerateBioOutputSchema = z.object({
  bios: z.array(z.object({
    text: z.string(),
    emojis: z.string(),
    charCount: z.number(),
    style: z.string(),
  })).describe('5 generated bio options'),
  tips: z.array(z.string()).describe('Bio optimization tips'),
});

export type GenerateBioOutput = z.infer<typeof GenerateBioOutputSchema>;

export async function generateBio(input: GenerateBioInput): Promise<GenerateBioOutput> {
  return generateBioFlow(input);
}

const generateBioPrompt = ai.definePrompt({
  name: 'generateBioPrompt',
  input: { schema: GenerateBioInputSchema },
  output: { schema: GenerateBioOutputSchema },
  prompt: `You are a TikTok bio expert. Create 5 unique, engaging TikTok bios.

Niche/Category: {{{niche}}}
Personality Vibe: {{{vibe}}}
Keywords to include: {{{keywords}}}
Target Language: {{{language}}}

Create 5 DIFFERENT bio variations:
1. One that's punchy and short (under 50 chars)
2. One that uses wordplay or puns
3. One that includes a call-to-action
4. One that's mysterious/intriguing
5. One that's maximalist with emojis

Rules:
- Each bio MUST be under 80 characters (TikTok limit)
- Include relevant emojis
- Make them memorable and unique
- Consider the vibe requested
- Be creative and trendy
- Include a suggested emoji set for each

Also provide 3 tips for optimizing TikTok bios.`,
});

const generateBioFlow = ai.defineFlow(
  {
    name: 'generateBioFlow',
    inputSchema: GenerateBioInputSchema,
    outputSchema: GenerateBioOutputSchema,
  },
  async (input) => {
    const { output } = await generateBioPrompt(input);
    return output!;
  }
);
