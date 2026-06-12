-- 002_update_schema.sql
-- Run this in Supabase SQL Editor to apply updates for Admin Dashboard enhancements

-- 1. Add fields to Projects Table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 2. Add fields to Properties Table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 3. Drop existing CHECK constraints on Properties (requires knowing the constraint name)
-- We will add new check constraints. Note: Supabase automatically generates constraint names if not specified.
-- To be safe, we'll try to drop the known check constraints or use a safe alteration if possible.
-- Since this is a direct SQL script, we will alter the constraints.

DO $$
DECLARE 
    type_constraint_name text;
    status_constraint_name text;
BEGIN
    -- Find and drop the check constraint for "type"
    SELECT conname INTO type_constraint_name 
    FROM pg_constraint 
    WHERE conrelid = 'properties'::regclass AND pg_get_constraintdef(oid) ILIKE '%type%';
    
    IF type_constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE properties DROP CONSTRAINT ' || type_constraint_name;
    END IF;

    -- Find and drop the check constraint for "status"
    SELECT conname INTO status_constraint_name 
    FROM pg_constraint 
    WHERE conrelid = 'properties'::regclass AND pg_get_constraintdef(oid) ILIKE '%status%';
    
    IF status_constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE properties DROP CONSTRAINT ' || status_constraint_name;
    END IF;
END $$;

-- 4. Add the new constraints with expanded values
ALTER TABLE properties ADD CONSTRAINT properties_type_check CHECK (type IN ('flat', 'shop', 'office'));
ALTER TABLE properties ADD CONSTRAINT properties_status_check CHECK (status IN ('available', 'booked', 'sold', 'rented'));
-- Add advance column to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS advance numeric DEFAULT 0;

-- Add tenant tracking fields to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS tenant_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS tenant_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS advance_paid_date DATE,
ADD COLUMN IF NOT EXISTS advance_paid NUMERIC(12, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS rent_paid NUMERIC(12, 2) DEFAULT 0;
