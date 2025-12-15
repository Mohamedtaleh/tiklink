'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateHashtagsInputSchema = z.object({
  topic: z.string().describe('The topic or niche for hashtag generation'),
  language: z.string().describe('The target language code (en, es, fr, ar, hi, id)'),
  style: z.string().describe('The style of hashtags (trending, niche, mixed)'),
});

export type GenerateHashtagsInput = z.infer<typeof GenerateHashtagsInputSchema>;

export interface HashtagItem {
  tag: string;
  posts: string;
}

export interface GenerateHashtagsOutput {
  trending: HashtagItem[];
  medium: HashtagItem[];
  niche: HashtagItem[];
  recommended: string[];
}

export async function generateHashtags(input: GenerateHashtagsInput): Promise<GenerateHashtagsOutput> {
  try {
    const prompt = `You are a TikTok growth expert. Generate optimized hashtags for the following topic.

Topic/Niche: ${input.topic}
Target Language: ${input.language}
Style Preference: ${input.style}

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
- Include some hashtags that are currently viral on TikTok

Return your response in this exact JSON format:
{
  "trending": [{"tag": "#hashtag", "posts": "2.5M"}, ...],
  "medium": [{"tag": "#hashtag", "posts": "500K"}, ...],
  "niche": [{"tag": "#hashtag", "posts": "50K"}, ...],
  "recommended": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
}`;

    const { text } = await ai.generate({
      prompt,
      config: {
        temperature: 0.8,
      },
    });

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const result = JSON.parse(jsonMatch[0]) as GenerateHashtagsOutput;
    return result;
  } catch (error) {
    console.error('Hashtag generation error:', error);
    // Return fallback data
    return {
      trending: [
        { tag: '#fyp', posts: '50B' },
        { tag: '#viral', posts: '30B' },
        { tag: '#tiktok', posts: '25B' },
        { tag: '#foryou', posts: '20B' },
        { tag: '#trending', posts: '15B' },
        { tag: '#explore', posts: '10B' },
        { tag: '#content', posts: '5B' },
        { tag: '#creator', posts: '3B' },
        { tag: '#viralvideo', posts: '2B' },
        { tag: '#tiktokviral', posts: '1.5B' },
      ],
      medium: [
        { tag: `#${input.topic.replace(/\s+/g, '').toLowerCase()}`, posts: '500K' },
        { tag: `#${input.topic.split(' ')[0]?.toLowerCase() || 'content'}tips`, posts: '400K' },
        { tag: '#contentcreator', posts: '350K' },
        { tag: '#growthhacks', posts: '300K' },
        { tag: '#socialmedia', posts: '250K' },
        { tag: '#tiktoktips', posts: '200K' },
        { tag: '#viralcontent', posts: '180K' },
        { tag: '#trending2024', posts: '150K' },
        { tag: '#fypシ', posts: '120K' },
        { tag: '#tiktoktrend', posts: '100K' },
      ],
      niche: [
        { tag: `#${input.topic.replace(/\s+/g, '').toLowerCase()}community`, posts: '50K' },
        { tag: `#${input.topic.split(' ')[0]?.toLowerCase() || 'niche'}life`, posts: '40K' },
        { tag: '#smallcreator', posts: '35K' },
        { tag: '#newcreator', posts: '30K' },
        { tag: '#underrated', posts: '25K' },
        { tag: '#hiddentalent', posts: '20K' },
        { tag: '#discoverme', posts: '15K' },
        { tag: '#supportsmallcreators', posts: '12K' },
        { tag: '#growingcreator', posts: '10K' },
        { tag: '#emergingartist', posts: '8K' },
      ],
      recommended: ['#fyp', '#viral', `#${input.topic.replace(/\s+/g, '').toLowerCase()}`, '#trending', '#foryou'],
    };
  }
}
