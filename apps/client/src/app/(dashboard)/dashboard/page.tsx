"use client";

import { useAuthStore } from "@/store/auth-store";
import {
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  Loader2,
  Brain,
  ChevronRight
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useApplicationStore } from "@/store/application-store";

export default function DashboardPage() {
  const {
    user,
    resume,
    uploadResume,
    loadResume,
    resumeHistory,
    loadResumeHistory,
  } = useAuthStore();
  const { applications, loadApplications } = useApplicationStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadResume();
    loadResumeHistory();
    loadApplications();
  }, []);

  const atsScore = resume?.analysis?.atsScore || 0;
  const skills = resume?.analysis?.skills || [];
  const education = resume?.analysis?.education || [];
  const keywordScore = Math.min(skills.length * 10, 100);
  const educationScore = Math.min(education.length * 20, 100);
  const missingSkills = resume?.analysis?.missingSkills || [];
  const suggestions = resume?.analysis?.suggestions || [];
  const readabilityScore = resume?.analysis?.extractedText
    ? Math.min(Math.floor(resume.analysis.extractedText.length / 50), 100)
    : 0;

  const [isUploading, setIsUploading] = useState(false);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadResume(file);
    } catch (error) {
      console.error("Resume upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!resume) {
    return (
      <div className="max-w-3xl mx-auto mt-10 md:mt-20">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">AI Resume Analyzer</h1>
          <p className="text-slate-400 mt-3 text-lg font-light">Upload your resume to instantly extract skills, get AI suggestions, and calculate your ATS compatibility.</p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all hover:border-cyan-500/30 hover:bg-white/10 group relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-cyan-500/30 transition-colors" />
          
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleResumeUpload}
          />

          <div className="w-20 h-20 bg-white/5 border border-white/10 text-cyan-400 rounded-full flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-semibold text-white mb-2 relative z-10">
            Drag and drop or click to upload
          </h3>
          <p className="text-sm text-slate-400 mb-8 max-w-sm relative z-10">
            PDF files only. Maximum file size 5MB.
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-medium hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative z-10"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Select PDF Resume
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
            Welcome back, {user?.name}.
          </h1>
          <p className="text-slate-400 mt-2 font-light">Here is your AI-driven career overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            onChange={handleResumeUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-5 py-2.5 bg-white/5 border border-white/10 text-white hover:text-cyan-400 rounded-lg text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUploading ? "Uploading..." : "Upload New Resume"}
          </button>
        </div>
      </motion.div>

      {/* Top Metrics Grid */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ATS Match Score Card */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-display font-semibold text-white">Overall ATS Match Score</h2>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">Top targeted roles</span>
          </div>

          <div className="flex flex-col md:flex-row gap-12 relative z-10">
            {/* Circular Progress */}
            <div className="relative flex items-center justify-center shrink-0 mt-4 md:mt-0">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Background Track */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="72" className="text-white/5" strokeWidth="12" fill="none" stroke="currentColor" />
                </svg>
                {/* Foreground Progress (Neon Cyan) */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                  <circle
                    cx="80" cy="80" r="72"
                    className="text-cyan-400"
                    strokeWidth="12" fill="none" stroke="currentColor"
                    strokeLinecap="round"
                    strokeDasharray="452.4"
                    strokeDashoffset={452.4 - (452.4 * atsScore) / 100}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-display font-bold text-white leading-none">{atsScore}</span>
                  <span className="text-xs text-slate-400 mt-1">/ 100</span>
                </div>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="flex-1 flex flex-col gap-6 justify-center">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-medium tracking-wide">Keyword Optimization</span>
                    <span className="text-cyan-400 font-semibold">{keywordScore}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: `${keywordScore}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-medium tracking-wide">Experience Relevance</span>
                    <span className="text-blue-400 font-semibold">{educationScore}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]" style={{ width: `${educationScore}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-medium tracking-wide">Format & Readability</span>
                    <span className="text-purple-400 font-semibold">{readabilityScore}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full shadow-[0_0_10px_rgba(192,132,252,0.5)]" style={{ width: `${readabilityScore}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real Application Stats */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col relative overflow-hidden">
           <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />
           <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="text-xl font-display font-semibold text-white">Application Pipeline</h2>
          </div>
          <div className="flex-1 space-y-3 relative z-10">
            <div className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors group">
              <h3 className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Total Tracked</h3>
              <div className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-md">{applications.length}</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 rounded-xl transition-colors group">
              <h3 className="text-sm font-medium text-blue-300 group-hover:text-blue-200 transition-colors">Interviews</h3>
              <div className="text-sm font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md">{applications.filter(a => a.status === 'interview').length}</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/10 rounded-xl transition-colors group">
              <h3 className="text-sm font-medium text-cyan-300 group-hover:text-cyan-200 transition-colors">Offers</h3>
              <div className="text-sm font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-md">{applications.filter(a => a.status === 'offer').length}</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors group">
              <h3 className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Rejected</h3>
              <div className="text-sm font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-md">{applications.filter(a => a.status === 'rejected').length}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Suggestions Row */}
      {suggestions.length > 0 && (
        <motion.div variants={item} className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 backdrop-blur-md p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-display font-semibold text-white">AI Improvement Suggestions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
            {suggestions.map((suggestion, index) => {
              const parts = suggestion.split('**');
              return (
                <div key={index} className="bg-black/20 p-5 rounded-xl border border-white/5 hover:bg-black/40 hover:border-indigo-500/30 transition-all">
                  <p className="text-sm text-slate-300 leading-relaxed font-light">
                    {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-indigo-300 font-semibold">{part}</strong> : <span key={i}>{part}</span>)}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Missing Skills Warning */}
      {missingSkills.length > 0 && (
        <motion.div variants={item} className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-amber-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Missing Skills Detected
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bottom Row */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills Section */}
        <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md p-8 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-display font-semibold text-white">
              Extracted Skills
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-xs font-medium"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md p-8 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-display font-semibold text-white">Recent Activity</h2>
            <button className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 font-medium">Document / Action</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {resumeHistory.slice(0,4).map((item, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 flex items-center gap-3 font-medium text-slate-200">
                      <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      {item.resumeName}
                    </td>
                    <td className="px-4 py-4 text-slate-400 font-light">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 text-xs font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-md">
                        {item.atsScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}