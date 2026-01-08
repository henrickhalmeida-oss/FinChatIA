import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
// ✅ Corrigido: O componente DataProvider está dentro do arquivo DataContext
import { DataProvider } from "@/contexts/DataContext"; 
import { AppLayout } from "@/components/AppLayout"; 
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ChatIA from "./pages/ChatIA";
import Carteira from "./pages/Carteira";
import Metas from "./pages/Metas";
import Integracoes from "./pages/Integracoes";
import Assinatura from "./pages/Assinatura";
// ✅ Corrigido: Importação com 'A' maiúsculo para coincidir com o arquivo Admin.tsx
import Admin from "./pages/Admin"; 
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#0d1117] text-white font-bold animate-pulse uppercase tracking-widest">Carregando...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      
      {/* Rotas Protegidas com Layout */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatIA />} />
        <Route path="/carteira" element={<Carteira />} />
        <Route path="/metas" element={<Metas />} />
        <Route path="/integracoes" element={<Integracoes />} />
        <Route path="/assinatura" element={<Assinatura />} />
        <Route path="/admin" element={<Admin />} /> 
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;