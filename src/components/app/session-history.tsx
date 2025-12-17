"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Session } from "@/lib/types";
import { Flame, Drumstick, Wheat, Droplet, History } from "lucide-react";

interface SessionHistoryProps {
  sessionHistory: Session[];
}

export default function SessionHistory({ sessionHistory }: SessionHistoryProps) {
  return (
    <div className="hidden lg:block border-l h-full">
      <Card className="h-full flex flex-col border-0 rounded-none">
        <CardHeader className="sticky top-0 bg-background/95 z-10">
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><History className="h-6 w-6"/> Session History</CardTitle>
          <CardDescription>A log of your analyzed meals in this session.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {sessionHistory.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-muted-foreground text-center px-4">
                  No meals analyzed yet. Your history will appear here.
                </div>
              ) : (
                [...sessionHistory].reverse().map(session => (
                  <Card key={session.id} className="bg-card-foreground/5 animate-in fade-in">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Meal {session.id}</span>
                        <span className="flex items-center gap-1 text-primary font-headline">
                          <Flame className="h-5 w-5" />
                          {session.calories.toFixed(0)}
                          <span className="text-sm font-sans font-medium text-muted-foreground ml-1">kcal</span>
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-xs text-muted-foreground grid grid-cols-3 gap-2">
                       <div className="flex items-center gap-1.5"><Drumstick className="h-4 w-4"/> P: {session.protein.toFixed(1)}g</div>
                       <div className="flex items-center gap-1.5"><Wheat className="h-4 w-4"/> C: {session.carbs.toFixed(1)}g</div>
                       <div className="flex items-center gap-1.5"><Droplet className="h-4 w-4"/> F: {session.fat.toFixed(1)}g</div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
