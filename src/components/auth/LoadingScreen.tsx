
import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-ramel" />
      <p className="mt-4">Carregando...</p>
    </div>
  );
};
