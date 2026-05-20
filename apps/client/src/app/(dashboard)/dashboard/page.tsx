"use client";

import { useAuthStore } from "@/store/auth-store";
import { 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  MoreVertical,
  Briefcase
} from "lucide-react";

export default function DashboardPage() {
  // Pulling the user from the Zustand store we just built
  const { user } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name || "Alex"}.
          </h1>
          <p className="text-slate-500 mt-1">Here is your AI-driven career overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            Update Resume
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Optimize Profile
          </button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ATS Match Score Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-slate-900">Overall ATS Match Score</h2>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Based on top 5 targeted roles</span>
          </div>

          <div className="flex items-center gap-10">
            {/* Circular Progress (Pure SVG + Tailwind) */}
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" className="text-slate-100" strokeWidth="12" fill="none" stroke="currentColor" />
                <circle 
                  cx="64" cy="64" r="56" 
                  className="text-blue-600 drop-shadow-sm" 
                  strokeWidth="12" fill="none" stroke="currentColor" 
                  strokeDasharray="351.8" 
                  strokeDashoffset={351.8 - (351.8 * 86) / 100} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-slate-900">86</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Excellent</span>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 font-medium">Keyword Optimization</span>
                  <span className="text-slate-900 font-semibold">92%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 font-medium">Experience Relevance</span>
                  <span className="text-slate-900 font-semibold">75%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 font-medium">Format & Readability</span>
                  <span className="text-slate-900 font-semibold">100%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Health Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-slate-900">Resume Health</h2>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <h3 className="text-sm font-semibold text-amber-900 mb-1">Missing Metrics</h3>
              <p className="text-xs text-amber-700 leading-relaxed">Add quantifiable results to your "Senior Developer" role to boost impact.</p>
            </div>
            
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
              <h3 className="text-sm font-semibold text-emerald-900 mb-1">Skill Gap Identified</h3>
              <p className="text-xs text-emerald-700 leading-relaxed">Many target roles require 'GraphQL'. Consider adding if applicable.</p>
            </div>
          </div>

          <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
            View Full Report
          </button>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Match Stats */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-slate-900">Recent Match Stats</h2>
          </div>
          <div className="space-y-4">
            {[
              { role: "Senior Frontend Eng.", company: "Google • Remote", score: 94, color: "text-emerald-500", bg: "bg-emerald-50" },
              { role: "UX Engineer", company: "Meta • New York", score: 85, color: "text-blue-500", bg: "bg-blue-50" },
              { role: "Full Stack Dev", company: "Stripe • San Fran", score: 72, color: "text-amber-500", bg: "bg-amber-50" },
            ].map((job, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm ${job.bg} ${job.color}`}>
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{job.role}</h3>
                    <p className="text-xs text-slate-500">{job.company}</p>
                  </div>
                </div>
                <div className={`text-sm font-bold ${job.color}`}>
                  {job.score}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-slate-900">Recent Activity</h2>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-50/50">
                <tr>
                  <th className="px-4 py-2 font-medium rounded-l-lg">Document / Action</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium text-center rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 flex items-center gap-2 font-medium text-slate-900">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Resume_Tech_v4.pdf
                  </td>
                  <td className="px-4 py-3 text-slate-500">Oct 24, 2023</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 rounded-full">Analyzed</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                  </td>
                </tr>
                <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 flex items-center gap-2 font-medium text-slate-900">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    Cover Letter Generated
                  </td>
                  <td className="px-4 py-3 text-slate-500">Oct 22, 2023</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-full">Completed</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}