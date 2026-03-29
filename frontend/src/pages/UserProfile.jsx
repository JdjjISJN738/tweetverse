import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User, Mail, Shield, Bell, LogOut, Camera, Activity,
  CheckCircle, Edit3, Save, X
} from 'lucide-react';

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = () => {
    if (updateUser) {
       updateUser({ name, email });
    }
    setEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-twitter to-blue-500 rounded-[2.5rem] p-8 text-white overflow-hidden shadow-xl shadow-twitter/20">
        <div className="absolute inset-0 opacity-10">
          <Activity className="w-96 h-96 absolute -right-24 -top-24 rotate-12" />
        </div>
        <div className="relative flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center text-3xl font-black shadow-lg">
              {user?.avatar || (user?.name?.charAt(0) || 'A')}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow text-twitter hover:scale-110 transition-transform">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-black leading-none">{user?.name || 'Analyst'}</h1>
            <p className="text-white/70 text-xs uppercase tracking-widest font-bold mt-1">{user?.role || 'PRO ANALYST'}</p>
            {user?.provider && (
              <span className="mt-2 inline-block text-[10px] bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                via {user.provider} OAuth
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-black text-slate-800">Account Details</h2>
          {editing ? (
            <div className="flex gap-2">
              <button onClick={() => {
                setName(user?.name || '');
                setEmail(user?.email || '');
                setEditing(false);
              }} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button onClick={handleSave} className="flex items-center gap-1.5 text-xs font-bold text-twitter px-3 py-1.5 rounded-xl bg-twitter/5 hover:bg-twitter/10 transition-all">
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-twitter px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all">
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          )}
        </div>

        {[
          { label: 'Full Name', icon: User, value: name, setter: setName, type: 'text' },
          { label: 'Email Address', icon: Mail, value: email, setter: setEmail, type: 'email' },
        ].map(({ label, icon: Icon, value, setter, type }) => (
          <div key={label} className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative group">
              <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                disabled={!editing}
                className={`w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm font-semibold transition-all border ${
                  editing
                    ? 'bg-slate-50 border-slate-200 focus:outline-none focus:ring-4 focus:ring-twitter/10 focus:border-twitter text-slate-700'
                    : 'bg-transparent border-transparent text-slate-700 cursor-default'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Security & Danger Zone */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-black text-slate-800 mb-4">Security</h2>
        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-sm font-bold text-slate-700">OAuth Session Active</p>
              <p className="text-[11px] text-slate-500 font-semibold">Your account is securely authenticated.</p>
            </div>
          </div>
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        </div>

        <div className="border-t border-slate-100 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-rose-500 bg-rose-50 hover:bg-rose-100 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out of TweetVerse
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
