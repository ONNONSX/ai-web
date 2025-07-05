"use server";

import { analyzePalm, type AnalyzePalmInput } from "@/ai/flows/analyze-palm";

export async function handleAnalyzePalm(input: AnalyzePalmInput) {
  try {
    const result = await analyzePalm(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to analyze palm. Please try again." };
  }
}
