CREATE TABLE IF NOT EXISTS public.free_trials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_hash TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indices
CREATE INDEX IF NOT EXISTS free_trials_ip_hash_idx ON public.free_trials (ip_hash);

-- Seguridad (RLS)
ALTER TABLE public.free_trials ENABLE ROW LEVEL SECURITY;

-- Solo permitimos acceso al service_role (backend), cerramos acceso al cliente anonimo
CREATE POLICY "Service Role Full Access" ON public.free_trials
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
