import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TransactionCategory, CATEGORY_LABELS, BankType } from '@/contexts/DataContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { addTransaction } = useData();
  const { toast } = useToast();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<TransactionCategory>('outros');
  const [bank, setBank] = useState<BankType>('nubank');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [repeatMonthly, setRepeatMonthly] = useState(false);

  const categories: TransactionCategory[] = [
    'alimentacao', 'transporte', 'casa', 'lazer', 
    'saude', 'educacao', 'salario', 'investimento', 'outros'
  ];

  const banks: { value: BankType; label: string }[] = [
    { value: 'nubank', label: 'Nubank' },
    { value: 'itau', label: 'Itaú' },
    { value: 'caixa', label: 'Caixa' },
  ];

  const handleSubmit = () => {
    if (!description.trim() || !amount) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    addTransaction({
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      bank,
      date: new Date(date),
      repeatMonths: repeatMonthly ? 12 : 1,
    });

    const message = repeatMonthly 
      ? `${description} adicionada para os próximos 12 meses!`
      : `${description} adicionada com sucesso!`;

    toast({
      title: type === 'income' ? "💰 Receita registrada!" : "📝 Despesa registrada!",
      description: message,
    });

    // Reset form
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('outros');
    setBank('nubank');
    setDate(new Date().toISOString().split('T')[0]);
    setRepeatMonthly(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1a1f2e] border border-border/50 rounded-2xl p-6 max-w-xl w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Nova Transação</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Type Toggle */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={type === 'expense' ? 'default' : 'outline'}
              className={`flex-1 ${type === 'expense' ? 'bg-destructive hover:bg-destructive/90' : 'border-gray-700'}`}
              onClick={() => setType('expense')}
            >
              Despesa
            </Button>
            <Button
              variant={type === 'income' ? 'default' : 'outline'}
              className={`flex-1 ${type === 'income' ? 'bg-success hover:bg-success/90' : 'border-gray-700'}`}
              onClick={() => setType('income')}
            >
              Receita
            </Button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Descrição *
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Almoço, Uber, Salário..."
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Banco
                </label>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value as BankType)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {banks.map(b => (
                    <option key={b.value} value={b.value} className="bg-gray-900 text-foreground">
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-900 text-foreground">
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Repeat Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-3">
                <Repeat className="w-5 h-5 text-primary" />
                <div>
                  <Label htmlFor="repeat-toggle" className="text-sm font-medium text-foreground">
                    Repetir por 12 meses
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cria a transação para os próximos 12 meses
                  </p>
                </div>
              </div>
              <Switch
                id="repeat-toggle"
                checked={repeatMonthly}
                onCheckedChange={setRepeatMonthly}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 border-gray-700 text-foreground hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="flex-1 glow-button">
              <Plus className="w-4 h-4 mr-2" />
              {repeatMonthly ? 'Adicionar (12x)' : 'Adicionar'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}