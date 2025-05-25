
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Info } from "lucide-react";

interface CalComTabProps {
  calApiKey: string;
  setCalApiKey: (value: string) => void;
}

const CalComTab = ({ calApiKey, setCalApiKey }: CalComTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Configuração Cal.com
          </CardTitle>
          <CardDescription>
            Configure a integração com Cal.com para agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cal-api-key">API Key do Cal.com</Label>
            <Input
              id="cal-api-key"
              placeholder="cal_live_xxxxxxxxxxxxxxxx"
              value={calApiKey}
              onChange={(e) => setCalApiKey(e.target.value)}
              type="password"
            />
            <p className="text-sm text-muted-foreground">
              Sua chave de API do Cal.com para integração de agendamentos
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  Como obter sua API Key do Cal.com:
                </p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Acesse sua conta no Cal.com</li>
                  <li>Vá em Settings → Developer</li>
                  <li>Clique em "Create New API Key"</li>
                  <li>Copie a chave gerada e cole aqui</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalComTab;
