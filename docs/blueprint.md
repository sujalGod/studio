# **App Name**: Wholesome Nutrition AI

## Core Features:

- Food Library: Searchable list of 80+ Indian food items from a static JSON file with quantity control (+/- buttons).
- Meal Builder: UI to build current meal, listing selected items and their quantities.
- Meal Analysis: Analyze the current meal via the /analyze POST endpoint, pushing results into React history state. Refreshes clear history.
- API Analysis: Accept food item list at /analyze using Express; respond with aggregated analysis including calories, protein, carbs, and fat, strictly in JSON format.
- AI-Powered Nutritional Analysis: Leverage the Gemini 1.5 Flash model through the @google/generative-ai SDK to compute a strict JSON object with itemized list and the running totals of all macronutrients. The model acts as a tool and will make choices based on the nutritional facts about each food in order to make the best calculation.
- Session History: Log of previous analysis results (calories) in the right sidebar of the 3-column dashboard.

## Style Guidelines:

- Dark background (#121212) for a modern, high-contrast aesthetic suitable for dark mode.
- Vibrant green (#32CD32) to highlight calories, providing a visual anchor for nutrition tracking.
- analogous shades of teal to complement the green and distinguish it from background, e.g. #40E0D0.
- 'Inter' (sans-serif) for body text and 'Space Grotesk' (sans-serif) for headlines to ensure readability and a contemporary feel.
- Three-column dashboard layout: Left sidebar for food library, main section for meal builder, and right sidebar for session history.
- Use simple, high-contrast icons for food categories and macronutrient indicators, aiding quick recognition in dark mode.
- Subtle animations when adding/removing food items or when the analysis is complete, providing user feedback without being intrusive.