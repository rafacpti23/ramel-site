
-- Criar tabela para armazenar logos dos clientes
CREATE TABLE public.client_logos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS (Row Level Security) - permitir leitura pública para mostrar na página inicial
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

-- Política para permitir que todos vejam os logos (página pública)
CREATE POLICY "Anyone can view client logos" 
  ON public.client_logos 
  FOR SELECT 
  TO public
  USING (true);

-- Política para permitir que apenas admins gerenciem os logos
CREATE POLICY "Only admins can manage client logos" 
  ON public.client_logos 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );
