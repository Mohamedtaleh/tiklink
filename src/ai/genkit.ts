import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyCmvUOAFQbVw4G7f4DJHjFBSQs0MJ_lSbY';

export const ai = genkit({
  plugins: [googleAI({ apiKey: API_KEY })],
  model: 'googleai/gemini-2.0-flash',
});

// Direct API call function
export async function callGeminiDirect(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2048,
      }
    }),
  });

  const responseText = await response.text();
  
  if (!response.ok) {
    console.error('[Gemini] Error:', response.status);
    throw new Error(`API ${response.status}: ${responseText.substring(0, 200)}`);
  }

  const data = JSON.parse(responseText);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error('Empty response from Gemini');
  }
  
  return text;
}
