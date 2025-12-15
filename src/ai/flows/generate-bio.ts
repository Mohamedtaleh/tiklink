'use server';

import { callGeminiDirect } from '@/ai/genkit';

export interface BioItem {
  text: string;
  emojis: string;
  charCount: number;
  style: string;
}

export interface GenerateBioInput {
  niche: string;
  vibe: string;
  keywords: string;
  language: string;
}

export interface GenerateBioOutput {
  bios: BioItem[];
  tips: string[];
  debug?: {
    error?: string;
    usedFallback: boolean;
  };
}

export async function generateBio(input: GenerateBioInput): Promise<GenerateBioOutput> {
  console.log('[generateBio] Called with:', input.niche, input.vibe);
  
  const prompt = `Create 5 unique TikTok bios for:
Niche: ${input.niche}
Vibe: ${input.vibe}
Keywords: ${input.keywords || 'none'}
Language: ${input.language}

Rules:
- Each bio MUST be under 80 characters
- Make them catchy and memorable
- Include emojis

IMPORTANT: Return ONLY valid JSON:
{"bios":[{"text":"bio text","emojis":"🔥✨","charCount":25,"style":"Punchy"},{"text":"bio2","emojis":"😎","charCount":30,"style":"Wordplay"},{"text":"bio3","emojis":"👇","charCount":35,"style":"CTA"},{"text":"bio4","emojis":"🌙","charCount":28,"style":"Mysterious"},{"text":"bio5","emojis":"🎨🎬","charCount":40,"style":"Maximalist"}],"tips":["tip1","tip2","tip3"]}`;

  try {
    console.log('[generateBio] Calling Gemini API...');
    const text = await callGeminiDirect(prompt);
    console.log('[generateBio] Response received');

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return { ...result, debug: { usedFallback: false } };
  } catch (error: any) {
    console.error('[generateBio] Error:', error.message);
    return createFallbackResponse(input, error.message);
  }
}

function createFallbackResponse(input: GenerateBioInput, errorMessage?: string): GenerateBioOutput {
  const niche = input.niche.toLowerCase();
  const vibe = input.vibe.toLowerCase();
  
  return {
    bios: [
      {
        text: `${niche} creator ✨ making magic daily`,
        emojis: '✨🎬💫',
        charCount: 38,
        style: 'Punchy',
      },
      {
        text: `${niche}? More like ${niche}-tastic 😎`,
        emojis: '😎🔥✨',
        charCount: 35,
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
        text: `✨🎬 ${niche.toUpperCase()} VIBES 🎬✨ | ${vibe} energy 💫`,
        emojis: '✨🎬💫🔥',
        charCount: 50,
        style: 'Maximalist',
      },
    ],
    tips: [
      '✅ Keep your bio under 80 characters for maximum impact',
      '✅ Include a clear call-to-action (follow, link, etc.)',
      '✅ Use 2-3 relevant emojis to stand out',
    ],
    debug: {
      error: errorMessage,
      usedFallback: true,
    }
  };
}
