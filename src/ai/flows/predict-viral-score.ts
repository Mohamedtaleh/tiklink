'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictViralScoreInputSchema = z.object({
  videoTitle: z.string().describe('The title/caption of the TikTok video'),
  videoAuthor: z.string().describe('The author of the video'),
  likes: z.string().describe('Number of likes'),
  duration: z.string().describe('Video duration'),
  mode: z.string().describe('Analysis mode: standard or roast'),
});

export type PredictViralScoreInput = z.infer<typeof PredictViralScoreInputSchema>;

const PredictViralScoreOutputSchema = z.object({
  score: z.number().describe('Viral score from 0-100'),
  verdict: z.string().describe('Short verdict like "High Potential" or "Needs Work"'),
  analysis: z.object({
    hook: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
    content: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
    engagement: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
    trending: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
  }),
  improvements: z.array(z.string()).describe('Top 5 actionable improvements'),
  roast: z.string().optional().describe('A funny roast of the video (if roast mode)'),
});

export type PredictViralScoreOutput = z.infer<typeof PredictViralScoreOutputSchema>;

export async function predictViralScore(input: PredictViralScoreInput): Promise<PredictViralScoreOutput> {
  return predictViralScoreFlow(input);
}

const predictViralScorePrompt = ai.definePrompt({
  name: 'predictViralScorePrompt',
  input: { schema: PredictViralScoreInputSchema },
  output: { schema: PredictViralScoreOutputSchema },
  prompt: `You are a TikTok viral content expert and social media analyst. Analyze this TikTok video and predict its viral potential.

Video Information:
- Title/Caption: {{{videoTitle}}}
- Author: {{{videoAuthor}}}
- Current Likes: {{{likes}}}
- Duration: {{{duration}}}
- Analysis Mode: {{{mode}}}

Provide a comprehensive viral score analysis:

1. OVERALL SCORE (0-100): Based on viral potential
   - 90-100: Viral Hit (will likely go viral)
   - 70-89: High Potential (strong chances)
   - 50-69: Average (might get decent traction)
   - 30-49: Below Average (needs significant work)
   - 0-29: Low Potential (unlikely to perform well)

2. VERDICT: A short, catchy verdict (2-4 words)

3. DETAILED ANALYSIS: Score and feedback for each category:
   - Hook (first 3 seconds grab attention?)
   - Content Quality (production value, creativity)
   - Engagement Potential (shareability, comments likelihood)
   - Trending Alignment (uses current trends/sounds?)

4. IMPROVEMENTS: Top 5 specific, actionable improvements

5. ROAST (if mode is "roast"): Write a funny, Gen-Z style roast of the video. Be savage but not mean-spirited. Use internet slang and emojis. Keep it entertaining!

Be honest and constructive. Base your analysis on TikTok's algorithm preferences: watch time, shares, comments, and saves.`,
});

const predictViralScoreFlow = ai.defineFlow(
  {
    name: 'predictViralScoreFlow',
    inputSchema: PredictViralScoreInputSchema,
    outputSchema: PredictViralScoreOutputSchema,
  },
  async (input) => {
    const { output } = await predictViralScorePrompt(input);
    return output!;
  }
);
