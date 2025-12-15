import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyDfi49qnHcD7sCOB1Vsw9fa92YYX1HlBZI';

console.log('[Genkit] Initializing with API key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'MISSING');

export const ai = genkit({
  plugins: [googleAI({ apiKey: API_KEY })],
  model: 'googleai/gemini-1.5-flash',
});

// Direct API call function as backup
export async function callGeminiDirect(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  console.log('[Gemini Direct] Making API call...');
  
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

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Gemini Direct] API Error:', response.status, errorText);
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('[Gemini Direct] Response received');
  
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error('[Gemini Direct] No text in response:', JSON.stringify(data));
    throw new Error('No text in Gemini response');
  }
  
  return text;
}
