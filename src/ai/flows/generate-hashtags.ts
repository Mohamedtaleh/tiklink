'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateHashtagsInputSchema = z.object({
  topic: z.string().describe('The topic or niche for hashtag generation'),
  language: z.string().describe('The target language code (en, es, fr, ar, hi, id)'),
  style: z.string().describe('The style of hashtags (trending, niche, mixed)'),
});

export type GenerateHashtagsInput = z.infer<typeof GenerateHashtagsInputSchema>;

const GenerateHashtagsOutputSchema = z.object({
  trending: z.array(z.object({
    tag: z.string(),
    posts: z.string(),
  })).describe('High-volume trending hashtags'),
  medium: z.array(z.object({
    tag: z.string(),
    posts: z.string(),
  })).describe('Medium competition hashtags'),
  niche: z.array(z.object({
    tag: z.string(),
    posts: z.string(),
  })).describe('Low competition niche hashtags'),
  recommended: z.array(z.string()).describe('Top 5 recommended hashtags for the topic'),
});

export type GenerateHashtagsOutput = z.infer<typeof GenerateHashtagsOutputSchema>;

export async function generateHashtags(input: GenerateHashtagsInput): Promise<GenerateHashtagsOutput> {
  return generateHashtagsFlow(input);
}

const generateHashtagsPrompt = ai.definePrompt({
  name: 'generateHashtagsPrompt',
  input: { schema: GenerateHashtagsInputSchema },
  output: { schema: GenerateHashtagsOutputSchema },
  prompt: `You are a TikTok growth expert. Generate optimized hashtags for the following topic.

Topic/Niche: {{{topic}}}
Target Language: {{{language}}}
Style Preference: {{{style}}}

Generate hashtags in THREE categories:

1. TRENDING (10 hashtags): High-volume hashtags with millions of posts. These give broad reach.
2. MEDIUM (10 hashtags): Moderate competition hashtags with 100K-1M posts. Good balance of reach and visibility.
3. NICHE (10 hashtags): Low competition, highly specific hashtags with under 100K posts. These help with discoverability.

For each hashtag, estimate the approximate number of posts (e.g., "2.5M", "500K", "50K").

Also provide your TOP 5 recommended hashtags that would work best together for maximum reach on TikTok.

Rules:
- All hashtags should start with #
- Make them relevant to TikTok trends and culture
- Include a mix of general and specific hashtags
- Consider the target language/region for localized hashtags
- Keep hashtags concise and easy to remember
- Include some hashtags that are currently viral on TikTok`,
});

const generateHashtagsFlow = ai.defineFlow(
  {
    name: 'generateHashtagsFlow',
    inputSchema: GenerateHashtagsInputSchema,
    outputSchema: GenerateHashtagsOutputSchema,
  },
  async (input) => {
    const { output } = await generateHashtagsPrompt(input);
    return output!;
  }
);
