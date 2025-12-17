import { z } from 'zod';

export type FoodItem = {
  id: string;
  name: string;
  serving: string;
  category: 'veg' | 'non-veg' | 'egg';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealItem = {
  food: FoodItem;
  quantity: number;
};

export type Session = {
  id: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// AI-powered nutritional analysis schemas and types
export const FoodItemSchema = z.object({
  name: z.string().describe('The name of the food item.'),
  calories: z.number().describe('The number of calories per serving.'),
  protein: z.number().describe('The amount of protein in grams per serving.'),
  carbs: z.number().describe('The amount of carbohydrates in grams per serving.'),
  fat: z.number().describe('The amount of fat in grams per serving.'),
});

export const AnalyzeMealInputSchema = z.object({
  items: z.array(
    z.object({
      food: FoodItemSchema,
      quantity: z.number().describe('The quantity of the food item in servings.'),
    })
  ).describe('A list of food items and their quantities.'),
});
export type AnalyzeMealInput = z.infer<typeof AnalyzeMealInputSchema>;

export const AnalyzeMealOutputSchema = z.object({
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


// Generate meal ideas schemas and types
export const GenerateMealIdeasInputSchema = z.object({
  dietaryRestrictions: z
    .string()
    .describe(
      'Any dietary restrictions the user has, such as allergies, intolerances, or specific diets (e.g., vegetarian, vegan, gluten-free).'
    ),
  preferences: z
    .string()
    .describe('The user’s food preferences (e.g. likes, dislikes).'),
});
export type GenerateMealIdeasInput = z.infer<typeof GenerateMealIdeasInputSchema>;

export const GenerateMealIdeasOutputSchema = z.object({
  mealIdeas: z
    .array(z.string())
    .describe('An array of meal ideas based on the dietary restrictions and preferences provided.'),
});
export type GenerateMealIdeasOutput = z.infer<typeof GenerateMealIdeasOutputSchema>;

// Summarize meal history schemas and types
export const SummarizeMealHistoryInputSchema = z.array(
  z.object({
    name: z.string(),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    quantity: z.number(),
  })
).describe('An array of meal objects, each containing nutritional information.');
export type SummarizeMealHistoryInput = z.infer<typeof SummarizeMealHistoryInputSchema>;

export const SummarizeMealHistoryOutputSchema = z.object({
  summary: z.string().describe('A summary of the meal history, including trends and personalized insights.'),
});
export type SummarizeMealHistoryOutput = z.infer<typeof SummarizeMealHistoryOutputSchema>;
