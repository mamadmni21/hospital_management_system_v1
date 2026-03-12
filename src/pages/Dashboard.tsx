import { motion } from 'motion/react';
import { Calendar, AlertTriangle, Users, Activity, ArrowUpRight } from 'lucide-react';
import { DepartmentInventory } from '../types';

interface DashboardProps {
  appointments: any[];
  lowStockItems: any[];
  patients: any[];
  setCurrentView: (view: any) => void;
}

export default function Dashboard({ appointments, lowStockItems, patients, setCurrentView }: DashboardProps) {
  return (
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
}
