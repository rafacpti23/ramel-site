
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardContent } from "@/components/ui/card";
import AdminRegistrationInfo from "@/components/AdminRegistrationInfo";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoadingScreen } from "@/components/auth/LoadingScreen";

const Auth = () => {
  const { user, loading, isPaid } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  
  useEffect(() => {
    if (!loading && user) {
      // Adicionado log para debug
      console.log("Auth page effect - User:", user.email, "isPaid:", isPaid);
      
      // Verifica se o usuário está aprovado para acessar a área de membros
      if (isPaid === true) {
        navigate("/membro");
      } else if (isPaid === false) {
        navigate("/aguardando-aprovacao");
      }
      // Se isPaid for undefined, aguarda até que o valor seja carregado
    }
  }, [user, loading, navigate, isPaid]);

  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <AuthLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Cadastro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="mt-4">
          <CardContent>
            <LoginForm 
              adminEmail="" 
              adminPassword="" 
            />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="register" className="mt-4">
          <CardContent>
            <RegisterForm />
          </CardContent>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};

export default Auth;
