// DeepSeek AI Configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-b5529a5f4f3c449d8a173352066f4eda';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function callAI(prompt: string): Promise<string> {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a TikTok marketing expert. Always respond with valid JSON only, no markdown or extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('[DeepSeek] API Error:', response.status, responseText.substring(0, 200));
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = JSON.parse(responseText);
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('Empty response from DeepSeek');
    }
    
    return content;
  } catch (error: any) {
    console.error('[DeepSeek] Error:', error.message);
    throw error;
  }
}

// Backward compatibility alias
export const callGeminiDirect = callAI;

// Dummy export for genkit compatibility (not used with DeepSeek)
export const ai = {
  definePrompt: () => {},
  defineFlow: () => {},
};
