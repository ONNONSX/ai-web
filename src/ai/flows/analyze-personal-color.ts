'use server';
/**
 * @fileOverview An AI agent that analyzes a user's photo to determine their personal color.
 *
 * - analyzePersonalColor - A function that handles the personal color analysis process.
 * - AnalyzePersonalColorInput - The input type for the analyzePersonalColor function.
 * - AnalyzePersonalColorOutput - The return type for the analyzePersonalColor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePersonalColorInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A frontal photo of a face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  locale: z.string().optional().describe('The language for the response.'),
});

export type AnalyzePersonalColorInput = z.infer<typeof AnalyzePersonalColorInputSchema>;

const AnalyzePersonalColorOutputSchema = z.object({
  personalColorTone: z.string().describe("The main personal color tone (e.g., Spring Warm, Summer Cool, Autumn Warm, Winter Cool)."),
  personalColorSubtype: z.string().describe("The detailed subtype of the personal color (e.g., Light, Bright, Mute, Deep)."),
  summary: z.string().describe("A summary of the user's diagnosed personal color characteristics."),
  bestColorPalette: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).describe("An array of 8 hex color codes for the best color palette."),
  worstColorPalette: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).describe("An array of 4 hex color codes for the worst color palette to avoid."),
  makeupRecommendations: z.object({
    base: z.string().describe("Recommended base makeup tone."),
    lips: z.string().describe("Recommended lip color tone."),
    shadows: z.string().describe("Recommended eyeshadow color tone."),
  }),
  fashionRecommendations: z.string().describe("Fashion styling tips and recommended item colors."),
});

export type AnalyzePersonalColorOutput = z.infer<typeof AnalyzePersonalColorOutputSchema>;

export async function analyzePersonalColor(input: AnalyzePersonalColorInput): Promise<AnalyzePersonalColorOutput> {
  return analyzePersonalColorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePersonalColorPrompt',
  input: {schema: AnalyzePersonalColorInputSchema},
  output: {schema: AnalyzePersonalColorOutputSchema},
  prompt: `You are a professional personal color consultant. Analyze the provided photo of a person's face to determine their personal color.

Photo: {{media url=photoDataUri}}

Analyze the user's skin tone (undertone, brightness), eye color, and hair color. Based on this comprehensive analysis, diagnose their personal color from one of the four main seasons: Spring Warm, Summer Cool, Autumn Warm, or Winter Cool. Also, provide a more detailed subtype (e.g., Spring Light, Spring Bright, Summer Light, Summer Mute, Autumn Mute, Autumn Deep, Winter Deep, Winter Bright).

Provide a detailed analysis including:
1.  A summary of their color characteristics.
2.  A palette of 8 "best colors" in hex code format.
3.  A palette of 4 "worst colors" (colors to avoid) in hex code format.
4.  Specific makeup recommendations for base, lips, and eyeshadow.
5.  Fashion styling tips and recommended colors for clothing.

Please write the entire response in {{locale}}.
`,
});

const analyzePersonalColorFlow = ai.defineFlow(
  {
    name: 'analyzePersonalColorFlow',
    inputSchema: AnalyzePersonalColorInputSchema,
    outputSchema: AnalyzePersonalColorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
