-- ==============================================================================
-- MIGRACIÓN DE PRODUCCIÓN: OPTIMIZACIÓN DE ÍNDICES PARA WEBHOOKS DE STRIPE
-- ==============================================================================

-- 1. Índice único para evitar duplicados y búsquedas de O(n) al email
CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON public.users (email);

-- 2. Índice B-Tree para el ID de Stripe, crítico para el evento checkout.session.completed
CREATE INDEX IF NOT EXISTS users_stripe_id_idx ON public.users (stripe_customer_id);

-- 3. Forzamiento de conexiones seguras
ALTER SYSTEM SET ssl = 'on';
