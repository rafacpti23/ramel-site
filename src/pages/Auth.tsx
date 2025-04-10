
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AdminRegistrationInfo } from "@/components/AdminRegistrationInfo";

const Auth = () => {
  const { user, loading, signIn, signUp, isPaid } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Informações do usuário admin padrão
  const adminEmail = "admin@admin.com";
  const adminPassword = "123456";

  useEffect(() => {
    if (!loading && user) {
      if (isPaid) {
        navigate("/membro");
      } else {
        navigate("/membro/aguardando");
      }
    }
  }, [user, loading, navigate, isPaid]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await signIn(email, password);
      // A navegação é feita no useEffect após a atualização do estado
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await signUp(email, password, fullName);
      // A navegação é feita no useEffect após a atualização do estado
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAdminLogin = async () => {
    setIsSubmitting(true);
    try {
      await signIn(adminEmail, adminPassword);
      toast({
        title: "Login com usuário admin",
        description: "Usando credenciais de administrador padrão.",
      });
      // A navegação é feita no useEffect após a atualização do estado
    } catch (error) {
      toast({
        title: "Usuário admin não encontrado",
        description: "O usuário admin@admin.com ainda não foi criado. Entre em contato com o administrador do sistema.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ramel" />
        <p className="mt-4">Carregando...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{
      backgroundImage: "url('/images/bg-pattern.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed"
    }}>
      <Card className="w-full max-w-md glass-card mb-6">
        <CardHeader className="text-center">
          <img 
            src="/lovable-uploads/ce5802ea-5404-48ed-ac8f-7ad335ff753c.png" 
            alt="Ramel Tecnologia" 
            className="h-16 mx-auto mb-4" 
          />
          <CardTitle>Acesso à Área Restrita</CardTitle>
          <CardDescription>
            Entre com sua conta ou crie uma nova
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">
                      Acesso rápido para desenvolvedores
                    </span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  className="w-full" 
                  variant="outline"
                  onClick={handleAdminLogin}
                  disabled={isSubmitting}
                >
                  Login como Admin Padrão
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  (Email: admin@admin.com, Senha: 123456)
                </p>
              </CardContent>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="mt-4">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input 
                    id="fullName" 
                    type="text" 
                    placeholder="Seu Nome Completo" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailRegister">Email</Label>
                  <Input 
                    id="emailRegister" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordRegister">Senha</Label>
                  <Input 
                    id="passwordRegister" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    "Cadastrar"
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Ao se cadastrar, você concorda com nossos termos e condições.
                </p>
              </CardContent>
            </form>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="border-t border-white/10 flex justify-center px-6 py-4">
          <Button variant="link" onClick={() => navigate("/")}>
            Voltar para o site
          </Button>
        </CardFooter>
      </Card>
      
      <AdminRegistrationInfo />
    </div>
  );
};

export default Auth;
