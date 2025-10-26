-- Criar tabela de câmeras
CREATE TABLE public.cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rtsp_url TEXT NOT NULL,
  description TEXT,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de relacionamento usuário-câmeras
CREATE TABLE public.user_cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  camera_id UUID NOT NULL REFERENCES public.cameras(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, camera_id)
);

-- Habilitar RLS
ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cameras ENABLE ROW LEVEL SECURITY;

-- Políticas para cameras
CREATE POLICY "Admins podem ver todas as câmeras"
  ON public.cameras FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "Admins podem gerenciar câmeras"
  ON public.cameras FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "Usuários podem ver suas câmeras atribuídas"
  ON public.cameras FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_cameras
    WHERE user_cameras.camera_id = cameras.id 
    AND user_cameras.user_id = auth.uid()
  ));

-- Políticas para user_cameras
CREATE POLICY "Admins podem gerenciar atribuições"
  ON public.user_cameras FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "Usuários podem ver suas próprias atribuições"
  ON public.user_cameras FOR SELECT
  USING (user_id = auth.uid());

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_cameras_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cameras_updated_at
  BEFORE UPDATE ON public.cameras
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cameras_updated_at();