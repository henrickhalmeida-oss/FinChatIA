import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'danger';
  delay?: number;
}

export function StatCard({ title, value, icon, variant = 'default', delay = 0 }: StatCardProps) {
  const cardClass = cn(
    'glass-card p-6 relative overflow-hidden',
    variant === 'success' && 'stat-card-success',
    variant === 'danger' && 'stat-card-danger'
  );

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={cardClass}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className={cn(
            "text-3xl font-bold tabular-nums",
            variant === 'success' && 'text-success',
            variant === 'danger' && 'text-destructive',
            variant === 'default' && 'text-foreground'
          )}>
            {value}
          </p>
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          variant === 'success' && 'bg-success/20 text-success',
          variant === 'danger' && 'bg-destructive/20 text-destructive',
          variant === 'default' && 'bg-primary/20 text-primary'
        )}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
