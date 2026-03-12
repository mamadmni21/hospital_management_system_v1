import { motion } from 'motion/react';
import { Filter, MoreVertical } from 'lucide-react';
import { Profile } from '../types';

interface PatientsProps {
  patients: Profile[];
  setCurrentView: (view: any) => void;
}

export default function Patients({ patients, setCurrentView }: PatientsProps) {
  return (
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
}
