"use client";

import { useAuthStore } from "@/store/auth-store";
import {
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  Briefcase,
  UploadCloud,
  Loader2,
  Brain
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useApplicationStore } from "@/store/application-store";

export default function DashboardPage() {
  // Pulling the user from the Zustand store we just built
  const {
    user,
    resume,
    uploadResume,
    loadResume,
    resumeHistory,
    loadResumeHistory,
  } = useAuthStore();
  const { applications, loadApplications } = useApplicationStore();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadResume();
    loadResumeHistory();
    loadApplications();
  }, []);
  const atsScore =
    resume?.analysis?.atsScore || 0;

  const skills =
    resume?.analysis?.skills || [];

  const education =
    resume?.analysis?.education || [];

  const keywordScore =
    Math.min(skills.length * 10, 100);

  const educationScore =
    Math.min(education.length * 20, 100);

  const missingSkills =
    resume?.analysis?.missingSkills || [];

  const suggestions =
    resume?.analysis?.suggestions || [];

  const readabilityScore =
    resume?.analysis?.extractedText
      ? Math.min(
        Math.floor(
          resume.analysis.extractedText.length /
          50
        ),
        100
      )
      : 0;

  const projects =
    resume?.analysis?.projects || [];

  const roleMatches = [
    {
      role: 'Frontend Developer',

      score:
        skills.includes('react') &&
          skills.includes('typescript')
          ? 92
          : 60,
    },

    {
      role: 'Backend Developer',

      score:
        skills.includes('node.js') &&
          skills.includes('mongodb')
          ? 88
          : 55,
    },

    {
      role: 'Full Stack Developer',

      score:
        skills.includes('react') &&
          skills.includes('node.js')
          ? 95
          : 65,
    },

    {
      role: 'Cloud Engineer',

      score:
        skills.includes('docker') &&
          skills.includes('aws')
          ? 90
          : 40,
    },
  ];

  const [isUploading, setIsUploading] = useState(false);

  const handleResumeUpload =
    async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) return;

      setIsUploading(true);
      try {
        await uploadResume(file);
      } catch (error) {
        console.error(
          "Resume upload failed",
          error,
        );
      } finally {
        setIsUploading(false);
      }
    };

  if (!resume) {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SmartHire Resume Analyzer</h1>
          <p className="text-slate-500 mt-2">Upload your resume (PDF) to extract skills, get AI suggestions, and calculate your ATS compatibility.</p>
        </div>

        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleResumeUpload}
          />

          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Drag and drop or click to upload
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">
            PDF files only. Maximum file size 5MB.
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
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
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
            Welcome back, {user?.name}.
          </h1>
          <p className="text-slate-600 mt-2 font-medium">Here is your AI-driven career overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <>
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
              className="px-6 py-2.5 bg-lime-300 border-2 border-slate-900 text-slate-900 rounded-sm text-sm font-bold hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0f172a] transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUploading ? "Uploading..." : "Upload New Resume"}
            </button>
          </>
        </div>
      </motion.div>

      {/* Top Metrics Grid */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ATS Match Score Card */}
        <div className="lg:col-span-2 bg-white border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-sm p-6 relative">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sky-200 border-2 border-slate-900 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-slate-900" />
              </div>
              <h2 className="text-lg font-black text-slate-900 uppercase">Overall ATS Match Score</h2>
            </div>
            <span className="text-xs font-bold text-slate-900 bg-amber-200 border-2 border-slate-900 px-3 py-1.5 rounded-sm shadow-[2px_2px_0px_#0f172a]">Based on top 5 targeted roles</span>
          </div>

          <div className="flex flex-col md:flex-row gap-10 relative z-10">
            {/* Circular Progress */}
            <div className="relative flex items-center justify-center shrink-0 mt-4 md:mt-0">
              <div className="w-32 h-32 rounded-full border-4 border-slate-900 bg-slate-50 flex items-center justify-center shadow-[4px_4px_0px_#0f172a] relative overflow-hidden">
                {/* SVG Progress */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="64" cy="64" r="64"
                    className="text-pink-400"
                    strokeWidth="128" fill="none" stroke="currentColor"
                    strokeDasharray="402.1"
                    strokeDashoffset={
                      402.1 - (402.1 * atsScore) / 100
                    }
                  />
                </svg>
                {/* Inner White Circle to create a donut effect, maintaining borders */}
                <div className="absolute w-24 h-24 bg-white border-4 border-slate-900 rounded-full flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900 z-10 leading-none">{atsScore}</span>
                </div>
              </div>
              <div className="absolute -bottom-3 flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider bg-lime-300 px-2 py-1 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] rounded-sm -rotate-3">Excellent</span>
              </div>
            </div>

            {/* Breakdown Bars and Missing Skills */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-900 font-bold uppercase tracking-tight">Keyword Optimization</span>
                    <span className="text-slate-900 font-black">{keywordScore}%</span>
                  </div>
                  <div className="w-full bg-white border-2 border-slate-900 h-4 rounded-sm overflow-hidden shadow-[2px_2px_0px_#0f172a]">
                    <div className="bg-lime-300 h-full border-r-2 border-slate-900" style={{ width: `${keywordScore}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-900 font-bold uppercase tracking-tight">Experience Relevance</span>
                    <span className="text-slate-900 font-black">{educationScore}%</span>
                  </div>
                  <div className="w-full bg-white border-2 border-slate-900 h-4 rounded-sm overflow-hidden shadow-[2px_2px_0px_#0f172a]">
                    <div className="bg-amber-300 h-full border-r-2 border-slate-900" style={{ width: `${educationScore}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-900 font-bold uppercase tracking-tight">Format & Readability</span>
                    <span className="text-slate-900 font-black">{readabilityScore}%</span>
                  </div>
                  <div className="w-full bg-white border-2 border-slate-900 h-4 rounded-sm overflow-hidden shadow-[2px_2px_0px_#0f172a]">
                    <div className="bg-sky-300 h-full border-r-2 border-slate-900" style={{ width: `${readabilityScore}%` }}></div>
                  </div>
                </div>
              </div>

              {missingSkills.length > 0 && (
                <div className="mt-2">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Missing Skills to Improve Score
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-xs font-medium shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real Application Stats replacing mock Top Role Matches */}
        <div className="bg-white border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-slate-900 uppercase">Application Stats</h2>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between p-3 border-2 border-slate-900 rounded-sm hover:bg-sky-200 transition-colors shadow-[2px_2px_0px_#0f172a]">
              <h3 className="text-sm font-bold text-slate-900 uppercase">Total Tracked</h3>
              <div className="text-sm font-black px-3 py-1 border-2 border-slate-900 rounded-sm bg-white shadow-[2px_2px_0px_#0f172a]">{applications.length}</div>
            </div>
            <div className="flex items-center justify-between p-3 border-2 border-slate-900 rounded-sm hover:bg-pink-200 transition-colors shadow-[2px_2px_0px_#0f172a]">
              <h3 className="text-sm font-bold text-slate-900 uppercase">Interviews</h3>
              <div className="text-sm font-black px-3 py-1 border-2 border-slate-900 rounded-sm bg-white shadow-[2px_2px_0px_#0f172a]">{applications.filter(a => a.status === 'interview').length}</div>
            </div>
            <div className="flex items-center justify-between p-3 border-2 border-slate-900 rounded-sm hover:bg-lime-300 transition-colors shadow-[2px_2px_0px_#0f172a]">
              <h3 className="text-sm font-bold text-slate-900 uppercase">Offers</h3>
              <div className="text-sm font-black px-3 py-1 border-2 border-slate-900 rounded-sm bg-white shadow-[2px_2px_0px_#0f172a]">{applications.filter(a => a.status === 'offer').length}</div>
            </div>
            <div className="flex items-center justify-between p-3 border-2 border-slate-900 rounded-sm hover:bg-slate-300 transition-colors shadow-[2px_2px_0px_#0f172a]">
              <h3 className="text-sm font-bold text-slate-900 uppercase">Rejected</h3>
              <div className="text-sm font-black px-3 py-1 border-2 border-slate-900 rounded-sm bg-white shadow-[2px_2px_0px_#0f172a]">{applications.filter(a => a.status === 'rejected').length}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Suggestions Row */}
      {suggestions.length > 0 && (
        <motion.div variants={item} className="bg-pink-200 rounded-sm border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] p-6 relative">
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-8 h-8 bg-white border-2 border-slate-900 rounded-sm flex items-center justify-center shadow-[2px_2px_0px_#0f172a]">
              <TrendingUp className="w-4 h-4 text-slate-900" />
            </div>
            <h2 className="text-lg font-black text-slate-900 uppercase">AI Improvement Suggestions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => {
              // Simple markdown parser to make **text** bold
              const parts = suggestion.split('**');
              return (
                <div key={index} className="bg-white p-4 rounded-sm border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] transition-all relative z-10">
                  <p className="text-sm text-slate-900 leading-relaxed font-medium">
                    {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-slate-900 font-black">{part}</strong> : <span key={i}>{part}</span>)}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Bottom Row */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills Section */}
        <div className="bg-white rounded-sm border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-slate-900 uppercase">
              Extracted Skills
            </h2>

            <span className="text-xs text-slate-500">
              AI detected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map(
              (skill, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 bg-lime-200 text-slate-900 rounded-sm text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] uppercase"
                >
                  {skill}
                </div>
              ),
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-sm border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-slate-900 uppercase">Recent Activity</h2>
            <button className="text-xs font-bold text-slate-900 bg-sky-200 px-3 py-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0f172a] transition-all rounded-sm uppercase">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-900 uppercase bg-pink-200 border-b-2 border-slate-900">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-l-lg">Document / Action</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {resumeHistory.map(
                  (item, index) => (
                    <tr
                      key={index}
                      className="border-b-2 border-slate-900 hover:bg-lime-50 transition-colors"
                    >
                      <td className="px-4 py-4 flex items-center gap-3 font-bold text-slate-900">
                        <div className="p-2 bg-sky-200 border-2 border-slate-900 rounded-sm shadow-[2px_2px_0px_#0f172a]">
                          <FileText className="w-4 h-4 text-slate-900" />
                        </div>
                        {item.resumeName}
                      </td>

                      <td className="px-4 py-4 font-bold text-slate-600">
                        {new Date(
                          item.createdAt,
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-900 bg-amber-200 border-2 border-slate-900 rounded-sm shadow-[2px_2px_0px_#0f172a]">
                          ATS {item.atsScore}%
                        </span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* AI Resume Summary */}
      <motion.div variants={item} className="bg-white p-6 rounded-sm border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] relative">
        <h3 className="text-lg font-black text-slate-900 uppercase mb-4 flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 bg-lime-300 border-2 border-slate-900 rounded-sm flex items-center justify-center shadow-[2px_2px_0px_#0f172a]">
            <Brain className="w-4 h-4 text-slate-900" />
          </div>
          AI Resume Summary
        </h3>
        <div className="bg-slate-50 border-2 border-slate-900 rounded-sm p-5 relative z-10 shadow-inner">
          <p className="text-sm leading-7 text-slate-900 font-medium">
            {resume?.analysis?.summary || `Candidate demonstrates strong capabilities with experience in ${skills?.slice(0, 5).join(", ")}. The resume reflects solid technical exposure, relevant project experience, and good ATS optimization.`}
          </p>
        </div>
      </motion.div>

      {/* Resume Text */}
      {resume?.analysis?.extractedText && (
        <motion.div variants={item} className="bg-white p-6 rounded-sm border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a]">
          <h3 className="text-lg font-black text-slate-900 uppercase mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-200 border-2 border-slate-900 rounded-sm flex items-center justify-center shadow-[2px_2px_0px_#0f172a]">
              <FileText className="w-4 h-4 text-slate-900" />
            </div>
            Extracted Resume Text
          </h3>
          <div className="bg-slate-900 border-2 border-slate-900 rounded-sm p-4 max-h-[400px] overflow-y-auto custom-scrollbar shadow-inner">
            <pre className="whitespace-pre-wrap text-sm text-lime-300 leading-relaxed font-mono font-bold">
              {resume.analysis.extractedText}
            </pre>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}