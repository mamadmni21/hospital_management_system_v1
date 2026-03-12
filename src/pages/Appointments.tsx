import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface AppointmentsProps {
  appointments: any[];
}

export default function Appointments({ appointments }: AppointmentsProps) {
  return (
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
}
