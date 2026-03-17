// Groq AI Configuration (FREE & Fast!)
// Set GROQ_API_KEY in Vercel Environment Variables
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function callAI(prompt: string): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not configured');
  }
  
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a TikTok marketing expert. Always respond with valid JSON only. No markdown, no code blocks, no extra text - just pure JSON.'
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
      console.error('[Groq] API Error:', response.status, responseText.substring(0, 300));
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
