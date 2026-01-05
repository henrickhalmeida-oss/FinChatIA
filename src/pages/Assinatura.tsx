import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Sparkles, Zap, Shield, MessageSquare, TrendingUp, X,
  Diamond, BarChart3, Lock, Rocket, AlertTriangle, Trash2,
  CreditCard, Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { CheckoutModal } from '@/components/CheckoutModal';
import { CancelSubscriptionModal } from '@/components/CancelSubscriptionModal';
import { ChangeCardModal } from '@/components/ChangeCardModal';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// ✅ Função adicionada para resolver o erro 'Cannot find name formatCurrency'
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

const freePlanFeatures = [
  { text: 'Acesso ao Dashboard Básico', included: true },
  { text: 'Cadastro manual de transações', included: true },
  { text: 'Sem Chat com IA', included: false },
  { text: 'Apenas 30 dias de histórico', included: false },
];

const proPlanFeatures = [
  { text: 'IA Financeira Ilimitada', icon: Rocket },
  { text: 'Histórico Completo', icon: Diamond },
  { text: 'Gráficos Avançados', icon: BarChart3 },
  { text: 'Suporte Prioritário', icon: Lock },
];

export default function Assinatura() {
  const { user } = useAuth();
  const { resetAccount } = useData();
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isChangeCardOpen, setIsChangeCardOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  const isProUser = user?.plan === 'pro'; 

  const monthlyPrice = 29.90;
  const annualPrice = monthlyPrice * 12 * 0.8; 
  const monthlyFromAnnual = annualPrice / 12;

  const handleCheckoutSuccess = () => {
    toast({ title: "🎉 Parabéns!", description: "Você agora é um membro PRO!" });
  };

  const handleResetAccount = () => {
    resetAccount();
    setShowResetConfirm(false);
    toast({ title: "Conta resetada", description: "Dados removidos com sucesso." });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 pb-24 md:pb-10 px-2 md:px-0">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Escolha seu Plano</h1>
        <p className="text-sm text-muted-foreground">Desbloqueie todo o potencial do FinChat</p>
      </motion.div>

      <div className="flex items-center justify-center gap-4 py-2">
        <Label className={`text-sm ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Mensal</Label>
        <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
        <div className="flex items-center gap-2">
          <Label className={`text-sm ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Anual</Label>
          {isAnnual && <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold">-20%</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`glass-card p-6 md:p-8 flex flex-col ${!isProUser ? 'ring-2 ring-primary/30 border-primary/20' : 'opacity-80'}`}>
          <div className="mb-6">
            <h3 className="text-xl font-bold">Gratuito</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Essencial</p>
          </div>
          <div className="mb-6"><span className="text-4xl font-bold">R$ 0</span><span className="text-muted-foreground">,00</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            {freePlanFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${f.included ? 'bg-success/20 text-success' : 'bg-white/5 text-gray-600'}`}>
                  {f.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                </div>
                <span className={f.included ? '' : 'text-gray-600 line-through'}>{f.text}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full py-6 font-bold" disabled>Plano Atual</Button>
        </div>

        <div className={`glass-card p-6 md:p-8 relative overflow-hidden border-2 flex flex-col ${isProUser ? 'border-primary/50' : 'border-primary/20'}`}>
          <div className="absolute top-4 right-4"><span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold border border-primary/30 uppercase">Popular</span></div>
          <div className="mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">PRO <Sparkles className="w-4 h-4 text-primary" /></h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Completo</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold">R$ {isAnnual ? monthlyFromAnnual.toFixed(2).replace('.', ',') : '29,90'}</span>
            <span className="text-muted-foreground">/mês</span>
            {isAnnual && <p className="text-[10px] text-primary font-bold mt-1">Cobrado {formatCurrency(annualPrice)}/ano</p>}
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {proPlanFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0"><f.icon className="w-3 h-3" /></div>
                <span className="font-medium text-white">{f.text}</span>
              </li>
            ))}
          </ul>
          <Button onClick={() => !isProUser && setIsCheckoutOpen(true)} className={`w-full py-6 text-lg font-black ${isProUser ? 'bg-secondary text-gray-400' : 'bg-primary text-primary-foreground shadow-xl shadow-primary/20'}`} disabled={isProUser}>
            {isProUser ? 'Ativo' : 'ASSINAR AGORA'}
          </Button>
        </div>
      </div>

      {isProUser && (
        <div className="glass-card p-6 border border-primary/10">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Gestão</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" className="py-5" onClick={() => setIsChangeCardOpen(true)}>Trocar Cartão</Button>
            <Button variant="ghost" className="py-5 text-destructive hover:bg-destructive/10" onClick={() => setIsCancelModalOpen(true)}>Cancelar</Button>
          </div>
        </div>
      )}

      {/* ✅ Zona de Perigo Otimizada para Mobile */}
      <div className="glass-card p-6 border border-destructive/20 bg-destructive/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-destructive/20 flex items-center justify-center shrink-0"><AlertTriangle className="w-6 h-6 text-destructive" /></div>
            <div><h4 className="font-bold text-white">Resetar Conta</h4><p className="text-xs text-gray-500">Iso apagará permanentemente todos os seus dados financeiros.</p></div>
          </div>
          {!showResetConfirm ? (
            <Button variant="outline" className="w-full md:w-auto border-destructive/50 text-destructive hover:bg-destructive/10 py-6 px-8" onClick={() => setShowResetConfirm(true)}>Resetar Agora</Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button variant="ghost" className="w-full sm:flex-1 py-6" onClick={() => setShowResetConfirm(false)}>Cancelar</Button>
              <Button variant="destructive" className="w-full sm:flex-1 py-6 font-bold" onClick={handleResetAccount}>Confirmar Reset</Button>
            </div>
          )}
        </div>
      </div>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} onSuccess={handleCheckoutSuccess} isAnnual={isAnnual} />
      <CancelSubscriptionModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onCancel={() => toast({title: "Cancelado"})} />
      <ChangeCardModal isOpen={isChangeCardOpen} onClose={() => setIsChangeCardOpen(false)} />
    </div>
  );
}