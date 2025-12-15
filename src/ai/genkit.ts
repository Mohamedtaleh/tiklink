import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY || 'AIzaSyDE4GDnjRc9ghHNyqn95qC7KdQhfWXKWIk' })],
  model: 'googleai/gemini-2.0-flash',
});
