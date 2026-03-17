'use server';

import { callAI } from '@/ai/genkit';

export interface GenerateCaptionInput {
  topic: string;
  niche: string;
  tone: string;
  includeEmojis: boolean;
  includeHashtags: boolean;
  includeCTA: boolean;
  language: string;
}

export interface CaptionVariant {
  text: string;
  style: string;
  charCount: number;
  hookStrength: number;
  engagementScore: number;
}

export interface GenerateCaptionOutput {
  captions: CaptionVariant[];
  suggestedHashtags: string[];
  tips: string[];
  debug?: {
    error?: string;
    usedFallback: boolean;
  };
}

export async function generateCaption(input: GenerateCaptionInput): Promise<GenerateCaptionOutput> {
  const prompt = `Generate 5 viral TikTok captions for: "${input.topic}"
Niche: ${input.niche}
Tone: ${input.tone}
Language: ${input.language}
Include emojis: ${input.includeEmojis}
Include hashtags: ${input.includeHashtags}
Include CTA: ${input.includeCTA}

Return JSON with this exact structure:
{
  "captions": [
    {
      "text": "Caption text here with emojis if requested",
      "style": "Hook Style Name",
      "charCount": 50,
      "hookStrength": 85,
      "engagementScore": 90
    }
  ],
  "suggestedHashtags": ["#fyp", "#viral", "#topicrelated", "#niche", "#trending"],
  "tips": ["Tip 1 for better captions", "Tip 2"]
}

Rules:
- Each caption MUST have a strong hook in the first few words
- Keep captions between 50-150 characters for optimal engagement
- Use pattern interrupts, questions, or bold statements
- Include relevant emojis if requested
- Add a call-to-action if requested (like "Follow for more", "Save this", "Comment below")
- Make each caption unique with different hook styles:
  1. Question hook (curiosity)
  2. Bold statement hook
  3. Story hook ("I just...")
  4. Number/list hook ("3 things...")
  5. Controversial/opinion hook
- hookStrength and engagementScore should be 0-100
- Provide 5 relevant hashtags for the topic
- Include 3 practical tips for writing better captions`;

  try {
    const text = await callAI(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    
    // Validate and enhance the response
    if (!result.captions || !Array.isArray(result.captions)) {
      throw new Error('Invalid captions array');
    }

    return {
      captions: result.captions.map((c: any) => ({
        text: c.text || '',
        style: c.style || 'Standard',
        charCount: c.text?.length || 0,
        hookStrength: c.hookStrength || 70,
        engagementScore: c.engagementScore || 70,
      })),
      suggestedHashtags: result.suggestedHashtags || ['#fyp', '#viral', '#trending'],
      tips: result.tips || ['Start with a hook', 'Keep it concise', 'Add a CTA'],
      debug: { usedFallback: false },
    };
  } catch (error: any) {
    console.error('[generateCaption] Error:', error.message);
    return createFallbackCaptions(input, error.message);
  }
}

function createFallbackCaptions(input: GenerateCaptionInput, errorMessage?: string): GenerateCaptionOutput {
  const emojis = input.includeEmojis ? " 🔥✨" : "";
  const cta = input.includeCTA ? " Follow for more!" : "";
  
  return {
    captions: [
      {
        text: `Wait for it... this ${input.topic} hack changed everything${emojis}${cta}`,
        style: "Curiosity Hook",
        charCount: 55,
        hookStrength: 85,
        engagementScore: 88,
      },
      {
        text: `POV: You just discovered the best ${input.topic} tip${emojis}${cta}`,
        style: "POV Hook",
        charCount: 48,
        hookStrength: 80,
        engagementScore: 82,
      },
      {
        text: `3 things about ${input.topic} nobody tells you${emojis}${cta}`,
        style: "List Hook",
        charCount: 42,
        hookStrength: 78,
        engagementScore: 85,
      },
      {
        text: `This ${input.topic} secret took me years to learn${emojis}${cta}`,
        style: "Story Hook",
        charCount: 45,
        hookStrength: 82,
        engagementScore: 80,
      },
      {
        text: `Hot take: Most people are doing ${input.topic} wrong${emojis}${cta}`,
        style: "Controversial Hook",
        charCount: 48,
        hookStrength: 90,
        engagementScore: 92,
      },
    ],
    suggestedHashtags: ["#fyp", "#viral", "#foryou", "#trending", `#${input.topic.replace(/\s+/g, '').toLowerCase()}`],
    tips: [
      "Start your caption with a hook that creates curiosity",
      "Keep captions between 50-150 characters for best engagement",
      "End with a clear call-to-action to drive interaction",
    ],
    debug: {
      error: errorMessage,
      usedFallback: true,
    },
  };
}
