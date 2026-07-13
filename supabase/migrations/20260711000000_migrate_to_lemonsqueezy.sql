-- Rename Stripe columns to generic billing columns for Lemon Squeezy

ALTER TABLE public.users 
RENAME COLUMN stripe_customer_id TO billing_customer_id;

ALTER TABLE public.users 
RENAME COLUMN stripe_subscription_id TO billing_subscription_id;

-- Drop old stripe index
DROP INDEX IF EXISTS users_stripe_id_idx;

-- Create new billing index
CREATE INDEX IF NOT EXISTS users_billing_id_idx ON public.users (billing_customer_id);
