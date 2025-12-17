"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { foodLibrary } from '@/lib/food-data';
import type { FoodItem } from '@/lib/types';
import { PlusCircle, Search } from 'lucide-react';
import { VegIcon, NonVegIcon, EggIcon } from './icons';

interface FoodLibraryProps {
  onAddItem: (food: FoodItem) => void;
}

const CategoryIcon = ({ category }: { category: FoodItem['category'] }) => {
  switch (category) {
    case 'veg':
      return <VegIcon />;
    case 'non-veg':
      return <NonVegIcon />;
    case 'egg':
      return <EggIcon />;
    default:
      return null;
  }
};


export default function FoodLibrary({ onAddItem }: FoodLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFood = foodLibrary.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="h-full flex flex-col border-t-0 border-b-0 border-l-0 rounded-none">
      <CardHeader className="sticky top-0 bg-background/95 z-10">
        <CardTitle className="font-headline text-2xl">Food Library</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for food..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {filteredFood.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-card-foreground/5 hover:bg-card-foreground/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                   <CategoryIcon category={item.category} />
                   <div>
                     <p className="font-medium">{item.name}</p>
                     <p className="text-xs text-muted-foreground">{item.serving}</p>
                   </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onAddItem(item)}>
                  <PlusCircle className="h-5 w-5 text-primary" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
