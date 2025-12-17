'use server';
/**
 * @fileOverview AI-powered nutritional analysis flow using Gemini 1.5 Flash to calculate macronutrient breakdown.
 *
 * - analyzeMeal - A function that takes a list of food items and their quantities, and returns a detailed nutritional analysis.
 * - AnalyzeMealInput - The input type for the analyzeMeal function.
 * - AnalyzeMealOutput - The return type for the analyzeMeal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the schema for a food item
const FoodItemSchema = z.object({
  name: z.string().describe('The name of the food item.'),
  calories: z.number().describe('The number of calories per serving.'),
  protein: z.number().describe('The amount of protein in grams per serving.'),
  carbs: z.number().describe('The amount of carbohydrates in grams per serving.'),
  fat: z.number().describe('The amount of fat in grams per serving.'),
});

// Define the input schema for the meal analysis
const AnalyzeMealInputSchema = z.object({
  items: z.array(
    z.object({
      food: FoodItemSchema,
      quantity: z.number().describe('The quantity of the food item in servings.'),
    })
  ).describe('A list of food items and their quantities.'),
});
export type AnalyzeMealInput = z.infer<typeof AnalyzeMealInputSchema>;

// Define the output schema for the meal analysis
const AnalyzeMealOutputSchema = z.object({
  itemizedBreakdown: z.array(
    z.object({
      name: z.string().describe('The name of the food item.'),
      calories: z.number().describe('The total calories from this food item.'),
      protein: z.number().describe('The total protein from this food item.'),
      carbs: z.number().describe('The total carbs from this food item.'),
      fat: z.number().describe('The total fat from this food item.'),
    })
  ).describe('An itemized breakdown of the macronutrients for each food item.'),
  runningTotals: z.object({
    calories: z.number().describe('The total calories for the meal.'),
    protein: z.number().describe('The total protein for the meal.'),
    carbs: z.number().describe('The total carbs for the meal.'),
    fat: z.number().describe('The total fat for the meal.'),
  }).describe('The running totals of the macronutrients for the meal.'),
});
export type AnalyzeMealOutput = z.infer<typeof AnalyzeMealOutputSchema>;

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
