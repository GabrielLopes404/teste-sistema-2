import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Registro from "@/pages/registro";
import RecuperarSenha from "@/pages/recuperar-senha";
import Dashboard from "@/pages/dashboard";
import Contas from "@/pages/contas";
import FluxoCaixa from "@/pages/fluxo-caixa";
import Contatos from "@/pages/contatos";
import Relatorios from "@/pages/relatorios";
import Conciliacao from "@/pages/conciliacao";
import Faturas from "@/pages/faturas";
import Configuracoes from "@/pages/configuracoes";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import AdminReports from "@/pages/admin/reports";
import AdminSettings from "@/pages/admin/settings";
import NotFound from "@/pages/not-found";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/registro" component={Registro} />
      <Route path="/recuperar-senha" component={RecuperarSenha} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/contas" component={Contas} />
      <Route path="/fluxo-caixa" component={FluxoCaixa} />
      <Route path="/conciliacao" component={Conciliacao} />
      <Route path="/faturas" component={Faturas} />
      <Route path="/contatos" component={Contatos} />
      <Route path="/relatorios" component={Relatorios} />
      <Route path="/configuracoes" component={Configuracoes} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/reports" component={AdminReports} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isLandingPage = location === "/";
  const isLoginPage = location === "/login";
  const isRegistroPage = location === "/registro";
  const isRecuperarSenhaPage = location === "/recuperar-senha";
  const isAdminPage = location.startsWith("/admin");

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (isLandingPage || isLoginPage || isRegistroPage || isRecuperarSenhaPage) {
    return <AppRouter />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        {isAdminPage ? <AdminSidebar /> : <AppSidebar />}
        <div className="flex flex-col flex-1 overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">
            <AppRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
