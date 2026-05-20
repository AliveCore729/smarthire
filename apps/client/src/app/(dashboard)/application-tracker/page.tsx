"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Calendar, PhoneCall, MoreHorizontal, LayoutGrid } from "lucide-react";

// Types matching the attributes shown in your application tracker mockup
interface Application {
  id: string;
  company: string;
  role: string;
  matchScore: number;
  date: string;
  actionText?: string;
}

interface Column {
  id: string;
  title: string;
  count: number;
  color: string;
  bgColor: string;
  applications: Application[];
}

export default function ApplicationTrackerPage() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "applied",
      title: "APPLIED",
      count: 3,
      color: "border-t-blue-500 text-blue-600",
      bgColor: "bg-blue-50/50",
      applications: [
        { id: "app-1", company: "Acme Corp", role: "Senior Frontend Engineer", matchScore: 92, date: "Oct 12, 2023" },
        { id: "app-2", company: "Global Logistics", role: "UX Designer", matchScore: 78, date: "Oct 14, 2023" },
      ],
    },
    {
      id: "screening",
      title: "SCREENING",
      count: 1,
      color: "border-t-rose-500 text-rose-600",
      bgColor: "bg-rose-50/50",
      applications: [
        { id: "app-3", company: "TechNova", role: "Product Manager", matchScore: 85, date: "Oct 10, 2023", actionText: "Call Tomorrow" },
      ],
    },
    {
      id: "interview",
      title: "INTERVIEW",
      count: 0,
      color: "border-t-amber-500 text-amber-600",
      bgColor: "bg-amber-50/50",
      applications: [],
    },
  ]);

  // Simple state machine handler to move an item to an adjacent column for evaluation
  const moveApplication = (id: string, direction: "next" | "prev") => {
    setColumns((prevColumns) => {
      let foundApp: Application | null = null;
      let sourceColIdx = -1;

      prevColumns.forEach((col, idx) => {
        const app = col.applications.find((a) => a.id === id);
        if (app) {
          foundApp = app;
          sourceColIdx = idx;
        }
      });

      if (!foundApp || sourceColIdx === -1) return prevColumns;

      const targetColIdx = direction === "next" ? sourceColIdx + 1 : sourceColIdx - 1;
      if (targetColIdx < 0 || targetColIdx >= prevColumns.length) return prevColumns;

      return prevColumns.map((col, idx) => {
        if (idx === sourceColIdx) {
          return {
            ...col,
            applications: col.applications.filter((a) => a.id !== id),
            count: col.count - 1,
          };
        }
        if (idx === targetColIdx) {
          return {
            ...col,
            applications: [...col.applications, foundApp!],
            count: col.count + 1,
          };
        }
        return col;
      });
    });
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-6">
      
      {/* Dynamic Dashboard Utility Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Application Tracker</h1>
          <p className="text-slate-500 mt-1">Manage and track your structural candidate pipeline.</p>
        </div>
        <button className="bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Search and Filters Strip */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles, companies..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button className="p-2 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600 transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Kanban Board Layout Container */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-start overflow-y-auto pb-6">
        {columns.map((column) => (
          <div key={column.id} className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col max-h-[70vh]">
            
            {/* Column Header Indicator */}
            <div className={`p-4 border-t-4 ${column.color} border-b border-slate-100 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wider text-slate-700">{column.title}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${column.bgColor}`}>
                  {column.applications.length}
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Application Cards Container Dropzone */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50/50 min-h-[200px]">
              <AnimatePresence mode="popLayout">
                {column.applications.map((app) => (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{app.company}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{app.role}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        app.matchScore >= 85 ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                      }`}>
                        {app.matchScore}% Match
                      </span>
                    </div>

                    {/* Meta Fields Footer */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {app.date}
                      </div>

                      {app.actionText && (
                        <div className="flex items-center gap-1 text-rose-500 font-medium bg-rose-50 px-1.5 py-0.5 rounded">
                          <PhoneCall className="w-2.5 h-2.5" />
                          {app.actionText}
                        </div>
                      )}
                    </div>

                    {/* Functional Navigation Elements for Board State Control */}
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white pl-1 rounded transition-opacity">
                      {column.id !== "applied" && (
                        <button 
                          onClick={() => moveApplication(app.id, "prev")}
                          className="px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 border border-slate-200 rounded"
                          title="Move left"
                        >
                          ←
                        </button>
                      )}
                      {column.id !== "interview" && (
                        <button 
                          onClick={() => moveApplication(app.id, "next")}
                          className="px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 border border-slate-200 rounded"
                          title="Move right"
                        >
                          →
                        </button>
                      )}
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>

              {column.applications.length === 0 && (
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                  <LayoutGrid className="w-6 h-6 mb-1 text-slate-300" />
                  Drop applications here
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}