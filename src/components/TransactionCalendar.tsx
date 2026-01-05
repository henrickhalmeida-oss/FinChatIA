import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';

interface TransactionCalendarProps {
  transactions: Transaction[];
  onDateSelect: (date: Date | null) => void;
  selectedDate: Date | null;
}

export function TransactionCalendar({ transactions, onDateSelect, selectedDate }: TransactionCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const getTransactionsForDay = (day: number) => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getDate() === day && 
             tDate.getMonth() === month && 
             tDate.getFullYear() === year;
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    onDateSelect(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    onDateSelect(null);
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    if (selectedDate && selectedDate.toDateString() === clickedDate.toDateString()) {
      onDateSelect(null);
    } else {
      onDateSelect(clickedDate);
    }
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const renderDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTransactions = getTransactionsForDay(day);
      const hasIncome = dayTransactions.some(t => t.type === 'income');
      const hasExpense = dayTransactions.some(t => t.type === 'expense');
      const isSelected = selectedDate && 
                        selectedDate.getDate() === day && 
                        selectedDate.getMonth() === month && 
                        selectedDate.getFullYear() === year;
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <motion.button
          key={day}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDayClick(day)}
          className={cn(
            "h-12 rounded-lg flex flex-col items-center justify-center relative transition-all",
            isSelected 
              ? "bg-primary text-primary-foreground" 
              : isToday 
                ? "bg-primary/20 text-primary" 
                : "hover:bg-secondary/50",
            dayTransactions.length > 0 && "cursor-pointer"
          )}
        >
          <span className={cn(
            "text-sm font-medium",
            !isSelected && !isToday && "text-foreground"
          )}>
            {day}
          </span>
          
          {/* Dots for transactions */}
          {(hasIncome || hasExpense) && (
            <div className="flex gap-0.5 mt-0.5">
              {hasIncome && (
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isSelected ? "bg-white" : "bg-success"
                )} />
              )}
              {hasExpense && (
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isSelected ? "bg-white" : "bg-destructive"
                )} />
              )}
            </div>
          )}
        </motion.button>
      );
    }

    return days;
  };

  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="text-lg font-semibold capitalize">{monthName}</h3>
        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="h-8 flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span>Receita</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span>Despesa</span>
        </div>
      </div>
    </motion.div>
  );
}
