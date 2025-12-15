import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY || 'AIzaSyDfi49qnHcD7sCOB1Vsw9fa92YYX1HlBZI' })],
  model: 'googleai/gemini-1.5-flash',
});
