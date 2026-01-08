import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Users, Database, Loader2, Star, Search, Bell, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, totalTransactions: 0 });
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  
  // Estados para o Comunicado
  const [announcement, setAnnouncement] = useState('');
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);

  const loadAdminData = async () => {
    try {
      const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { count: transCount, error: tError } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });
      
      // Busca o comunicado atual (tabela settings)
      const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'global_announcement')
        .maybeSingle(); 
      
      if (settings) setAnnouncement(settings.value);

      if (pError || tError) throw new Error("Erro ao carregar dados");

      if (profiles) setUsersList(profiles);
      setStats({ totalUsers: profiles?.length || 0, totalTransactions: transCount || 0 });
    } catch (err: any) {
      toast({ title: "Erro de Conexão", description: err.message, variant: "destructive" });
    }
  };

  const saveAnnouncement = async () => {
    setIsSavingAnnouncement(true);
    try {
      // ✅ Ajuste Crítico: Removido 'updated_at' para bater com as colunas reais do seu banco
      // ✅ Uso do onConflict garantindo que o comunicado seja atualizado corretamente
      const { error } = await supabase
        .from('settings')
        .upsert(
          { 
            key: 'global_announcement', 
            value: announcement 
          }, 
          { onConflict: 'key' } 
        );

      if (error) throw error;

      toast({ 
        title: "Sucesso!", 
        description: announcement ? "Comunicado publicado para todos os usuários." : "Comunicado removido." 
      });
    } catch (error: any) {
      // ✅ Feedback visual claro caso ocorra erro de Unique Constraint ou RLS
      toast({ 
        title: "Falha ao Publicar", 
        description: error.message, 
        variant: "destructive" 
      });
      console.error("Erro no Supabase:", error);
    } finally {
      setIsSavingAnnouncement(false);
    }
  };

  const togglePro = async (userId: string, currentPlan: string) => {
    setIsUpdating(userId);
    const newPlan = currentPlan === 'pro' ? 'free' : 'pro';
    const { error } = await supabase.from('profiles').update({ plan_type: newPlan }).eq('id', userId);

    if (!error) {
      toast({ title: "Plano Atualizado", description: `Usuário agora é ${newPlan.toUpperCase()}` });
      await loadAdminData();
    }
    setIsUpdating(null);
  };

  useEffect(() => { 
    if (user?.is_admin) loadAdminData(); 
  }, [user]);

  // Filtro de Busca
  const filteredUsers = usersList.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user?.is_admin) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShieldCheck className="w-16 h-16 text-destructive mb-4 opacity-20" />
        <h1 className="text-xl font-bold text-white">Acesso Restrito</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-20 px-2 md:px-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-border">
            <ShieldCheck className="w-5 h-5 text-primary"/>
          </div>
          <h1 className="text-2xl font-bold text-white">Painel de Controle</h1>
        </div>
      </div>

      {/* Seção de Comunicado Global */}
      <div className="glass-card p-6 border-amber-500/20 bg-amber-500/5">
        <h2 className="text-amber-500 font-bold text-sm uppercase flex items-center gap-2 mb-4">
          <Megaphone className="w-4 h-4" /> Comunicado Global (24h)
        </h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Ex: Manutenção hoje às 10h..." 
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
          />
          <Button 
            onClick={saveAnnouncement} 
            className="bg-amber-600 hover:bg-amber-700 font-bold"
            disabled={isSavingAnnouncement}
          >
            {isSavingAnnouncement ? <Loader2 className="animate-spin w-4 h-4" /> : "Publicar Aviso"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => { setAnnouncement(''); }}
            className="border-white/10 text-gray-400"
          >
            Limpar Texto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-6 border-white/5 bg-white/5 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Users /></div>
          <div><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Usuários</p><p className="text-3xl font-black text-white">{stats.totalUsers}</p></div>
        </div>
        <div className="glass-card p-6 border-white/5 bg-white/5 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Database /></div>
          <div><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Registros</p><p className="text-3xl font-black text-white">{stats.totalTransactions}</p></div>
        </div>
      </div>

      {/* Lista com Busca */}
      <div className="glass-card border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" /> Lista de Membros
          </h2>
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-white"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.01] text-gray-500 text-[10px] uppercase font-black tracking-tighter">
              <tr>
                <th className="px-6 py-4">Membro</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white leading-none mb-1">{u.full_name || 'Sem nome'}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.plan_type === 'pro' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-gray-800 text-gray-500'}`}>
                      {u.plan_type || 'free'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      size="sm" 
                      variant={u.plan_type === 'pro' ? 'outline' : 'default'}
                      disabled={isUpdating === u.id}
                      onClick={() => togglePro(u.id, u.plan_type)}
                      className="font-bold text-[10px] h-8"
                    >
                      {isUpdating === u.id ? <Loader2 className="w-3 h-3 animate-spin" /> : (u.plan_type === 'pro' ? 'REBAIXAR' : 'TORNAR PRO')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}