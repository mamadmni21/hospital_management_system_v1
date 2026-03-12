-- PulsePoint HMS: Supabase/PostgreSQL Schema
-- Copy and paste this into your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Departments Table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE, -- e.g., 'CARD', 'PHARM', 'SURG'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles Table (Linked to auth.users)
CREATE TYPE user_role AS ENUM ('ADMIN', 'DOCTOR', 'NURSE', 'CLERK', 'PATIENT');

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'PATIENT',
    department_id UUID REFERENCES departments(id),
    contact_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Appointments Table
CREATE TYPE appointment_status AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES profiles(id),
    doctor_id UUID NOT NULL REFERENCES profiles(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    status appointment_status DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Medical Records Table
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES profiles(id),
    doctor_id UUID NOT NULL REFERENCES profiles(id),
    diagnosis TEXT NOT NULL,
    treatment_plan TEXT,
    prescriptions JSONB, -- Array of medications
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Inventory Items (Global Catalog)
CREATE TYPE item_category AS ENUM ('MEDICATION', 'SURGICAL_TOOL', 'OFFICE_SUPPLY', 'EQUIPMENT', 'DIAGNOSTIC_KIT');

CREATE TABLE inventory_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    category item_category NOT NULL,
    unit TEXT NOT NULL, -- e.g., 'vial', 'box', 'piece'
    description TEXT
);

-- 6. Department Inventory (Polymorphic Stock Management)
CREATE TABLE department_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES departments(id),
    item_id UUID NOT NULL REFERENCES inventory_catalog(id),
    current_stock INTEGER NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    min_stock_level INTEGER NOT NULL DEFAULT 10, -- Automated reorder trigger
    expiration_date DATE,
    last_restocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(department_id, item_id)
);

-- 7. Inventory Transactions (Audit Trail)
CREATE TYPE transaction_type AS ENUM ('RESTOCK', 'USAGE', 'WASTE', 'TRANSFER_IN', 'TRANSFER_OUT');

CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES departments(id),
    item_id UUID NOT NULL REFERENCES inventory_catalog(id),
    quantity_change INTEGER NOT NULL,
    type transaction_type NOT NULL,
    performed_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time Stock Trigger Example (PostgreSQL Function)
CREATE OR REPLACE FUNCTION check_reorder_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.current_stock <= NEW.min_stock_level THEN
        -- In a real Supabase app, you might trigger an Edge Function or Notification here
        RAISE NOTICE 'Low stock alert for item % in department %', NEW.item_id, NEW.department_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_inventory_reorder
AFTER UPDATE OF current_stock ON department_inventory
FOR EACH ROW EXECUTE FUNCTION check_reorder_trigger();
