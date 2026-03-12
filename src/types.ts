export type UserRole = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'CLERK' | 'PATIENT';
export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type ItemCategory = 'MEDICATION' | 'SURGICAL_TOOL' | 'OFFICE_SUPPLY' | 'EQUIPMENT' | 'DIAGNOSTIC_KIT';
export type TransactionType = 'RESTOCK' | 'USAGE' | 'WASTE' | 'TRANSFER_IN' | 'TRANSFER_OUT';

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  department_id?: string;
  contact_number?: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  department_id: string;
  scheduled_at: string;
  status: AppointmentStatus;
  notes?: string;
  patient?: Profile;
  doctor?: Profile;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: ItemCategory;
  unit: string;
}

export interface DepartmentInventory {
  id: string;
  department_id: string;
  item_id: string;
  current_stock: number;
  min_stock_level: number;
  expiration_date?: string;
  last_restocked_at: string;
  item?: InventoryItem;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  diagnosis: string;
  treatment_plan?: string;
  prescriptions?: any;
  created_at: string;
}
