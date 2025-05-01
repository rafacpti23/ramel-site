
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCheck, Edit, UserCheck, X, Trash2 } from "lucide-react";
import { ExtendedUserProfile } from "@/types/user";

interface UsersTableProps {
  users: ExtendedUserProfile[];
  onEdit: (user: ExtendedUserProfile) => void;
  onApprovePayment: (userId: string) => void;
  onToggleAdmin: (userId: string, currentStatus: boolean) => void;
  onDelete: (userId: string) => void;
}

const UsersTable = ({
  users,
  onEdit,
  onApprovePayment,
  onToggleAdmin,
  onDelete,
}: UsersTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4">Nome</th>
            <th className="text-left py-3 px-4">Email</th>
            <th className="text-left py-3 px-4">Data de Cadastro</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Admin</th>
            <th className="text-right py-3 px-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-3 px-4">{user.full_name || "Sem nome"}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded text-xs ${
                  user.payment_status === 'aprovado' 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {user.payment_status === 'aprovado' ? 'Aprovado' : 'Pendente'}
                </span>
              </td>
              <td className="py-3 px-4">
                {user.is_admin ? 'Sim' : 'Não'}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex gap-2 justify-end">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEdit(user)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  
                  {user.payment_status !== 'aprovado' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onApprovePayment(user.id)}
                    >
                      <CheckCheck className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant={user.is_admin ? "destructive" : "outline"}
                    onClick={() => onToggleAdmin(user.id, user.is_admin)}
                  >
                    {user.is_admin ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Remover Admin
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-1" />
                        Tornar Admin
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => onDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
