
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserManagement } from "@/hooks/useUserManagement";
import UsersTable from "./users/UsersTable";
import UserEditDialog from "./users/UserEditDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const UserManagement = () => {
  const {
    users,
    loading,
    totalUsers,
    searchTerm,
    setSearchTerm,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingUser,
    editUserName,
    editUserEmail,
    editUserPaymentStatus,
    editUserWhatsapp,
    setEditUserName,
    setEditUserEmail,
    setEditUserPaymentStatus,
    setEditUserWhatsapp,
    fetchUsers,
    approvePayment,
    toggleAdminStatus,
    openEditUserDialog,
    handleSaveUserEdit,
    deleteUser,
  } = useUserManagement();

  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleDeleteUser = async () => {
    if (userToDelete) {
      const success = await deleteUser(userToDelete);
      if (success) {
        setUserToDelete(null);
      }
    }
  };

  const confirmDeleteUser = (userId: string) => {
    setUserToDelete(userId);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Gerenciar Usuários</CardTitle>
        <CardDescription>
          Aprovar pagamentos e gerenciar permissões ({users.length} de {totalUsers} usuários carregados)
        </CardDescription>
        <div className="mt-4 flex gap-4">
          <div className="flex-1">
            <Input 
              placeholder="Buscar por nome ou email" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={fetchUsers}
            disabled={loading}
          >
            Atualizar Lista
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Carregando usuários...
          </div>
        ) : users.length > 0 ? (
          <UsersTable
            users={users}
            onEdit={openEditUserDialog}
            onApprovePayment={approvePayment}
            onToggleAdmin={toggleAdminStatus}
            onDelete={confirmDeleteUser}
          />
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Nenhum usuário encontrado
          </div>
        )}
      </CardContent>

      <UserEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingUser={editingUser}
        editUserName={editUserName}
        editUserEmail={editUserEmail}
        editUserPaymentStatus={editUserPaymentStatus}
        editUserWhatsapp={editUserWhatsapp}
        onNameChange={setEditUserName}
        onEmailChange={setEditUserEmail}
        onPaymentStatusChange={setEditUserPaymentStatus}
        onWhatsappChange={setEditUserWhatsapp}
        onSave={handleSaveUserEdit}
      />

      <AlertDialog 
        open={!!userToDelete} 
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
              Todos os dados associados a este usuário também serão excluídos, incluindo tickets de suporte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default UserManagement;
