'use server';

import { callAI } from '@/ai/genkit';

export interface HashtagItem {
  tag: string;
  posts: string;
}

export interface GenerateHashtagsInput {
  topic: string;
  language: string;
  style: string;
}

export interface GenerateHashtagsOutput {
  trending: HashtagItem[];
  medium: HashtagItem[];
  niche: HashtagItem[];
  recommended: string[];
  debug?: {
    error?: string;
    usedFallback: boolean;
    apiCalled: boolean;
  };
}

export async function generateHashtags(input: GenerateHashtagsInput): Promise<GenerateHashtagsOutput> {
  const prompt = `Generate TikTok hashtags for: "${input.topic}"
Language: ${input.language}, Style: ${input.style}

Return JSON with this exact structure:
{
  "trending": [{"tag": "#fyp", "posts": "50B"}, ...9 more high-volume hashtags],
  "medium": [{"tag": "#example", "posts": "500K"}, ...9 more medium hashtags for "${input.topic}"],
  "niche": [{"tag": "#specific", "posts": "50K"}, ...9 more niche hashtags],
  "recommended": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
}

Rules:
- trending: 10 hashtags with millions/billions of posts (#fyp, #viral, #foryou, etc.)
- medium: 10 hashtags related to "${input.topic}" with 100K-1M posts
- niche: 10 specific hashtags under 100K posts
- recommended: 5 best hashtags to use together
- Use realistic post counts (K, M, B format)`;

  try {
    const text = await callAI(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    return { ...result, debug: { usedFallback: false, apiCalled: true } };
  } catch (error: any) {
    console.error('[generateHashtags] Error:', error.message);
    return createFallbackResponse(input.topic, error.message);
  }
}

function createFallbackResponse(topic: string, errorMessage?: string): GenerateHashtagsOutput {
  const topicTag = topic.replace(/\s+/g, '').toLowerCase().substring(0, 20);
  
  return {
    trending: [
      { tag: '#fyp', posts: '54.2T' },
      { tag: '#foryou', posts: '36.8T' },
      { tag: '#viral', posts: '28.1T' },
      { tag: '#foryoupage', posts: '22.4T' },
      { tag: '#trending', posts: '18.9T' },
      { tag: '#tiktok', posts: '15.7T' },
      { tag: '#xyzbca', posts: '12.3T' },
      { tag: '#explore', posts: '8.9T' },
      { tag: '#viralvideo', posts: '6.4T' },
      { tag: '#trend', posts: '4.2T' },
    ],
    medium: [
      { tag: `#${topicTag}`, posts: '892K' },
      { tag: `#${topicTag}tok`, posts: '654K' },
      { tag: '#contentcreator', posts: '1.2M' },
      { tag: '#tiktokcreator', posts: '987K' },
      { tag: '#viralpost', posts: '756K' },
      { tag: '#tiktoktrend', posts: '612K' },
      { tag: '#fypage', posts: '543K' },
      { tag: '#fypシ', posts: '489K' },
      { tag: '#trending2024', posts: '367K' },
      { tag: '#explorepage', posts: '298K' },
    ],
    niche: [
      { tag: `#${topicTag}community`, posts: '89K' },
      { tag: `#${topicTag}life`, posts: '67K' },
      { tag: `#${topicTag}lover`, posts: '52K' },
      { tag: '#smallcreator', posts: '98K' },
      { tag: '#newcreator', posts: '76K' },
      { tag: '#growingcreator', posts: '54K' },
      { tag: '#supportsmallcreators', posts: '43K' },
      { tag: '#undiscovered', posts: '38K' },
      { tag: '#hiddentalent', posts: '29K' },
      { tag: '#upandcoming', posts: '21K' },
    ],
    recommended: ['#fyp', '#viral', `#${topicTag}`, '#foryoupage', '#trending'],
    debug: {
      error: errorMessage,
      usedFallback: true,
      apiCalled: true,
    }
  };
}
