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
  const prompt = `You are a TikTok branding expert. Create 5 unique, HIGHLY OPTIMIZED bios for TikTok.

CREATOR DETAILS:
- Niche: ${input.niche}
- Vibe: ${input.vibe}
- Keywords to include: ${input.keywords || 'none specified'}
- Language: ${input.language}

BIO REQUIREMENTS:
1. MUST be under 80 characters (TikTok limit)
2. Should be catchy, memorable, and personality-driven
3. Include relevant emojis that enhance the message
4. Each bio should have a different STYLE:
   - Punchy: Short, impactful, memorable
   - Wordplay: Clever puns or plays on words
   - Call-to-Action: Encourages follows/engagement
   - Mysterious: Creates curiosity
   - Professional: Establishes authority

Include 3 PRO TIPS for optimizing TikTok bios.

Return ONLY valid JSON:
{"bios":[{"text":"bio here","emojis":"🔥✨","charCount":40,"style":"Punchy"}],"tips":["tip1","tip2","tip3"]}`;

  try {
    const text = await callGeminiDirect(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    return { ...result, debug: { usedFallback: false } };
  } catch (error: any) {
    return createFallbackResponse(input, error.message);
  }
}

function createFallbackResponse(input: GenerateBioInput, errorMessage?: string): GenerateBioOutput {
  const niche = input.niche.toLowerCase();
  const vibe = input.vibe.toLowerCase();
  const isSerious = vibe.includes('serious') || vibe.includes('professional');
  const isFunny = vibe.includes('funny') || vibe.includes('humor');
  
  // Generate context-aware bios based on common niches
  const nicheBios: Record<string, BioItem[]> = {
    fitness: [
      { text: "Building bodies & confidence 💪 Your transformation starts here", emojis: "💪🏋️‍♀️✨", charCount: 58, style: "Punchy" },
      { text: "Reps > Regrets 🔥 Let's get after it", emojis: "🔥💪🏆", charCount: 37, style: "Motivational" },
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
      { text: "Professionally unhinged 🤪 Send help (or likes)", emojis: "🤪😂💀", charCount: 47, style: "Wordplay" },
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

  // Select appropriate bios based on niche
  let selectedBios = nicheBios.default;
  if (niche.includes('fit') || niche.includes('gym') || niche.includes('workout')) {
    selectedBios = nicheBios.fitness;
  } else if (niche.includes('beauty') || niche.includes('makeup') || niche.includes('skin')) {
    selectedBios = nicheBios.beauty;
  } else if (niche.includes('comedy') || niche.includes('funny') || niche.includes('humor')) {
    selectedBios = nicheBios.comedy;
  }

  return {
    bios: selectedBios,
    tips: [
      "✅ Keep it under 80 characters - TikTok truncates longer bios on mobile",
      "✅ Include a clear CTA (follow, link, DM) to guide visitor behavior",
      "✅ Use 2-3 emojis max - they catch the eye but too many looks spammy",
      "✅ Update your bio weekly to reflect trending content or promotions",
      "✅ Add your posting schedule (e.g., 'New videos daily at 7PM') for consistency",
    ],
    debug: {
      error: errorMessage,
      usedFallback: true,
    }
  };
}
