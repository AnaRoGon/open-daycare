CREATE TABLE users (
  id                      uuid PRIMARY KEY,
  daycare_id              uuid REFERENCES daycares(id),
  role                    user_role NOT NULL,
  status                  user_status NOT NULL DEFAULT 'active',
  full_name               text NOT NULL,
  avatar_url              text,
  notify_on_post          boolean NOT NULL DEFAULT true,
  daily_summary_enabled   boolean NOT NULL DEFAULT true,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_all" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert_all" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update_all" ON users FOR UPDATE USING (true);
CREATE POLICY "users_delete_all" ON users FOR DELETE USING (true);
