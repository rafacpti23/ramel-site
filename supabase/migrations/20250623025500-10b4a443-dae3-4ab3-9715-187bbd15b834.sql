
-- Adicionar a coluna cal_api_key na tabela system_config
ALTER TABLE public.system_config 
ADD COLUMN cal_api_key text;
