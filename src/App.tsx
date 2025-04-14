
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import MemberArea from "./pages/MemberArea";
import WaitingApproval from "./pages/WaitingApproval";
import SupportPage from "./pages/SupportPage";
import TicketDetail from "./pages/TicketDetail";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import AgendaProPlus from "./pages/AgendaProPlus";
import DeliveryFlow from "./pages/DeliveryFlow";
import FileManagement from "./pages/FileManagement";
import VideoManagement from "./pages/VideoManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/membro" element={<MemberArea />} />
            <Route path="/membro/aguardando" element={<WaitingApproval />} />
            <Route path="/membro/suporte" element={<SupportPage />} />
            <Route path="/membro/suporte/:ticketId" element={<TicketDetail />} />
            <Route path="/membro/admin" element={<AdminPage />} />
            <Route path="/membro/admin/arquivos" element={<FileManagement />} />
            <Route path="/membro/admin/videos" element={<VideoManagement />} />
            <Route path="/produtos/agenda-pro-plus" element={<AgendaProPlus />} />
            <Route path="/produtos/deliveryflow" element={<DeliveryFlow />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
