
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
  
  useEffect(() => {
    if (!loading && user) {
      // Adicionado log para debug
      console.log("Auth page effect - User:", user.email, "isPaid:", isPaid);
      
      if (isPaid) {
        navigate("/membro");
      } else {
        navigate("/membro/aguardando");
      }
    }
  }, [user, loading, navigate, isPaid]);

  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <AuthLayout>
      <Tabs defaultValue="login" className="w-full">
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
