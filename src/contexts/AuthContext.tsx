import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// ✅ Adicionada a propriedade is_admin para sincronizar com o banco
interface User extends SupabaseUser {
  plan?: 'free' | 'pro';
  name?: string; 
  is_admin?: boolean; 
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  updateUserPlan: (plan: 'free' | 'pro') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (currentSession: Session | null) => {
    if (!currentSession?.user) {
      setUser(null);
      return;
    }

    try {
      // ✅ O select('*') agora busca a sua nova coluna is_admin
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', error);
      }

      const fullName = profile?.full_name || currentSession.user.user_metadata?.full_name || 'Usuário';
      const planType = profile?.plan_type || 'free';
      const isAdminStatus = profile?.is_admin || false; // ✅ Captura o status do banco

      const userData: User = {
        ...currentSession.user,
        plan: planType as 'free' | 'pro',
        name: fullName,
        is_admin: isAdminStatus, // ✅ Disponibiliza o status para o app
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Erro de sistema:', error);
      setUser({
        ...currentSession.user,
        plan: 'free',
        name: currentSession.user.user_metadata?.full_name || 'Usuário',
        is_admin: false
      });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchProfile(session).then(() => setIsLoading(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchProfile(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!password) throw new Error("Senha obrigatória");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (name: string, email: string, password?: string) => {
    if (!password) throw new Error("Senha obrigatória");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUserPlan = async (plan: 'free' | 'pro') => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ plan_type: plan })
      .eq('id', user.id);

    if (!error) {
      setUser({ ...user, plan });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUserPlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}