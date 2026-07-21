"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { User, Mail, Bell, Shield, Key, Save, Loader2, Check } from "lucide-react";

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
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Settings</h1>
        <p className="text-slate-600 mt-2 font-medium">Manage your account preferences and application settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-64 flex flex-col gap-1 shrink-0">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-black transition-all uppercase tracking-wide border-2 ${
                  activeTab === tab.id
                    ? "bg-lime-300 text-slate-900 border-slate-900 shadow-[4px_4px_0px_#0f172a] -translate-y-1"
                    : "bg-transparent text-slate-600 border-transparent hover:border-slate-900 hover:bg-sky-200 hover:text-slate-900 hover:shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1"
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 w-full bg-white rounded-sm border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] p-6 lg:p-8">
          
          {activeTab === "profile" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase">Profile Information</h2>
                <p className="text-sm font-bold text-slate-600 mt-2">This is how others will see you on the platform.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 max-w-2xl mt-8">
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-pink-100 border-2 border-slate-900 rounded-sm text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:shadow-[4px_4px_0px_#0f172a] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">Professional Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full px-4 py-3 bg-pink-100 border-2 border-slate-900 rounded-sm text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:shadow-[4px_4px_0px_#0f172a] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">Bio</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a few sentences about yourself..."
                    className="w-full px-4 py-3 bg-pink-100 border-2 border-slate-900 rounded-sm text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:shadow-[4px_4px_0px_#0f172a] transition-all resize-y"
                  />
                </div>
              </div>

              <div className="pt-6 border-t-2 border-slate-900 flex justify-end">
                <button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="px-6 py-3 bg-lime-300 text-slate-900 border-2 border-slate-900 rounded-sm text-sm font-black hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] flex items-center gap-2 uppercase tracking-wide disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#0f172a]">
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 border-2 border-slate-900 rounded-sm bg-white animate-spin" />
                  ) : isSaved ? (
                    <Check className="w-5 h-5 border-2 border-slate-900 rounded-sm bg-white text-emerald-600" />
                  ) : (
                    <Save className="w-5 h-5 border-2 border-slate-900 rounded-sm bg-white" />
                  )}
                  {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase">Account Details</h2>
                <p className="text-sm font-bold text-slate-600 mt-2">Manage your email and authentication settings.</p>
              </div>
              
              <div className="max-w-2xl space-y-6">
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 bg-slate-200 border-2 border-slate-900 rounded-sm text-sm font-bold text-slate-600 cursor-not-allowed shadow-[2px_2px_0px_#0f172a]"
                  />
                  <p className="text-xs font-bold text-slate-600 mt-2 uppercase tracking-wider">Contact support to change your primary email.</p>
                </div>
              </div>
            </div>
          )}

          {/* Placeholders for other tabs to keep the UI from breaking */}
          {(activeTab === "notifications" || activeTab === "security") && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 animate-in fade-in">
              <Key className="w-12 h-12 mb-3 text-slate-300" />
              <p>This section is under construction.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}