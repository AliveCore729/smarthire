"use client";

import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { resumeService } from "@/services/resume-service";
import { UploadCloud, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResumeAnalyzerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TanStack Query Mutation for the upload
  const uploadMutation = useMutation({
    mutationFn: (file: File) => resumeService.uploadResume(file),
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  // If upload is successful, show the analysis results
  if (uploadMutation.isSuccess && uploadMutation.data) {
    const analysis = uploadMutation.data.data.analysis;
    const document = uploadMutation.data.data.resume;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analysis Complete</h1>
            <p className="text-slate-500 mt-1">Reviewing candidate profile from {document.originalName}</p>
          </div>
          <button 
            onClick={() => {
              setSelectedFile(null);
              uploadMutation.reset();
            }}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            Upload Another
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ATS Score Card */}
          <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full border-8 border-blue-100 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-blue-600">{analysis.atsScore}</span>
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">ATS Compatibility</h3>
            <p className="text-sm text-slate-500 mt-2">Based on standard semantic parsing.</p>
          </div>

          {/* Extracted Skills Card */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Verified Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-sm font-medium capitalize"
                >
                  {skill}
                </span>
              ))}
              {analysis.skills.length === 0 && (
                <p className="text-sm text-slate-500 italic">No technical skills detected.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Upload View
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resume Analyzer</h1>
        <p className="text-slate-500 mt-1">Upload a candidate's resume (PDF) to extract skills and calculate ATS compatibility.</p>
      </div>

      <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50">
        <input 
          type="file" 
          accept="application/pdf"
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <UploadCloud className="w-8 h-8" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
        </h3>
        <p className="text-sm text-slate-500 mb-6 max-w-sm">
          {selectedFile 
            ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze` 
            : "PDF files only. Maximum file size 5MB."}
        </p>

        {uploadMutation.isError && (
          <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-md text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Upload failed. Please check your backend connection.</span>
          </div>
        )}

        <div className="flex gap-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition-colors shadow-sm"
            disabled={uploadMutation.isPending}
          >
            {selectedFile ? "Change File" : "Select PDF"}
          </button>
          
          {selectedFile && (
            <button 
              onClick={handleUpload}
              disabled={uploadMutation.isPending}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Run Analysis
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}