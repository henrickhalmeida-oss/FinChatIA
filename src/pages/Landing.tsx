import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  ArrowRight,
  Sparkles,
  Check,
  ChevronRight,
  X,
  Zap,
  Lock,
  Diamond,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckoutModal } from '@/components/CheckoutModal';
import { useToast } from '@/hooks/use-toast';

const features = [
  {
    icon: MessageSquare,
    title: 'Chat Inteligente',
    description: 'Registre gastos conversando naturalmente. "Gastei 50 no Uber" e pronto!',
  },
  {
    icon: BarChart3,
    title: 'Gráficos Dinâmicos',
    description: 'Visualize seu fluxo de caixa e gastos por categoria em tempo real.',
  },
  {
    icon: Shield,
    title: 'Dados Seguros',
    description: 'Seus dados financeiros protegidos com criptografia de ponta a ponta.',
  },
];

const demoMessages = [
  { role: 'user', text: 'Gastei 50 no Uber' },
  { role: 'ai', text: '🚗 Anotado! R$ 50,00 em Transporte.' },
  { role: 'user', text: 'Recebi 5000 de salário' },
  { role: 'ai', text: '💰 Excelente! R$ 5.000,00 registrado.' },
];

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

export default function Landing() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { toast } = useToast();

  const handleCheckoutSuccess = () => {
    toast({
      title: "🎉 Parabéns!",
      description: "Você agora é um membro PRO! Faça login para acessar.",
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="aurora-bg" />

      {/* Header Responsivo */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-border">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <span className="text-lg md:text-xl font-bold gradient-text">FinChat</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs md:text-sm">
                Entrar
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="glow-button bg-primary hover:bg-primary/90 text-xs md:text-sm px-3 md:px-4">
                Começar <span className="hidden sm:inline ml-1">Grátis</span>
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section Otimizada */}
      <section className="min-h-screen flex items-center justify-center px-4 md:px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs md:text-sm text-primary font-medium">Powered by AI</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
              <span className="gradient-text">O Futuro</span>
              <br />
              <span className="text-foreground">do seu Dinheiro</span>
            </h1>

            <p className="text-base md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Controle suas finanças conversando com nossa IA. 
              Registre gastos, analise padrões e economize de forma inteligente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 items-center lg:items-start">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="w-full glow-button bg-primary hover:bg-primary/90 px-8 py-7 md:py-6 text-lg">
                  Começar Grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-7 md:py-6 text-lg">
                Ver Demo
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>Setup em 2 min</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Demo (Mobile Friendly) */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative w-full max-w-md mx-auto lg:max-w-none"
          >
            <div className="absolute -top-10 -right-10 w-40 md:w-80 h-40 md:h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 md:w-80 h-40 md:h-80 bg-accent/20 rounded-full blur-3xl" />

            <div className="relative glass-card p-4 md:p-6 neon-border">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base">Chat IA</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Seu assistente financeiro</p>
                </div>
              </div>

              <div className="space-y-4">
                {demoMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.3, duration: 0.4 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-secondary rounded-bl-sm'
                      }`}
                    >
                      <p className="text-xs md:text-sm">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-secondary/50 rounded-xl px-4 py-2.5 text-xs text-muted-foreground italic">
                    Digite sua mensagem...
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section Responsiva */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 px-2">
              Por que escolher o <span className="gradient-text">FinChat</span>?
            </h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Tudo que você precisa para transformar sua relação com dinheiro
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="glass-card p-6 md:p-8 text-center group hover:scale-[1.02] md:hover:scale-105 transition-all duration-300"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section Mobile Friendly */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-secondary/20" id="pricing">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planos simples.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Cancele quando quiser.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
            {/* Free Plan */}
            <motion.div
              className="glass-card p-6 md:p-8 order-2 md:order-1"
            >
              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-bold mb-1">Gratuito</h3>
                <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Essencial</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-bold">R$ 0</span>
                <span className="text-muted-foreground">,00</span>
              </div>

              <ul className="space-y-4 mb-8">
                {freePlanFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${f.included ? 'bg-success/20 text-success' : 'bg-white/5 text-gray-600'}`}>
                      {f.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    </div>
                    <span className={`text-sm ${f.included ? 'text-gray-300' : 'text-gray-600 line-through'}`}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <Link to="/auth">
                <Button variant="outline" className="w-full py-6 text-base font-bold">Começar Grátis</Button>
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              className="glass-card p-6 md:p-8 relative overflow-hidden border-2 border-primary/50 order-1 md:order-2"
            >
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-tighter border border-primary/30">Popular</span>
              </div>

              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">PRO <Sparkles className="w-4 h-4 text-primary" /></h3>
                <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Poder Total</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-bold">R$ 29</span>
                <span className="text-muted-foreground">,90</span>
                <span className="text-muted-foreground text-sm font-medium">/mês</span>
              </div>

              <ul className="space-y-4 mb-8">
                {proPlanFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                      <f.icon className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-bold text-white">{f.text}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-7 md:py-6 text-lg font-black bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              >
                ASSINAR AGORA
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Responsivo */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-white">FinChat</span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            © 2024 FinChat. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}