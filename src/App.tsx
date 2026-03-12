import { useEffect, useState } from 'react';
import { 
  Package, 
  Users, 
  Calendar, 
  Search,
  LayoutDashboard,
  Stethoscope,
  Settings,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DepartmentInventory, Profile } from './types';

// Page Components
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import MedicalRecords from './pages/MedicalRecords';
import Inventory from './pages/Inventory';
import SystemConfig from './pages/SystemConfig';

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
              {currentView === 'dashboard' && (
                <Dashboard 
                  appointments={appointments} 
                  lowStockItems={lowStockItems} 
                  patients={patients} 
                  setCurrentView={setCurrentView} 
                />
              )}
              {currentView === 'appointments' && <Appointments appointments={appointments} />}
              {currentView === 'patients' && <Patients patients={patients} setCurrentView={setCurrentView} />}
              {currentView === 'records' && <MedicalRecords records={records} />}
              {currentView === 'inventory' && <Inventory inventory={inventory} />}
              {currentView === 'config' && <SystemConfig />}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
