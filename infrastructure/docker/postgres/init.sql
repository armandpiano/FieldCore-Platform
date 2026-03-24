-- ============================================
-- FieldCore Database Initialization
-- ============================================
-- This script runs on first container startup
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'supervisor', 'technician');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE work_order_status AS ENUM ('pending', 'assigned', 'in_progress', 'on_site', 'completed', 'cancelled', 'on_hold');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE work_order_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE work_order_type AS ENUM ('installation', 'repair', 'maintenance', 'inspection', 'emergency');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE evidence_type AS ENUM ('photo', 'signature', 'document', 'video');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE technician_status AS ENUM ('available', 'busy', 'offline', 'on_route');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE client_type AS ENUM ('company', 'individual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for common queries
-- These will be created after tables in subsequent migrations

-- Set default timezone
SET timezone = 'America/Mexico_City';

-- Log initialization completion
DO $$ BEGIN
    RAISE NOTICE 'FieldCore database initialization completed successfully';
END $$;
