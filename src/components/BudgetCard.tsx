import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BudgetCardProps {
  category: string;
  spent: number;
  limit: number;
  color: string;
  delay?: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function BudgetCard({ category, spent, limit, color, delay = 0 }: BudgetCardProps) {
  const percentage = Math.min((spent / limit) * 100, 100);
  const isOverBudget = spent > limit;
  const overPercentage = isOverBudget ? ((spent - limit) / limit) * 100 : 0;
  
  const getStatusColor = () => {
    if (isOverBudget) return 'text-destructive';
    if (percentage >= 80) return 'text-amber-400';
    return 'text-success';
  };

  const getBarColor = () => {
    if (isOverBudget) return 'bg-destructive';
    if (percentage >= 80) return 'bg-amber-400';
    return color;
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={cn(
        "p-4 rounded-xl bg-secondary/30 border transition-all",
        isOverBudget ? "border-destructive/50" : "border-border/30"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: isOverBudget ? 'hsl(var(--destructive))' : color }}
          />
          <span className="font-medium">{category}</span>
        </div>
        {isOverBudget && (
          <div className="flex items-center gap-1 text-destructive text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>+{overPercentage.toFixed(0)}%</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-secondary/50 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ delay: delay + 0.2, duration: 0.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", getBarColor())}
        />
      </div>

      {/* Values */}
      <div className="flex items-center justify-between text-sm">
        <span className={cn("font-bold tabular-nums", getStatusColor())}>
          {formatCurrency(spent)}
        </span>
        <span className="text-muted-foreground">
          / {formatCurrency(limit)}
        </span>
      </div>
    </motion.div>
  );
}
