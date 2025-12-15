'use server';

import { callGeminiDirect } from '@/ai/genkit';

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
  console.log('[generateHashtags] Called with:', input);
  
  const prompt = `You are a TikTok growth expert. Generate optimized hashtags for: "${input.topic}"

Language: ${input.language}
Style: ${input.style}

Generate hashtags in THREE categories:
1. TRENDING (10 hashtags): High-volume hashtags with millions of posts
2. MEDIUM (10 hashtags): Moderate competition hashtags with 100K-1M posts  
3. NICHE (10 hashtags): Low competition, specific hashtags under 100K posts

IMPORTANT: Return ONLY valid JSON in this exact format, no other text:
{"trending":[{"tag":"#example","posts":"2.5M"}],"medium":[{"tag":"#example","posts":"500K"}],"niche":[{"tag":"#example","posts":"50K"}],"recommended":["#tag1","#tag2","#tag3","#tag4","#tag5"]}`;

  try {
    console.log('[generateHashtags] Calling Gemini API...');
    const text = await callGeminiDirect(prompt);
    console.log('[generateHashtags] Raw response:', text.substring(0, 200));

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[generateHashtags] No JSON found in response');
      throw new Error('No JSON in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log('[generateHashtags] Parsed successfully');
    
    return {
      ...result,
      debug: { usedFallback: false, apiCalled: true }
    };
  } catch (error: any) {
    console.error('[generateHashtags] Error:', error.message || error);
    
    // Return fallback with debug info
    return createFallbackResponse(input.topic, error.message);
  }
}

function createFallbackResponse(topic: string, errorMessage?: string): GenerateHashtagsOutput {
  const safeTopic = topic.replace(/\s+/g, '').toLowerCase().substring(0, 20);
  
  return {
    trending: [
      { tag: '#fyp', posts: '50B' },
      { tag: '#viral', posts: '30B' },
      { tag: '#tiktok', posts: '25B' },
      { tag: '#foryou', posts: '20B' },
      { tag: '#trending', posts: '15B' },
      { tag: '#foryoupage', posts: '12B' },
      { tag: '#viralvideo', posts: '8B' },
      { tag: '#explorepage', posts: '5B' },
      { tag: '#tiktokviral', posts: '3B' },
      { tag: '#fypage', posts: '2B' },
    ],
    medium: [
      { tag: `#${safeTopic}`, posts: '800K' },
      { tag: `#${safeTopic}tips`, posts: '600K' },
      { tag: '#contentcreator', posts: '500K' },
      { tag: '#tiktoktips', posts: '400K' },
      { tag: '#growthtips', posts: '350K' },
      { tag: '#socialmediatips', posts: '300K' },
      { tag: '#creatorlife', posts: '250K' },
      { tag: '#tiktokgrowth', posts: '200K' },
      { tag: '#viralcontent', posts: '150K' },
      { tag: '#trendingaudio', posts: '120K' },
    ],
    niche: [
      { tag: `#${safeTopic}community`, posts: '80K' },
      { tag: `#${safeTopic}lover`, posts: '60K' },
      { tag: '#smallcreator', posts: '50K' },
      { tag: '#newcreator2024', posts: '40K' },
      { tag: '#undiscovered', posts: '35K' },
      { tag: '#supportsmall', posts: '30K' },
      { tag: '#growingcreator', posts: '25K' },
      { tag: '#nichcontent', posts: '20K' },
      { tag: '#discoverme', posts: '15K' },
      { tag: '#hiddentalent', posts: '10K' },
    ],
    recommended: ['#fyp', '#viral', `#${safeTopic}`, '#trending', '#foryoupage'],
    debug: {
      error: errorMessage,
      usedFallback: true,
      apiCalled: true,
    }
  };
}
