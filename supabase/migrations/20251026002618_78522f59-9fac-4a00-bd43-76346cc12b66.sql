-- Corrigir função update_cameras_updated_at para incluir search_path
CREATE OR REPLACE FUNCTION public.update_cameras_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SET search_path = public;