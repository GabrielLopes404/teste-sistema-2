import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface CalendarEvent {
  day: number;
  hasEvent: boolean;
  isToday?: boolean;
}

export function CalendarWidget() {
  const [currentMonth] = useState("Novembro - 2025");
  
  const daysInMonth = 30;
  const firstDayOfWeek = 5; // Sexta-feira (5)
  const today = 2;
  
  const events = [2, 10, 15, 22, 28];
  
  const days: CalendarEvent[] = [];
  
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ day: 0, hasEvent: false });
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      hasEvent: events.includes(day),
      isToday: day === today,
    });
  }

  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{currentMonth}</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" data-testid="button-prev-month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" data-testid="button-next-month">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-xs font-medium text-muted-foreground text-center py-1"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((item, index) => (
            <div key={index} className="aspect-square">
              {item.day > 0 && (
                <button
                  className={`w-full h-full flex items-center justify-center text-sm rounded-md hover-elevate relative ${
                    item.isToday
                      ? "bg-primary text-primary-foreground font-bold"
                      : item.hasEvent
                      ? "font-semibold"
                      : ""
                  }`}
                  data-testid={`calendar-day-${item.day}`}
                >
                  {item.day}
                  {item.hasEvent && !item.isToday && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Saldo atual:</span>
            <span className="font-semibold font-mono text-success">R$ 80,00</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Previsão do mês:</span>
            <span className="font-semibold font-mono">R$ 80,00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
