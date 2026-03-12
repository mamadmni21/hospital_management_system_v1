import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoreVertical, Plus, X, Edit2, Trash2, RefreshCw } from 'lucide-react';

interface InventoryProps {
  inventory: any[];
}

export default function Inventory({ inventory }: InventoryProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="font-serif italic text-3xl">Inventory Management</h3>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#141414] text-[#E4E3E0] px-6 py-3 text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#141414]/90 transition-colors"
          >
            <Plus size={14} />
            Add New Item
          </button>
        </div>
      </div>
      
      <div className="border border-[#141414] overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="grid grid-cols-7 p-4 border-b border-[#141414] bg-[#141414] text-[#E4E3E0] text-[10px] uppercase tracking-widest font-bold">
          <div className="col-span-2">Item / SKU</div>
          <div>Category</div>
          <div>Department</div>
          <div>Stock</div>
          <div>Reorder Level</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-[#141414]/10">
          {inventory.map((item) => (
            <div key={item.id} className="grid grid-cols-7 p-4 hover:bg-[#141414]/5 transition-colors items-center relative">
              <div className="col-span-2">
                <p className="font-medium text-sm">{item.name}</p>
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
              <div className="text-right relative">
                <button 
                  onClick={() => setActiveActionId(activeActionId === item.id ? null : item.id)}
                  className={`p-2 transition-colors ${activeActionId === item.id ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#141414]/10'}`}
                >
                  <MoreVertical size={14} />
                </button>

                {/* Actions Dropdown */}
                <AnimatePresence>
                  {activeActionId === item.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setActiveActionId(null)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-[#E4E3E0] border border-[#141414] shadow-xl z-20 overflow-hidden"
                      >
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors border-b border-[#141414]/10">
                          <RefreshCw size={12} />
                          Update Stock
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors border-b border-[#141414]/10">
                          <Edit2 size={12} />
                          Edit Item
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors text-red-600">
                          <Trash2 size={12} />
                          Delete Item
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Stock Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-[#141414]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#E4E3E0] border border-[#141414] shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-[#141414]">
                <div>
                  <h4 className="font-serif italic text-2xl">Add New Inventory Item</h4>
                  <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Register new medical supplies or equipment</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Item Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Surgical Masks"
                      className="w-full bg-transparent border border-[#141414] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">SKU / Reference</label>
                    <input 
                      type="text" 
                      placeholder="e.g. MSK-001"
                      className="w-full bg-transparent border border-[#141414] px-4 py-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#141414]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Category</label>
                    <select className="w-full bg-transparent border border-[#141414] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414] appearance-none">
                      <option>Surgical Supplies</option>
                      <option>Medication</option>
                      <option>Diagnostics</option>
                      <option>General Equipment</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Department</label>
                    <select className="w-full bg-transparent border border-[#141414] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414] appearance-none">
                      <option>General Surgery</option>
                      <option>Emergency Room</option>
                      <option>Pharmacy</option>
                      <option>Radiology</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Initial Stock</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full bg-transparent border border-[#141414] px-4 py-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#141414]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Unit</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Boxes"
                      className="w-full bg-transparent border border-[#141414] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Reorder Level</label>
                    <input 
                      type="number" 
                      placeholder="10"
                      className="w-full bg-transparent border border-[#141414] px-4 py-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#141414]"
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-8 py-3 text-[10px] uppercase tracking-widest border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 text-[10px] uppercase tracking-widest bg-[#141414] text-[#E4E3E0] hover:bg-[#141414]/90 transition-colors"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
