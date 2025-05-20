
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, FileText, Video, MessageSquare, LogOut, Award } from "lucide-react";

const MemberHeader = () => {
  const { signOut, userProfile, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  
  return (
    <header className="bg-secondary/80 backdrop-blur-sm border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/ce5802ea-5404-48ed-ac8f-7ad335ff753c.png" 
                alt="Ramel Tecnologia" 
                className="h-10 w-auto mr-2" 
              />
              <span className="font-medium hidden md:block">Área de Membros</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/membro" className="hover:text-ramel transition-colors">
                Início
              </Link>
              <Link to="/membro/afiliacao" className="hover:text-ramel transition-colors">
                Afiliação
              </Link>
              <Link to="/membro/suporte" className="hover:text-ramel transition-colors">
                Suporte
              </Link>
              {isAdmin && (
                <Link to="/membro/admin" className="hover:text-ramel transition-colors">
                  Admin
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sair</span>
              </Button>
            </div>
            
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-6 mt-6">
                  <div className="flex flex-col items-center p-4 border border-white/10 rounded-md">
                    <User className="h-10 w-10 mb-2" />
                    <p className="font-medium">{userProfile?.full_name || "Membro"}</p>
                    <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Link 
                      to="/membro" 
                      className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <FileText className="h-5 w-5" />
                      <span>Arquivos de Apoio</span>
                    </Link>
                    
                    <Link 
                      to="/membro" 
                      className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <Video className="h-5 w-5" />
                      <span>Vídeo Aulas</span>
                    </Link>
                    
                    <Link 
                      to="/membro/afiliacao" 
                      className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <Award className="h-5 w-5" />
                      <span>Programa de Afiliação</span>
                    </Link>
                    
                    <Link 
                      to="/membro/suporte" 
                      className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>Suporte</span>
                    </Link>
                    
                    {isAdmin && (
                      <Link 
                        to="/membro/admin" 
                        className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>Admin</span>
                      </Link>
                    )}
                  </div>
                  
                  <Button onClick={() => signOut()} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sair</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MemberHeader;
