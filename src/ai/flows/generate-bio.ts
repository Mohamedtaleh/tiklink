'use server';

import { callAI } from '@/ai/genkit';

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
  const prompt = `Create 5 TikTok bios for a ${input.niche} creator with ${input.vibe} vibe.
${input.keywords ? `Include keywords: ${input.keywords}` : ''}
Language: ${input.language}

Return JSON:
{
  "bios": [
    {"text": "bio under 80 chars", "emojis": "🔥✨", "charCount": 40, "style": "Punchy"},
    {"text": "clever wordplay bio", "emojis": "😎", "charCount": 35, "style": "Wordplay"},
    {"text": "follow for... bio", "emojis": "👇", "charCount": 38, "style": "Call-to-Action"},
    {"text": "mysterious bio", "emojis": "🌙", "charCount": 42, "style": "Mysterious"},
    {"text": "professional bio", "emojis": "✅", "charCount": 45, "style": "Professional"}
  ],
  "tips": ["tip about bios 1", "tip about bios 2", "tip about bios 3"]
}

Rules:
- Each bio MUST be under 80 characters
- Make them catchy and memorable
- Include relevant emojis
- Each style should be different`;

  try {
    const text = await callAI(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    return { ...result, debug: { usedFallback: false } };
  } catch (error: any) {
    console.error('[generateBio] Error:', error.message);
    return createFallbackResponse(input, error.message);
  }
}

function createFallbackResponse(input: GenerateBioInput, errorMessage?: string): GenerateBioOutput {
  const niche = input.niche.toLowerCase();
  
  const nicheBios: Record<string, BioItem[]> = {
    fitness: [
      { text: "Building bodies & confidence 💪 Your transformation starts here", emojis: "💪🏋️‍♀️✨", charCount: 58, style: "Punchy" },
      { text: "Reps > Regrets 🔥 Let's get after it", emojis: "🔥💪🏆", charCount: 37, style: "Wordplay" },
      { text: "Follow for daily workouts that actually work 👇", emojis: "👇📲💪", charCount: 47, style: "Call-to-Action" },
      { text: "The gym content you didn't know you needed 🏋️", emojis: "🏋️✨🔥", charCount: 47, style: "Mysterious" },
      { text: "Certified trainer | 10K+ transformations 💪", emojis: "💪✅📈", charCount: 44, style: "Professional" },
    ],
    beauty: [
      { text: "Making faces beautiful, one video at a time ✨", emojis: "✨💄💋", charCount: 46, style: "Punchy" },
      { text: "Glow-getter 💫 Skincare isn't skin deep", emojis: "💫✨🧴", charCount: 40, style: "Wordplay" },
      { text: "Follow for makeup secrets pros won't tell you 👇", emojis: "👇💄🤫", charCount: 48, style: "Call-to-Action" },
      { text: "The tutorials that made them ask 'how?' 💅", emojis: "💅✨💄", charCount: 43, style: "Mysterious" },
      { text: "MUA | 500+ brides | Your glow-up specialist 💄", emojis: "💄👰✨", charCount: 47, style: "Professional" },
    ],
    comedy: [
      { text: "Making you laugh is my cardio 😂", emojis: "😂🏃💀", charCount: 33, style: "Punchy" },
      { text: "Professionally unhinged 🤪 Send help", emojis: "🤪😂💀", charCount: 36, style: "Wordplay" },
      { text: "Follow before I blow up & forget you 💀", emojis: "💀😂🚀", charCount: 40, style: "Call-to-Action" },
      { text: "The content your therapist warned you about", emojis: "🤪💀😂", charCount: 44, style: "Mysterious" },
      { text: "Full-time chaos creator | Part-time adult 😅", emojis: "😅🤪✨", charCount: 46, style: "Professional" },
    ],
    default: [
      { text: `${niche} creator ✨ Making content that hits different`, emojis: "✨🔥💫", charCount: 52, style: "Punchy" },
      { text: `Living my best ${niche} life 🌟 You're welcome`, emojis: "🌟✨💖", charCount: 45, style: "Wordplay" },
      { text: `Follow for ${niche} content you'll actually love 👇`, emojis: "👇📲❤️", charCount: 50, style: "Call-to-Action" },
      { text: "The content algorithm doesn't want you to see 👀", emojis: "👀🤫✨", charCount: 48, style: "Mysterious" },
      { text: `Your go-to ${niche} creator | DM for collabs 📩`, emojis: "📩✨🤝", charCount: 47, style: "Professional" },
    ],
  };

  let selectedBios = nicheBios.default;
  if (niche.includes('fit') || niche.includes('gym')) selectedBios = nicheBios.fitness;
  else if (niche.includes('beauty') || niche.includes('makeup')) selectedBios = nicheBios.beauty;
  else if (niche.includes('comedy') || niche.includes('funny')) selectedBios = nicheBios.comedy;

  return {
    bios: selectedBios,
    tips: [
      "✅ Keep it under 80 characters - TikTok truncates longer bios",
      "✅ Include a clear CTA (follow, link, DM) to guide visitors",
      "✅ Use 2-3 emojis max - they catch the eye but too many looks spammy",
    ],
    debug: {
      error: errorMessage,
      usedFallback: true,
    }
  };
}
