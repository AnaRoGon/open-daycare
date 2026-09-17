INSERT INTO users (id, daycare_id, role, status, full_name, avatar_url, notify_on_post, daily_summary_enabled)
SELECT
  gen_random_uuid(),
  d.id,
  'staff',
  'active',
  'Ani',
  NULL,
  true,
  true
FROM daycares d
WHERE d.name = 'Guardería Sala Soles'
LIMIT 1;
