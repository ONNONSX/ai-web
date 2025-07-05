"use server";

import { analyzePersonalColor, type AnalyzePersonalColorInput } from "@/ai/flows/analyze-personal-color";

export async function handleAnalyzePersonalColor(input: AnalyzePersonalColorInput) {
  try {
    const result = await analyzePersonalColor(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to analyze personal color. Please try again." };
  }
}
