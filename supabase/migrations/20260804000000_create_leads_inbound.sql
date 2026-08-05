-- Creación de la tabla Inbound Leads para LOPDP
CREATE TABLE IF NOT EXISTS public.leads_inbound (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    consent_given BOOLEAN NOT NULL DEFAULT false,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configuración de Row Level Security (RLS)
ALTER TABLE public.leads_inbound ENABLE ROW LEVEL SECURITY;

-- Política: Solo permitir INSERT. No permitir SELECT al público para proteger los emails recolectados (Art 56 LOPDP)
CREATE POLICY "Allow public inserts" ON public.leads_inbound
    FOR INSERT
    WITH CHECK (true);

-- Solo usuarios autenticados (admin) podrían leer, o se gestiona desde el panel de Supabase
CREATE POLICY "Allow authenticated read" ON public.leads_inbound
    FOR SELECT
    USING (auth.role() = 'authenticated');
