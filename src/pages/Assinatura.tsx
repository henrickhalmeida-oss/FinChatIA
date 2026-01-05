import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Shield, 
  MessageSquare,
  TrendingUp,
  X,
  Diamond,
  BarChart3,
  Lock,
  Rocket,
  AlertTriangle,
  Trash2,
  CreditCard,
  RefreshCw,
  Calendar
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

const whyProFeatures = [
  {
    icon: MessageSquare,
    title: 'IA Avançada',
    description: 'Registre gastos conversando naturalmente com nossa IA',
  },
  {
    icon: TrendingUp,
    title: 'Análises Profundas',
    description: 'Insights personalizados para economizar mais',
  },
  {
    icon: Shield,
    title: 'Dados Seguros',
    description: 'Criptografia de ponta a ponta para seus dados',
  },
];

export default function Assinatura() {
  const { user, updateUser } = useAuth();
  const { resetAccount } = useData();
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isChangeCardOpen, setIsChangeCardOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  const monthlyPrice = 29.90;
  const annualPrice = monthlyPrice * 12 * 0.8; // 20% off
  const monthlyFromAnnual = annualPrice / 12;

  const handleCheckoutSuccess = () => {
    toast({
      title: "🎉 Parabéns!",
      description: "Você agora é um membro PRO! Aproveite todos os recursos.",
    });
  };

  const handleCancelSubscription = () => {
    updateUser({ isPro: false });
    toast({
      title: "Assinatura cancelada",
      description: "Você voltou para o plano gratuito.",
    });
  };

  const handleResetAccount = () => {
    resetAccount();
    setShowResetConfirm(false);
    toast({
      title: "Conta resetada",
      description: "Todas as transações foram removidas.",
    });
  };

  const handleChangeToAnnual = () => {
    toast({
      title: "Plano alterado!",
      description: "Você agora está no plano anual com 20% de desconto.",
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Escolha seu Plano</h1>
        <p className="text-muted-foreground">
          Desbloqueie todo o potencial do FinChat
        </p>
      </motion.div>

      {/* Billing Toggle */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex items-center justify-center gap-4"
      >
        <Label htmlFor="billing-toggle" className={`text-sm ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
          Mensal
        </Label>
        <Switch
          id="billing-toggle"
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
        <div className="flex items-center gap-2">
          <Label htmlFor="billing-toggle" className={`text-sm ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Anual
          </Label>
          {isAnnual && (
            <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
              -20%
            </span>
          )}
        </div>
      </motion.div>

      {/* Current Plan Badge */}
      {user?.isPro && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Você é PRO!</span>
          </div>
        </motion.div>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className={`glass-card p-8 ${!user?.isPro ? 'ring-2 ring-primary/30' : ''}`}
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-1">Gratuito</h3>
            <p className="text-muted-foreground text-sm">Para começar a organizar suas finanças</p>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold">R$ 0</span>
            <span className="text-muted-foreground">,00</span>
          </div>

          <ul className="space-y-3 mb-8">
            {freePlanFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  feature.included 
                    ? 'bg-success/20 text-success' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {feature.included ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                </div>
                <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          <Button 
            variant="outline" 
            className="w-full" 
            disabled
          >
            {!user?.isPro ? 'Plano Atual' : 'Plano Básico'}
          </Button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className={`glass-card p-8 relative overflow-hidden border-2 ${
            user?.isPro ? 'border-accent/50' : 'border-accent/30'
          }`}
          style={{
            boxShadow: user?.isPro ? '0 0 60px hsl(160 84% 39% / 0.2)' : '0 0 40px hsl(160 84% 39% / 0.1)',
          }}
        >
          {/* Popular Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium border border-accent/30">
              Mais Popular
            </span>
          </div>

          {/* Glow Effect */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">PRO</h3>
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <p className="text-muted-foreground text-sm">Para quem quer controle total</p>
            </div>

            <div className="mb-6">
              {isAnnual ? (
                <>
                  <span className="text-4xl font-bold">R$ {monthlyFromAnnual.toFixed(2).replace('.', ',')}</span>
                  <span className="text-muted-foreground">/mês</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cobrado R$ {annualPrice.toFixed(2).replace('.', ',')} anualmente
                  </p>
                </>
              ) : (
                <>
                  <span className="text-4xl font-bold">R$ 29</span>
                  <span className="text-muted-foreground">,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {proPlanFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                    <feature.icon className="w-3 h-3 text-accent" />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </li>
              ))}
            </ul>

            {user?.isPro ? (
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
                disabled
                style={{
                  boxShadow: '0 0 20px hsl(160 84% 39% / 0.3)',
                }}
              >
                <Check className="w-4 h-4 mr-2" />
                Plano Atual
              </Button>
            ) : (
              <Button 
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                style={{
                  boxShadow: '0 0 30px hsl(160 84% 39% / 0.4)',
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Assinar Agora
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* PRO User Management Panel */}
      {user?.isPro && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Gerenciar Assinatura
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsChangeCardOpen(true)}
            >
              <CreditCard className="w-4 h-4" />
              Alterar Cartão
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleChangeToAnnual}
            >
              <Calendar className="w-4 h-4" />
              Mudar para Anual
            </Button>

            <Button 
              variant="ghost" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setIsCancelModalOpen(true)}
            >
              Cancelar Assinatura
            </Button>
          </div>
        </motion.div>
      )}

      {/* Features Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="glass-card p-8"
      >
        <h3 className="text-xl font-bold mb-6 text-center">Por que escolher o PRO?</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {whyProFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reset Account Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="glass-card p-6 border-destructive/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h4 className="font-semibold">Zona de Perigo</h4>
              <p className="text-sm text-muted-foreground">Resetar todos os dados da conta</p>
            </div>
          </div>
          {!showResetConfirm ? (
            <Button 
              variant="outline" 
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={() => setShowResetConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Resetar Conta
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleResetAccount}>
                Confirmar Reset
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
        isAnnual={isAnnual}
      />

      {/* Cancel Subscription Modal */}
      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onCancel={handleCancelSubscription}
      />

      {/* Change Card Modal */}
      <ChangeCardModal
        isOpen={isChangeCardOpen}
        onClose={() => setIsChangeCardOpen(false)}
      />
    </div>
  );
}
