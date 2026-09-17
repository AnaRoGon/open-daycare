-- Migration 2: Enable RLS on daycares table
-- NOTE: This migration depends on the `users` table existing.
-- Apply AFTER the users table migration.

ALTER TABLE daycares ENABLE ROW LEVEL SECURITY;

-- Admin: full CRUD access to all daycares
CREATE POLICY "admin_full_access_daycares" ON daycares
  FOR ALL USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Staff: read-only access to their own daycare
CREATE POLICY "staff_read_daycares" ON daycares
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'staff'
    AND id = (SELECT daycare_id FROM users WHERE id = auth.uid())
  );

-- Parent: read-only access to their own daycare
CREATE POLICY "parent_read_daycares" ON daycares
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'parent'
    AND id = (SELECT daycare_id FROM users WHERE id = auth.uid())
  );
