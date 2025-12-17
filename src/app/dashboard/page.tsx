"use client";

import { useState, useTransition } from 'react';
import FoodLibrary from '@/components/app/food-library';
import MealBuilder from '@/components/app/meal-builder';
import SessionHistory from '@/components/app/session-history';
import type { FoodItem, MealItem, Session } from '@/lib/types';
import type { AnalyzeMealOutput } from '@/lib/types';
import { getAnalysis } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [currentMeal, setCurrentMeal] = useState<MealItem[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeMealOutput | null>(null);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const [isAnalyzing, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAddItem = (food: FoodItem, quantity = 1) => {
    setCurrentMeal(prevMeal => {
      const existingItem = prevMeal.find(item => item.food.id === food.id);
      if (existingItem) {
        return prevMeal.map(item =>
          item.food.id === food.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevMeal, { food, quantity }];
    });
    setAnalysisResult(null);
  };

  const handleRemoveItem = (foodId: string) => {
    setCurrentMeal(prevMeal => prevMeal.filter(item => item.food.id !== foodId));
    setAnalysisResult(null);
  };

  const handleUpdateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(foodId);
    } else {
      setCurrentMeal(prevMeal =>
        prevMeal.map(item =>
          item.food.id === foodId ? { ...item, quantity } : item
        )
      );
    }
    setAnalysisResult(null);
  };
  
  const handleClearMeal = () => {
    setCurrentMeal([]);
    setAnalysisResult(null);
  }

  const handleAnalyzeMeal = () => {
    startTransition(async () => {
      const result = await getAnalysis(currentMeal);
      if (result.success) {
        setAnalysisResult(result.data);
        setSessionHistory(prevHistory => [
          ...prevHistory,
          { 
            id: prevHistory.length + 1,
            ...result.data.runningTotals
          },
        ]);
      } else {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="grid md:grid-cols-[380px_1fr] lg:grid-cols-[380px_1fr_320px] h-[calc(100vh-4rem)]">
      <FoodLibrary onAddItem={handleAddItem} />
      
      <MealBuilder
        currentMeal={currentMeal}
        analysisResult={analysisResult}
        isAnalyzing={isAnalyzing}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onAnalyzeMeal={handleAnalyzeMeal}
        onClearMeal={handleClearMeal}
      />

      <SessionHistory sessionHistory={sessionHistory} />
    </div>
  );
}
