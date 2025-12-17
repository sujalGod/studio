'use server';
/**
 * @fileOverview AI-powered nutritional analysis flow using Gemini 1.5 Flash to calculate macronutrient breakdown.
 *
 * - analyzeMeal - A function that takes a list of food items and their quantities, and returns a detailed nutritional analysis.
 * - AnalyzeMealInput - The input type for the analyzeMeal function.
 * - AnalyzeMealOutput - The return type for the analyzeMeal function.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeMealInputSchema, AnalyzeMealOutputSchema, type AnalyzeMealInput, type AnalyzeMealOutput } from '@/lib/types';

// Define the tool for nutritional analysis
const analyzeMealTool = ai.defineTool({
  name: 'analyzeMeal',
  description: 'Calculates the nutritional breakdown of a meal based on a list of food items and their quantities.',
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

  const runningTotals = {
    calories: totalCalories,
    protein: totalProtein,
    carbs: totalCarbs,
    fat: totalFat,
  };

  return {
    itemizedBreakdown: itemizedBreakdown,
    runningTotals: runningTotals,
  };
});

const prompt = ai.definePrompt({
  name: 'aiPoweredNutritionalAnalysisPrompt',
  tools: [analyzeMealTool],
  input: {schema: AnalyzeMealInputSchema},
  output: {schema: AnalyzeMealOutputSchema},
  prompt: `Given the following list of food items and their quantities, use the analyzeMeal tool to calculate the itemized and total nutritional information.

Items: {{items}}`,
});

// Define the flow for AI-powered nutritional analysis
const aiPoweredNutritionalAnalysisFlow = ai.defineFlow(
  {
    name: 'aiPoweredNutritionalAnalysisFlow',
    inputSchema: AnalyzeMealInputSchema,
    outputSchema: AnalyzeMealOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
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

export type { AnalyzeMealInput, AnalyzeMealOutput };
