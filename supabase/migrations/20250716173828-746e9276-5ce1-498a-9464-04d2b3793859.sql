-- Atualizar URLs das imagens dos clientes com os arquivos baixados
UPDATE public.client_logos 
SET logo_url = '/client-logos/escola-paulo-freire.png'
WHERE name = 'Escola de Formação Paulo Freire - SME Rio';

UPDATE public.client_logos 
SET logo_url = '/client-logos/mcd-informatica.png'
WHERE name = 'MCD Informática Ltda';