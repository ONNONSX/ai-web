'use server';

/**
 * @fileOverview An AI agent that analyzes a user's palm photo to provide insights about their health and wealth.
 *
 * - analyzePalm - A function that handles the palm analysis process.
 * - AnalyzePalmInput - The input type for the analyzePalm function.
 * - AnalyzePalmOutput - The return type for the analyzePalm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePalmInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a palm, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  locale: z.string().optional().describe('The language for the response.'),
});
export type AnalyzePalmInput = z.infer<typeof AnalyzePalmInputSchema>;

const AnalyzePalmOutputSchema = z.object({
  healthInsights: z.string().describe('Insights about the user health.'),
  wealthInsights: z.string().describe('Insights about the user wealth.'),
  annotatedPhotoDataUri: z.string().describe('The palm photo with highlighted lines.'),
});
export type AnalyzePalmOutput = z.infer<typeof AnalyzePalmOutputSchema>;

export async function analyzePalm(input: AnalyzePalmInput): Promise<AnalyzePalmOutput> {
  return analyzePalmFlow(input);
}

const textAnalysisPrompt = ai.definePrompt({
  name: 'analyzePalmTextPrompt',
  input: {schema: z.object({ photoDataUri: z.string(), locale: z.string().optional() })},
  output: {schema: z.object({
      healthInsights: z.string().describe('Insights about the user health.'),
      wealthInsights: z.string().describe('Insights about the user wealth.'),
  })},
  prompt: `You are an expert palm reader. Analyze the palm photo provided by the user and provide insights about their health and wealth.
Please write the response in {{locale}}.
Palm Photo: {{media url=photoDataUri}}`,
});

const imageAnnotationPrompt = `Analyze the provided image of a palm. Identify the main palmistry lines (such as the heart line, head line, and life line) and draw over them with a vibrant yellow color. Return the image with the lines highlighted.`;

const analyzePalmFlow = ai.defineFlow(
  {
    name: 'analyzePalmFlow',
    inputSchema: AnalyzePalmInputSchema,
    outputSchema: AnalyzePalmOutputSchema,
  },
  async input => {
    const [textResult, imageResult] = await Promise.all([
        textAnalysisPrompt(input),
        ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: [
                {media: {url: input.photoDataUri}},
                {text: imageAnnotationPrompt},
            ],
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        }),
    ]);
    
    const textOutput = textResult.output;
    if (!textOutput) {
        throw new Error('Failed to get text analysis from AI');
    }

    const annotatedImage = imageResult.media;
    if (!annotatedImage) {
        throw new Error('Failed to get annotated image from AI');
    }

    return {
      ...textOutput,
      annotatedPhotoDataUri: annotatedImage.url,
    };
  }
);
