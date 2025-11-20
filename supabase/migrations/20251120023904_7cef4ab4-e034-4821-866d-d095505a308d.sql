-- Add status and versioning fields to plans table
ALTER TABLE plans 
ADD COLUMN status TEXT NOT NULL DEFAULT 'active',
ADD COLUMN version_number INTEGER NOT NULL DEFAULT 1,
ADD COLUMN parent_plan_id UUID REFERENCES plans(id);

-- Add index for better query performance
CREATE INDEX idx_plans_status ON plans(status);
CREATE INDEX idx_plans_parent_plan_id ON plans(parent_plan_id);

-- Add comment to describe status values
COMMENT ON COLUMN plans.status IS 'Plan status: active, versioned';
COMMENT ON COLUMN plans.version_number IS 'Version number of the plan, incremented with each new version';
COMMENT ON COLUMN plans.parent_plan_id IS 'Reference to the previous version of the plan';