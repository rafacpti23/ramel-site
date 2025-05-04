
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  type?: "customer" | "deal" | "interaction";
}

export const StatusBadge = ({ status, type = "customer" }: StatusBadgeProps) => {
  if (type === "customer") {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-500">Ativo</Badge>;
      case "inativo":
        return <Badge variant="outline">Inativo</Badge>;
      case "potencial":
        return <Badge className="bg-blue-500">Potencial</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  } else if (type === "deal") {
    switch (status) {
      case "prospeccao":
        return <Badge className="bg-purple-500">Prospecção</Badge>;
      case "qualificado":
        return <Badge className="bg-blue-500">Qualificado</Badge>;
      case "proposta":
        return <Badge className="bg-yellow-500">Proposta</Badge>;
      case "negociacao":
        return <Badge className="bg-orange-500">Negociação</Badge>;
      case "fechado_ganho":
        return <Badge className="bg-green-500">Fechado (Ganho)</Badge>;
      case "fechado_perdido":
        return <Badge className="bg-destructive">Fechado (Perdido)</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  } else if (type === "interaction") {
    switch (status) {
      case "email":
        return <Badge className="bg-blue-500">Email</Badge>;
      case "ligacao":
        return <Badge className="bg-green-500">Ligação</Badge>;
      case "reuniao":
        return <Badge className="bg-purple-500">Reunião</Badge>;
      case "whatsapp":
        return <Badge className="bg-green-600">WhatsApp</Badge>;
      default:
        return <Badge variant="secondary">Outro</Badge>;
    }
  }

  return <Badge variant="secondary">{status}</Badge>;
};
