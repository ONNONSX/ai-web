'use server';

/**
 * @fileOverview Dream interpretation AI agent.
 *
 * - interpretDream - A function that handles the dream interpretation process.
 * - InterpretDreamInput - The input type for the interpretDream function.
 * - InterpretDreamOutput - The return type for the interpretDream function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretDreamInputSchema = z.object({
  dreamContent: z.string().describe('The content of the dream to be interpreted.'),
  locale: z.string().optional().describe('The language for the response.'),
});
export type InterpretDreamInput = z.infer<typeof InterpretDreamInputSchema>;

const InterpretDreamOutputSchema = z.object({
  interpretation: z.string().describe('The AI interpretation of the dream.'),
});
export type InterpretDreamOutput = z.infer<typeof InterpretDreamOutputSchema>;

export async function interpretDream(input: InterpretDreamInput): Promise<InterpretDreamOutput> {
  return interpretDreamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretDreamPrompt',
  input: {schema: InterpretDreamInputSchema},
  output: {schema: InterpretDreamOutputSchema},
  prompt: `You are a dream interpreter. A user will describe their dream to you, and you will provide a detailed interpretation of its symbolic meaning.

Dream Content: {{{dreamContent}}}

Please write the response in {{locale}}.`,
});

const interpretDreamFlow = ai.defineFlow(
  {
    name: 'interpretDreamFlow',
    inputSchema: InterpretDreamInputSchema,
    outputSchema: InterpretDreamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
