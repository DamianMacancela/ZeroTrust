-- Tabla para registrar suscripciones de PayPal (idempotencia y auditoría)
CREATE TABLE IF NOT EXISTS public.paypal_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id TEXT NOT NULL UNIQUE,
    email TEXT,
    plan_id TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índice para búsquedas rápidas por subscription_id
CREATE INDEX IF NOT EXISTS idx_paypal_subscriptions_sub_id ON public.paypal_subscriptions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_paypal_subscriptions_email ON public.paypal_subscriptions(email);

-- RLS: solo el service role puede leer/escribir (nunca el cliente anónimo)
ALTER TABLE public.paypal_subscriptions ENABLE ROW LEVEL SECURITY;

-- Ningún acceso público — solo server-side via supabase-admin (service role key)
-- (No añadir policies públicas aquí es intencional)
