import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export type TransactionCategory = 'alimentacao' | 'transporte' | 'casa' | 'lazer' | 'saude' | 'educacao' | 'salario' | 'investimento' | 'outros';
export type BankType = 'nubank' | 'itau' | 'caixa' | 'outros';
export type PaymentMethod = 'debit' | 'credit';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: TransactionCategory;
  date: Date;
  userId: string;
  bank: BankType;
  paymentMethod: PaymentMethod;
}

export interface Budget {
  category: TransactionCategory;
  limit: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  current: number;
  target: number;
  icon: string;
}

interface DataContextType {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  isPrivacyEnabled: boolean;
  togglePrivacy: () => void;
  addTransaction: (transaction: any) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  resetAccount: () => Promise<void>;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  bankBalances: Record<BankType, number>;
  creditCardBills: Record<BankType, number>;
  getTransactionsByMonth: (month: number, year: number) => Transaction[];
  getCategoryTotals: (month?: number, year?: number) => { category: TransactionCategory; total: number }[];
  getBudgetStatus: (month?: number, year?: number) => { category: TransactionCategory; spent: number; limit: number }[];
  getMonthlyStats: (month: number, year: number) => { 
    totalBalance: number; 
    totalIncome: number; 
    totalExpenses: number; 
    bankBalances: Record<BankType, number>;
    creditCardBills: Record<BankType, number>; 
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  alimentacao: 'Alimentação', transporte: 'Transporte', casa: 'Casa', lazer: 'Lazer',
  saude: 'Saúde', educacao: 'Educação', salario: 'Salário', investimento: 'Investimento', outros: 'Outros',
};

const DEFAULT_BUDGETS: Budget[] = [
  { category: 'alimentacao', limit: 1200 }, { category: 'transporte', limit: 600 },
  { category: 'casa', limit: 2000 }, { category: 'lazer', limit: 500 },
  { category: 'saude', limit: 400 }, { category: 'educacao', limit: 300 },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets] = useState<Budget[]>(DEFAULT_BUDGETS);
  const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(false);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  // Carregar Metas do LocalStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('userSavingsGoals');
    if (savedGoals) setSavingsGoals(JSON.parse(savedGoals));
  }, []);

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = { ...goal, id: crypto.randomUUID() };
    const updatedGoals = [...savingsGoals, newGoal];
    setSavingsGoals(updatedGoals);
    localStorage.setItem('userSavingsGoals', JSON.stringify(updatedGoals));
  };

  const updateSavingsGoal = (id: string, updates: Partial<SavingsGoal>) => {
    const newGoals = savingsGoals.map(g => g.id === id ? { ...g, ...updates } : g);
    setSavingsGoals(newGoals);
    localStorage.setItem('userSavingsGoals', JSON.stringify(newGoals));
  };

  const deleteSavingsGoal = (id: string) => {
    const newGoals = savingsGoals.filter(g => g.id !== id);
    setSavingsGoals(newGoals);
    localStorage.setItem('userSavingsGoals', JSON.stringify(newGoals));
  };

  const togglePrivacy = () => setIsPrivacyEnabled(prev => !prev);

  // Busca transações do Supabase
  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
    if (error) return;
    
    const formattedTransactions: Transaction[] = data.map((t: any) => ({
      id: t.id, 
      description: t.description, 
      amount: Number(t.amount), 
      type: t.type, 
      category: t.category,
      bank: t.bank || 'outros', 
      paymentMethod: (t.payment_method as PaymentMethod) || 'debit', 
      date: new Date(t.date), 
      userId: t.user_id,
    }));
    setTransactions(formattedTransactions);
  }, [user]);

  useEffect(() => { if (user) fetchTransactions(); }, [user, fetchTransactions]);

  // Adicionar Transação
  const addTransaction = useCallback(async (transactionData: any) => {
    if (!user) return;
    const finalMethod = transactionData.paymentMethod === 'credit' ? 'credit' : 'debit';

    const { error } = await supabase.from('transactions').insert([{
        user_id: user.id, 
        description: transactionData.description, 
        amount: transactionData.amount, 
        type: transactionData.type,
        category: transactionData.category, 
        bank: transactionData.bank || 'outros', 
        payment_method: finalMethod, 
        date: (transactionData.date || new Date()).toISOString(),
    }]);
    
    if (!error) {
      fetchTransactions();
      toast({ title: "Sucesso", description: "Lançamento salvo com sucesso!" });
    }
  }, [user, fetchTransactions, toast]);

  // ✅ Atualizar Transação (Corrigido para mapear 'bank')
  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    if (!user) return;
    
    const dbUpdates: any = { ...updates };
    if (updates.date) dbUpdates.date = new Date(updates.date).toISOString();
    if (updates.paymentMethod) dbUpdates.payment_method = updates.paymentMethod;
    // O campo 'bank' já está em 'updates', o Supabase aceita se a coluna for 'bank'
    
    const { error } = await supabase.from('transactions').update(dbUpdates).eq('id', id);
    
    if (!error) {
      // Atualiza o estado local para resposta imediata
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      toast({ title: "Sucesso", description: "Registro atualizado!" });
      fetchTransactions(); // Sincroniza
    }
  }, [user, fetchTransactions, toast]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({ title: "Removido", description: "Lançamento excluído." });
    }
  }, [user, toast]);

  const resetAccount = useCallback(async () => {
    if (!user) return;
    await supabase.from('transactions').delete().eq('user_id', user.id);
    setTransactions([]);
  }, [user]);

  // Cálculos Globais (Dashboard Principal)
  const { totalIncome, totalExpenses, totalBalance, bankBalances, creditCardBills } = useMemo(() => {
    const balances: Record<BankType, number> = { nubank: 0, itau: 0, caixa: 0, outros: 0 };
    const bills: Record<BankType, number> = { nubank: 0, itau: 0, caixa: 0, outros: 0 };
    let inc = 0;
    let exp = 0;

    transactions.forEach(t => {
      const bank = (t.bank as BankType) || 'outros';
      if (t.type === 'income') {
        inc += t.amount;
        balances[bank] += t.amount;
      } else {
        if (t.paymentMethod === 'credit') {
          bills[bank] += t.amount;
        } else {
          exp += t.amount;
          balances[bank] -= t.amount;
        }
      }
    });

    return { totalIncome: inc, totalExpenses: exp, totalBalance: inc - exp, bankBalances: balances, creditCardBills: bills };
  }, [transactions]);

  const getTransactionsByMonth = useCallback((month: number, year: number) => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }, [transactions]);

  const getCategoryTotals = useCallback((month?: number, year?: number) => {
    const categoryMap = new Map<TransactionCategory, number>();
    let filtered = transactions.filter(t => t.type === 'expense');
    
    if (month !== undefined && year !== undefined) {
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });
    }
    filtered.forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });
    return Array.from(categoryMap.entries()).map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total);
  }, [transactions]);

  const getBudgetStatus = useCallback((month?: number, year?: number) => {
    const now = new Date();
    const targetMonth = month ?? now.getMonth();
    const targetYear = year ?? now.getFullYear();
    const monthlyExpenses = transactions.filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && date.getMonth() === targetMonth && date.getFullYear() === targetYear;
    });
    return budgets.map(budget => {
      const spent = monthlyExpenses.filter(t => t.category === budget.category).reduce((sum, t) => sum + t.amount, 0);
      return { category: budget.category, spent, limit: budget.limit };
    });
  }, [transactions, budgets]);

  const getMonthlyStats = useCallback((month: number, year: number) => {
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions
        .filter(t => t.type === 'expense' && t.paymentMethod === 'debit')
        .reduce((sum, t) => sum + t.amount, 0);

    const balancesByBank: Record<BankType, number> = { nubank: 0, itau: 0, caixa: 0, outros: 0 };
    const billsByBank: Record<BankType, number> = { nubank: 0, itau: 0, caixa: 0, outros: 0 };
    
    monthTransactions.forEach(t => {
      const bank = (t.bank as BankType) || 'outros';
      if (t.type === 'income') balancesByBank[bank] += t.amount;
      else {
        if (t.paymentMethod === 'credit') billsByBank[bank] += t.amount;
        else balancesByBank[bank] -= t.amount;
      }
    });

    return { 
        totalBalance: income - expenses, 
        totalIncome: income, 
        totalExpenses: expenses, 
        bankBalances: balancesByBank, 
        creditCardBills: billsByBank 
    };
  }, [transactions]);

  return (
    <DataContext.Provider value={{ 
      transactions, budgets, addTransaction, updateTransaction, deleteTransaction, 
      resetAccount, totalBalance, totalIncome, totalExpenses, bankBalances, 
      creditCardBills, getTransactionsByMonth, getCategoryTotals, getBudgetStatus, 
      getMonthlyStats, isPrivacyEnabled, togglePrivacy, savingsGoals, 
      updateSavingsGoal, addSavingsGoal, deleteSavingsGoal 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
}