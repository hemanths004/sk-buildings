-- Migration: Add map coordinates to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS map_lat NUMERIC(10, 8);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS map_lng NUMERIC(11, 8);
