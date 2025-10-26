
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import MemberArea from "@/pages/MemberArea";
import NotFound from "@/pages/NotFound";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import FileManagement from "@/pages/FileManagement";
import VideoManagement from "@/pages/VideoManagement";
import SupportPage from "@/pages/SupportPage";
import TicketDetail from "@/pages/TicketDetail";
import AdminPage from "@/pages/AdminPage";
import SystemConfigPage from "@/pages/SystemConfigPage";
import DeliveryFlow from "@/pages/DeliveryFlow";
import AgendaPro from "@/pages/AgendaPro";
import AgendaProPlus from "@/pages/AgendaProPlus";
import AgendamentoPage from "@/pages/AgendamentoPage";
import WhatsPro from "@/pages/WhatsPro";
import { Toaster } from "@/components/ui/toaster"
import WaitingApproval from "@/pages/WaitingApproval";
import CrmPage from "@/pages/CrmPage";
import MonitorCam from "@/pages/MonitorCam";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LiveChatService } from "@/services/LiveChatService";
import AffiliationPage from "@/pages/AffiliationPage";

function App() {
  // Carrega as configurações do sistema e inicializa o chat ao carregar a aplicação
  useEffect(() => {
    const loadSystemConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("system_config")
          .select("*")
          .limit(1)
          .single();
        
        if (error) throw error;
        
        if (data) {
          LiveChatService.updateLiveChat(
            data.live_chat_enabled ?? true,
            data.chat_button_text ?? "Estamos aqui!",
            data.live_chat_code ?? ""
          );
        }
      } catch (error) {
        console.error("Erro ao carregar configurações do sistema:", error);
      }
    };

    loadSystemConfig();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/agendamento" element={<AgendamentoPage />} />
          <Route path="/aguardando-aprovacao" element={<WaitingApproval />} />
          <Route path="/produtos/deliveryflow" element={<DeliveryFlow />} />
          <Route path="/produtos/agenda-pro-plus" element={<AgendaProPlus />} />
          <Route path="/produtos/agendapro" element={<AgendaPro />} />
          <Route path="/produtos/whatspro" element={<WhatsPro />} />
          <Route path="/membro" element={<MemberArea />} />
          <Route path="/membro/arquivos" element={<AffiliationPage />} />
          <Route path="/membro/admin/arquivos" element={<FileManagement />} />
          <Route path="/membro/admin/videos" element={<VideoManagement />} />
          <Route path="/membro/suporte" element={<SupportPage />} />
          <Route path="/membro/suporte/:ticketId" element={<TicketDetail />} />
          <Route path="/membro/admin" element={<AdminPage />} />
          <Route path="/membro/admin/configuracoes" element={<SystemConfigPage />} />
          <Route path="/membro/admin/crm" element={<CrmPage />} />
          <Route path="/membro/monitorcam" element={<MonitorCam />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
