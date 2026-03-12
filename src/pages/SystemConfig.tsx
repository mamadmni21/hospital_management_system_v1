import { motion } from 'motion/react';
import { ShieldCheck, Users, ClipboardList, Database, Globe, Bell } from 'lucide-react';

export default function SystemConfig() {
  return (
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
}
