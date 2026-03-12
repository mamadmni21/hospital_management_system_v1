import { useEffect, useState } from 'react';
import { 
  Activity, 
  Package, 
  Users, 
  Calendar, 
  AlertTriangle, 
  ArrowUpRight, 
  Search,
  LayoutDashboard,
  Stethoscope,
  ClipboardList,
  Settings,
  Plus,
  Filter,
  MoreVertical,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Database,
  Globe,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DepartmentInventory, Appointment, Profile, MedicalRecord } from './types';

type View = 'dashboard' | 'appointments' | 'patients' | 'records' | 'inventory' | 'config';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [inventory, setInventory] = useState<(DepartmentInventory & { name: string, category: string, unit: string, dept_name: string })[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<Profile[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [invRes, appRes, patRes, recRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/appointments'),
          fetch('/api/patients'),
          fetch('/api/medical-records')
        ]);
        
        const [invData, appData, patData, recData] = await Promise.all([
          invRes.json(),
          appRes.json(),
          patRes.json(),
          recRes.json()
        ]);

        setInventory(invData.inventory);
        setAppointments(appData);
        setPatients(patData);
        setRecords(recData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const lowStockItems = inventory.filter(item => item.current_stock <= item.min_stock_level);

  const renderDashboard = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Appointments', value: appointments.length, icon: Calendar, trend: '+12%' },
          { label: 'Critical Stock Alerts', value: lowStockItems.length, icon: AlertTriangle, color: 'text-red-600' },
          { label: 'Total Patients', value: patients.length, icon: Users, trend: '+4%' },
          { label: 'Avg. Wait Time', value: '14m', icon: Activity, trend: '-2m' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="border border-[#141414] p-6 bg-[#E4E3E0] hover:bg-[#141414] hover:text-[#E4E3E0] transition-all duration-300 group cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              <stat.icon size={20} className={stat.color || 'opacity-50 group-hover:opacity-100'} />
              {stat.trend && <span className="text-[10px] font-mono">{stat.trend}</span>}
            </div>
            <p className="text-[10px] uppercase tracking-widest opacity-50 group-hover:opacity-70">{stat.label}</p>
            <h3 className="text-3xl font-mono mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Inventory Preview */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif italic text-2xl">Critical Inventory</h3>
          <button onClick={() => setCurrentView('inventory')} className="text-[10px] uppercase tracking-widest border border-[#141414] px-4 py-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors">
            View All Inventory
          </button>
        </div>
        <div className="border border-[#141414] overflow-hidden">
          <div className="grid grid-cols-5 p-4 border-b border-[#141414] bg-[#141414]/5 text-[10px] uppercase tracking-widest font-bold">
            <div className="col-span-2">Item</div>
            <div>Department</div>
            <div>Stock</div>
            <div className="text-right">Status</div>
          </div>
          {lowStockItems.slice(0, 5).map((item) => (
            <div key={item.id} className="grid grid-cols-5 p-4 border-b border-[#141414]/10 hover:bg-[#141414]/5 transition-colors items-center">
              <div className="col-span-2 font-medium">{item.name}</div>
              <div className="text-xs">{item.dept_name}</div>
              <div className="font-mono text-xs">{item.current_stock} {item.unit}</div>
              <div className="text-right">
                <span className="bg-red-100 text-red-800 text-[9px] px-2 py-0.5 font-bold uppercase">Critical</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-[#141414] p-8">
          <h4 className="font-serif italic text-xl mb-6">Upcoming Appointments</h4>
          <div className="space-y-4">
            {appointments.slice(0, 3).map(app => (
              <div key={app.id} className="flex items-center justify-between py-3 border-b border-[#141414]/10 last:border-0">
                <div>
                  <p className="text-sm font-medium">{app.patient_first} {app.patient_last}</p>
                  <p className="text-[10px] opacity-50 uppercase tracking-wider">Dr. {app.doctor_last} • {new Date(app.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <button onClick={() => setCurrentView('appointments')} className="p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors">
                  <ArrowUpRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-[#141414] p-8 bg-[#141414] text-[#E4E3E0]">
          <h4 className="font-serif italic text-xl mb-6">System Health</h4>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-60">Database Latency</span>
              <span className="font-mono text-xs text-green-400">12ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-60">API Status</span>
              <span className="font-mono text-xs text-green-400">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-60">Active Sessions</span>
              <span className="font-mono text-xs">42</span>
            </div>
            <button onClick={() => setCurrentView('config')} className="w-full mt-4 border border-[#E4E3E0]/30 py-3 text-[10px] uppercase tracking-widest hover:bg-[#E4E3E0] hover:text-[#141414] transition-all">
              System Configuration
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAppointments = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="font-serif italic text-3xl">Appointments Schedule</h3>
        <button className="flex items-center gap-2 bg-[#141414] text-[#E4E3E0] px-6 py-3 text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity">
          <Plus size={14} /> New Appointment
        </button>
      </div>
      
      <div className="border border-[#141414] overflow-hidden">
        <div className="grid grid-cols-6 p-4 border-b border-[#141414] bg-[#141414]/5 text-[10px] uppercase tracking-widest font-bold">
          <div>Time</div>
          <div className="col-span-2">Patient</div>
          <div>Doctor</div>
          <div>Department</div>
          <div className="text-right">Status</div>
        </div>
        {appointments.map((app) => (
          <div key={app.id} className="grid grid-cols-6 p-4 border-b border-[#141414]/10 hover:bg-[#141414]/5 transition-colors items-center">
            <div className="font-mono text-xs">{new Date(app.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="col-span-2 font-medium">{app.patient_first} {app.patient_last}</div>
            <div className="text-sm">Dr. {app.doctor_last}</div>
            <div className="text-xs opacity-70">{app.dept_name}</div>
            <div className="text-right">
              <span className="text-[9px] font-bold uppercase border border-[#141414] px-2 py-0.5">{app.status}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderPatients = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="font-serif italic text-3xl">Patient Directory</h3>
        <div className="flex gap-4">
          <button className="p-3 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors"><Filter size={16} /></button>
          <button className="bg-[#141414] text-[#E4E3E0] px-6 py-3 text-[10px] uppercase tracking-widest">Add Patient</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map(patient => (
          <div key={patient.id} className="border border-[#141414] p-6 hover:shadow-lg transition-shadow bg-white/50">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-[#141414] text-[#E4E3E0] flex items-center justify-center text-xl font-serif italic">
                {patient.first_name[0]}{patient.last_name[0]}
              </div>
              <button className="opacity-30 hover:opacity-100"><MoreVertical size={16} /></button>
            </div>
            <h4 className="font-medium text-lg">{patient.first_name} {patient.last_name}</h4>
            <p className="text-xs opacity-50 font-mono mb-4">ID: {patient.id.slice(0, 8)}</p>
            <div className="space-y-2 border-t border-[#141414]/10 pt-4">
              <div className="flex justify-between text-[10px] uppercase tracking-wider opacity-60">
                <span>Last Visit</span>
                <span>12 Mar 2026</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-wider opacity-60">
                <span>Status</span>
                <span className="text-green-600 font-bold">Active</span>
              </div>
            </div>
            <button onClick={() => setCurrentView('records')} className="w-full mt-6 py-2 text-[10px] uppercase tracking-widest border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors">
              Medical History
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderRecords = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h3 className="font-serif italic text-3xl">Medical Records</h3>
      <div className="space-y-4">
        {records.map(record => (
          <div key={record.id} className="border border-[#141414] p-8 bg-white/30 relative group overflow-hidden">
            <div className="absolute right-0 top-0 w-1 h-full bg-[#141414] transform translate-x-full group-hover:translate-x-0 transition-transform"></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest opacity-50 bg-[#141414]/5 px-2 py-1">Record #{record.id.slice(0, 6)}</span>
                <h4 className="text-xl font-serif italic mt-2">{record.patient_first} {record.patient_last}</h4>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono">{new Date(record.created_at).toLocaleDateString()}</p>
                <p className="text-[10px] opacity-50 uppercase mt-1">Dr. {record.doctor_last}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold mb-2">Diagnosis</p>
                <p className="text-sm leading-relaxed">{record.diagnosis}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold mb-2">Treatment Plan</p>
                <p className="text-sm leading-relaxed opacity-70">{record.treatment_plan}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderInventory = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="font-serif italic text-3xl">Inventory Management</h3>
        <div className="flex gap-4">
          <button className="bg-[#141414] text-[#E4E3E0] px-6 py-3 text-[10px] uppercase tracking-widest">Add Stock</button>
        </div>
      </div>
      
      <div className="border border-[#141414] overflow-hidden">
        <div className="grid grid-cols-7 p-4 border-b border-[#141414] bg-[#141414]/5 text-[10px] uppercase tracking-widest font-bold">
          <div className="col-span-2">Item / SKU</div>
          <div>Category</div>
          <div>Department</div>
          <div>Stock</div>
          <div>Reorder Level</div>
          <div className="text-right">Actions</div>
        </div>
        {inventory.map((item) => (
          <div key={item.id} className="grid grid-cols-7 p-4 border-b border-[#141414]/10 hover:bg-[#141414]/5 transition-colors items-center">
            <div className="col-span-2">
              <p className="font-medium">{item.name}</p>
              <p className="text-[10px] font-mono opacity-50">{item.sku}</p>
            </div>
            <div className="text-xs opacity-70">{item.category}</div>
            <div className="text-sm">{item.dept_name}</div>
            <div className="font-mono text-sm">
              <span className={item.current_stock <= item.min_stock_level ? 'text-red-600 font-bold' : ''}>
                {item.current_stock}
              </span>
              <span className="text-[10px] opacity-50 ml-1">{item.unit}</span>
            </div>
            <div className="font-mono text-xs opacity-50">{item.min_stock_level}</div>
            <div className="text-right">
              <button className="p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors"><MoreVertical size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderConfig = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <h3 className="font-serif italic text-3xl">System Configuration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Security & Access</h4>
          <div className="space-y-4">
            {[
              { label: 'Two-Factor Authentication', icon: ShieldCheck, status: 'Enabled' },
              { label: 'Role-Based Access Control', icon: Users, status: 'Active' },
              { label: 'Audit Logging', icon: ClipboardList, status: 'Recording' },
            ].map(setting => (
              <div key={setting.label} className="flex items-center justify-between p-4 border border-[#141414]/10 bg-white/20">
                <div className="flex items-center gap-3">
                  <setting.icon size={18} className="opacity-50" />
                  <span className="text-sm font-medium">{setting.label}</span>
                </div>
                <span className="text-[9px] font-bold uppercase text-green-600">{setting.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Infrastructure</h4>
          <div className="space-y-4">
            {[
              { label: 'Database Backup', icon: Database, status: 'Daily 02:00' },
              { label: 'API Region', icon: Globe, status: 'US-East-1' },
              { label: 'Notification Service', icon: Bell, status: 'Connected' },
            ].map(setting => (
              <div key={setting.label} className="flex items-center justify-between p-4 border border-[#141414]/10 bg-white/20">
                <div className="flex items-center gap-3">
                  <setting.icon size={18} className="opacity-50" />
                  <span className="text-sm font-medium">{setting.label}</span>
                </div>
                <span className="text-[9px] font-bold uppercase opacity-50">{setting.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-[#141414] pt-12">
        <h4 className="font-serif italic text-xl mb-6">System Maintenance</h4>
        <div className="flex gap-4">
          <button className="border border-red-600 text-red-600 px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Clear Cache</button>
          <button className="border border-[#141414] px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-[#141414] hover:text-[#E4E3E0] transition-all">Download Logs</button>
          <button className="bg-[#141414] text-[#E4E3E0] px-6 py-3 text-[10px] uppercase tracking-widest">Update System</button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-[#141414] bg-[#E4E3E0] z-50 hidden lg:block">
        <div className="p-8 border-b border-[#141414]">
          <h1 className="font-serif italic text-2xl tracking-tight">PulsePoint</h1>
          <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Hospital Management System</p>
        </div>
        
        <nav className="mt-8 px-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
            { icon: Calendar, label: 'Appointments', id: 'appointments' },
            { icon: Users, label: 'Patients', id: 'patients' },
            { icon: Stethoscope, label: 'Medical Records', id: 'records' },
            { icon: Package, label: 'Inventory', id: 'inventory' },
            { icon: Settings, label: 'System Config', id: 'config' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-[#141414] text-[#E4E3E0]' 
                  : 'hover:bg-[#141414]/5'
              }`}
            >
              <item.icon size={18} strokeWidth={1.5} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-8 border-t border-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#141414] rounded-full flex items-center justify-center text-[#E4E3E0] text-xs font-bold">JD</div>
            <div>
              <p className="text-xs font-bold">Dr. John Doe</p>
              <p className="text-[9px] uppercase tracking-widest opacity-50">Chief Surgeon</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-8 min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-end mb-12 border-b border-[#141414] pb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] opacity-40 mb-2">
              <span>PulsePoint</span>
              <span>/</span>
              <span className="font-bold text-[#141414] opacity-100">{currentView}</span>
            </div>
            <h2 className="font-serif italic text-4xl capitalize">{currentView === 'records' ? 'Medical Records' : currentView === 'config' ? 'System Config' : currentView}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
              <input 
                type="text" 
                placeholder="Search system..." 
                className="bg-transparent border border-[#141414] pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414] w-64"
              />
            </div>
            <button className="p-2 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full border border-[#E4E3E0]"></span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[50vh] space-y-4"
            >
              <div className="w-12 h-12 border-2 border-[#141414] border-t-transparent animate-spin"></div>
              <p className="font-mono text-xs uppercase tracking-widest opacity-50">Synchronizing Data...</p>
            </motion.div>
          ) : (
            <div key={currentView}>
              {currentView === 'dashboard' && renderDashboard()}
              {currentView === 'appointments' && renderAppointments()}
              {currentView === 'patients' && renderPatients()}
              {currentView === 'records' && renderRecords()}
              {currentView === 'inventory' && renderInventory()}
              {currentView === 'config' && renderConfig()}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
