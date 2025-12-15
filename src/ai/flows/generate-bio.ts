'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateBioInputSchema = z.object({
  niche: z.string().describe('The content niche/category'),
  vibe: z.string().describe('The personality vibe (funny, professional, mysterious, etc)'),
  keywords: z.string().describe('Optional keywords to include'),
  language: z.string().describe('Target language code'),
});

export type GenerateBioInput = z.infer<typeof GenerateBioInputSchema>;

export interface BioItem {
  text: string;
  emojis: string;
  charCount: number;
  style: string;
}

export interface GenerateBioOutput {
  bios: BioItem[];
  tips: string[];
}

export async function generateBio(input: GenerateBioInput): Promise<GenerateBioOutput> {
  try {
    const prompt = `You are a TikTok bio expert. Create 5 unique, engaging TikTok bios.

Niche/Category: ${input.niche}
Personality Vibe: ${input.vibe}
Keywords to include: ${input.keywords || 'none specified'}
Target Language: ${input.language}

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

Also provide 3 tips for optimizing TikTok bios.

Return your response in this exact JSON format:
{
  "bios": [
    {"text": "Your bio text here", "emojis": "🔥✨💫", "charCount": 25, "style": "Punchy"},
    {"text": "Another bio", "emojis": "😎🎯", "charCount": 30, "style": "Wordplay"},
    {"text": "CTA bio", "emojis": "👇📲", "charCount": 35, "style": "Call-to-Action"},
    {"text": "Mystery bio", "emojis": "🌙✨", "charCount": 28, "style": "Mysterious"},
    {"text": "Emoji bio", "emojis": "🎨🎬🎤", "charCount": 40, "style": "Maximalist"}
  ],
  "tips": ["tip 1", "tip 2", "tip 3"]
}`;

    const { text } = await ai.generate({
      prompt,
      config: {
        temperature: 0.9,
      },
    });

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const result = JSON.parse(jsonMatch[0]) as GenerateBioOutput;
    return result;
  } catch (error) {
    console.error('Bio generation error:', error);
    // Return fallback data
    const niche = input.niche.toLowerCase();
    const vibe = input.vibe.toLowerCase();
    
    return {
      bios: [
        {
          text: `${niche} creator ✨ making magic daily`,
          emojis: '✨🎬💫',
          charCount: 35,
          style: 'Punchy',
        },
        {
          text: `${niche}? More like ${niche}-mazing 😎`,
          emojis: '😎🔥✨',
          charCount: 40,
          style: 'Wordplay',
        },
        {
          text: `Follow for daily ${niche} content 👇`,
          emojis: '👇📲🔔',
          charCount: 38,
          style: 'Call-to-Action',
        },
        {
          text: `The ${niche} content you didn't know you needed`,
          emojis: '🌙✨🎭',
          charCount: 48,
          style: 'Mysterious',
        },
        {
          text: `✨🎬 ${niche.toUpperCase()} 🎬✨ | ${vibe} vibes only 💫`,
          emojis: '✨🎬💫🔥',
          charCount: 55,
          style: 'Maximalist',
        },
      ],
      tips: [
        'Keep your bio under 80 characters for maximum impact',
        'Include a clear call-to-action to drive engagement',
        'Use 2-3 relevant emojis to stand out in search results',
      ],
    };
  }
}
