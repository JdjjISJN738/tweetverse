import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Flame, BarChart2, Settings, HelpCircle, Activity, Smile } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: TrendingUp, label: 'Trends', path: '/trends' },
    { icon: Flame, label: 'Viral Feed', path: '/viral' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Smile, label: 'Emoji Pulse', path: '/emojis' },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col h-full shadow-sm z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-twitter p-2 rounded-xl shadow-lg shadow-twitter/20">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-black tracking-tight text-slate-800">TweetVerse</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) => `
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm
              ${isActive 
                ? 'bg-twitter text-white shadow-md shadow-twitter/20 translate-x-1' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-twitter'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-6 border-t border-slate-100 space-y-1.5">
        <NavLink
          to="/settings"
          className={({ isActive }) => `
            w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm
            ${isActive 
              ? 'bg-slate-100 text-twitter' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-twitter'
            }
          `}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
        
        <NavLink
          to="/support"
          className={({ isActive }) => `
            w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm
            ${isActive 
              ? 'bg-slate-100 text-twitter' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-twitter'
            }
          `}
        >
          <HelpCircle className="w-5 h-5" />
          <span>Support</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
