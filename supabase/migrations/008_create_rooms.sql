CREATE TABLE rooms (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daycare_id uuid NOT NULL REFERENCES daycares(id),
  name       text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Staff: full CRUD on rooms of their own daycare
CREATE POLICY "staff_manage_rooms" ON rooms
  FOR ALL USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'staff'
    AND daycare_id = (SELECT daycare_id FROM users WHERE id = auth.uid())
  );

-- Parent: read-only on rooms of their own daycare
CREATE POLICY "parent_read_rooms" ON rooms
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'parent'
    AND daycare_id = (SELECT daycare_id FROM users WHERE id = auth.uid())
  );

-- Seed: 3 rooms for "Guardería Sala Soles"
INSERT INTO rooms (daycare_id, name)
SELECT d.id, r.name
FROM daycares d, (VALUES
  ('Soles'),
  ('Hojas Verdes'),
  ('Arcoiris')
) AS r(name)
WHERE d.name = 'Guardería Sala Soles';
