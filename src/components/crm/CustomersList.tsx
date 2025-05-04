
import { useState } from "react";
import { Customer } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomerForm from "./forms/CustomerForm";
import CustomerDetail from "./CustomerDetail";
import { CustomersTable } from "./components/CustomersTable";
import { SearchInput } from "./components/SearchInput";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog";
import { useCustomers } from "@/hooks/crm/useCustomers";

const CustomersList = () => {
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  const handleAddCustomer = () => {
    setCurrentCustomer(null);
    setIsEditing(false);
    setIsFormDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsEditing(true);
    setIsFormDialogOpen(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCustomer = async () => {
    if (!currentCustomer) return;
    
    const success = await deleteCustomer(currentCustomer.id);
    
    if (success) {
      setIsDeleteDialogOpen(false);
      setCurrentCustomer(null);
    }
  };

  const handleSaveCustomer = async (customer: Partial<Customer>) => {
    let success;
    
    if (isEditing && currentCustomer) {
      // Atualizar cliente existente
      success = await updateCustomer(currentCustomer.id, customer);
    } else {
      // Criar novo cliente
      success = await addCustomer(customer);
    }
    
    if (success) {
      setIsFormDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-ramel" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Clientes ({customers.length})</h2>
        <Button onClick={handleAddCustomer}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <SearchInput 
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Buscar clientes..."
      />

      <CustomersTable 
        customers={filteredCustomers}
        onView={handleViewCustomer}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
      />

      {/* Formulário de cliente (novo/editar) */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Cliente" : "Novo Cliente"}
            </DialogTitle>
          </DialogHeader>
          <CustomerForm
            customer={currentCustomer}
            onSave={handleSaveCustomer}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Detalhes do cliente */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {currentCustomer && (
            <CustomerDetail 
              customerId={currentCustomer.id}
              onEdit={() => {
                setIsDetailDialogOpen(false);
                handleEditCustomer(currentCustomer);
              }}
              onClose={() => setIsDetailDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteCustomer}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir o cliente"
        itemName={currentCustomer?.name}
      />
    </div>
  );
};

export default CustomersList;
