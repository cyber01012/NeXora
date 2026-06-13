-- =============================================================
-- NexOra Seed Data  (src/main/resources/data.sql)
-- Spring Boot runs this after schema creation on every startup.
-- All INSERTs use ON CONFLICT DO NOTHING so they are safe to
-- re-run against an already-populated database.
-- =============================================================

-- ------------------------------------------------------------
-- 1. complaint_type  (1 = SOS, 2 = CIVIC)
-- ------------------------------------------------------------
INSERT INTO complaint_type (id, name) VALUES
    (1, 'SOS'),
    (2, 'CIVIC')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 2. complaint_nature  (linked to complaint_type)
--    MEDICAL(1) → SOS(1)
--    ELECTRICITY(7), GAS(8), ROAD(9), WATER(10) → CIVIC(2)
-- ------------------------------------------------------------
INSERT INTO complaint_nature (id, description, type_id) VALUES
    (1,  'MEDICAL',      1),
    (7,  'ELECTRICITY',  2),
    (8,  'GAS',          2),
    (9,  'ROAD',         2),
    (10, 'WATER',        2)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 3. user_type  (role lookup)
-- ------------------------------------------------------------
INSERT INTO user_type (id, name) VALUES
    (1, 'ADMIN'),
    (2, 'NGO'),
    (3, 'RESPONDER'),
    (4, 'HELP_DESK'),
    (5, 'ASSIGNING_OFFICER'),
    (6, 'VOLUNTEER'),
    (7, 'WORKER')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 4. responder_type  (department category codes)
-- ------------------------------------------------------------
INSERT INTO responder_type (id, name) VALUES
    ('P1', 'PDMA'),
    ('F2', 'Fire Brigade'),
    ('S3', 'Search & Rescue Team'),
    ('S4', 'SUI Gas'),
    ('K5', 'K-Electric'),
    ('K6', 'KMC (Sewerage)'),
    ('D7', 'Disaster Relief Unit'),
    ('P8', 'PDMA')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 5. department  (operational departments)
-- ------------------------------------------------------------
INSERT INTO department (dept_id, active, dept_address, dept_email, dept_name, entry_date, entry_person, entry_time, focal_person_name, focal_person_number, responder_type_category, responder_type_id) VALUES
    (1, true, '', '', 'PDMA Operations',                 CURRENT_DATE, '', CURRENT_TIME, '', '', 'GOV', 'P1'),
    (2, true, '', '', 'Fire & Rescue Wing',              CURRENT_DATE, '', CURRENT_TIME, '', '', 'GOV', 'F2'),
    (3, true, '', '', 'Search & Rescue Coordination',    CURRENT_DATE, '', CURRENT_TIME, '', '', 'NGO', 'S3'),
    (4, true, '', '', 'SUI Gas Operations',              CURRENT_DATE, '', CURRENT_TIME, '', '', 'GOV', 'S4'),
    (5, true, '', '', 'K-Electric Operations',           CURRENT_DATE, '', CURRENT_TIME, '', '', 'GOV', 'K5'),
    (6, true, '', '', 'KMC (Sewerage) Operations',       CURRENT_DATE, '', CURRENT_TIME, '', '', 'GOV', 'K6'),
    (7, true, '', '', 'Disaster Relief Unit Operations', CURRENT_DATE, '', CURRENT_TIME, '', '', 'GOV', 'D7'),
    (8, true, '', '', 'PDMA Operations',                 CURRENT_DATE, '', CURRENT_TIME, '', '', 'GOV', 'P8')
ON CONFLICT (dept_id) DO NOTHING;

-- ------------------------------------------------------------
-- 6. Backfill NULL user_type_id in volunteer_worker table
--    Workers created via raw SQL may be missing this FK.
--    VOLUNTEER = 6, WORKER = 7  (matches user_type seed above)
-- ------------------------------------------------------------
UPDATE volunteer_worker
    SET user_type_id = 6
WHERE user_type_id IS NULL
  AND username_created LIKE 'vol_%';

UPDATE volunteer_worker
    SET user_type_id = 7
WHERE user_type_id IS NULL;

-- ------------------------------------------------------------
-- 7. Backfill plain-text passwords in volunteer_worker
--    Replaces any non-BCrypt password with the hash for 'password123'
-- ------------------------------------------------------------
UPDATE volunteer_worker
    SET password = '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjQgG.Qd2u'
WHERE password NOT LIKE '$2a$%';
