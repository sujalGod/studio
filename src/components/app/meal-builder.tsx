"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MealItem } from "@/lib/types";
import type { AnalyzeMealOutput } from "@/ai/flows/ai-powered-nutritional-analysis";
import { MinusCircle, PlusCircle, XCircle, Flame, Drumstick, Wheat, Droplet, Zap, RotateCw } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface MealBuilderProps {
  currentMeal: MealItem[];
  analysisResult: AnalyzeMealOutput | null;
  isAnalyzing: boolean;
  onUpdateQuantity: (foodId: string, quantity: number) => void;
  onRemoveItem: (foodId: string) => void;
  onAnalyzeMeal: () => void;
  onClearMeal: () => void;
}

export default function MealBuilder({
  currentMeal,
  analysisResult,
  isAnalyzing,
  onUpdateQuantity,
  onRemoveItem,
  onAnalyzeMeal,
  onClearMeal,
}: MealBuilderProps) {
  const totals = analysisResult?.runningTotals;

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-6">
      <Card className="flex-shrink-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-headline text-2xl">Meal Builder</CardTitle>
            {currentMeal.length > 0 && (
              <Button variant="outline" size="sm" onClick={onClearMeal}>
                <XCircle className="mr-2 h-4 w-4" /> Clear Meal
              </Button>
            )}
          </div>
          <CardDescription>Add items from the library to build your meal.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            {currentMeal.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Your meal is empty.
              </div>
            ) : (
              <div className="space-y-3">
                {currentMeal.map(({ food, quantity }) => (
                  <div key={food.id} className="flex items-center justify-between p-3 rounded-lg bg-card-foreground/5">
                    <div>
                      <p className="font-medium">{food.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {quantity} x {food.serving}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onUpdateQuantity(food.id, quantity - 1)}>
                        <MinusCircle className="h-5 w-5" />
                      </Button>
                      <span className="w-6 text-center">{quantity}</span>
                      <Button variant="ghost" size="icon" onClick={() => onUpdateQuantity(food.id, quantity + 1)}>
                        <PlusCircle className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onRemoveItem(food.id)}>
                        <XCircle className="h-5 w-5 text-destructive/80" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            className="w-full text-lg"
            onClick={onAnalyzeMeal}
            disabled={isAnalyzing || currentMeal.length === 0}
          >
            {isAnalyzing ? (
              <><RotateCw className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</>
            ) : (
              <><Zap className="mr-2 h-5 w-5" /> Analyze Meal</>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {isAnalyzing && <AnalysisSkeleton />}
      
      {analysisResult && (
        <Card className="flex-1 flex flex-col animate-in fade-in zoom-in-95">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Nutritional Analysis</CardTitle>
            <CardDescription>Here's the breakdown of your meal.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MacroCard icon={Flame} value={totals?.calories.toFixed(0)} label="Calories" unit="kcal" color="text-primary" />
              <MacroCard icon={Drumstick} value={totals?.protein.toFixed(1)} label="Protein" unit="g" />
              <MacroCard icon={Wheat} value={totals?.carbs.toFixed(1)} label="Carbs" unit="g" />
              <MacroCard icon={Droplet} value={totals?.fat.toFixed(1)} label="Fat" unit="g" />
            </div>
            <p className="mb-2 font-medium">Itemized Breakdown</p>
            <ScrollArea className="flex-grow">
              <div className="space-y-2 pr-4">
                {analysisResult.itemizedBreakdown.map((item, index) => (
                   <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg bg-card-foreground/5">
                      <p>{item.name}</p>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-primary/80"/>{item.calories.toFixed(0)}</span>
                        <span className="flex items-center gap-1"><Drumstick className="h-3 w-3"/>{item.protein.toFixed(1)}g</span>
                        <span className="flex items-center gap-1"><Wheat className="h-3 w-3"/>{item.carbs.toFixed(1)}g</span>
                        <span className="flex items-center gap-1"><Droplet className="h-3 w-3"/>{item.fat.toFixed(1)}g</span>
                      </div>
                   </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const MacroCard = ({ icon: Icon, value, label, unit, color }: { icon: React.ElementType, value?: string, label: string, unit: string, color?: string }) => (
  <Card className="p-4 flex flex-col justify-between bg-card-foreground/5">
    <div className="flex items-center justify-between text-muted-foreground">
      <p className="text-sm font-medium">{label}</p>
      <Icon className="h-5 w-5" />
    </div>
    <div className={`text-3xl font-bold font-headline mt-2 ${color || ''}`}>
      {value || '0'}
      <span className="text-base font-sans font-medium text-muted-foreground ml-1">{unit}</span>
    </div>
  </Card>
);

const AnalysisSkeleton = () => (
    <Card className="flex-1 flex flex-col">
        <CardHeader>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="p-4 flex flex-col justify-between bg-card-foreground/5">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-5 rounded-full" />
                        </div>
                        <Skeleton className="h-9 w-24 mt-2" />
                    </Card>
                ))}
            </div>
             <Skeleton className="h-6 w-1/3 mb-2" />
            <div className="space-y-2 pr-4">
                 {[...Array(3)].map((_, i) => (
                   <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
        </CardContent>
    </Card>
)
