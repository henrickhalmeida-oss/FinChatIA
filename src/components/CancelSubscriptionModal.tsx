import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
}

export function CancelSubscriptionModal({ isOpen, onClose, onCancel }: CancelSubscriptionModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const handleCancel = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setIsCancelled(true);
    
    setTimeout(() => {
      onCancel();
      setIsCancelled(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card p-8 max-w-md w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isCancelled ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4"
              >
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Assinatura Cancelada</h3>
              <p className="text-muted-foreground">
                Você voltou para o plano gratuito.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cancelar Assinatura?</h3>
                <p className="text-muted-foreground">
                  Você perderá acesso a todos os recursos PRO, incluindo:
                </p>
              </div>

              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-destructive">•</span>
                  Chat IA Ilimitado
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-destructive">•</span>
                  Histórico Completo
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-destructive">•</span>
                  Gráficos Avançados
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-destructive">•</span>
                  Suporte Prioritário
                </li>
              </ul>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Voltar
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    'Confirmar Cancelamento'
                  )}
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
