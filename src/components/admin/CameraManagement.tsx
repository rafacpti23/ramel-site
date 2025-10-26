import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Pencil, Trash2, Users } from "lucide-react";
import { UserProfile } from "@/context/AuthTypes";

interface Camera {
  id: string;
  name: string;
  rtsp_url: string;
  description: string | null;
  location: string | null;
  is_active: boolean;
}

const CameraManagement = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [selectedCameraForAssign, setSelectedCameraForAssign] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    rtsp_url: "",
    description: "",
    location: "",
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [camerasData, usersData] = await Promise.all([
        supabase.from("cameras").select("*").order("name"),
        supabase.from("profiles").select("*").order("full_name"),
      ]);

      if (camerasData.error) throw camerasData.error;
      if (usersData.error) throw usersData.error;

      setCameras(camerasData.data || []);
      setUsers(usersData.data as UserProfile[] || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as câmeras e usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedCamera) {
        const { error } = await supabase
          .from("cameras")
          .update(formData)
          .eq("id", selectedCamera.id);

        if (error) throw error;
        toast({ title: "Câmera atualizada com sucesso!" });
      } else {
        const { error } = await supabase
          .from("cameras")
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Câmera criada com sucesso!" });
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Erro ao salvar câmera:", error);
      toast({
        title: "Erro ao salvar câmera",
        description: "Não foi possível salvar a câmera.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta câmera?")) return;

    try {
      const { error } = await supabase
        .from("cameras")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Câmera excluída com sucesso!" });
      fetchData();
    } catch (error) {
      console.error("Erro ao excluir câmera:", error);
      toast({
        title: "Erro ao excluir câmera",
        description: "Não foi possível excluir a câmera.",
        variant: "destructive",
      });
    }
  };

  const handleAssignUsers = async () => {
    if (!selectedCameraForAssign || selectedUsers.length === 0) return;

    try {
      // Remove atribuições antigas
      await supabase
        .from("user_cameras")
        .delete()
        .eq("camera_id", selectedCameraForAssign);

      // Adiciona novas atribuições
      const assignments = selectedUsers.map(userId => ({
        user_id: userId,
        camera_id: selectedCameraForAssign,
      }));

      const { error } = await supabase
        .from("user_cameras")
        .insert(assignments);

      if (error) throw error;

      toast({ title: "Usuários atribuídos com sucesso!" });
      setAssignDialogOpen(false);
      setSelectedCameraForAssign(null);
      setSelectedUsers([]);
    } catch (error) {
      console.error("Erro ao atribuir usuários:", error);
      toast({
        title: "Erro ao atribuir usuários",
        description: "Não foi possível atribuir os usuários à câmera.",
        variant: "destructive",
      });
    }
  };

  const openAssignDialog = async (cameraId: string) => {
    setSelectedCameraForAssign(cameraId);
    
    try {
      const { data, error } = await supabase
        .from("user_cameras")
        .select("user_id")
        .eq("camera_id", cameraId);

      if (error) throw error;
      
      setSelectedUsers(data?.map(uc => uc.user_id) || []);
      setAssignDialogOpen(true);
    } catch (error) {
      console.error("Erro ao carregar atribuições:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      rtsp_url: "",
      description: "",
      location: "",
      is_active: true,
    });
    setSelectedCamera(null);
  };

  const openEditDialog = (camera: Camera) => {
    setSelectedCamera(camera);
    setFormData({
      name: camera.name,
      rtsp_url: camera.rtsp_url,
      description: camera.description || "",
      location: camera.location || "",
      is_active: camera.is_active,
    });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gerenciar Câmeras</CardTitle>
            <CardDescription>
              Adicione e gerencie câmeras de monitoramento e atribua aos usuários
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Câmera
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedCamera ? "Editar Câmera" : "Nova Câmera"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados da câmera de monitoramento
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rtsp_url">URL RTSP *</Label>
                  <Input
                    id="rtsp_url"
                    value={formData.rtsp_url}
                    onChange={(e) => setFormData({ ...formData, rtsp_url: e.target.value })}
                    placeholder="rtsp://usuario:senha@ip:porta/stream"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked as boolean })
                    }
                  />
                  <Label htmlFor="is_active">Câmera ativa</Label>
                </div>
                <DialogFooter>
                  <Button type="submit">Salvar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cameras.map((camera) => (
              <TableRow key={camera.id}>
                <TableCell className="font-medium">{camera.name}</TableCell>
                <TableCell>{camera.location || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      camera.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {camera.is_active ? "Ativa" : "Inativa"}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openAssignDialog(camera.id)}
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(camera)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(camera.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atribuir Usuários</DialogTitle>
              <DialogDescription>
                Selecione os usuários que terão acesso a esta câmera
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                      }
                    }}
                  />
                  <Label htmlFor={`user-${user.id}`} className="flex-1">
                    {user.full_name || user.email}
                  </Label>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={handleAssignUsers}>Salvar Atribuições</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CameraManagement;
