import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";

const db = new Database(":memory:");

// Initialize Mock Database for Preview
db.exec(`
  CREATE TABLE departments (id TEXT PRIMARY KEY, name TEXT, code TEXT);
  CREATE TABLE profiles (id TEXT PRIMARY KEY, first_name TEXT, last_name TEXT, role TEXT, department_id TEXT);
  CREATE TABLE inventory_catalog (id TEXT PRIMARY KEY, name TEXT, sku TEXT, category TEXT, unit TEXT);
  CREATE TABLE department_inventory (
    id TEXT PRIMARY KEY, 
    department_id TEXT, 
    item_id TEXT, 
    current_stock INTEGER, 
    min_stock_level INTEGER,
    expiration_date TEXT
  );

  INSERT INTO departments VALUES ('d1', 'Pharmacy', 'PHARM'), ('d2', 'Surgery', 'SURG'), ('d3', 'Administration', 'ADMIN'), ('d4', 'Cardiology', 'CARD');
  
  INSERT INTO inventory_catalog VALUES 
    ('i1', 'Amoxicillin 500mg', 'AMX-500', 'MEDICATION', 'box'),
    ('i2', 'Scalpel Blade #10', 'SCAL-10', 'SURGICAL_TOOL', 'pack'),
    ('i3', 'A4 Printer Paper', 'PAP-A4', 'OFFICE_SUPPLY', 'ream'),
    ('i4', 'Stethoscope Classic III', 'STETH-C3', 'EQUIPMENT', 'unit');

  INSERT INTO department_inventory VALUES 
    ('s1', 'd1', 'i1', 45, 20, '2026-12-31'),
    ('s2', 'd2', 'i2', 8, 15, '2027-06-15'),
    ('s3', 'd3', 'i3', 100, 10, NULL),
    ('s4', 'd4', 'i4', 5, 2, NULL);
    
  INSERT INTO profiles VALUES 
    ('u1', 'John', 'Doe', 'DOCTOR', 'd2'), 
    ('u2', 'Jane', 'Smith', 'CLERK', 'd1'),
    ('p1', 'Alice', 'Brown', 'PATIENT', NULL),
    ('p2', 'Bob', 'Wilson', 'PATIENT', NULL),
    ('p3', 'Charlie', 'Davis', 'PATIENT', NULL);

  CREATE TABLE appointments (
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    doctor_id TEXT,
    department_id TEXT,
    scheduled_at TEXT,
    status TEXT,
    notes TEXT
  );

  INSERT INTO appointments VALUES 
    ('a1', 'p1', 'u1', 'd2', '2026-03-15T10:00:00Z', 'SCHEDULED', 'Pre-op consultation'),
    ('a2', 'p2', 'u1', 'd2', '2026-03-15T11:30:00Z', 'SCHEDULED', 'Follow-up'),
    ('a3', 'p3', 'u1', 'd2', '2026-03-16T09:00:00Z', 'SCHEDULED', 'Routine checkup');

  CREATE TABLE medical_records (
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    doctor_id TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    created_at TEXT
  );

  INSERT INTO medical_records VALUES 
    ('m1', 'p1', 'u1', 'Acute Appendicitis', 'Surgical removal scheduled', '2026-03-10T14:20:00Z'),
    ('m2', 'p2', 'u1', 'Hypertension', 'Prescribed Lisinopril', '2026-03-11T09:45:00Z');
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/dashboard/stats", (req, res) => {
    const inventory = db.prepare(`
      SELECT di.*, ic.name, ic.category, ic.unit, d.name as dept_name
      FROM department_inventory di
      JOIN inventory_catalog ic ON di.item_id = ic.id
      JOIN departments d ON di.department_id = d.id
    `).all();
    
    res.json({ inventory });
  });

  app.get("/api/appointments", (req, res) => {
    const appointments = db.prepare(`
      SELECT a.*, 
             p.first_name as patient_first, p.last_name as patient_last,
             d.first_name as doctor_first, d.last_name as doctor_last,
             dept.name as dept_name
      FROM appointments a
      JOIN profiles p ON a.patient_id = p.id
      JOIN profiles d ON a.doctor_id = d.id
      JOIN departments dept ON a.department_id = dept.id
    `).all();
    res.json(appointments);
  });

  app.get("/api/patients", (req, res) => {
    const patients = db.prepare("SELECT * FROM profiles WHERE role = 'PATIENT'").all();
    res.json(patients);
  });

  app.get("/api/medical-records", (req, res) => {
    const records = db.prepare(`
      SELECT m.*, 
             p.first_name as patient_first, p.last_name as patient_last,
             d.first_name as doctor_first, d.last_name as doctor_last
      FROM medical_records m
      JOIN profiles p ON m.patient_id = p.id
      JOIN profiles d ON m.doctor_id = d.id
    `).all();
    res.json(records);
  });

  app.get("/api/departments", (req, res) => {
    const depts = db.prepare("SELECT * FROM departments").all();
    res.json(depts);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HMS Server running on http://localhost:${PORT}`);
  });
}

startServer();
