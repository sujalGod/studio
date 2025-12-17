"use server";

import { analyzeMeal } from '@/ai/flows/ai-powered-nutritional-analysis';
import { getNutritionalInfo } from '@/ai/flows/nutritional-analysis-for-custom-food';
import type { AnalyzeMealInput, AnalyzeMealOutput, MealItem } from '@/lib/types';

export async function getAnalysis(mealItems: MealItem[]): Promise<{ success: true, data: AnalyzeMealOutput } | { success: false, error: string }> {
  if (!mealItems || mealItems.length === 0) {
    return { success: false, error: "Cannot analyze an empty meal." };
  }

  try {
    // Enhance meal items with nutritional info for custom foods
    const enhancedItems = await Promise.all(
      mealItems.map(async (item) => {
        // A custom food is identified by having 0 calories.
        if (item.food.calories === 0 && item.food.name.trim() !== '') {
          try {
            const nutritionalInfo = await getNutritionalInfo(item.food.name);
            return {
              ...item,
              food: {
                ...item.food,
                ...nutritionalInfo,
              },
            };
          } catch (e) {
            console.error(`Failed to get nutritional info for ${item.food.name}`, e);
            // If AI fails for a single item, we can decide how to handle it.
            // For now, we'll proceed with it as a zero-calorie item.
            return item;
          }
        }
        return item;
      })
    );

    const analysisInput: AnalyzeMealInput = {
      items: enhancedItems.map(item => ({
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
    
    // The itemized breakdown should reflect the potentially updated nutritional info
    // The current analyzeMeal flow recalculates it, so we just need to pass the result.
    return { success: true, data: result };

  } catch (error) {
    console.error('Error in AI analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while analyzing the meal.';
    return { success: false, error: errorMessage };
  }
}
