
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ClientLogo {
  id: string;
  name: string;
  logo_url: string;
  created_at: string;
}

const ClientLogosManagement = () => {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', logo_url: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao carregar logos dos clientes:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar os logos dos clientes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.logo_url) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome e URL do logo são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('client_logos')
        .insert([newClient]);

      if (error) throw error;

      toast({
        title: 'Cliente adicionado',
        description: 'Logo do cliente foi adicionado com sucesso.',
      });

      setNewClient({ name: '', logo_url: '' });
      setIsDialogOpen(false);
      fetchClients();
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      toast({
        title: 'Erro ao adicionar cliente',
        description: 'Não foi possível adicionar o logo do cliente.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('client_logos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Cliente removido',
        description: 'Logo do cliente foi removido com sucesso.',
      });

      fetchClients();
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      toast({
        title: 'Erro ao remover cliente',
        description: 'Não foi possível remover o logo do cliente.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-ramel border-opacity-50 border-t-ramel rounded-full"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Logos dos Clientes</CardTitle>
            <CardDescription>
              Gerencie os logos dos clientes exibidos no carrossel da página inicial
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Logo do Cliente</DialogTitle>
                <DialogDescription>
                  Adicione um novo logo de cliente para exibir no carrossel
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Cliente</Label>
                  <Input
                    id="name"
                    placeholder="Nome da empresa"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="logo_url">URL do Logo</Label>
                  <Input
                    id="logo_url"
                    placeholder="https://exemplo.com/logo.png"
                    value={newClient.logo_url}
                    onChange={(e) => setNewClient({ ...newClient, logo_url: e.target.value })}
                  />
                </div>
                {newClient.logo_url && (
                  <div className="mt-4">
                    <Label>Preview</Label>
                    <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                      <img
                        src={newClient.logo_url}
                        alt="Preview"
                        className="max-w-32 max-h-16 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddClient} disabled={saving}>
                  {saving ? 'Salvando...' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            Nenhum logo de cliente cadastrado.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <img
                      src={client.logo_url}
                      alt={client.name}
                      className="w-16 h-10 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>
                    {new Date(client.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientLogosManagement;
