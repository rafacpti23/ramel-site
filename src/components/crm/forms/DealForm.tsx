
import { useState, useEffect } from "react";
import { Deal } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface DealFormProps {
  deal?: Deal;
  onSave: (deal: Partial<Deal>) => void;
  onCancel: () => void;
}

const DealForm = ({ deal, onSave, onCancel }: DealFormProps) => {
  const [title, setTitle] = useState(deal?.title || "");
  const [value, setValue] = useState(deal?.value?.toString() || "");
  const [status, setStatus] = useState<string>(deal?.status || "prospeccao");
  const [expectedCloseDate, setExpectedCloseDate] = useState(deal?.expected_close_date || "");
  const [notes, setNotes] = useState(deal?.notes || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (deal) {
      setTitle(deal.title);
      setValue(deal.value.toString());
      setStatus(deal.status);
      setExpectedCloseDate(deal.expected_close_date || "");
      setNotes(deal.notes || "");
    }
  }, [deal]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = "O título é obrigatório";
    }
    
    if (!value.trim()) {
      newErrors.value = "O valor é obrigatório";
    } else if (isNaN(Number(value)) || Number(value) < 0) {
      newErrors.value = "Valor inválido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSave({
      title,
      value: Number(value),
      status: status as "prospeccao" | "qualificado" | "proposta" | "negociacao" | "fechado_ganho" | "fechado_perdido",
      expected_close_date: expectedCloseDate || undefined,
      notes: notes || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do negócio"
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="value">Valor (R$) *</Label>
          <Input
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0,00"
            type="number"
            step="0.01"
            min="0"
            className={errors.value ? "border-destructive" : ""}
          />
          {errors.value && (
            <p className="text-xs text-destructive">{errors.value}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prospeccao">Prospecção</SelectItem>
              <SelectItem value="qualificado">Qualificado</SelectItem>
              <SelectItem value="proposta">Proposta</SelectItem>
              <SelectItem value="negociacao">Negociação</SelectItem>
              <SelectItem value="fechado_ganho">Fechado (Ganho)</SelectItem>
              <SelectItem value="fechado_perdido">Fechado (Perdido)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="expected_close_date">Data esperada de fechamento</Label>
          <Input
            id="expected_close_date"
            type="date"
            value={expectedCloseDate}
            onChange={(e) => setExpectedCloseDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações sobre o negócio"
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {deal ? "Atualizar" : "Adicionar"} Negócio
        </Button>
      </DialogFooter>
    </form>
  );
};

export default DealForm;
