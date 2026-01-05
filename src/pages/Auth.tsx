import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

type AuthMode = 'login' | 'register';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        toast({
          title: "Bem-vindo de volta!",
          description: "Login realizado com sucesso.",
        });
      } else {
        await register(formData.name, formData.email, formData.password);
        toast({
          title: "Conta criada!",
          description: "Parabéns! Você ganhou acesso PRO!",
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro",
        description: error.message || "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 relative overflow-x-hidden">
      {/* Botão de Voltar Otimizado */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20 bg-[#0d1117]/80 backdrop-blur-sm p-2 rounded-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs md:text-sm font-medium">Voltar</span>
      </Link>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        
        {/* Left Side - Form (Mobile Optimized) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto pt-16 lg:pt-0 px-2"
        >
          <div className="mb-6 md:mb-8 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                FinChat
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              {mode === 'login' 
                ? 'Entre para gerenciar suas finanças' 
                : 'Comece sua jornada financeira hoje'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-gray-300">Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#161b22] border border-gray-800 rounded-xl py-3.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Seu nome"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#161b22] border border-gray-800 rounded-xl py-3.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-300">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#161b22] border border-gray-800 rounded-xl py-3.5 pl-10 pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 md:h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {mode === 'login' ? 'Entrar' : 'Criar Minha Conta'} <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-gray-400 text-sm">
              {mode === 'login' ? 'Ainda não tem conta?' : 'Já possui uma conta?'}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="ml-2 text-primary hover:text-primary/80 font-bold underline-offset-4 hover:underline transition-all"
              >
                {mode === 'login' ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Right Side - Features (Desktop Only) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex flex-col items-center text-center p-8 rounded-3xl bg-gradient-to-b from-[#161b22] to-[#0d1117] border border-gray-800"
        >
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 shadow-inner border border-primary/10">
            <TrendingUp className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Finanças Inteligentes
          </h2>
          <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
            Controle seu dinheiro com o poder da Inteligência Artificial.
            Registre gastos conversando, receba insights e tome decisões melhores.
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {['Chat IA', 'Gráficos', 'Metas', 'Relatórios'].map((feature) => (
              <div key={feature} className="p-3 rounded-xl bg-[#161b22] border border-gray-800 text-gray-300 text-xs font-bold uppercase tracking-widest shadow-sm">
                {feature}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}