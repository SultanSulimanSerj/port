-- Enable Row Level Security on key tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Create policies for companies table
CREATE POLICY company_isolation ON companies
  USING (id = current_setting('app.company_id', true)::uuid);

-- Create policies for memberships table  
CREATE POLICY membership_isolation ON memberships
  USING (company_id = current_setting('app.company_id', true)::uuid);

-- Users table doesn't need RLS as it's cross-tenant
-- But we'll add a policy to restrict access to users in the same company
CREATE POLICY user_company_access ON users
  USING (
    id IN (
      SELECT user_id FROM memberships 
      WHERE company_id = current_setting('app.company_id', true)::uuid
    )
  );

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON companies TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON memberships TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO PUBLIC;