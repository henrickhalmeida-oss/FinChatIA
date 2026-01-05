import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search,
  Calendar,
  List,
  Trash2,
  Pencil,
  Clock,
  CreditCard,
  Wallet,
  Filter
} from 'lucide-react';
import { useData, CATEGORY_LABELS, TransactionCategory, Transaction, BankType } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TransactionCalendar } from '@/components/TransactionCalendar';
import { EditTransactionModal } from '@/components/EditTransactionModal';
import { MonthSelector } from '@/components/MonthSelector';

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  alimentacao: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  transporte: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  casa: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  lazer: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  saude: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  educacao: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  salario: 'bg-green-500/20 text-green-400 border-green-500/30',
  investimento: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  outros: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export default function Carteira() {
  const { transactions, deleteTransaction, updateTransaction, isPrivacyEnabled } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [bankFilter, setBankFilter] = useState<BankType | 'all'>('all');

  const formatCurrency = (value: number) => {
    if (isPrivacyEnabled) return '•••••••';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const now = new Date();
  const isFutureMonth = selectedMonth.getMonth() > now.getMonth() || selectedMonth.getFullYear() > now.getFullYear();

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const tDate = new Date(t.date);
    
    if (selectedDate) {
      return matchesSearch && tDate.toDateString() === selectedDate.toDateString();
    }
    
    const matchesMonth = tDate.getMonth() === selectedMonth.getMonth() && 
                         tDate.getFullYear() === selectedMonth.getFullYear();
    
    const matchesType = typeFilter === 'all' 
        ? true 
        : typeFilter === 'credit' 
            ? t.paymentMethod === 'credit'
            : t.paymentMethod === 'debit';

    const matchesBank = bankFilter === 'all' ? true : t.bank === bankFilter;

    return matchesSearch && matchesMonth && matchesType && matchesBank;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 md:space-y-8 pb-24 md:pb-20 px-2 md:px-0">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Minha Carteira</h1>
            <p className="text-gray-400 text-sm">Controle total dos seus lançamentos.</p>
          </div>

          <div className="flex rounded-xl overflow-hidden border border-border/50 self-start">
            <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => { setViewMode('list'); setSelectedDate(null); }} className="rounded-none px-4">
              <List className="w-4 h-4 mr-2" /> Lista
            </Button>
            <Button variant={viewMode === 'calendar' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('calendar')} className="rounded-none px-4">
              <Calendar className="w-4 h-4 mr-2" /> Calendário
            </Button>
          </div>
        </div>

        <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      </motion.div>

      {viewMode === 'calendar' && <TransactionCalendar transactions={transactions} onDateSelect={setSelectedDate} selectedDate={selectedDate} />}

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar transações..." className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none" />
        </div>

        {/* Filtros com scroll lateral no mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <button onClick={() => setTypeFilter('all')} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold border transition-all ${typeFilter === 'all' ? 'bg-primary text-white border-primary' : 'bg-secondary/50 text-gray-400 border-border/50'}`}>TODOS</button>
            <button onClick={() => setTypeFilter('credit')} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold border flex items-center gap-1 transition-all ${typeFilter === 'credit' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' : 'bg-secondary/50 text-gray-400 border-border/50'}`}><CreditCard className="w-3 h-3"/> CRÉDITO</button>
            <button onClick={() => setTypeFilter('debit')} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold border flex items-center gap-1 transition-all ${typeFilter === 'debit' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-secondary/50 text-gray-400 border-border/50'}`}><Wallet className="w-3 h-3"/> DÉBITO</button>
        </div>
      </motion.div>

      {/* VISÃO DESKTOP (TABELA) - Oculta no mobile */}
      <div className="hidden md:block glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-sm font-medium">
                <th className="text-left p-4">Transação</th>
                <th className="text-left p-4">Categoria</th>
                <th className="text-left p-4">Data</th>
                <th className="text-right p-4">Valor</th>
                <th className="text-right p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => {
                const isCredit = transaction.paymentMethod === 'credit';
                return (
                  <tr key={transaction.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.type === 'income' ? 'bg-success/20 text-success' : isCredit ? 'bg-orange-500/20 text-orange-500' : 'bg-destructive/20 text-destructive'}`}>
                          {transaction.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : isCredit ? <CreditCard className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        </div>
                        <span className="font-medium text-white">{transaction.description}</span>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant="outline" className={CATEGORY_COLORS[transaction.category]}>{CATEGORY_LABELS[transaction.category]}</Badge></td>
                    <td className="p-4 text-muted-foreground">{new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4 text-right">
                      <span className={`font-bold tabular-nums ${transaction.type === 'income' ? 'text-success' : isCredit ? 'text-orange-500' : 'text-destructive'}`}>
                        {transaction.type === 'income' ? '+' : isCredit ? '' : '-'} {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingTransaction(transaction)} className="h-8 w-8 text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteTransaction(transaction.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* VISÃO MOBILE (CARDS) - Aparece apenas no mobile */}
      <div className="md:hidden space-y-4">
        {filteredTransactions.map((t) => {
          const isCredit = t.paymentMethod === 'credit';
          return (
            <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4 flex flex-col gap-4 border-l-4" style={{ borderLeftColor: t.type === 'income' ? '#22c55e' : isCredit ? '#f97316' : '#ef4444' }}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                  <span className="font-bold text-white truncate pr-2">{t.description}</span>
                  <Badge variant="outline" className={`w-fit text-[9px] h-5 ${CATEGORY_COLORS[t.category]}`}>{CATEGORY_LABELS[t.category]}</Badge>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`font-bold text-sm ${t.type === 'income' ? 'text-success' : isCredit ? 'text-orange-500' : 'text-destructive'}`}>
                    {t.type === 'income' ? '+' : isCredit ? '' : '-'} {formatCurrency(t.amount)}
                  </span>
                  {isCredit && <span className="text-[8px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded uppercase font-bold">Cartão</span>}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[9px] text-gray-500 uppercase font-bold">{t.bank || 'Geral'}</span>
                <div className="flex gap-1">
                  <button onClick={() => setEditingTransaction(t)} className="p-2.5 bg-secondary/50 rounded-lg text-gray-400"><Pencil className="w-4 h-4"/></button>
                  <button onClick={() => deleteTransaction(t.id)} className="p-2.5 bg-destructive/10 rounded-lg text-destructive"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filteredTransactions.length === 0 && <div className="text-center py-10 text-gray-500 text-sm italic">Nenhum registro encontrado.</div>}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <EditTransactionModal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          onSave={async (id, updates) => {
              await updateTransaction(id, updates);
              setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
}