import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, Wallet, 
  Target, Zap, CreditCard, Menu, X, TrendingUp, LogOut, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export function AppLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Painel', path: '/dashboard' },
    { icon: MessageSquare, label: 'Chat IA', path: '/chat' },
    { icon: Wallet, label: 'Minha Carteira', path: '/carteira' },
    { icon: Target, label: 'Meus Cofrinhos', path: '/metas' },
    { icon: Zap, label: 'Integrações', path: '/integracoes' },
    { icon: CreditCard, label: 'Assinatura', path: '/assinatura' },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row overflow-x-hidden">
      
      {/* 📱 HEADER MOBILE */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111] border-b border-white/5 sticky top-0 z-[100] w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">FinChat</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2.5 bg-white/5 rounded-xl border border-white/5 active:scale-95 transition-all"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 🖥️ SIDEBAR */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth > 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`
              fixed md:sticky top-0 left-0 h-[100dvh] w-[280px] bg-[#0f0f0f] border-r border-white/5 
              flex flex-col z-[150] md:z-auto
              ${isMobileMenuOpen ? 'block shadow-2xl shadow-black' : 'hidden md:flex'}
            `}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-border">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">FinChat</h1>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Master AI</p>
                </div>
              </div>

              <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMenu}
                      className={`
                        flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm
                        ${isActive 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'}
                      `}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                      {item.label}
                    </Link>
                  );
                })}

                {/* 🛡️ BOTÃO ADMIN EXCLUSIVO - Agora usa o is_admin do banco */}
                {user?.is_admin && (
                  <div className="pt-4 mt-4 border-t border-white/5">
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className={`
                        flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm
                        ${pathname === '/admin' 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' 
                          : 'text-amber-500/60 hover:text-amber-400 hover:bg-amber-500/10'}
                      `}
                    >
                      <ShieldCheck className="w-5 h-5" />
                      Painel Admin
                    </Link>
                  </div>
                )}
              </nav>
            </div>

            <div className="mt-auto p-6 border-t border-white/5 bg-black/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-black text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate text-white">{user?.name || 'Usuário'}</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">
                    {user?.is_admin ? 'Administrador' : 'Membro PRO'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => logout()}
                className="w-full py-3.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-500 transition-all text-xs font-black border border-red-500/10 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                SAIR DA CONTA
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 🌑 OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[140] md:hidden" 
          onClick={closeMenu} 
        />
      )}

      {/* 🚀 CONTEÚDO PRINCIPAL */}
      <main className="flex-1 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}