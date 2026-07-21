"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Calendar, MoreHorizontal, LayoutGrid, Trash2 } from "lucide-react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApplicationStore } from "@/store/application-store";
import { ApplicationData } from "@/services/application-service";

const COLUMNS = [
  { id: "applied", title: "APPLIED", color: "border-t-4 border-t-sky-300 text-slate-900", bgColor: "bg-sky-200 border-2 border-slate-900" },
  { id: "screening", title: "SCREENING", color: "border-t-4 border-t-pink-300 text-slate-900", bgColor: "bg-pink-200 border-2 border-slate-900" },
  { id: "interview", title: "INTERVIEW", color: "border-t-4 border-t-amber-300 text-slate-900", bgColor: "bg-amber-200 border-2 border-slate-900" },
  { id: "offer", title: "OFFER", color: "border-t-4 border-t-lime-300 text-slate-900", bgColor: "bg-lime-300 border-2 border-slate-900" },
  { id: "rejected", title: "REJECTED", color: "border-t-4 border-t-slate-400 text-slate-900", bgColor: "bg-slate-300 border-2 border-slate-900" }
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
      className={`bg-white p-4 rounded-sm border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] hover:-translate-y-0.5 transition-all cursor-grab active:cursor-grabbing ${isOverlay ? 'shadow-[8px_8px_0px_#0f172a] rotate-2' : ''}`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <div>
          <h4 className="font-black text-slate-900 text-sm uppercase">{app.company}</h4>
          <p className="text-xs font-bold text-slate-600 mt-0.5 uppercase">{app.role}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 border-2 border-slate-900 rounded-sm shadow-[2px_2px_0px_#0f172a] ${
            app.matchScore >= 85 ? "bg-lime-300 text-slate-900" : "bg-sky-200 text-slate-900"
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
              className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t-2 border-slate-900 text-[11px] font-bold text-slate-600 uppercase">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
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
    <div className="bg-white rounded-sm border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] flex flex-col max-h-[70vh] w-full">
      <div className={`p-4 ${col.color} border-b-2 border-slate-900 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="font-black text-sm tracking-widest text-slate-900 uppercase">{col.title}</span>
          <span className={`text-xs font-black px-2 py-0.5 rounded-sm shadow-[2px_2px_0px_#0f172a] text-slate-900 ${col.bgColor}`}>
            {applications.length}
          </span>
        </div>
        <button className="text-slate-900 hover:scale-110 transition-transform">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div ref={setNodeRef} className="p-4 overflow-y-auto space-y-4 flex-1 bg-slate-50 min-h-[200px]">
        <SortableContext items={applications.map(a => a._id)} strategy={verticalListSortingStrategy}>
          {applications.map((app) => (
            <SortableAppCard key={app._id} app={app} onDelete={onDelete} />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="h-32 border-2 border-dashed border-slate-900 rounded-sm flex flex-col items-center justify-center text-slate-900 font-bold text-xs text-center p-4 uppercase tracking-wide">
            <LayoutGrid className="w-6 h-6 mb-2 text-slate-900" />
            Drop applications here
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

    // Check if dropping on a column
    let targetStatus = over.id as ApplicationData['status'];
    
    // If dropping on an item inside a column, find that column
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
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-6">
      
      {/* Utility Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Application Tracker</h1>
          <p className="text-slate-600 mt-2 font-medium">Manage and track your candidate pipeline.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-lime-300 text-slate-900 border-2 border-slate-900 px-6 py-2.5 rounded-sm text-sm font-black transition-all shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] flex items-center gap-2 self-start sm:self-auto uppercase tracking-wide"
        >
          <Plus className="w-5 h-5 border-2 border-slate-900 rounded-sm bg-white" /> Add Application
        </button>
      </div>

      <div className="flex items-center gap-3 bg-white p-3 rounded-sm border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a]">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900" />
          <input
            type="text"
            placeholder="Search roles, companies..."
            className="w-full pl-9 pr-3 py-2 bg-pink-100 border-2 border-slate-900 rounded-sm text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:shadow-[2px_2px_0px_#0f172a] transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex-1 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 items-start">
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
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-sm shadow-[8px_8px_0px_#0f172a] overflow-hidden border-2 border-slate-900"
            >
              <div className="px-6 py-4 border-b-2 border-slate-900 flex items-center justify-between bg-sky-200">
                <h3 className="text-lg font-black text-slate-900 uppercase">Add New Application</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-900 hover:scale-110 transition-transform"
                >
                  <MoreHorizontal className="w-5 h-5 rotate-45" /> {/* Close Icon */}
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
                <div>
                  <label htmlFor="company" className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">Company Name</label>
                  <input
                    id="company"
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Google, Stripe"
                    className="w-full px-4 py-3 bg-pink-100 border-2 border-slate-900 rounded-sm text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:shadow-[4px_4px_0px_#0f172a] transition-all placeholder:text-slate-600"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">Role / Position</label>
                  <input
                    id="role"
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Frontend Engineer"
                    className="w-full px-4 py-3 bg-pink-100 border-2 border-slate-900 rounded-sm text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:shadow-[4px_4px_0px_#0f172a] transition-all placeholder:text-slate-600"
                    required
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t-2 border-slate-900 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-6 py-2.5 text-sm font-black text-slate-900 hover:-translate-y-1 border-2 border-transparent hover:border-slate-900 hover:shadow-[4px_4px_0px_#0f172a] hover:bg-white rounded-sm transition-all uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newCompany.trim() || !newRole.trim()}
                    className="px-6 py-2.5 bg-lime-300 text-slate-900 text-sm font-black border-2 border-slate-900 rounded-sm hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#0f172a] uppercase"
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
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-sm shadow-[8px_8px_0px_#0f172a] overflow-hidden border-2 border-slate-900"
            >
              <div className="px-6 py-4 border-b-2 border-slate-900 bg-pink-200">
                <h3 className="text-lg font-black text-slate-900 uppercase">Delete Application?</h3>
              </div>
              <div className="p-6">
                <p className="text-sm font-bold text-slate-600">
                  Are you sure you want to delete this application? This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-900 border-2 border-slate-900 rounded-sm text-sm font-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0f172a] transition-all uppercase"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-400 text-slate-900 border-2 border-slate-900 rounded-sm text-sm font-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0f172a] transition-all uppercase flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
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