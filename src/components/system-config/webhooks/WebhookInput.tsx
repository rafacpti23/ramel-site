
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

interface WebhookInputProps {
  id: string;
  label: string;
  description: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValid: boolean;
  showValidation: boolean;
}

const WebhookInput = ({ 
  id, 
  label, 
  description, 
  value, 
  onChange, 
  isValid, 
  showValidation 
}: WebhookInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          placeholder="https://exemplo.com/webhook"
          value={value}
          onChange={onChange}
          className={`pr-8 ${!isValid ? 'border-red-500' : ''}`}
        />
        {value && showValidation && (
          <div className="absolute right-2 top-2.5">
            {isValid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      {!isValid && showValidation && (
        <p className="text-xs text-red-500">URL inválido. Insira uma URL válida.</p>
      )}
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

export default WebhookInput;
