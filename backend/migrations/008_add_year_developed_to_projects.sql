-- Migration: Add year_developed to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS year_developed VARCHAR(4);
