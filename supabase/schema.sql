-- ==============================================================================
-- MUNICIPAL TOURISM OFFICE DATABASE MANAGEMENT SYSTEM (MTODMS)
-- SUPABASE POSTGRESQL PRODUCTION DDL SCHEMA
-- Municipality of Malungon, Sarangani Province, Region XII
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tourist Arrivals Table (TAMS)
CREATE TABLE IF NOT EXISTS tourist_arrivals (
    id TEXT PRIMARY KEY,
    tourist_id TEXT NOT NULL,
    date_of_visit DATE NOT NULL DEFAULT CURRENT_DATE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    sex TEXT NOT NULL CHECK (sex IN ('Male', 'Female', 'Other')),
    address TEXT,
    nationality TEXT NOT NULL DEFAULT 'Filipino',
    is_foreign BOOLEAN NOT NULL DEFAULT FALSE,
    contact_number TEXT,
    email_address TEXT,
    occupation TEXT,
    purpose_of_visit TEXT NOT NULL,
    destination_visited TEXT NOT NULL,
    accommodation_used TEXT,
    number_of_days_stayed INTEGER NOT NULL DEFAULT 1,
    transportation_used TEXT,
    tourist_spending NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    travel_companion TEXT,
    companions_count INTEGER NOT NULL DEFAULT 0,
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_comments TEXT,
    recorded_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tourism Establishments Table (TED)
CREATE TABLE IF NOT EXISTS tourism_establishments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner TEXT NOT NULL,
    category TEXT NOT NULL,
    address TEXT NOT NULL,
    barangay TEXT NOT NULL,
    contact_number TEXT,
    email TEXT,
    business_permit_number TEXT,
    dot_accreditation_status TEXT NOT NULL,
    dot_accreditation_number TEXT,
    number_of_employees INTEGER DEFAULT 0,
    investment_cost NUMERIC(14, 2) DEFAULT 0.00,
    annual_revenue NUMERIC(14, 2) DEFAULT 0.00,
    environmental_compliance TEXT,
    safety_compliance TEXT,
    insurance_coverage TEXT,
    business_status TEXT DEFAULT 'Active & Operating',
    inspection_history JSONB DEFAULT '[]'::JSONB,
    renewal_schedule DATE,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MSME Tourism Database (MSME)
CREATE TABLE IF NOT EXISTS msme_tourism (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner TEXT NOT NULL,
    product_category TEXT NOT NULL,
    local_products TEXT,
    production_capacity TEXT,
    market_location TEXT,
    registration_status TEXT DEFAULT 'Fully Registered',
    dti_registration TEXT,
    bir_registration TEXT,
    barangay TEXT NOT NULL,
    contact_information TEXT,
    trainings_attended TEXT[] DEFAULT '{}',
    financial_assistance_received TEXT,
    product_photos TEXT[] DEFAULT '{}',
    inventory_count INTEGER DEFAULT 0,
    average_price NUMERIC(10, 2) DEFAULT 0.00,
    indigenous_affiliation TEXT,
    otop_certified BOOLEAN DEFAULT FALSE,
    grant_amount_received NUMERIC(12, 2) DEFAULT 0.00,
    market_outlets TEXT[] DEFAULT '{}',
    shelf_life_or_durability TEXT,
    fda_or_halal_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tourism Destinations & Attractions (DAIMS)
CREATE TABLE IF NOT EXISTS tourism_destinations (
    id TEXT PRIMARY KEY,
    site_name TEXT NOT NULL,
    barangay TEXT NOT NULL,
    gps_coordinates TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    elevation TEXT,
    accessibility TEXT,
    distance_from_municipal_hall_km NUMERIC(6, 2) DEFAULT 0.0,
    travel_time_minutes INTEGER DEFAULT 0,
    classification TEXT NOT NULL,
    attractions TEXT[] DEFAULT '{}',
    facilities_available TEXT[] DEFAULT '{}',
    safety_equipment TEXT[] DEFAULT '{}',
    tourism_activities TEXT[] DEFAULT '{}',
    carrying_capacity_daily INTEGER NOT NULL DEFAULT 500,
    current_visitors_today INTEGER NOT NULL DEFAULT 0,
    entrance_fee NUMERIC(8, 2) DEFAULT 0.00,
    contact_person TEXT,
    contact_number TEXT,
    status TEXT DEFAULT 'Open / Normal Operations',
    photos TEXT[] DEFAULT '{}',
    drone_images_count INTEGER DEFAULT 0,
    has_gis_map BOOLEAN DEFAULT TRUE,
    dot_rating_score NUMERIC(4, 2) DEFAULT 4.5,
    dot_class TEXT,
    ecological_vulnerability TEXT,
    gate_status TEXT DEFAULT 'Open Entry',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tourism Events Management (EMS)
CREATE TABLE IF NOT EXISTS tourism_events (
    id TEXT PRIMARY KEY,
    event_name TEXT NOT NULL,
    date DATE NOT NULL,
    end_date DATE,
    venue TEXT NOT NULL,
    organizer TEXT NOT NULL,
    budget NUMERIC(12, 2) DEFAULT 0.00,
    actual_expense NUMERIC(12, 2) DEFAULT 0.00,
    participants_expected INTEGER DEFAULT 0,
    attendance_actual INTEGER DEFAULT 0,
    sponsors TEXT[] DEFAULT '{}',
    guests TEXT[] DEFAULT '{}',
    performers TEXT[] DEFAULT '{}',
    program_flow TEXT,
    status TEXT DEFAULT 'Upcoming',
    evaluation_rating NUMERIC(3, 2) DEFAULT 5.0,
    documentation_urls TEXT[] DEFAULT '{}',
    financial_report_status TEXT DEFAULT 'Pending Submission',
    event_category TEXT,
    permit_number TEXT,
    barangay TEXT,
    security_deployment TEXT,
    waste_management_plan TEXT,
    economic_impact_estimate NUMERIC(14, 2) DEFAULT 0.00,
    banner_photo TEXT,
    coordinating_agencies TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Administrative Employees (AFS)
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    employee_number TEXT NOT NULL,
    name TEXT NOT NULL,
    appointment TEXT NOT NULL,
    position TEXT NOT NULL,
    employment_status TEXT DEFAULT 'Active',
    leave_credits NUMERIC(5, 2) DEFAULT 15.0,
    daily_time_record_hours_this_month NUMERIC(6, 2) DEFAULT 160.0,
    performance_evaluation_rating TEXT,
    trainings TEXT[] DEFAULT '{}',
    designation TEXT,
    service_record_years INTEGER DEFAULT 1,
    email TEXT,
    contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Office Physical Inventory / PPE (AFS)
CREATE TABLE IF NOT EXISTS office_inventory (
    id TEXT PRIMARY KEY,
    property_number TEXT NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    acquisition_date DATE,
    acquisition_cost NUMERIC(12, 2) DEFAULT 0.00,
    assigned_to TEXT,
    location TEXT,
    disposal_record TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Notices of Violation (PSRU)
CREATE TABLE IF NOT EXISTS notices_of_violation (
    id TEXT PRIMARY KEY,
    docket_number TEXT,
    establishment_name TEXT NOT NULL,
    barangay TEXT,
    violation_date DATE NOT NULL,
    violation_details TEXT NOT NULL,
    ordinance_violated TEXT NOT NULL,
    corrective_action_required TEXT NOT NULL,
    deadline DATE NOT NULL,
    inspecting_officer TEXT,
    fine_amount NUMERIC(10, 2) DEFAULT 0.00,
    resolution_date DATE,
    recommendation TEXT,
    status TEXT DEFAULT 'Pending Corrective Action',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tourist Complaints / Redress (PSRU & TFRGS)
CREATE TABLE IF NOT EXISTS tourist_complaints (
    id TEXT PRIMARY KEY,
    tracking_number TEXT NOT NULL,
    complainant TEXT NOT NULL,
    contact_number TEXT,
    email TEXT,
    date_filed DATE NOT NULL DEFAULT CURRENT_DATE,
    target_entity TEXT NOT NULL,
    entity_type TEXT,
    category TEXT NOT NULL,
    urgency TEXT DEFAULT 'Medium',
    description TEXT NOT NULL,
    status TEXT DEFAULT 'Received',
    resolution_notes TEXT,
    action_taken TEXT,
    assigned_officer TEXT,
    resolution_date DATE,
    sla_status TEXT DEFAULT 'Within 72hr ARTA SLA',
    complainant_satisfied BOOLEAN,
    barangay TEXT,
    evidence_urls TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tourist Feedback & ARTA CSM (TFRGS)
CREATE TABLE IF NOT EXISTS tourist_feedback (
    id TEXT PRIMARY KEY,
    reference_number TEXT NOT NULL,
    date_submitted DATE NOT NULL DEFAULT CURRENT_DATE,
    tourist_name TEXT NOT NULL,
    tourist_origin TEXT,
    destination_visited TEXT NOT NULL,
    overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    ratings JSONB NOT NULL,
    nps_score INTEGER NOT NULL CHECK (nps_score BETWEEN 0 AND 10),
    arta_sqd JSONB NOT NULL,
    positive_remarks TEXT,
    areas_for_improvement TEXT,
    would_recommend BOOLEAN DEFAULT TRUE,
    submission_channel TEXT DEFAULT 'TIAC Kiosk',
    status TEXT DEFAULT 'Reviewed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Official Document Management System (DMS)
CREATE TABLE IF NOT EXISTS official_documents (
    id TEXT PRIMARY KEY,
    control_number TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date_issued DATE NOT NULL,
    signatory TEXT NOT NULL,
    file_size TEXT,
    file_type TEXT DEFAULT 'PDF',
    tags TEXT[] DEFAULT '{}',
    is_confidential BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Audit Trail Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    details TEXT NOT NULL
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE tourist_arrivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourism_establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE msme_tourism ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourism_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourism_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices_of_violation ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to directories (for visitor portal)
CREATE POLICY "Public destinations read access" ON tourism_destinations FOR SELECT USING (true);
CREATE POLICY "Public establishments read access" ON tourism_establishments FOR SELECT USING (true);
CREATE POLICY "Public events read access" ON tourism_events FOR SELECT USING (true);
CREATE POLICY "Public msme read access" ON msme_tourism FOR SELECT USING (true);

-- Allow authenticated or anon access with API key for full CRUD
CREATE POLICY "Full access to tourist_arrivals" ON tourist_arrivals FOR ALL USING (true);
CREATE POLICY "Full access to tourism_establishments" ON tourism_establishments FOR ALL USING (true);
CREATE POLICY "Full access to msme_tourism" ON msme_tourism FOR ALL USING (true);
CREATE POLICY "Full access to tourism_destinations" ON tourism_destinations FOR ALL USING (true);
CREATE POLICY "Full access to tourism_events" ON tourism_events FOR ALL USING (true);
CREATE POLICY "Full access to employees" ON employees FOR ALL USING (true);
CREATE POLICY "Full access to office_inventory" ON office_inventory FOR ALL USING (true);
CREATE POLICY "Full access to notices_of_violation" ON notices_of_violation FOR ALL USING (true);
CREATE POLICY "Full access to tourist_complaints" ON tourist_complaints FOR ALL USING (true);
CREATE POLICY "Full access to tourist_feedback" ON tourist_feedback FOR ALL USING (true);
CREATE POLICY "Full access to official_documents" ON official_documents FOR ALL USING (true);
CREATE POLICY "Full access to audit_logs" ON audit_logs FOR ALL USING (true);
