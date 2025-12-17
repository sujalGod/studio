'use server';

/**
 * @fileOverview Summarizes a user's meal history, identifying trends and providing personalized insights.
 *
 * - summarizeMealHistory - A function that summarizes the meal history.
 * - SummarizeMealHistoryInput - The input type for the summarizeMealHistory function.
 * - SummarizeMealHistoryOutput - The return type for the summarizeMealHistory function.
 */

import {ai} from '@/ai/genkit';
import { SummarizeMealHistoryInputSchema, SummarizeMealHistoryOutputSchema, type SummarizeMealHistoryInput, type SummarizeMealHistoryOutput } from '@/lib/types';


export async function summarizeMealHistory(input: SummarizeMealHistoryInput): Promise<SummarizeMealHistoryOutput> {
  return summarizeMealHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMealHistoryPrompt',
  input: {schema: SummarizeMealHistoryInputSchema},
  output: {schema: SummarizeMealHistoryOutputSchema},
  prompt: `You are a nutritional advisor. Summarize the following meal history, identify any trends in macronutrient intake, and provide personalized insights to help the user better understand their eating habits and make informed decisions.

Meal History:
{{#each this}}
- {{name}} (Quantity: {{quantity}}, Calories: {{calories}}, Protein: {{protein}}g, Carbs: {{carbs}}g, Fat: {{fat}}g)
{{/each}}
`,
});

const summarizeMealHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeMealHistoryFlow',
    inputSchema: SummarizeMealHistoryInputSchema,
    outputSchema: SummarizeMealHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
