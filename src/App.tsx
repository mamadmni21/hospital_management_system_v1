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
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';
import { DepartmentInventory } from './types';

export default function App() {
  const [inventory, setInventory] = useState<(DepartmentInventory & { name: string, category: string, unit: string, dept_name: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setInventory(data.inventory);
        setLoading(false);
      });
  }, []);

  const lowStockItems = inventory.filter(item => item.current_stock <= item.min_stock_level);

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-[#141414] bg-[#E4E3E0] z-50 hidden lg:block">
        <div className="p-8 border-bottom border-[#141414]">
          <h1 className="font-serif italic text-2xl tracking-tight">PulsePoint</h1>
          <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Hospital Management System</p>
        </div>
        
        <nav className="mt-8 px-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: Calendar, label: 'Appointments' },
            { icon: Users, label: 'Patients' },
            { icon: Stethoscope, label: 'Medical Records' },
            { icon: Package, label: 'Inventory' },
            { icon: Settings, label: 'System Config' },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                item.active 
                  ? 'bg-[#141414] text-[#E4E3E0]' 
                  : 'hover:bg-[#141414]/5'
              }`}
            >
              <item.icon size={18} strokeWidth={1.5} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-end mb-12 border-b border-[#141414] pb-8">
          <div>
            <h2 className="font-serif italic text-4xl">System Overview</h2>
            <p className="text-sm opacity-60 mt-2">Real-time monitoring of hospital resources and operations.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
              <input 
                type="text" 
                placeholder="Search records..." 
                className="bg-transparent border border-[#141414] pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414] w-64"
              />
            </div>
            <div className="w-10 h-10 bg-[#141414] rounded-full flex items-center justify-center text-[#E4E3E0]">
              <Users size={20} />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Appointments', value: '124', icon: Calendar, trend: '+12%' },
            { label: 'Critical Stock Alerts', value: lowStockItems.length, icon: AlertTriangle, color: 'text-red-600' },
            { label: 'Total Patients', value: '1,842', icon: Users, trend: '+4%' },
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

        {/* Inventory Table */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif italic text-2xl">Departmental Inventory</h3>
            <button className="text-xs uppercase tracking-widest border border-[#141414] px-4 py-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors">
              Export Report
            </button>
          </div>
          
          <div className="border border-[#141414] overflow-hidden">
            <div className="grid grid-cols-6 p-4 border-b border-[#141414] bg-[#141414]/5 text-[10px] uppercase tracking-widest font-bold">
              <div className="col-span-2">Item / SKU</div>
              <div>Department</div>
              <div>Stock Level</div>
              <div>Status</div>
              <div className="text-right">Expiry</div>
            </div>
            
            {loading ? (
              <div className="p-12 text-center font-mono opacity-50">Loading records...</div>
            ) : (
              inventory.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + (i * 0.05) }}
                  key={item.id} 
                  className="grid grid-cols-6 p-4 border-b border-[#141414]/10 hover:bg-[#141414]/5 transition-colors items-center"
                >
                  <div className="col-span-2">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-[10px] font-mono opacity-50">{item.sku}</p>
                  </div>
                  <div className="text-sm">{item.dept_name}</div>
                  <div className="font-mono text-sm">
                    {item.current_stock} <span className="text-[10px] opacity-50">{item.unit}</span>
                  </div>
                  <div>
                    {item.current_stock <= item.min_stock_level ? (
                      <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 font-bold uppercase">Low Stock</span>
                    ) : (
                      <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 font-bold uppercase">Optimal</span>
                    )}
                  </div>
                  <div className="text-right font-mono text-xs opacity-60">
                    {item.expiration_date || 'N/A'}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-[#141414] p-8">
            <h4 className="font-serif italic text-xl mb-6">Recent Medical Records</h4>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-[#141414]/10 last:border-0">
                  <div>
                    <p className="text-sm font-medium">Patient #{1000 + i}</p>
                    <p className="text-xs opacity-50">Diagnosis: Routine Checkup</p>
                  </div>
                  <button className="p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors">
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-[#141414] p-8 bg-[#141414] text-[#E4E3E0]">
            <h4 className="font-serif italic text-xl mb-6">Automated Reorder Queue</h4>
            <p className="text-sm opacity-70 mb-8">Items below threshold are automatically added to the procurement queue.</p>
            <div className="space-y-4">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-[#E4E3E0]/20 last:border-0">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={16} className="text-red-400" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-mono text-xs">Qty: {item.min_stock_level * 2}</span>
                </div>
              ))}
              {lowStockItems.length === 0 && <p className="text-xs opacity-50 italic">No pending reorders.</p>}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
