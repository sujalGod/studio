'use server';
/**
 * @fileOverview AI-powered nutritional analysis flow using Gemini 1.5 Flash to calculate macronutrient breakdown.
 *
 * - analyzeMeal - A function that takes a list of food items and their quantities, and returns a detailed nutritional analysis.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeMealInputSchema, AnalyzeMealOutputSchema, type AnalyzeMealInput, type AnalyzeMealOutput } from '@/lib/types';

const prompt = ai.definePrompt({
  name: 'aiPoweredNutritionalAnalysisPrompt',
  input: {schema: AnalyzeMealInputSchema},
  output: {schema: AnalyzeMealOutputSchema},
  prompt: `Given the following list of food items and their quantities, calculate the itemized and total nutritional information.

{{#each items}}
- {{food.name}}: {{quantity}}
{{/each}}
`,
});

// Define the flow for AI-powered nutritional analysis
const aiPoweredNutritionalAnalysisFlow = ai.defineFlow(
  {
    name: 'aiPoweredNutritionalAnalysisFlow',
    inputSchema: AnalyzeMealInputSchema,
    outputSchema: AnalyzeMealOutputSchema,
  },
  async (input) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const itemizedBreakdown = input.items.map(item => {
      const calories = item.food.calories * item.quantity;
      const protein = item.food.protein * item.quantity;
      const carbs = item.food.carbs * item.quantity;
      const fat = item.food.fat * item.quantity;

      totalCalories += calories;
      totalProtein += protein;
      totalCarbs += carbs;
      totalFat += fat;

      return {
        name: item.food.name,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat,
      };
    });

    return {
      itemizedBreakdown,
      runningTotals: {
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
      },
    };
  }
);

/**
 * Analyzes the nutritional content of a meal using AI.
 * @param input The meal to analyze.
 * @returns The nutritional analysis of the meal.
 */
export async function analyzeMeal(input: AnalyzeMealInput): Promise<AnalyzeMealOutput> {
  return aiPoweredNutritionalAnalysisFlow(input);
}
