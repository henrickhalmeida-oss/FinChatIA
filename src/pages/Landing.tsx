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
    <div className="min-h-screen overflow-hidden">
      <div className="aurora-bg" />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-border">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold gradient-text">FinChat</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Entrar
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="glow-button bg-primary hover:bg-primary/90">
                Começar Grátis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Powered by AI</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="gradient-text">O Futuro</span>
              <br />
              <span className="text-foreground">do seu Dinheiro</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Controle suas finanças conversando com nossa IA. 
              Registre gastos, analise padrões e economize mais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/auth">
                <Button size="lg" className="glow-button bg-primary hover:bg-primary/90 px-8 py-6 text-lg">
                  Começar Grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Ver Demo
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>Configuração em 2 min</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Demo */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            {/* Glow Effects */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />

            {/* Chat Demo Card */}
            <div className="relative glass-card p-6 neon-border">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Chat IA</h3>
                  <p className="text-xs text-muted-foreground">Seu assistente financeiro</p>
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
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-secondary rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Fake Input */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-secondary/50 rounded-xl px-4 py-3 text-sm text-muted-foreground">
                    Digite sua mensagem...
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Por que escolher o <span className="gradient-text">FinChat</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para transformar sua relação com dinheiro
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="glass-card p-8 text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6" id="pricing">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Planos simples. <span className="gradient-text">Cancele quando quiser.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para suas necessidades
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glass-card p-8 relative"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-1">Gratuito</h3>
                <p className="text-muted-foreground text-sm">Para começar a organizar</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold">R$ 0</span>
                <span className="text-muted-foreground">,00</span>
              </div>

              <ul className="space-y-4 mb-8">
                {freePlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      feature.included 
                        ? 'bg-success/20 text-success' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {feature.included ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </div>
                    <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/auth">
                <Button variant="outline" className="w-full py-6 text-lg">
                  Começar Grátis
                </Button>
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="glass-card p-8 relative overflow-hidden border-2 border-accent/50"
              style={{
                boxShadow: '0 0 60px hsl(160 84% 39% / 0.15)',
              }}
            >
              {/* Popular Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-semibold border border-accent/30">
                  Mais Popular
                </span>
              </div>

              {/* Glow Effect */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />

              <div className="relative">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold">PRO</h3>
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-muted-foreground text-sm">Para quem quer o máximo</p>
                </div>

                <div className="mb-8">
                  <span className="text-5xl font-bold">R$ 29</span>
                  <span className="text-muted-foreground">,90</span>
                  <span className="text-muted-foreground text-lg"> /mês</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {proPlanFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                        <feature.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-6 text-lg bg-accent hover:bg-accent/90 text-accent-foreground"
                  style={{
                    boxShadow: '0 0 30px hsl(160 84% 39% / 0.4)',
                  }}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Assinar PRO
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto glass-card p-12 text-center relative overflow-hidden"
        >
          {/* Glow Effects */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Junte-se a milhares de pessoas que já transformaram sua vida financeira
            </p>
            <Link to="/auth">
              <Button size="lg" className="glow-button bg-primary hover:bg-primary/90 px-12 py-6 text-lg">
                Criar Conta Grátis
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold gradient-text">FinChat</span>
          </div>
          <p className="text-sm text-muted-foreground">
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
