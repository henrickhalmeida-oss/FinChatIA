import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  QrCode, 
  Smartphone, 
  Check,
  ArrowRight,
  Zap,
  Loader2
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
    { number: 4, text: 'Veja a mágica no Painel' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-20 px-2 md:px-0">
      {/* Header Responsivo */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="px-2 md:px-0"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Integrações</h1>
        <p className="text-sm md:text-base text-muted-foreground">Conecte suas ferramentas favoritas</p>
      </motion.div>

      {/* WhatsApp Integration Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-5 md:p-8 border border-white/5"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col items-center md:items-start">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-white">WhatsApp Inteligente</h2>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black border border-amber-500/20 uppercase tracking-tighter">
                Em Breve
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
              Registre despesas enviando um áudio ou texto como <span className="text-green-400 font-medium">"Gastei 50 no almoço"</span> e nossa IA cuida do resto no seu painel.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* QR Code Section - Centralizada no Mobile */}
          <div className="flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl bg-black/20 border border-white/5 order-2 lg:order-1">
            <div className="relative mb-6">
              <div className={`w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 ${!qrGenerated ? 'blur-sm opacity-50' : 'bg-white shadow-2xl'}`}>
                {qrGenerated ? (
                  <div className="w-32 h-32 md:w-40 md:h-40 p-2">
                    <div className="w-full h-full grid grid-cols-8 gap-0.5">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className={`aspect-square ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <QrCode className="w-20 h-20 text-white/20" />
                )}
              </div>
              
              {!qrGenerated && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Aguardando geração
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleGenerateQR}
              disabled={isGenerating || qrGenerated}
              className={`w-full md:w-auto py-6 md:py-4 px-8 font-bold rounded-2xl transition-all ${qrGenerated ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-primary text-primary-foreground'}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando Chave...
                </>
              ) : qrGenerated ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Pronto para Escanear
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Gerar QR Code
                </>
              )}
            </Button>

            <div className="mt-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Desconectado</span>
            </div>
          </div>

          {/* Instructions Otimizadas */}
          <div className="space-y-6 order-1 lg:order-2">
            <h3 className="text-sm md:text-lg font-bold flex items-center gap-2 text-white uppercase tracking-wider">
              <Zap className="w-4 h-4 text-primary" />
              Guia de Ativação
            </h3>
            
            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0">
                    {step.number}
                  </div>
                  <span className="text-sm text-gray-300 font-medium">{step.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Example Box */}
            <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
              <h4 className="text-[10px] font-black text-green-400 mb-3 flex items-center gap-2 uppercase tracking-widest">
                <Smartphone className="w-3 h-3" />
                Exemplos Rápidos
              </h4>
              <div className="space-y-2 italic text-xs text-gray-500">
                <p>"Gastei 50 reais no posto"</p>
                <p>"Recebi meu bônus de 200"</p>
                <p>"Paguei o aluguel hoje"</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}