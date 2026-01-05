import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  const now = new Date();
  const isCurrentMonth = 
    selectedMonth.getMonth() === now.getMonth() && 
    selectedMonth.getFullYear() === now.getFullYear();
  
  const isFutureMonth = selectedMonth > now;

  const goToPreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const goToCurrentMonth = () => {
    onMonthChange(new Date());
  };

  const monthLabel = `${MONTH_NAMES[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`;

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center gap-3"
    >
      <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousMonth}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="min-w-[160px] text-center">
          <span className="font-semibold text-foreground">{monthLabel}</span>
          {isFutureMonth && (
            <div className="flex items-center justify-center gap-1 text-xs text-primary mt-0.5">
              <Clock className="w-3 h-3" />
              <span>Projetado</span>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {!isCurrentMonth && (
        <Button
          variant="outline"
          size="sm"
          onClick={goToCurrentMonth}
          className="text-xs border-primary/30 text-primary hover:bg-primary/10"
        >
          Mês Atual
        </Button>
      )}
    </motion.div>
  );
}
