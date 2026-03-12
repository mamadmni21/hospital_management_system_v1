import { motion } from 'motion/react';

interface MedicalRecordsProps {
  records: any[];
}

export default function MedicalRecords({ records }: MedicalRecordsProps) {
  return (
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
}
