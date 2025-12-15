import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyDlAK_oUd3p0H3qXSAvjznfSqIGJ_d4TYI';

console.log('[Genkit] API key:', API_KEY ? `${API_KEY.substring(0, 15)}...` : 'MISSING');

export const ai = genkit({
  plugins: [googleAI({ apiKey: API_KEY })],
  model: 'googleai/gemini-2.0-flash',
});

// Direct API call function - using gemini-2.0-flash
export async function callGeminiDirect(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  
  console.log('[Gemini] Calling gemini-2.0-flash...');
  
  try {
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
      console.error('[Gemini] Error:', response.status, responseText.substring(0, 300));
      throw new Error(`API ${response.status}: ${responseText.substring(0, 200)}`);
    }

    const data = JSON.parse(responseText);
    console.log('[Gemini] Success!');
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('[Gemini] No text in response');
      throw new Error('Empty response from Gemini');
    }
    
    return text;
  } catch (error: any) {
    console.error('[Gemini] Error:', error.message);
    throw error;
  }
}
