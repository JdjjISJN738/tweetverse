import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette, Zap, Check } from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [proMode, setProMode] = useState(false);

  return (
    <div className="max-w-4xl space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-1 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">System Settings</h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">Configure your TweetVerse dashboard and intelligence alerts</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-3 mb-8">
            <Palette className="w-5 h-5 text-twitter" /> Interface Preferences
          </h2>
          
          <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 gap-4">
              <div>
                <h4 className="font-black text-slate-800 text-sm">Theme Mode</h4>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1">Switch between Light and Dark interface</p>
              </div>
              <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                <button className="px-6 py-2 bg-twitter text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-twitter/20">Light</button>
                <button className="px-6 py-2 text-slate-400 hover:text-twitter rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Dark</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 gap-4">
              <div>
                <h4 className="font-black text-slate-800 text-sm">Real-time Updates</h4>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1">Auto-refresh dashboard every 30 seconds</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-8 rounded-full transition-all relative ${notifications ? 'bg-twitter' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${notifications ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Pro Features Section */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 opacity-10 transform group-hover:scale-110 transition-transform duration-700 text-twitter">
            <Zap className="w-48 h-48 fill-twitter" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-twitter/20 text-twitter text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">Premium Feature</span>
            </div>
            <h3 className="text-3xl font-black text-white mb-4">Unlock Predictive AI</h3>
            <p className="text-slate-400 font-medium max-w-lg mb-8">
                Get access to advanced bot detection algorithms, historical trend comparisons, and 1-hour viral forecasting.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                    'Advanced Bot Detection',
                    'Geo-location Sentiment',
                    'Historical Data Export',
                    'Custom Alert Keywords'
                ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-300 font-bold text-xs">
                        <div className="w-5 h-5 bg-twitter/10 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-twitter" />
                        </div>
                        {feature}
                    </div>
                ))}
            </div>

            <button className="bg-twitter text-white font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-twitter/20">
                Upgrade to Pro Plan
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-3 mb-8">
            <Shield className="w-5 h-5 text-emerald-500" /> Data & Privacy
          </h2>
          <div className="space-y-4">
            <button className="w-full text-left p-6 bg-slate-50 hover:bg-slate-100 rounded-3xl border border-slate-100 transition-all group">
                <h4 className="font-black text-slate-800 text-sm group-hover:text-twitter transition-colors">Export Account Data</h4>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1">Download all your analysis history in CSV format</p>
            </button>
            <button className="w-full text-left p-6 bg-rose-50 hover:bg-rose-100 rounded-3xl border border-rose-100 transition-all group">
                <h4 className="font-black text-rose-600 text-sm">Clear Cache</h4>
                <p className="text-xs text-rose-400 font-bold uppercase mt-1">Reset all local storage and predictive models</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
