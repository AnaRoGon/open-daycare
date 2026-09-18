-- Fix: seed remaining 2 rooms for "Guardería Sala Soles"
-- Original migration 008 had LIMIT 1 which only inserted 1 room
INSERT INTO rooms (daycare_id, name)
SELECT d.id, r.name
FROM daycares d, (VALUES ('Hojas Verdes'), ('Arcoiris')) AS r(name)
WHERE d.name = 'Guardería Sala Soles'
AND NOT EXISTS (SELECT 1 FROM rooms r2 WHERE r2.name = r.name);
