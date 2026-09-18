-- Remove duplicate rooms for "Guardería Sala Soles", keeping the earliest created for each name
DELETE FROM rooms
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY daycare_id, name ORDER BY created_at) as rn
    FROM rooms
    WHERE daycare_id = (SELECT id FROM daycares WHERE name = 'Guardería Sala Soles')
  ) sub
  WHERE rn > 1
);
