
import { useState } from "react";
import { Interaction } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface InteractionFormProps {
  onSave: (interaction: Partial<Interaction>) => void;
  onCancel: () => void;
}

const InteractionForm = ({ onSave, onCancel }: InteractionFormProps) => {
  const [type, setType] = useState<string>("email");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!description.trim()) {
      newErrors.description = "A descrição é obrigatória";
    }
    
    if (!date) {
      newErrors.date = "A data é obrigatória";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSave({
      type: type as "email" | "ligacao" | "reuniao" | "whatsapp" | "outro",
      description,
      date: new Date(date).toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="type">Tipo de interação *</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="ligacao">Ligação</SelectItem>
              <SelectItem value="reuniao">Reunião</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="date">Data e hora *</Label>
          <Input
            id="date"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={errors.date ? "border-destructive" : ""}
          />
          {errors.date && (
            <p className="text-xs text-destructive">{errors.date}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="description">Descrição *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes da interação"
            rows={5}
            className={errors.description ? "border-destructive" : ""}
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description}</p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Registrar Interação
        </Button>
      </DialogFooter>
    </form>
  );
};

export default InteractionForm;
