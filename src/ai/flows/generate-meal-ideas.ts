'use server';

/**
 * @fileOverview AI-powered meal idea generator based on dietary restrictions and preferences.
 *
 * - generateMealIdeas - A function that generates meal ideas based on user input.
 * - GenerateMealIdeasInput - The input type for the generateMealIdeas function.
 * - GenerateMealIdeasOutput - The return type for the generateMealIdeas function.
 */

import {ai} from '@/ai/genkit';
import { GenerateMealIdeasInputSchema, GenerateMealIdeasOutputSchema, type GenerateMealIdeasInput, type GenerateMealIdeasOutput } from '@/lib/types';


export async function generateMealIdeas(input: GenerateMealIdeasInput): Promise<GenerateMealIdeasOutput> {
  return generateMealIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMealIdeasPrompt',
  input: {schema: GenerateMealIdeasInputSchema},
  output: {schema: GenerateMealIdeasOutputSchema},
  prompt: `You are a nutritional assistant that suggests meal ideas based on a user's dietary restrictions and preferences.

  Dietary Restrictions: {{{dietaryRestrictions}}}
  Preferences: {{{preferences}}}

  Suggest meal ideas, taking into account the dietary restrictions and preferences to create meals that the user can add to their meal builder.
  Return a JSON array of strings.`,
});

const generateMealIdeasFlow = ai.defineFlow(
  {
    name: 'generateMealIdeasFlow',
    inputSchema: GenerateMealIdeasInputSchema,
    outputSchema: GenerateMealIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export type { GenerateMealIdeasInput, GenerateMealIdeasOutput };
