
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface LiveChatTabProps {
  liveChatEnabled: boolean;
  setLiveChatEnabled: (value: boolean) => void;
  chatButtonText: string;
  setChatButtonText: (value: string) => void;
  liveChatCode: string;
  setLiveChatCode: (value: string) => void;
}

const LiveChatTab = ({
  liveChatEnabled,
  setLiveChatEnabled,
  chatButtonText,
  setChatButtonText,
  liveChatCode,
  setLiveChatCode
}: LiveChatTabProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Chat ao Vivo</h3>
      
      <div className="flex items-center space-x-2 mb-6">
        <Switch 
          id="chat-enabled"
          checked={liveChatEnabled} 
          onCheckedChange={setLiveChatEnabled}
        />
        <Label htmlFor="chat-enabled" className="font-medium">
          {liveChatEnabled ? "Chat ao vivo ativado" : "Chat ao vivo desativado"}
        </Label>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="chat-text">Texto do Botão de Chat</Label>
        <Input
          id="chat-text"
          placeholder="Estamos aqui!"
          value={chatButtonText}
          onChange={(e) => setChatButtonText(e.target.value)}
          disabled={!liveChatEnabled}
        />
        <p className="text-sm text-muted-foreground">
          Este texto será exibido no botão de chat quando o visitante acessar seu site.
        </p>
      </div>

      <div className="space-y-3 mt-6">
        <Label htmlFor="chat-code">Código Personalizado (Opcional)</Label>
        <Textarea
          id="chat-code"
          placeholder="<!-- Cole aqui o código do seu serviço de chat (Tawk.to, Crisp, etc) -->"
          value={liveChatCode}
          onChange={(e) => setLiveChatCode(e.target.value)}
          rows={8}
          disabled={!liveChatEnabled}
        />
        <p className="text-sm text-muted-foreground">
          Se desejar usar código completamente personalizado, cole-o aqui. 
          Caso contrário, deixe em branco para usar as configurações acima.
        </p>
      </div>
      
      <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 mt-4">
        <h4 className="font-medium text-green-500 mb-2">Chat do Tawk.to Configurado</h4>
        <p className="text-sm">
          Um chat do Tawk.to já está pré-configurado para seu site. Você pode:
          <br />1. Ativar/desativar o chat usando o botão acima
          <br />2. Personalizar o texto do botão de chat
          <br />3. Ou substituir completamente colando seu próprio código no campo acima
        </p>
      </div>
    </div>
  );
};

export default LiveChatTab;
