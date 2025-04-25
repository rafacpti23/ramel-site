
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExtendedUserProfile } from "@/types/user";

interface UserEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: ExtendedUserProfile | null;
  editUserName: string;
  editUserEmail: string;
  editUserPaymentStatus: string;
  editUserWhatsapp: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPaymentStatusChange: (value: string) => void;
  onWhatsappChange: (value: string) => void;
  onSave: () => void;
}

const UserEditDialog = ({
  isOpen,
  onOpenChange,
  editingUser,
  editUserName,
  editUserEmail,
  editUserPaymentStatus,
  editUserWhatsapp,
  onNameChange,
  onEmailChange,
  onPaymentStatusChange,
  onWhatsappChange,
  onSave,
}: UserEditDialogProps) => {
  if (!editingUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Nome
            </Label>
            <Input
              id="edit-name"
              value={editUserName}
              onChange={(e) => onNameChange(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-email" className="text-right">
              Email
            </Label>
            <Input
              id="edit-email"
              value={editUserEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-whatsapp" className="text-right">
              WhatsApp
            </Label>
            <Input
              id="edit-whatsapp"
              value={editUserWhatsapp || ""}
              onChange={(e) => onWhatsappChange(e.target.value)}
              placeholder="Ex: 11999887766"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-status" className="text-right">
              Status
            </Label>
            <select
              id="edit-status"
              value={editUserPaymentStatus}
              onChange={(e) => onPaymentStatusChange(e.target.value)}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="pendente">Pendente</option>
              <option value="aprovado">Aprovado</option>
            </select>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="submit" onClick={onSave}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
