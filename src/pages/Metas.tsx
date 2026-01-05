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

// --- COMPONENTE MODAL DE META (INTERNO) ---
const GoalModal = ({ isOpen, onClose, onSave, onDelete, initialData }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, onDelete?: () => void, initialData?: SavingsGoal }) => {
    if (!isOpen) return null;
    const [name, setName] = useState(initialData?.name || '');
    const [target, setTarget] = useState(initialData?.target?.toString() || '');
    const [current, setCurrent] = useState(initialData?.current?.toString() || '0');
    const [icon, setIcon] = useState(initialData?.icon || '💰');

    // Resetar estado ao abrir
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4"
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{initialData ? 'Editar Meta' : 'Nova Meta'}</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-white"/></button>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Nome da Meta</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" placeholder="Ex: Viagem, Carro..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Valor Alvo (R$)</label>
                            <input type="number" value={target} onChange={e => setTarget(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Já Guardado (R$)</label>
                            <input type="number" value={current} onChange={e => setCurrent(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" placeholder="0.00" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Ícone</label>
                        <div className="flex gap-2 flex-wrap">
                            {['💰', '✈️', '🚗', '🏠', '🛡️', '💍', '🎓', '💻', '🎮', '🏖️', '🏍️'].map(i => (
                                <button key={i} onClick={() => setIcon(i)} className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl border transition-colors ${icon === i ? 'border-primary bg-primary/20' : 'border-white/5 hover:bg-white/5'}`}>{i}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 pt-2">
                    {initialData && onDelete && (
                        <button onClick={onDelete} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"><Trash2 className="w-4 h-4"/> Excluir</button>
                    )}
                    <button onClick={() => { onSave({ name, target: parseFloat(target || '0'), current: parseFloat(current || '0'), icon }); onClose(); }} className="flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-semibold transition-colors">Salvar</button>
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
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Meus Cofrinhos</h1>
          <p className="text-muted-foreground">Acompanhe e realize seus sonhos.</p>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={togglePrivacy} className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                {isPrivacyEnabled ? <EyeOff className="w-5 h-5 text-gray-400"/> : <Eye className="w-5 h-5 text-primary"/>}
            </button>
            <button onClick={() => { setEditingGoal(undefined); setIsGoalModalOpen(true); }} className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors">
                <Plus className="w-5 h-5"/> Nova Meta
            </button>
        </div>
      </div>

      {/* Grid de Metas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
            {savingsGoals.map((goal, index) => {
                const percent = Math.min(100, (goal.current / goal.target) * 100);
                return (
                    <motion.div 
                        key={goal.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-2xl bg-secondary/20 border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all"
                    >
                        {isPrivacyEnabled && <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900/95 backdrop-blur-[2px]"><span className="text-xl font-bold text-gray-500">•••••••</span></div>}
                        
                        <button onClick={() => { setEditingGoal(goal); setIsGoalModalOpen(true); }} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white bg-black/20 hover:bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-30">
                            <Pencil className="w-4 h-4"/>
                        </button>

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl border border-white/5">
                                {goal.icon}
                            </div>
                            <span className="text-sm font-bold bg-secondary px-3 py-1 rounded-full text-gray-300">{percent.toFixed(0)}%</span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-4">{goal.name}</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span className="text-white font-medium">{formatValue(goal.current, false)}</span>
                                <span>de {formatValue(goal.target, false)}</span>
                            </div>
                            
                            <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }} />
                            </div>

                            {/* Input Rápido */}
                            <div className="pt-4 flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">R$</span>
                                    <input 
                                        type="number" 
                                        placeholder="Adicionar..." 
                                        className="w-full bg-black/30 rounded-xl pl-8 pr-3 py-2 text-sm text-white border border-transparent focus:border-yellow-400/50 outline-none transition-all" 
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = parseFloat((e.target as HTMLInputElement).value);
                                                if (!isNaN(val)) {
                                                    updateSavingsGoal(goal.id, { current: goal.current + val });
                                                    (e.target as HTMLInputElement).value = '';
                                                    toast({ title: "Dinheiro Guardado! 💰", description: `R$ ${val} adicionados ao cofrinho.` });
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
        
        {/* Card de Adicionar Novo (Vazio) */}
        <motion.button 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            onClick={() => { setEditingGoal(undefined); setIsGoalModalOpen(true); }}
            className="p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[250px]"
        >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8"/>
            </div>
            <p className="font-medium">Criar Novo Cofrinho</p>
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