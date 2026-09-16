CREATE TABLE daycares (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  address    text,
  city       text,
  state      text,
  country    text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed data
INSERT INTO daycares (id, name, address, city, state, country) VALUES
  (gen_random_uuid(), 'Guardería Sala Soles', 'Av. Principal #123, Col. Centro', 'Ciudad de México', 'CDMX', 'MX'),
  (gen_random_uuid(), 'Guardería Arcoíris', 'Calle Luna #45, Col. Norte', 'Guadalajara', 'Jalisco', 'MX'),
  (gen_random_uuid(), 'Guardería Estrellitas', 'Blvd. de los Niños #789', 'Monterrey', 'Nuevo León', 'MX'),
  (gen_random_uuid(), 'Guardería Semillitas', 'Calle del Sol #32, Col. Sur', 'Puebla', 'Puebla', 'MX');
