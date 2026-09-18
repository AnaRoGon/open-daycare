CREATE TABLE children (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id         uuid NOT NULL REFERENCES rooms(id),
  full_name       text NOT NULL,
  birth_date      date NOT NULL,
  enrolled_at     date NOT NULL,
  medical_notes   text,
  allergy_tags    text[],
  photo_consent   boolean NOT NULL DEFAULT true,
  status          child_status NOT NULL DEFAULT 'active',
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- Staff: full CRUD on children in their own daycare's rooms
CREATE POLICY "staff_manage_children" ON children
  FOR ALL USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'staff'
    AND room_id IN (SELECT id FROM rooms WHERE daycare_id = (SELECT daycare_id FROM users WHERE id = auth.uid()))
  );

-- Parent: read-only on children in their own daycare's rooms
CREATE POLICY "parent_read_children" ON children
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'parent'
    AND room_id IN (SELECT id FROM rooms WHERE daycare_id = (SELECT daycare_id FROM users WHERE id = auth.uid()))
  );
