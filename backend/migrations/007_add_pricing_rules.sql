-- Add unit_type to properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS unit_type VARCHAR(50);
-- It can be '1rk', '1bhk', '2bhk', '3bhk', or NULL (for shops)

-- Add pricing_rules to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS pricing_rules JSONB DEFAULT '{}'::jsonb;

-- Add tracking fields to bookings so admin sees the dynamic rent requested
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS number_of_people INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS requested_rent NUMERIC(10, 2);
-- Example JSONB:
-- {
--   "flat": {
--     "1rk": { "1": 6000, "2": 7000 },
--     "1bhk": { "1": 8000, "2": 9000 }
--   }
-- }
