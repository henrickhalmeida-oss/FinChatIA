import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Plus, Pencil, Trash2, X, Eye, EyeOff 
} from 'lucide-react';
import { useData, SavingsGoal } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

// --- FUNÇÕES DE FORMATAÇÃO ---
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

const formatValue = (value: number, isPrivacyEnabled: boolean) => {
    if (isPrivacyEnabled) return '•••••••';
    return formatCurrency(value);
};

// --- COMPONENTE MODAL DE META (OTIMIZADO MOBILE) ---
const GoalModal = ({ isOpen, onClose, onSave, onDelete, initialData }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, onDelete?: () => void, initialData?: SavingsGoal }) => {
    if (!isOpen) return null;
    const [name, setName] = useState(initialData?.name || '');
    const [target, setTarget] = useState(initialData?.target?.toString() || '');
    const [current, setCurrent] = useState(initialData?.current?.toString() || '0');
    const [icon, setIcon] = useState(initialData?.icon || '💰');

    React.useEffect(() => {
        if (isOpen && !initialData) {
            setName(''); setTarget(''); setCurrent('0'); setIcon('💰');
        } else if (isOpen && initialData) {
            setName(initialData.name);
            setTarget(initialData.target.toString());
            setCurrent(initialData.current.toString());
            setIcon(initialData.icon);
        }
    }, [isOpen, initialData]);

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4">
            <motion.div 
                initial={{ y: "100%", opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                className="bg-[#1a1a1a] border-t md:border border-white/10 rounded-t-3xl md:rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]"
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{initialData ? 'Editar Cofrinho' : 'Novo Cofrinho'}</h3>
                    <button onClick={onClose} className="p-2 bg-secondary/50 rounded-full"><X className="w-5 h-5 text-gray-400"/></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest">Nome do Sonho</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/30 border border-white/5 rounded-xl p-4 text-white focus:border-primary outline-none transition-all" placeholder="Ex: Viagem para Maldivas" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest">Valor Alvo</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                                <input type="number" value={target} onChange={e => setTarget(e.target.value)} className="w-full bg-black/30 border border-white/5 rounded-xl p-4 pl-10 text-white focus:border-primary outline-none transition-all" placeholder="0.00" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest">Já Guardado</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                                <input type="number" value={current} onChange={e => setCurrent(e.target.value)} className="w-full bg-black/30 border border-white/5 rounded-xl p-4 pl-10 text-white focus:border-primary outline-none transition-all" placeholder="0.00" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block tracking-widest">Escolha um Ícone</label>
                        <div className="flex gap-2 flex-wrap justify-between">
                            {['💰', '✈️', '🚗', '🏠', '🏖️', '🎓', '💻', '🎮', '💍', '🛡️'].map(i => (
                                <button key={i} onClick={() => setIcon(i)} className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border transition-all ${icon === i ? 'border-primary bg-primary/20 scale-110 shadow-lg shadow-primary/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}>{i}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <button onClick={() => { onSave({ name, target: parseFloat(target || '0'), current: parseFloat(current || '0'), icon }); onClose(); }} className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 transition-transform active:scale-95">Salvar Cofrinho</button>
                    {initialData && onDelete && (
                        <button onClick={onDelete} className="w-full bg-destructive/10 text-destructive py-4 rounded-2xl font-bold transition-all border border-destructive/10">Excluir Meta</button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default function Metas() {
  const { savingsGoals, updateSavingsGoal, addSavingsGoal, deleteSavingsGoal, isPrivacyEnabled, togglePrivacy } = useData();
  const { toast } = useToast();
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | undefined>(undefined);

  return (
    <div className="space-y-6 md:space-y-8 pb-24 md:pb-10 px-2 md:px-0">
      {/* Header Responsivo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Meus Cofrinhos</h1>
          <p className="text-gray-400 text-sm">Acompanhe e realize seus sonhos.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <button onClick={togglePrivacy} className="p-3 rounded-2xl bg-secondary/50 border border-white/5 transition-colors">
                {isPrivacyEnabled ? <EyeOff className="w-5 h-5 text-gray-400"/> : <Eye className="w-5 h-5 text-primary"/>}
            </button>
            <button onClick={() => { setEditingGoal(undefined); setIsGoalModalOpen(true); }} className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/20 transition-all">
                <Plus className="w-5 h-5"/> Nova Meta
            </button>
        </div>
      </div>

      {/* Grid de Metas Otimizado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        <AnimatePresence>
            {savingsGoals.map((goal, index) => {
                const percent = Math.min(100, (goal.current / goal.target) * 100);
                return (
                    <motion.div 
                        key={goal.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-5 md:p-6 rounded-3xl bg-secondary/20 border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all shadow-xl"
                    >
                        {isPrivacyEnabled && <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-[4px]"><span className="text-xl font-black text-gray-700 tracking-widest">•••••••</span></div>}
                        
                        <button onClick={() => { setEditingGoal(goal); setIsGoalModalOpen(true); }} className="absolute top-4 right-4 p-2.5 text-gray-400 hover:text-white bg-black/20 rounded-xl md:opacity-0 group-hover:opacity-100 transition-all z-30">
                            <Pencil className="w-4 h-4"/>
                        </button>

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center text-3xl border border-white/5 shadow-inner">
                                {goal.icon}
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-black bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">{percent.toFixed(0)}%</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-4 truncate">{goal.name}</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end text-xs uppercase font-bold tracking-tighter">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-gray-500">Guardado</span>
                                    <span className="text-primary text-base">{formatValue(goal.current, false)}</span>
                                </div>
                                <div className="flex flex-col items-end gap-0.5">
                                    <span className="text-gray-500">Alvo</span>
                                    <span className="text-white">{formatValue(goal.target, false)}</span>
                                </div>
                            </div>
                            
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full" 
                                />
                            </div>

                            {/* Input de Depósito Rápido Mobile Friendly */}
                            <div className="pt-2">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-sm">R$</span>
                                    <input 
                                        type="number" 
                                        placeholder="Adicionar valor..." 
                                        className="w-full bg-black/40 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white border border-white/5 focus:border-primary/50 outline-none transition-all placeholder:text-gray-600" 
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = parseFloat((e.target as HTMLInputElement).value);
                                                if (!isNaN(val) && val > 0) {
                                                    updateSavingsGoal(goal.id, { current: goal.current + val });
                                                    (e.target as HTMLInputElement).value = '';
                                                    toast({ title: "Dinheiro Guardado! 💰", description: `${formatCurrency(val)} adicionados ao seu sonho.` });
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </AnimatePresence>
        
        {/* Card de Adicionar Novo Otimizado */}
        <motion.button 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            onClick={() => { setEditingGoal(undefined); setIsGoalModalOpen(true); }}
            className="p-6 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all min-h-[280px]"
        >
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4 shadow-inner">
                <Plus className="w-8 h-8"/>
            </div>
            <p className="font-bold uppercase text-xs tracking-widest">Novo Cofrinho</p>
        </motion.button>
      </div>

      <GoalModal 
        isOpen={isGoalModalOpen} 
        onClose={() => setIsGoalModalOpen(false)} 
        onSave={(data) => { if(editingGoal) updateSavingsGoal(editingGoal.id, data); else addSavingsGoal(data); }} 
        onDelete={editingGoal ? () => { deleteSavingsGoal(editingGoal.id); setIsGoalModalOpen(false); } : undefined} 
        initialData={editingGoal} 
      />
    </div>
  );
}