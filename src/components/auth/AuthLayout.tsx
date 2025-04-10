
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate();

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
        
        {children}
        
        <CardFooter className="border-t border-white/10 flex justify-center px-6 py-4">
          <Button variant="link" onClick={() => navigate("/")}>
            Voltar para o site
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
