import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  QrCode, 
  Smartphone, 
  Check,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Integracoes() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  const handleGenerateQR = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setQrGenerated(true);
    }, 2000);
  };

  const steps = [
    { number: 1, text: 'Clique em "Gerar QR Code"' },
    { number: 2, text: 'Escaneie com seu WhatsApp' },
    { number: 3, text: 'Envie seus gastos por áudio ou texto' },
    { number: 4, text: 'Veja a mágica acontecer no Painel' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold">Integrações</h1>
        <p className="text-muted-foreground">Conecte suas ferramentas favoritas</p>
      </motion.div>

      {/* WhatsApp Integration Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="glass-card p-8"
      >
        <div className="flex items-start gap-6 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">FinChat no WhatsApp</h2>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30">
                Em Breve
              </span>
            </div>
            <p className="text-muted-foreground max-w-xl">
              Registre suas despesas e receitas diretamente pelo WhatsApp. 
              Basta enviar um áudio ou mensagem como "Gastei 50 no almoço" e nossa IA cuida do resto.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-secondary/30 border border-border/50">
            <div className="relative mb-6">
              {/* QR Code Placeholder */}
              <div className={`w-48 h-48 rounded-2xl bg-white/10 border border-border/50 flex items-center justify-center ${!qrGenerated ? 'blur-sm' : ''}`}>
                {qrGenerated ? (
                  <div className="w-40 h-40 bg-white rounded-lg p-2">
                    <div className="w-full h-full grid grid-cols-8 gap-0.5">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`aspect-square ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <QrCode className="w-24 h-24 text-muted-foreground/50" />
                )}
              </div>
              
              {!qrGenerated && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="px-4 py-2 rounded-lg bg-background/80 border border-border/50 text-sm text-muted-foreground">
                    QR Code não gerado
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleGenerateQR}
              disabled={isGenerating || qrGenerated}
              className="glow-button"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                  />
                  Gerando...
                </>
              ) : qrGenerated ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  QR Code Gerado
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Gerar QR Code
                </>
              )}
            </Button>

            {/* Connection Status */}
            <div className="mt-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm text-muted-foreground">Desconectado</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Como Funciona
            </h3>
            
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/30"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
                    {step.number}
                  </div>
                  <span>{step.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Example Messages */}
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Exemplos de mensagens
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 text-green-400" />
                  "Gastei 50 reais no uber"
                </p>
                <p className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 text-green-400" />
                  "Recebi 3500 de salário"
                </p>
                <p className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 text-green-400" />
                  "Paguei 180 de conta de luz"
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
