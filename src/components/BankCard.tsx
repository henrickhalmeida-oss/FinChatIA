import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, CreditCard, Building2, Wallet } from 'lucide-react';

interface BankCardProps {
  bank: 'nubank' | 'itau' | 'caixa' | 'outros';
  balance: number;
  delay?: number;
  isProjected?: boolean;
}

const bankConfig = {
  nubank: {
    name: 'Nubank',
    color: 'from-[#820AD1] to-[#400080]',
    icon: CreditCard,
    text: 'text-white',
    label: 'Nu'
  },
  itau: {
    name: 'Itaú',
    color: 'from-[#EC7000] to-[#b35500]',
    icon: Landmark,
    text: 'text-white',
    label: 'Itaú'
  },
  caixa: {
    name: 'Caixa',
    color: 'from-[#005CA9] to-[#003d70]',
    icon: Building2,
    text: 'text-white',
    label: 'CEF'
  },
  outros: {
    name: 'Outros Bancos',
    color: 'from-gray-700 to-gray-900', // Cor neutra elegante
    icon: Wallet,
    text: 'text-gray-200',
    label: 'Outros'
  }
};

export function BankCard({ bank, balance, delay = 0, isProjected = false }: BankCardProps) {
  const config = bankConfig[bank] || bankConfig.outros; // Fallback para 'outros' se der erro
  const Icon = config.icon;

  const formattedBalance = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(balance);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${config.color} shadow-lg group hover:scale-[1.02] transition-transform duration-300 border border-white/5`}
    >
      {/* Background Pattern */}
      <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-black/10 blur-3xl" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <Icon className={`w-5 h-5 ${config.text}`} />
          </div>
          <span className={`font-medium ${config.text}`}>{config.name}</span>
        </div>
        <span className={`text-lg font-bold opacity-50 ${config.text} font-mono tracking-wider`}>
          {config.label}
        </span>
      </div>

      {/* Balance */}
      <div className="relative z-10">
        <p className={`text-xs font-medium opacity-80 mb-1 ${config.text}`}>
          {isProjected ? 'Saldo Projetado' : 'Saldo disponível'}
        </p>
        <h3 className={`text-2xl font-bold tracking-tight ${config.text}`}>
          {formattedBalance}
        </h3>
      </div>
    </motion.div>
  );
}