// Groq AI Configuration (FREE & Fast!)
// Get your free API key at: https://console.groq.com/
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'gsk_xxxx'; // Replace with your key
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function callAI(prompt: string): Promise<string> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile', // Free, fast, and powerful
        messages: [
          {
            role: 'system',
            content: 'You are a TikTok marketing expert. Always respond with valid JSON only, no markdown code blocks, no extra text.'
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
      console.error('[Groq] API Error:', response.status, responseText.substring(0, 200));
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = JSON.parse(responseText);
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('Empty response from Groq');
    }
    
    // Clean up response - remove markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    return cleanContent;
  } catch (error: any) {
    console.error('[Groq] Error:', error.message);
    throw error;
  }
}

// Backward compatibility alias
export const callGeminiDirect = callAI;

// Dummy export for compatibility
export const ai = {
  definePrompt: () => {},
  defineFlow: () => {},
};
