'use server';
/**
 * @fileOverview AI-powered nutritional analysis for a single custom food item.
 *
 * - getNutritionalInfo - A function that takes a food name and returns its estimated nutritional information.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { FoodItemSchema } from '@/lib/types';

const CustomFoodInputSchema = z.object({
  name: z.string().describe('The name of the food item.'),
});

const CustomFoodOutputSchema = FoodItemSchema.pick({
    calories: true,
    protein: true,
    carbs: true,
    fat: true,
});

export async function getNutritionalInfo(name: string): Promise<z.infer<typeof CustomFoodOutputSchema>> {
  return customFoodAnalysisFlow({ name });
}

const prompt = ai.definePrompt({
    name: 'nutritionalAnalysisForCustomFoodPrompt',
    input: { schema: CustomFoodInputSchema },
    output: { schema: CustomFoodOutputSchema },
    prompt: `You are a nutritional expert. Analyze the following food item and provide an estimated nutritional breakdown for a standard serving size.
  
  Food Item: {{{name}}}
  
  Provide your best estimate for calories, protein, carbohydrates, and fat in grams.`,
  });

const customFoodAnalysisFlow = ai.defineFlow(
  {
    name: 'customFoodAnalysisFlow',
    inputSchema: CustomFoodInputSchema,
    outputSchema: CustomFoodOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
