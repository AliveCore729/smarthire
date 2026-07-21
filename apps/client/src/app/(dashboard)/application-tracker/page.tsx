"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Calendar, MoreHorizontal, LayoutGrid, Trash2, X } from "lucide-react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApplicationStore } from "@/store/application-store";
import { ApplicationData } from "@/services/application-service";

const COLUMNS = [
  { id: "applied", title: "APPLIED", color: "from-sky-500/20 to-sky-500/5", badge: "bg-sky-500/20 text-sky-400" },
  { id: "screening", title: "SCREENING", color: "from-purple-500/20 to-purple-500/5", badge: "bg-purple-500/20 text-purple-400" },
  { id: "interview", title: "INTERVIEW", color: "from-blue-500/20 to-blue-500/5", badge: "bg-blue-500/20 text-blue-400" },
  { id: "offer", title: "OFFER", color: "from-emerald-500/20 to-emerald-500/5", badge: "bg-emerald-500/20 text-emerald-400" },
  { id: "rejected", title: "REJECTED", color: "from-slate-500/20 to-slate-500/5", badge: "bg-slate-500/20 text-slate-400" }
];

function SortableAppCard({ app, isOverlay, onDelete }: { app: ApplicationData; isOverlay?: boolean; onDelete?: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: app._id, data: app });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg hover:border-white/20 hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing ${isOverlay ? 'scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)] rotate-2 z-50' : ''}`}
    >
      <div className="flex justify-between items-start gap-2 mb-3">
        <div>
          <h4 className="font-semibold text-white text-sm">{app.company}</h4>
          <p className="text-xs font-medium text-slate-400 mt-0.5">{app.role}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
            app.matchScore >= 85 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/20"
          }`}>
            {app.matchScore}% Match
          </span>
          {!isOverlay && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(app._id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-[11px] font-medium text-slate-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(app.dateApplied).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

// Droppable Column
import { useDroppable } from '@dnd-kit/core';

function Column({ col, applications, onDelete }: { col: typeof COLUMNS[0]; applications: ApplicationData[]; onDelete: (id: string) => void }) {
  const { setNodeRef } = useDroppable({ id: col.id });

  return (
    <div className="bg-[#0f0f0f] rounded-2xl border border-white/5 flex flex-col max-h-[75vh] w-full relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-b ${col.color} opacity-50 pointer-events-none`} />
      
      <div className="p-4 flex items-center justify-between relative z-10 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs tracking-widest text-slate-300 uppercase">{col.title}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
            {applications.length}
          </span>
        </div>
        <button className="text-slate-500 hover:text-slate-300 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div ref={setNodeRef} className="p-4 overflow-y-auto space-y-3 flex-1 min-h-[200px] custom-scrollbar">
        <SortableContext items={applications.map(a => a._id)} strategy={verticalListSortingStrategy}>
          {applications.map((app) => (
            <SortableAppCard key={app._id} app={app} onDelete={onDelete} />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="h-32 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-slate-500 font-medium text-xs text-center p-4">
            <LayoutGrid className="w-5 h-5 mb-2 opacity-50" />
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApplicationTrackerPage() {
  const { applications, loadApplications, updateApplicationStatus, createApplication, deleteApplication } = useApplicationStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteApplication(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };
  
  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;
    
    const activeApp = applications.find(a => a._id === active.id);
    if (!activeApp) return;

    let targetStatus = over.id as ApplicationData['status'];
    
    if (!COLUMNS.find(c => c.id === targetStatus)) {
      const overApp = applications.find(a => a._id === over.id);
      if (overApp) targetStatus = overApp.status;
    }

    if (targetStatus && activeApp.status !== targetStatus) {
      updateApplicationStatus(active.id as string, targetStatus);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompany.trim() && newRole.trim()) {
      createApplication({ company: newCompany.trim(), role: newRole.trim() });
      setIsAddModalOpen(false);
      setNewCompany("");
      setNewRole("");
    }
  };

  const activeApp = activeId ? applications.find(a => a._id === activeId) : null;

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col space-y-6">
      
      {/* Utility Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Application Tracker</h1>
          <p className="text-slate-400 mt-2 font-light">Manage and track your candidate pipeline.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> Add Application
        </button>
      </div>

      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles, companies..."
            className="w-full pl-9 pr-3 py-2 bg-transparent text-sm font-medium focus:outline-none text-white placeholder:text-slate-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 pb-6 overflow-x-auto">
        <div className="flex gap-6 items-start min-w-[1000px] h-full">
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCorners} 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
          >
            {COLUMNS.map((col) => (
              <Column 
                key={col.id} 
                col={col} 
                applications={applications.filter(a => a.status === col.id)} 
                onDelete={(id) => setDeleteConfirmId(id)}
              />
            ))}
            <DragOverlay>
              {activeApp ? <SortableAppCard app={activeApp} isOverlay /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Add Application Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#111] rounded-2xl shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-display font-semibold text-white">New Application</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                  <input
                    id="company"
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Google, Stripe"
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder:text-slate-600 transition-all"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">Role / Position</label>
                  <input
                    id="role"
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Frontend Engineer"
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder:text-slate-600 transition-all"
                    required
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newCompany.trim() || !newRole.trim()}
                    className="px-6 py-2.5 bg-cyan-500 text-black text-sm font-semibold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] disabled:opacity-50 disabled:shadow-none"
                  >
                    Save Application
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-[#111] rounded-2xl shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">Delete Application?</h3>
                <p className="text-sm font-light text-slate-400">
                  Are you sure you want to delete this application? This action cannot be undone.
                </p>
                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 px-4 py-2.5 bg-white/5 text-white border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmDelete}
                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}