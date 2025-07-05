"use server";

import { interpretDream, type InterpretDreamInput } from "@/ai/flows/interpret-dream";

export async function handleInterpretDream(input: InterpretDreamInput) {
  try {
    const result = await interpretDream(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to interpret dream. Please try again." };
  }
}
