CREATE TABLE daycares (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Seed data
INSERT INTO daycares (id, name) VALUES
  (gen_random_uuid(), 'Guardería Sala Soles'),
  (gen_random_uuid(), 'Guardería Arcoíris'),
  (gen_random_uuid(), 'Guardería Estrellitas'),
  (gen_random_uuid(), 'Guardería Semillitas');
