-- ============================================================
-- 001_create_pwa_orders_table.sql
-- PWA Orders Table - Customer orders from PWA checkout flow
-- ============================================================
-- Simple schema without RLS for MVP testing phase
-- Handles: order creation, Stripe payment link, status tracking

CREATE TABLE IF NOT EXISTS public.pwa_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Customer Info
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_email TEXT,

    -- Order Details
    items TEXT NOT NULL,                           -- "Product 1 (x2), Product 2 (x1)"
    total_price NUMERIC(10,2) NOT NULL,
    notes TEXT,

    -- Order Status
    status TEXT NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'PAYMENT_SENT', 'PAID', 'ASSIGNED', 'IN_PICKUP', 'IN_DELIVERY', 'DELIVERED', 'CANCELLED')),

    -- Stripe Payment Integration
    stripe_payment_link TEXT,                      -- Payment link to send to customer
    stripe_session_id TEXT,                        -- Stripe checkout session ID
    stripe_payment_intent_id TEXT,                 -- Stripe payment intent (for subscriptions)
    payment_status TEXT NOT NULL DEFAULT 'PENDING'
        CHECK (payment_status IN ('PENDING', 'SENT', 'PAID', 'FAILED')),

    -- Rider Assignment
    assigned_rider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ,

    -- Delivery Tracking
    delivery_started_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    estimated_arrival TEXT,
    estimated_delivery_minutes INT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    payment_sent_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes for Performance ──
CREATE INDEX IF NOT EXISTS idx_pwa_orders_status
    ON public.pwa_orders(status);

CREATE INDEX IF NOT EXISTS idx_pwa_orders_payment_status
    ON public.pwa_orders(payment_status);

CREATE INDEX IF NOT EXISTS idx_pwa_orders_customer_phone
    ON public.pwa_orders(customer_phone);

CREATE INDEX IF NOT EXISTS idx_pwa_orders_created_at
    ON public.pwa_orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pwa_orders_assigned_rider
    ON public.pwa_orders(assigned_rider_id);

-- ── Auto-update updated_at ──
CREATE OR REPLACE FUNCTION update_pwa_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_pwa_orders_updated_at ON public.pwa_orders;
CREATE TRIGGER trg_pwa_orders_updated_at
    BEFORE UPDATE ON public.pwa_orders
    FOR EACH ROW EXECUTE FUNCTION update_pwa_orders_updated_at();

-- ── Enable Real-time Subscriptions ──
-- Important for order tracking page real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.pwa_orders;

-- ── NOTE: NO RLS enabled ──
-- pwa_orders table does NOT have RLS policies
-- This allows direct insert/select from PWA for MVP phase
-- TODO: Add RLS when moving to production
