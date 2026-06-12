-- Add tenant document URLs to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS tenant_aadhar_file VARCHAR(512),
ADD COLUMN IF NOT EXISTS tenant_agreement_file VARCHAR(512);
