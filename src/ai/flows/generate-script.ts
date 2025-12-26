'use server';

import { callAI } from '@/ai/genkit';

export interface GenerateScriptInput {
  topic: string;
  niche: string;
  duration: string; // "15", "30", "60", "180"
  style: string;
  language: string;
}

export interface ScriptSection {
  timestamp: string;
  type: "hook" | "content" | "cta" | "transition";
  script: string;
  visualSuggestion: string;
  duration: number;
}

export interface GenerateScriptOutput {
  title: string;
  hook: string;
  sections: ScriptSection[];
  totalDuration: number;
  wordCount: number;
  trendingSounds: string[];
  tips: string[];
  debug?: {
    error?: string;
    usedFallback: boolean;
  };
}

const DURATION_DETAILS: Record<string, { seconds: number; sections: number; label: string }> = {
  "15": { seconds: 15, sections: 2, label: "15 seconds" },
  "30": { seconds: 30, sections: 3, label: "30 seconds" },
  "60": { seconds: 60, sections: 4, label: "60 seconds" },
  "180": { seconds: 180, sections: 6, label: "3 minutes" },
};

export async function generateScript(input: GenerateScriptInput): Promise<GenerateScriptOutput> {
  const durationInfo = DURATION_DETAILS[input.duration] || DURATION_DETAILS["30"];
  
  const prompt = `Create a TikTok video script for: "${input.topic}"
Niche: ${input.niche}
Duration: ${durationInfo.label}
Style: ${input.style}
Language: ${input.language}

Return JSON with this exact structure:
{
  "title": "Catchy video title",
  "hook": "Strong opening hook (first 3 seconds)",
  "sections": [
    {
      "timestamp": "0:00",
      "type": "hook",
      "script": "What you say on screen",
      "visualSuggestion": "What to show visually",
      "duration": 3
    },
    {
      "timestamp": "0:03",
      "type": "content",
      "script": "Main content script",
      "visualSuggestion": "Visual suggestion",
      "duration": ${Math.floor(durationInfo.seconds * 0.6)}
    },
    {
      "timestamp": "${Math.floor(durationInfo.seconds * 0.8)}",
      "type": "cta",
      "script": "Call to action",
      "visualSuggestion": "End screen",
      "duration": ${Math.floor(durationInfo.seconds * 0.2)}
    }
  ],
  "totalDuration": ${durationInfo.seconds},
  "wordCount": ${durationInfo.seconds * 2},
  "trendingSounds": ["Sound name 1", "Sound name 2", "Sound name 3"],
  "tips": ["Filming tip 1", "Editing tip 2", "Engagement tip 3"]
}

Rules:
- Hook MUST grab attention in first 3 seconds (question, shocking statement, or pattern interrupt)
- Script should sound natural and conversational, not scripted
- Include ${durationInfo.sections} sections total
- Word count should be roughly 2-3 words per second
- Suggest trending sounds that fit the ${input.niche} niche
- Include practical filming and editing tips
- Visual suggestions should be specific and actionable
- End with a strong CTA (follow, comment, save, share)
- Make the script engaging enough for viewers to watch till the end`;

  try {
    const text = await callAI(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    
    // Validate response
    if (!result.sections || !Array.isArray(result.sections)) {
      throw new Error('Invalid sections array');
    }

    return {
      title: result.title || `${input.topic} Video`,
      hook: result.hook || "Hook goes here",
      sections: result.sections.map((s: any) => ({
        timestamp: s.timestamp || "0:00",
        type: s.type || "content",
        script: s.script || "",
        visualSuggestion: s.visualSuggestion || "Show relevant visuals",
        duration: s.duration || 5,
      })),
      totalDuration: result.totalDuration || durationInfo.seconds,
      wordCount: result.wordCount || durationInfo.seconds * 2,
      trendingSounds: result.trendingSounds || ["Original Sound", "Trending Audio"],
      tips: result.tips || ["Start with energy", "Good lighting is key"],
      debug: { usedFallback: false },
    };
  } catch (error: any) {
    console.error('[generateScript] Error:', error.message);
    return createFallbackScript(input, error.message);
  }
}

function createFallbackScript(input: GenerateScriptInput, errorMessage?: string): GenerateScriptOutput {
  const durationInfo = DURATION_DETAILS[input.duration] || DURATION_DETAILS["30"];
  
  return {
    title: `How to ${input.topic} - Quick Guide`,
    hook: `Stop scrolling if you want to master ${input.topic}!`,
    sections: [
      {
        timestamp: "0:00",
        type: "hook",
        script: `Stop scrolling! Here's what nobody tells you about ${input.topic}...`,
        visualSuggestion: "Face close to camera, dramatic expression, then pull back",
        duration: 3,
      },
      {
        timestamp: "0:03",
        type: "content",
        script: `So here's the thing about ${input.topic}. Most people get it wrong because they don't know this one simple trick. Let me show you exactly what I mean...`,
        visualSuggestion: "Show demonstration or b-roll of the topic, use text overlays for key points",
        duration: Math.floor(durationInfo.seconds * 0.6),
      },
      {
        timestamp: `0:${Math.floor(durationInfo.seconds * 0.7)}`,
        type: "content",
        script: `And that's how you do it! This works every single time. I've been doing this for years and it never fails.`,
        visualSuggestion: "Show results or before/after comparison",
        duration: Math.floor(durationInfo.seconds * 0.15),
      },
      {
        timestamp: `0:${Math.floor(durationInfo.seconds * 0.85)}`,
        type: "cta",
        script: `Follow for more ${input.niche} tips! Drop a comment if you want part 2!`,
        visualSuggestion: "Point to follow button, add text overlay with CTA",
        duration: Math.floor(durationInfo.seconds * 0.15),
      },
    ],
    totalDuration: durationInfo.seconds,
    wordCount: durationInfo.seconds * 2,
    trendingSounds: [
      "Original Sound - Your Voice",
      "Aesthetic Background Music",
      "Trending Tutorial Sound",
    ],
    tips: [
      "Film in good natural lighting or use a ring light",
      "Speak clearly and with energy - enthusiasm is contagious",
      "Add captions for viewers watching without sound (85% of TikTok users)",
      "Use quick cuts to maintain engagement and pacing",
    ],
    debug: {
      error: errorMessage,
      usedFallback: true,
    },
  };
}
