import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isAnnual?: boolean;
}

type CheckoutStep = 'form' | 'processing' | 'success';

export function CheckoutModal({ isOpen, onClose, onSuccess, isAnnual = false }: CheckoutModalProps) {
  const { upgradeToPro } = useAuth();
  const monthlyPrice = 29.90;
  const annualPrice = monthlyPrice * 12 * 0.8;
  const [step, setStep] = useState<CheckoutStep>('form');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Upgrade user to PRO
    await upgradeToPro();
    
    setStep('success');
    
    // Auto close after success
    setTimeout(() => {
      onSuccess();
      onClose();
      setStep('form');
    }, 2000);
  };

  const handleClose = () => {
    if (step !== 'processing') {
      onClose();
      setStep('form');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md glass-card p-8 neon-border overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />

            {/* Close Button */}
            {step !== 'processing' && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="relative z-10">
              {step === 'form' && (
                <>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Finalizar Assinatura</h2>
                    <p className="text-muted-foreground">Plano FinChat PRO</p>
                  </div>

                    <div className="bg-secondary/50 rounded-xl p-4 mb-6 border border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <span className="font-medium">FinChat PRO {isAnnual ? '(Anual)' : ''}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold">R$ {isAnnual ? (annualPrice / 12).toFixed(2).replace('.', ',') : '29,90'}</span>
                          <span className="text-muted-foreground text-sm">/mês</span>
                        </div>
                      </div>
                    </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome no Cartão</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="HENRIQUE ALMEIDA"
                        required
                        className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Número do Cartão</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          required
                          className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 tabular-nums"
                        />
                        <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Validade</label>
                        <input
                          type="text"
                          value={formData.expiry}
                          onChange={(e) => setFormData({ ...formData, expiry: formatExpiry(e.target.value) })}
                          placeholder="MM/AA"
                          maxLength={5}
                          required
                          className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVC</label>
                        <input
                          type="text"
                          value={formData.cvc}
                          onChange={(e) => setFormData({ ...formData, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                          placeholder="123"
                          maxLength={3}
                          required
                          className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 tabular-nums"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full glow-button bg-primary hover:bg-primary/90 py-6 mt-6"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Confirmar Assinatura
                    </Button>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                      🔒 Pagamento seguro. Cancele quando quiser.
                    </p>
                  </form>
                </>
              )}

              {step === 'processing' && (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Processando Pagamento</h3>
                  <p className="text-muted-foreground">Aguarde um momento...</p>
                </div>
              )}

              {step === 'success' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-success" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Pagamento Aprovado!</h3>
                  <p className="text-muted-foreground">
                    Bem-vindo ao FinChat PRO! 🎉
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
