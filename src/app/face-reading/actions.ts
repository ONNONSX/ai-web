"use server";

import { analyzeFace, type AnalyzeFaceInput } from "@/ai/flows/analyze-face";

export async function handleAnalyzeFace(input: AnalyzeFaceInput) {
  try {
    const result = await analyzeFace(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to analyze face. Please try again." };
  }
}
