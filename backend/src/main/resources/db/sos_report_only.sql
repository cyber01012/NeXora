-- ============================================
-- SOS FLOW - ANONYMOUS USER
-- Username: assigning_officer (not assigning_officer_1)
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
-- NOTE: Using 'assigning_officer' as username (not 'assigning_officer_1')
INSERT INTO admin_user (username, name, user_type_id, contact_number, active, password, category, dept_id)
VALUES ('assigning_officer', 'Assigning Officer', 4, '0300-3333333', true, 'password123', 'GOV', 1)
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
-- Time: 2026-06-06 08:15:00
-- ============================================
INSERT INTO anonymous_report (
    anonymous_id, name, phone_num, province, district, town, area, city, type_id, nature_id, evidence, detail
) VALUES (
             1, 'Anonymous Citizen', '0300-9999999', 'Sindh', 'Karachi', 'Korangi',
             'Korangi Industrial Area, Sector 15', 'Karachi', 1, 7, NULL,
             'EMERGENCY: Major power outage. Transformer on fire. People trapped in buildings. Need immediate help.'
         )
    ON CONFLICT (anonymous_id) DO UPDATE SET
    phone_num = EXCLUDED.phone_num, detail = EXCLUDED.detail;

-- ============================================
-- STEP 2: HELPDESK REVIEWS AND CREATES SOS REPORT
-- Time: 2026-06-06 08:22:00
-- ============================================
INSERT INTO sos_report (
    sos_id, helpdesk_username, name, province, district, town, area, city,
    type_id, nature_id, detail, phone_auto_detect, status
) VALUES (
             1, 'helpdesk_1', 'Anonymous Reporter', 'Sindh', 'Karachi', 'Korangi',
             'Korangi Industrial Area, Sector 15, Near Factory Road', 'Karachi',
             1, 7,
             'CRITICAL EMERGENCY REPORT: Industrial transformer fire reported at Korangi Sector 15, Factory Road. Fire has spread to adjacent building. 50+ workers evacuated. Power lines down across 3 blocks. Fire brigade dispatched at 08:18. K-Electric emergency response required for: (1) Power isolation to prevent electrocution, (2) Emergency lighting for rescue operations, (3) Temporary power for firefighting equipment. Estimated 5000+ households affected. Priority: CRITICAL.',
             '0300-9999999', 'PENDING'
         )
    ON CONFLICT (sos_id) DO UPDATE SET
    helpdesk_username = EXCLUDED.helpdesk_username,
                                detail = EXCLUDED.detail,
                                status = 'PENDING';

-- ============================================
-- STEP 3: ASSIGNING OFFICER FORWARDS TO RESPONDER
-- Time: 2026-06-06 08:25:00
-- Status: PENDING (responder hasn't accepted yet)
-- ============================================
INSERT INTO forwarded_complaint (
    forwarded_complain_id, assigning_officer_id, dept_username, citizen_id, report_id,
    sos_id, anonymous_id, dept_id, submit_status, submit_date, submit_time,
    read_by_dept, read_by_dept_date, read_by_dept_time,
    assigned_to_worker, assigned_worker_date, assigned_worker_time, worker_username,
    dept_decision, read_by_worker, read_worker_date, read_worker_time,
    accepted_by_worker, accepted_date, accepted_time, worker_decision, remarks
) VALUES (
             301, 'assigning_officer', NULL, NULL, NULL, 1, 1, 1, true, '2026-06-06', '08:25:00',
             false, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
         )
    ON CONFLICT (forwarded_complain_id) DO UPDATE SET
    assigning_officer_id = EXCLUDED.assigning_officer_id,
                                               sos_id = EXCLUDED.sos_id, anonymous_id = EXCLUDED.anonymous_id, dept_id = EXCLUDED.dept_id,
                                               submit_status = true, submit_date = EXCLUDED.submit_date, submit_time = EXCLUDED.submit_time,
                                               read_by_dept = false, read_by_dept_date = NULL, read_by_dept_time = NULL,
                                               assigned_to_worker = false, assigned_worker_date = NULL, assigned_worker_time = NULL, worker_username = NULL,
                                               dept_decision = NULL, read_by_worker = NULL, read_worker_date = NULL, read_worker_time = NULL,
                                               accepted_by_worker = NULL, accepted_date = NULL, accepted_time = NULL, worker_decision = NULL, remarks = NULL;