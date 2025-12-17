"use server";

import { analyzeMeal } from '@/ai/flows/ai-powered-nutritional-analysis';
import type { AnalyzeMealInput, AnalyzeMealOutput, MealItem } from '@/lib/types';

export async function getAnalysis(mealItems: MealItem[]): Promise<{ success: true, data: AnalyzeMealOutput } | { success: false, error: string }> {
  if (!mealItems || mealItems.length === 0) {
    return { success: false, error: "Cannot analyze an empty meal." };
  }

  try {
    const analysisInput: AnalyzeMealInput = {
      items: mealItems.map(item => ({
        food: {
          name: item.food.name,
          calories: item.food.calories,
          protein: item.food.protein,
          carbs: item.food.carbs,
          fat: item.food.fat,
        },
        quantity: item.quantity,
      })),
    };

    const result = await analyzeMeal(analysisInput);
    if (!result || !result.runningTotals) {
      throw new Error("Invalid analysis result from AI.");
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in AI analysis:', error);
    return { success: false, error: 'An unexpected error occurred while analyzing the meal.' };
  }
}
