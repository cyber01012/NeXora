-- ============================================
-- REALISTIC SOS FLOW - ANONYMOUS USER
-- All timestamps realistic, all fields filled
-- FIXED: removed created_at from anonymous_report (not in schema)
-- ============================================

-- 1. DEPARTMENT (if not exists)
INSERT INTO department (dept_id, dept_name, responder_type_category, dept_address, active) 
VALUES (1, 'K-Electric', 'GOV', 'Korangi Industrial Area, Karachi', true)
ON CONFLICT DO NOTHING;

-- 2. ADMIN_USER - HelpDesk (if not exists)
INSERT INTO admin_user (username, name, user_type_id, contact_number, active, password, category, dept_id) 
VALUES ('helpdesk_1', 'Help Desk User', 4, '0300-2222222', true, 'password123', 'GOV', 1)
ON CONFLICT DO NOTHING;

-- 3. ADMIN_USER - Assigning Officer (if not exists)
INSERT INTO admin_user (username, name, user_type_id, contact_number, active, password, category, dept_id) 
VALUES ('assigning_officer_1', 'Assigning Officer', 4, '0300-3333333', true, 'password123', 'GOV', 1)
ON CONFLICT DO NOTHING;

-- 4. ADMIN_USER - Responder (if not exists)
INSERT INTO admin_user (username, name, user_type_id, contact_number, active, password, category, dept_id) 
VALUES ('kelectric_fp', 'Ahmed Raza', 3, '0300-1111111', true, 'password123', 'GOV', 1)
ON CONFLICT DO NOTHING;

-- 5. VOLUNTEER (if not exists)
INSERT INTO volunteer_worker (username_created, name, password, active, phone_number, dept_id, created_date, created_time) 
VALUES ('volunteer_ali', 'Ali Volunteer', 'volunteer123', true, '0310-1111111', 1, '2026-06-01', '09:00:00')
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 1: ANONYMOUS USER CLICKS SOS BUTTON
-- Time: 2026-06-06 08:15:00 (morning emergency)
-- Auto-detected: GPS location, phone number
-- ============================================
INSERT INTO anonymous_report (
    anonymous_id,
    name,
    phone_num,
    province,
    district,
    town,
    area,
    city,
    type_id,
    nature_id,
    evidence,
    detail
) VALUES (
    1,
    'Anonymous Citizen',        -- Default name (user didn't enter name)
    '0300-9999999',             -- Auto-detected from device
    'Sindh',
    'Karachi',
    'Korangi',
    'Korangi Industrial Area, Sector 15',
    'Karachi',
    1,                          -- SOS type
    7,                          -- Electricity emergency
    NULL,                       -- No evidence uploaded by anonymous user
    'EMERGENCY: Major power outage. Transformer on fire. People trapped in buildings. Need immediate help.'
)
ON CONFLICT (anonymous_id) DO UPDATE SET
    phone_num = EXCLUDED.phone_num,
    detail = EXCLUDED.detail;

-- ============================================
-- STEP 2: HELPDESK REVIEWS AND CREATES SOS REPORT
-- Time: 2026-06-06 08:22:00 (7 minutes after SOS)
-- ============================================
INSERT INTO sos_report (
    sos_id,
    helpdesk_username,
    name,
    province,
    district,
    town,
    area,
    city,
    type_id,
    nature_id,
    detail,
    phone_auto_detect,
    status
) VALUES (
    1,
    'helpdesk_1',               -- HelpDesk user who processed
    'Anonymous Reporter',       -- From anonymous report
    'Sindh',
    'Karachi',
    'Korangi',
    'Korangi Industrial Area, Sector 15, Near Factory Road',
    'Karachi',
    1,                          -- SOS type
    7,                          -- Electricity emergency
    'CRITICAL EMERGENCY REPORT: Industrial transformer fire reported at Korangi Sector 15, Factory Road. Fire has spread to adjacent building. 50+ workers evacuated. Power lines down across 3 blocks. Fire brigade dispatched at 08:18. K-Electric emergency response required for: (1) Power isolation to prevent electrocution, (2) Emergency lighting for rescue operations, (3) Temporary power for firefighting equipment. Estimated 5000+ households affected. Priority: CRITICAL.',
    '0300-9999999',             -- Auto-detected phone from anonymous
    'PENDING'                   -- Waiting for assigning officer
)
ON CONFLICT (sos_id) DO UPDATE SET
    helpdesk_username = EXCLUDED.helpdesk_username,
    detail = EXCLUDED.detail,
    status = 'PENDING';

-- ============================================
-- STEP 3: ASSIGNING OFFICER FORWARDS TO RESPONDER
-- Time: 2026-06-06 08:25:00 (3 minutes after HelpDesk)
-- Status: PENDING (responder hasn't accepted yet)
-- ============================================
INSERT INTO forwarded_complaint (
    forwarded_complain_id,
    assigning_officer_id,
    dept_username,
    citizen_id,
    report_id,
    sos_id,
    anonymous_id,
    dept_id,
    submit_status,
    submit_date,
    submit_time,
    read_by_dept,
    read_by_dept_date,
    read_by_dept_time,
    assigned_to_worker,
    assigned_worker_date,
    assigned_worker_time,
    worker_username,
    dept_decision,
    read_by_worker,
    read_worker_date,
    read_worker_time,
    accepted_by_worker,
    accepted_date,
    accepted_time,
    worker_decision,
    remarks
) VALUES (
    301,
    'assigning_officer_1',    -- Assigning Officer who forwarded
    NULL,                       -- dept_username NULL (responder will accept)
    NULL,                       -- citizen_id NULL (SOS has no citizen)
    NULL,                       -- report_id NULL (this is SOS)
    1,                          -- sos_id = 1
    1,                          -- anonymous_id = 1
    1,                          -- dept_id = 1 (K-Electric)
    true,                       -- submit_status = true
    '2026-06-06',               -- submit_date
    '08:25:00',                 -- submit_time
    false,                      -- read_by_dept = false (responder hasn't seen)
    NULL,                       -- read_by_dept_date
    NULL,                       -- read_by_dept_time
    false,                      -- assigned_to_worker = false
    NULL,                       -- assigned_worker_date
    NULL,                       -- assigned_worker_time
    NULL,                       -- worker_username
    NULL,                       -- dept_decision = NULL (PENDING)
    NULL,                       -- read_by_worker
    NULL,                       -- read_worker_date
    NULL,                       -- read_worker_time
    NULL,                       -- accepted_by_worker
    NULL,                       -- accepted_date
    NULL,                       -- accepted_time
    NULL,                       -- worker_decision = NULL (PENDING)
    NULL                        -- remarks = NULL
)
ON CONFLICT (forwarded_complain_id) DO UPDATE SET
    assigning_officer_id = EXCLUDED.assigning_officer_id,
    sos_id = EXCLUDED.sos_id,
    anonymous_id = EXCLUDED.anonymous_id,
    dept_id = EXCLUDED.dept_id,
    submit_status = true,
    submit_date = EXCLUDED.submit_date,
    submit_time = EXCLUDED.submit_time,
    read_by_dept = false,
    read_by_dept_date = NULL,
    read_by_dept_time = NULL,
    assigned_to_worker = false,
    assigned_worker_date = NULL,
    assigned_worker_time = NULL,
    worker_username = NULL,
    dept_decision = NULL,
    read_by_worker = NULL,
    read_worker_date = NULL,
    read_worker_time = NULL,
    accepted_by_worker = NULL,
    accepted_date = NULL,
    accepted_time = NULL,
    worker_decision = NULL,
    remarks = NULL;

-- ============================================
-- STEP 4: RESPONDER ACCEPTS TASK (YOU WILL DO THIS IN UI)
-- Time: 2026-06-06 08:32:00 (7 minutes after receiving)
-- Run this AFTER clicking "Accept" in Responder UI:
-- ============================================

-- UPDATE forwarded_complaint SET
--     dept_username = 'kelectric_fp',
--     read_by_dept = true,
--     read_by_dept_date = '2026-06-06',
--     read_by_dept_time = '08:32:00',
--     dept_decision = 'D',
--     remarks = 'Emergency acknowledged. Team mobilizing. ETA 15 minutes.'
-- WHERE forwarded_complain_id = 301;

-- UPDATE sos_report SET status = 'ACCEPTED' WHERE sos_id = 1;

-- ============================================
-- STEP 5: RESPONDER ASSIGNS TO VOLUNTEER (YOU WILL DO THIS IN UI)
-- Time: 2026-06-06 08:35:00 (3 minutes after accepting)
-- Run this AFTER assigning volunteer in Responder UI:
-- ============================================

-- UPDATE forwarded_complaint SET
--     assigned_to_worker = true,
--     assigned_worker_date = '2026-06-06',
--     assigned_worker_time = '08:35:00',
--     worker_username = 'volunteer_ali',
--     remarks = 'Assigned to volunteer Ali. Emergency team dispatched with equipment.'
-- WHERE forwarded_complain_id = 301;

-- ============================================
-- STEP 6: VOLUNTEER COMPLETES TASK (VOLUNTEER PORTAL)
-- Time: 2026-06-06 10:45:00 (2+ hours of work)
-- Volunteer uploads evidence via their portal
-- ============================================

-- INSERT INTO forward_decision (
--     id,
--     forwarded_complain_id,
--     decision_type,
--     evidence,
--     description,
--     date,
--     time
-- ) VALUES (
--     3,
--     301,
--     'D',
--     'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400',
--     'Emergency response completed: Fire extinguished at 09:30. Damaged transformer replaced with 1000KVA emergency unit. All power lines inspected and secured. Emergency lighting installed for rescue operations. 5000+ households power restored at 10:30. Safety clearance obtained from fire department. Area declared safe.',
--     '2026-06-06',
--     '10:45:00'
-- );

-- UPDATE forwarded_complaint SET
--     read_by_worker = true,
--     read_worker_date = '2026-06-06',
--     read_worker_time = '08:45:00',
--     accepted_by_worker = true,
--     accepted_date = '2026-06-06',
--     accepted_time = '10:45:00',
--     remarks = 'Volunteer Ali completed emergency response. Evidence submitted for review.'
-- WHERE forwarded_complain_id = 301;

-- ============================================
-- STEP 7: RESPONDER CONFIRMS COMPLETION (YOU WILL DO THIS IN UI)
-- Time: 2026-06-06 11:00:00 (15 minutes after review)
-- Run this AFTER clicking "Confirm Completion" in Responder UI:
-- ============================================

-- UPDATE forwarded_complaint SET
--     worker_decision = 'D',
--     remarks = 'SOS Emergency fully resolved. Transformer replaced, power restored, fire contained. All safety protocols verified. 5000+ households back online. Incident closed by responder Ahmed Raza at 11:00.'
-- WHERE forwarded_complain_id = 301;

-- UPDATE sos_report SET status = 'COMPLETED' WHERE sos_id = 1;

-- ============================================
-- VERIFICATION QUERIES - Run after each step
-- ============================================

-- Check anonymous report (after Step 1):
-- SELECT anonymous_id, name, phone_num, province, district, town, area, city, detail
-- FROM anonymous_report WHERE anonymous_id = 1;

-- Check SOS report (after Step 2):
-- SELECT sos_id, helpdesk_username, name, detail, phone_auto_detect, status
-- FROM sos_report WHERE sos_id = 1;

-- Check forwarded_complaint initial state (after Step 3):
-- SELECT 
--     forwarded_complain_id,
--     assigning_officer_id,
--     dept_username,
--     sos_id,
--     anonymous_id,
--     dept_id,
--     submit_date,
--     submit_time,
--     read_by_dept,
--     dept_decision,
--     assigned_to_worker,
--     worker_username,
--     accepted_by_worker,
--     worker_decision,
--     remarks
-- FROM forwarded_complaint WHERE forwarded_complain_id = 301;

-- Check complete flow status:
-- SELECT 
--     ar.anonymous_id,
--     ar.phone_num AS anonymous_phone,
--     ar.area AS anonymous_location,
--     sr.sos_id,
--     sr.detail AS sos_detail,
--     sr.status AS sos_status,
--     fc.forwarded_complain_id,
--     fc.dept_username AS responder,
--     fc.dept_decision,
--     fc.assigned_to_worker,
--     fc.worker_username,
--     fc.accepted_by_worker AS volunteer_completed,
--     fc.worker_decision AS responder_confirmed,
--     CASE 
--         WHEN fc.worker_decision = 'D' THEN 'COMPLETED'
--         WHEN fc.accepted_by_worker = true AND fc.worker_decision IS NULL THEN 'AWAITING_REVIEW'
--         WHEN fc.assigned_to_worker = true THEN 'WITH_VOLUNTEER'
--         WHEN fc.dept_decision = 'D' THEN 'ACCEPTED'
--         WHEN fc.dept_decision = 'R' THEN 'REJECTED'
--         WHEN fc.read_by_dept = true THEN 'READ'
--         ELSE 'PENDING'
--     END AS current_status
-- FROM anonymous_report ar
-- LEFT JOIN sos_report sr ON sr.sos_id = 1
-- LEFT JOIN forwarded_complaint fc ON fc.sos_id = sr.sos_id
-- WHERE ar.anonymous_id = 1;
