import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import MemberArea from "@/pages/MemberArea";
import WaitingApproval from "@/pages/WaitingApproval";
import SupportPage from "@/pages/SupportPage";
import TicketDetail from "@/pages/TicketDetail";
import AdminPage from "@/pages/AdminPage";
import FileManagement from "@/pages/FileManagement";
import VideoManagement from "@/pages/VideoManagement";
import SystemConfigPage from "@/pages/SystemConfigPage";
import NotFound from "@/pages/NotFound";
import AgendaProPlus from "@/pages/AgendaProPlus";
import DeliveryFlow from "@/pages/DeliveryFlow";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {

  return (
    <div className="App font-sans">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/agenda-pro-plus" element={<AgendaProPlus />} />
              <Route path="/delivery-flow" element={<DeliveryFlow />} />
              <Route path="/membro" element={<MemberArea />} />
              <Route path="/membro/aguardando" element={<WaitingApproval />} />
              <Route path="/membro/suporte" element={<SupportPage />} />
              <Route path="/membro/suporte/:ticketId" element={<TicketDetail />} />
              <Route path="/membro/admin" element={<AdminPage />} />
              <Route path="/membro/admin/arquivos" element={<FileManagement />} />
              <Route path="/membro/admin/videos" element={<VideoManagement />} />
              <Route path="/membro/admin/configuracoes" element={<SystemConfigPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
