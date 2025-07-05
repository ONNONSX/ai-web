// This is an AI-powered tool that analyzes a user's face from a photo to provide insights about their personality and fortune.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFaceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  locale: z.string().optional().describe('The language for the response.'),
});

export type AnalyzeFaceInput = z.infer<typeof AnalyzeFaceInputSchema>;

const AnalyzeFaceOutputSchema = z.object({
  personalityInsights: z.string().describe('Insights about the user\'s personality based on their facial features.'),
  fortuneOutlook: z.string().describe('A fortune outlook for the user, derived from their facial features.'),
  jobRecommendations: z.array(z.string()).describe('A list of recommended job titles based on the face analysis.'),
});

export type AnalyzeFaceOutput = z.infer<typeof AnalyzeFaceOutputSchema>;

export async function analyzeFace(input: AnalyzeFaceInput): Promise<AnalyzeFaceOutput> {
  return analyzeFaceFlow(input);
}

const analyzeFacePrompt = ai.definePrompt({
  name: 'analyzeFacePrompt',
  input: {schema: AnalyzeFaceInputSchema},
  output: {schema: AnalyzeFaceOutputSchema},
  prompt: `Analyze the provided facial photo to infer personality traits, provide a brief fortune outlook, and suggest potential career paths.

  Photo: {{media url=photoDataUri}}
  
  Consider common physiognomy associations, but provide a modern, entertaining, and slightly whimsical interpretation.
  Focus on positive attributes and potential future opportunities.
  Based on the inferred personality, recommend a few suitable job titles.
  Format your response into personality insights, a fortune outlook, and a list of job recommendations.

  Please write the response in {{locale}}.
  `,
});

const analyzeFaceFlow = ai.defineFlow(
  {
    name: 'analyzeFaceFlow',
    inputSchema: AnalyzeFaceInputSchema,
    outputSchema: AnalyzeFaceOutputSchema,
  },
  async input => {
    const {output} = await analyzeFacePrompt(input);
    return output!;
  }
);
