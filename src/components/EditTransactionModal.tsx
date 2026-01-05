import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Calendar, Tag, Wallet, CreditCard } from 'lucide-react';
import { Transaction, TransactionCategory, BankType, PaymentMethod, CATEGORY_LABELS } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null; // Agora aceita nulo para novos lançamentos
  onSave: (id: string, updates: Partial<Transaction>) => Promise<void>;
}

export function EditTransactionModal({ isOpen, onClose, transaction, onSave }: EditTransactionModalProps) {
  // Inicializa os estados: se houver transação, usa os dados dela; se não, inicia vazio (Autonomia)
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('outros');
  const [bank, setBank] = useState<BankType>('itau');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('debit');
  const [date, setDate] = useState('');

  // Sincroniza os campos quando o modal abre (seja para editar ou para novo)
  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setBank(transaction.bank || 'itau');
      setType(transaction.type);
      setPaymentMethod(transaction.paymentMethod || 'debit');
      setDate(new Date(transaction.date).toISOString().split('T')[0]);
    } else {
      // Limpa os campos para um NOVO lançamento
      setDescription('');
      setAmount('');
      setCategory('outros');
      setBank('itau');
      setType('expense');
      setPaymentMethod('debit');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [transaction, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Partial<Transaction> = {
      description,
      amount: parseFloat(amount),
      category,
      bank,
      type,
      paymentMethod,
      date: new Date(date + 'T12:00:00') // Garante que a data não mude por fuso horário
    };
    await onSave(transaction?.id || '', updates);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{transaction ? 'Editar Registro' : 'Novo Lançamento'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seletor de Tipo (Receita/Despesa) */}
          <div className="flex gap-2 p-1 bg-secondary/30 rounded-xl">
            <button type="button" onClick={() => setType('expense')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${type === 'expense' ? 'bg-destructive text-white shadow-lg' : 'text-gray-400'}`}>SAÍDA</button>
            <button type="button" onClick={() => setType('income')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${type === 'income' ? 'bg-success text-white shadow-lg' : 'text-gray-400'}`}>ENTRADA</button>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Descrição</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-secondary/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" required placeholder="Ex: Mercado mensal" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Valor (R$)</label>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-secondary/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none" required />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Data</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-secondary/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as TransactionCategory)} className="w-full bg-secondary/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none">
                {Object.entries(CATEGORY_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Banco</label>
              <select value={bank} onChange={(e) => setBank(e.target.value as BankType)} className="w-full bg-secondary/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none uppercase">
                <option value="itau">Itaú</option>
                <option value="nubank">Nubank</option>
                <option value="caixa">Caixa</option>
                <option value="outros">Outros</option>
              </select>
            </div>
          </div>

          {/* Método de Pagamento (Só aparece se for Despesa) */}
          {type === 'expense' && (
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Método de Pagamento</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPaymentMethod('debit')} className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${paymentMethod === 'debit' ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 bg-secondary/30 text-gray-400'}`}><Wallet className="w-4 h-4"/> Débito</button>
                <button type="button" onClick={() => setPaymentMethod('credit')} className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${paymentMethod === 'credit' ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-white/5 bg-secondary/30 text-gray-400'}`}><CreditCard className="w-4 h-4"/> Crédito</button>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full py-6 mt-4 text-lg font-bold">
            <Save className="w-5 h-5 mr-2" /> {transaction ? 'Salvar Alterações' : 'Confirmar Lançamento'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}