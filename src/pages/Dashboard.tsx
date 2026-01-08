import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Plus,
  Target, Sparkles, CreditCard, Clock, 
  Wallet, ArrowUp, ArrowDown, PieChart as PieIcon,
  Pencil, Save, CheckCircle2, Check, Eye, EyeOff, AlertTriangle, X,
  Info, MessageSquare, Zap, Megaphone
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useData, CATEGORY_LABELS, TransactionCategory, BankType } from '@/contexts/DataContext';
import { StatCard } from '@/components/StatCard';
import { BankCard } from '@/components/BankCard';
import { BudgetCard } from '@/components/BudgetCard';
import { MonthSelector } from '@/components/MonthSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { EditTransactionModal } from '@/components/EditTransactionModal';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const COLORS: Record<TransactionCategory, string> = {
  alimentacao: '#ef4444', transporte: '#8b5cf6', casa: '#3b82f6',
  lazer: '#10b981', saude: '#f59e0b', educacao: '#06b6d4',
  salario: '#22c55e', investimento: '#6366f1', outros: '#94a3b8',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

const formatValue = (value: number, isPrivacyEnabled: boolean) => {
    if (isPrivacyEnabled) return '•••••••';
    return formatCurrency(value);
};

const DEFAULT_LIMITS: Record<string, number> = {
  alimentacao: 1200, transporte: 600, casa: 2000,
  lazer: 500, saude: 400, educacao: 300, outros: 500
};

const WelcomeTutorial = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1a1a1a] border border-primary/30 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Zap className="w-24 h-24 md:w-32 md:h-32 text-primary" /></div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">Bem-vindo! <Sparkles className="text-primary w-5 h-5 md:w-6 md:h-6"/></h2>
                <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base">Vamos turbinar sua gestão financeira em segundos.</p>
                
                <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20"><MessageSquare className="text-primary w-5 h-5 md:w-6 md:h-6"/></div>
                        <div><h4 className="text-white font-bold text-sm md:text-base">Chat IA</h4><p className="text-xs md:text-sm text-gray-400">Comandos naturais por voz ou texto.</p></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-success/10 flex items-center justify-center shrink-0 border border-success/20"><Plus className="text-success w-5 h-5 md:w-6 md:h-6"/></div>
                        <div><h4 className="text-white font-bold text-sm md:text-base">Manual</h4><p className="text-xs md:text-sm text-gray-400">Controle total com o botão "Novo Lançamento".</p></div>
                    </div>
                </div>

                <Button onClick={onClose} className="w-full py-6 md:py-7 rounded-2xl text-base md:text-lg font-bold">Começar Agora</Button>
            </motion.div>
        </div>
    );
};

const PaymentModal = ({ isOpen, onClose, onConfirm, billDetails }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, billDetails: { bank: string, amount: number } | null }) => {
    if (!isOpen || !billDetails) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#1a1a1a] border border-red-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20"><AlertTriangle className="w-6 h-6 text-red-400" /></div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Liquidação</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">Pagar fatura <span className="text-white font-semibold capitalize">{billDetails.bank}</span> de <span className="text-white font-semibold">{formatCurrency(billDetails.amount)}</span>?</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl font-medium text-gray-300 border border-white/5">Sair</button>
                    <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white">Pagar</button>
                </div>
            </motion.div>
        </div>
    );
};

export default function Dashboard() {
  const { transactions, getCategoryTotals, getMonthlyStats, addTransaction, isPrivacyEnabled, togglePrivacy } = useData();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isEditingBudgets, setIsEditingBudgets] = useState(false);
  const [budgetLimits, setBudgetLimits] = useState(DEFAULT_LIMITS);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [billToPay, setBillToPay] = useState<{ bank: string, amount: number } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Estados para Comunicado Global
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    const savedLimits = localStorage.getItem('userBudgetLimits');
    if (savedLimits) setBudgetLimits(JSON.parse(savedLimits));
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) setShowTutorial(true);

    // ✅ Busca o comunicado da tabela settings no Supabase
    const fetchAnnouncement = async () => {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'global_announcement')
        .maybeSingle();
      
      if (data?.value) setAnnouncement(data.value);
    };
    fetchAnnouncement();
  }, []);

  const closeTutorial = () => {
      localStorage.setItem('hasSeenTutorial', 'true');
      setShowTutorial(false);
  };

  const saveBudgets = () => { localStorage.setItem('userBudgetLimits', JSON.stringify(budgetLimits)); setIsEditingBudgets(false); };
  const handleBudgetChange = (category: string, value: string) => { const numValue = parseFloat(value); if (!isNaN(numValue)) setBudgetLimits(prev => ({ ...prev, [category]: numValue })); };
  
  const monthlyStats = getMonthlyStats(selectedMonth.getMonth(), selectedMonth.getFullYear());
  const monthTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === selectedMonth.getMonth() && date.getFullYear() === selectedMonth.getFullYear();
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedMonth]);

  const processedBills = useMemo(() => {
    const bills = monthlyStats.creditCardBills;
    const result = [];
    for (const [bank, totalSpent] of Object.entries(bills)) {
        if (totalSpent <= 0) continue;
        const paidAmount = monthTransactions
            .filter(t => t.type === 'expense' && t.description.toLowerCase().includes('pagamento fatura') && t.description.toLowerCase().includes(bank.toLowerCase()))
            .reduce((sum, t) => sum + t.amount, 0);
        const remaining = totalSpent - paidAmount;
        result.push({ bank, totalSpent, paidAmount, remaining: Math.max(0, remaining), isFullyPaid: remaining <= 1 });
    }
    return result;
  }, [monthlyStats.creditCardBills, monthTransactions]);

  const initiatePayment = (bank: string, amount: number) => { setBillToPay({ bank, amount }); setPaymentModalOpen(true); };
  
  const confirmPayment = async () => {
    if (!billToPay) return;
    const payerBankEntry = Object.entries(monthlyStats.bankBalances).sort(([, a], [, b]) => b - a)[0]; 
    const payerBank = (payerBankEntry && payerBankEntry[1] > 0) ? payerBankEntry[0] : 'outros';
    await addTransaction({ description: `Pagamento Fatura ${billToPay.bank}`, amount: billToPay.amount, type: 'expense', category: 'outros', bank: payerBank as BankType, paymentMethod: 'debit', date: new Date() });
    toast({ title: "Pagamento efetuado!" });
    setPaymentModalOpen(false);
  };

  const chartData = useMemo(() => {
    const days = [];
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getDate() === day && tDate.getMonth() === month && tDate.getFullYear() === year;
      });
      days.push({ 
        name: day % 5 === 0 || day === 1 ? `${day}` : '', 
        receitas: dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0), 
        despesas: dayTransactions.filter(t => t.type === 'expense' && t.paymentMethod === 'debit').reduce((sum, t) => sum + t.amount, 0) 
      });
    }
    return days;
  }, [transactions, selectedMonth]);

  const categoryTotals = getCategoryTotals(selectedMonth.getMonth(), selectedMonth.getFullYear());
  const categoryData = useMemo(() => {
    return categoryTotals
      .filter(item => item.total > 0 && item.category !== 'salario')
      .map(item => ({ name: CATEGORY_LABELS[item.category], value: item.total, color: COLORS[item.category] }))
      .sort((a, b) => b.value - a.value);
  }, [categoryTotals]);

  const budgetStatus = useMemo(() => {
     return categoryTotals.filter(c => c.category !== 'salario' && c.category !== 'investimento').map(c => ({ 
        category: c.category, spent: c.total, limit: budgetLimits[c.category] || 500 
     }));
  }, [categoryTotals, budgetLimits]);

  const activeBanks = useMemo(() => Object.entries(monthlyStats.bankBalances).filter(([_, bal]) => bal !== 0), [monthlyStats.bankBalances]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 md:space-y-10 pb-24 md:pb-10 max-w-7xl mx-auto px-1 md:px-0">
      
      <WelcomeTutorial isOpen={showTutorial} onClose={closeTutorial} />

      {/* ✅ Banner de Comunicado Global */}
      {announcement && showAnnouncement && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mx-2 md:mx-0 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] text-amber-500/60 uppercase font-black tracking-widest mb-0.5">Aviso Master AI</p>
              <p className="text-sm font-bold text-amber-100">{announcement}</p>
            </div>
          </div>
          <button onClick={() => setShowAnnouncement(false)} className="text-amber-500/50 hover:text-amber-500 p-1">
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {/* HEADER MOBILE OPTIMIZED */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="px-2 md:px-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">Painel Financeiro</h1>
            <p className="text-gray-400 text-sm">Resumo consolidado do fluxo de caixa.</p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 bg-secondary/30 p-1.5 md:p-2 rounded-2xl border border-white/5 w-full md:w-auto justify-between md:justify-start">
              <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2.5 md:px-4 md:py-2.5 rounded-xl font-bold transition-all shadow-lg text-sm md:text-base flex-1 md:flex-none justify-center"
              >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  Novo
              </button>
              <div className="flex items-center gap-2">
                <button onClick={togglePrivacy} className="p-2.5 md:p-3 rounded-xl hover:bg-secondary transition-colors shrink-0">
                    {isPrivacyEnabled ? <EyeOff className="w-5 h-5 md:w-6 md:h-6 text-gray-400"/> : <Eye className="w-5 h-5 md:w-6 md:h-6 text-primary"/>}
                </button>
                <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
              </div>
          </div>
        </div>
      </div>

      {/* IA INSIGHT MOBILE OPTIMIZED */}
      <motion.div className="mx-2 md:mx-0 glass-card p-4 border border-primary/20 relative overflow-hidden">
        <div className="flex items-center gap-3 md:gap-4 relative z-10">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0" />
          <div>
            <p className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">Análise FinChat IA</p>
            <p className="text-sm md:text-base text-gray-200 line-clamp-2 md:line-clamp-none">
               {isPrivacyEnabled ? "Modo de privacidade ativo." : `Seu saldo líquido disponível é de ${formatCurrency(monthlyStats.totalBalance)}.`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* SALDOS E FATURAS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 px-2 md:px-0">
        <div className="space-y-4 md:space-y-6">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-gray-200 tracking-tight"><Wallet className="w-4 h-4 md:w-5 md:h-5 text-primary"/> Saldos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {activeBanks.map(([bank, balance], index) => (
                    <div key={bank} className="relative group min-w-0">
                        <BankCard bank={bank as BankType} balance={isPrivacyEnabled ? 0 : balance} delay={index * 0.1} />
                        {isPrivacyEnabled && <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm rounded-2xl font-bold text-gray-600">•••••••</div>}
                    </div>
                ))}
            </div>
        </div>
        <div className="space-y-4 md:space-y-6">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-red-400 tracking-tight"><CreditCard className="w-4 h-4 md:w-5 md:h-5"/> Cartões</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {processedBills.map(({ bank, remaining, isFullyPaid }, index) => (
                    <motion.div key={bank} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className={`p-4 md:p-6 rounded-2xl border shadow-lg relative overflow-hidden ${isFullyPaid ? 'bg-green-900/10 border-green-500/20' : 'bg-red-900/10 border-red-500/20'}`}>
                        {isPrivacyEnabled && <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm font-bold text-gray-600">•••••••</div>}
                        <div className="flex justify-between mb-3 md:mb-4"><span className="font-semibold text-gray-200 capitalize text-sm md:text-base">{bank}</span><CreditCard className={`w-4 h-4 md:w-5 md:h-5 ${isFullyPaid ? 'text-green-400' : 'text-red-400'}`}/></div>
                        <div className="flex justify-between items-end">
                            <div><p className="text-[10px] md:text-xs text-gray-500 mb-1 uppercase font-bold tracking-tight">A pagar</p><p className="text-xl md:text-2xl font-bold">{isFullyPaid ? 'OK' : formatValue(remaining, isPrivacyEnabled)}</p></div>
                            {!isFullyPaid && <button onClick={() => initiatePayment(bank, remaining)} className="p-2 bg-red-500/20 text-red-400 rounded-xl"><CheckCircle2 className="w-5 h-5"/></button>}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>

      {/* KPI GRID MOBILE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 px-2 md:px-0">
        <StatCard title="Mês" value={formatValue(monthlyStats.totalBalance, isPrivacyEnabled)} icon={<Wallet className="w-6 h-6 md:w-7 md:h-7" />} delay={0} />
        <StatCard title="Receitas" value={formatValue(monthlyStats.totalIncome, isPrivacyEnabled)} icon={<ArrowUp className="w-6 h-6 md:w-7 md:h-7" />} variant="success" delay={0.1} />
        <StatCard title="Despesas" value={formatValue(monthlyStats.totalExpenses, isPrivacyEnabled)} icon={<ArrowDown className="w-6 h-6 md:w-7 md:h-7" />} variant="danger" delay={0.2} />
      </div>

      {/* PLANEJAMENTO DE GASTOS MOBILE */}
      <div className="mx-2 md:mx-0 glass-card p-5 md:p-8 border border-white/5 space-y-6 md:space-y-8">
        <div className="flex items-center justify-between gap-2">
           <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2 md:gap-3 text-white"><Target className="w-5 h-5 md:w-6 md:h-6 text-primary" /> Metas</h2>
           <button onClick={() => isEditingBudgets ? saveBudgets() : setIsEditingBudgets(true)} className="px-3 py-1.5 md:px-5 md:py-2 bg-secondary/50 rounded-lg text-[10px] md:text-sm font-bold uppercase tracking-wider">
               {isEditingBudgets ? 'Salvar' : 'Ajustar'}
           </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {isEditingBudgets ? 
              Object.entries(budgetLimits).map(([cat, limit]) => (
                <div key={cat} className="p-4 rounded-xl bg-black/20 border border-white/5">
                    <label className="text-[10px] text-gray-500 block mb-1 uppercase font-bold">{CATEGORY_LABELS[cat as TransactionCategory]}</label>
                    <div className="flex items-center gap-2 font-bold text-lg text-white">R$ <input type="number" value={limit} onChange={(e) => handleBudgetChange(cat, e.target.value)} className="bg-transparent border-none outline-none w-full"/></div>
                </div>
              )) : 
              budgetStatus.map((budget, index) => (
                <BudgetCard key={budget.category} category={CATEGORY_LABELS[budget.category as TransactionCategory]} spent={isPrivacyEnabled ? 0 : budget.spent} limit={isPrivacyEnabled ? 0 : budget.limit} color={COLORS[budget.category as TransactionCategory]} delay={0.1 * index} />
              ))
            }
        </div>
      </div>

      {/* GRÁFICOS RESPONSIVOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 px-2 md:px-0">
        <div className="lg:col-span-2 glass-card p-5 md:p-8 border border-white/5 h-[350px] md:h-[450px]">
          <h2 className="text-lg md:text-xl font-bold mb-6 md:mb-8 flex items-center gap-3 text-white"><TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-primary"/> Fluxo Diário</h2>
          <div className="h-full pb-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '12px' }} formatter={(v: number) => formatValue(v, isPrivacyEnabled)} />
                <Area type="monotone" dataKey="receitas" stroke="#10b981" fillOpacity={0.1} fill="#10b981" strokeWidth={2}/>
                <Area type="monotone" dataKey="despesas" stroke="#ef4444" fillOpacity={0.1} fill="#ef4444" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5 md:p-8 border border-white/5 h-[400px] md:h-[450px] flex flex-col">
          <h2 className="text-lg md:text-xl font-bold mb-6 md:mb-8 flex items-center gap-3 text-white"><PieIcon className="w-5 h-5 md:w-6 md:h-6 text-primary"/> Categorias</h2>
          {categoryData.length > 0 ? (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="h-[180px] md:h-[200px] w-full relative shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={6} dataKey="value" stroke="none">
                          {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => formatValue(v, isPrivacyEnabled)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Total</span>
                      <span className="text-base md:text-xl font-bold text-white">{formatValue(monthlyStats.totalExpenses, isPrivacyEnabled)}</span>
                    </div>
                </div>
                <div className="mt-4 flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {categoryData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs font-medium text-gray-300 truncate max-w-[80px]">{item.name}</span>
                        </div>
                        <span className="text-xs font-bold text-white">{formatValue(item.value, isPrivacyEnabled)}</span>
                      </div>
                    ))}
                </div>
            </div>
          ) : <div className="flex-1 flex items-center justify-center opacity-30 text-xs">Vazio.</div>}
        </div>
      </div>

      <AnimatePresence>
        {paymentModalOpen && <PaymentModal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} onConfirm={confirmPayment} billDetails={billToPay} />}
        {isAddModalOpen && (
            <EditTransactionModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                // @ts-ignore
                transaction={null}
                onSave={async (_, updates) => {
                    await addTransaction(updates);
                    setIsAddModalOpen(false);
                }} 
            />
        )}
      </AnimatePresence>
    </motion.div>
  );
}