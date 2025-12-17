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
