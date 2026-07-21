"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { User, Mail, Bell, Shield, Key, Save, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Form state
  const [name, setName] = useState(user?.name || "");
  const [title, setTitle] = useState(user?.title || "");
  const [bio, setBio] = useState(user?.bio || "");

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setIsSaved(false);
    try {
      await updateProfile({ name, title, bio });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-2 font-light">Manage your account preferences and application settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          {[
            { id: "profile", label: "Public Profile", icon: User },
            { id: "account", label: "Account Details", icon: Mail },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security & Passwords", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                    : "bg-transparent text-slate-400 border border-transparent hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? "text-cyan-400" : "text-slate-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
          
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative z-10">
              <div>
                <h2 className="text-xl font-display font-semibold text-white">Profile Information</h2>
                <p className="text-sm font-light text-slate-400 mt-2">This is how others will see you on the platform.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 max-w-2xl mt-8">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Professional Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder:text-slate-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a few sentences about yourself..."
                    className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder:text-slate-600 transition-all resize-y custom-scrollbar"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex justify-end">
                <button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="px-8 py-3 bg-cyan-500 text-black rounded-xl text-sm font-semibold hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center gap-2 disabled:opacity-70 disabled:shadow-none"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isSaved ? (
                    <Check className="w-5 h-5 text-green-700" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "account" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative z-10">
              <div>
                <h2 className="text-xl font-display font-semibold text-white">Account Details</h2>
                <p className="text-sm font-light text-slate-400 mt-2">Manage your email and authentication settings.</p>
              </div>
              
              <div className="max-w-2xl space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ""}
                    disabled
                    className="w-full px-5 py-3.5 bg-black/20 border border-white/5 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs font-light text-slate-500 mt-3">Contact support to change your primary email.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Placeholders for other tabs */}
          {(activeTab === "notifications" || activeTab === "security") && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-64 flex flex-col items-center justify-center text-slate-500 relative z-10">
              <Key className="w-12 h-12 mb-4 text-slate-600" />
              <p className="font-light">This section is under construction.</p>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}