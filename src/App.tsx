
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
import { Toaster } from "@/components/ui/toaster"
import WaitingApproval from "@/pages/WaitingApproval";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/aguardando-aprovacao" element={<WaitingApproval />} />
          <Route path="/produtos/deliveryflow" element={<DeliveryFlow />} />
          <Route path="/produtos/agendapro" element={<AgendaPro />} />
          <Route path="/produtos/agenda-pro-plus" element={<AgendaProPlus />} />
          <Route path="/membro" element={<MemberArea />} />
          <Route path="/membro/arquivo" element={<FileManagement />} />
          <Route path="/membro/videos" element={<VideoManagement />} />
          <Route path="/membro/suporte" element={<SupportPage />} />
          <Route path="/membro/suporte/:ticketId" element={<TicketDetail />} />
          <Route path="/membro/admin" element={<AdminPage />} />
          <Route path="/membro/admin/configuracoes" element={<SystemConfigPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
