import React, { useState } from 'react';
import { Search, Bell, User, LogOut, Shield, Settings, Menu, X, LayoutDashboard, TrendingUp, Flame, BarChart2, Smile } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onSearch, isSearching }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: TrendingUp, label: 'Trends', path: '/trends' },
    { icon: Flame, label: 'Viral Feed', path: '/viral' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Smile, label: 'Emoji Pulse', path: '/emojis' },
  ];

  return (
    <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Mobile Menu Toggle (Left Side) */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-twitter transition-colors" />
          <input
            type="text"
            placeholder="Search trends..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-twitter/20 focus:border-twitter text-sm text-slate-700 placeholder:text-slate-400 transition-all shadow-inner"
            onKeyDown={(e) => e.key === 'Enter' && onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6 ml-4">
        <button className="hidden sm:block relative text-slate-400 hover:text-twitter transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="relative">
          <div 
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="flex items-center gap-3 pl-0 sm:pl-6 border-l-0 sm:border-l border-slate-100 cursor-pointer group select-none"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-lg transition-all transform group-hover:scale-105 ${showAccountMenu ? 'bg-twitter text-white ring-4 ring-twitter/10' : 'bg-gradient-to-tr from-twitter to-blue-400 text-white shadow-twitter/20'}`}>
              <User className="w-5 h-5" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-black text-slate-800 leading-tight">{user?.name || 'Guest Analyst'}</p>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{user?.role || 'External'}</p>
            </div>
          </div>

          {showAccountMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowAccountMenu(false)}
              ></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/60 p-2 space-y-1 animate-in slide-in-from-top-2 duration-200 z-20">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Settings</p>
                </div>
                <Link 
                  to="/profile" 
                  onClick={() => setShowAccountMenu(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-twitter/5 hover:text-twitter transition-all"
                >
                  <Settings className="w-4 h-4" /> Profile Settings
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-twitter/5 hover:text-twitter transition-all">
                  <Shield className="w-4 h-4" /> Privacy & Security
                </button>
                <div className="pt-1 mt-1 border-t border-slate-50">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Full Left-Side Mobile Navigation Drawer */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 z-50 lg:hidden transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div 
        className={`fixed top-0 left-0 h-[100dvh] w-[75vw] max-w-sm bg-white shadow-[20px_0_30px_-5px_rgba(0,0,0,0.1)] z-[60] lg:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100 shrink-0">
          <span className="text-xl font-black tracking-tight text-twitter">TweetVerse</span>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 -mr-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="px-4 py-6 flex flex-col gap-2 flex-1">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `
              w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 font-black text-sm uppercase tracking-widest
              ${isActive 
                ? 'bg-twitter text-white shadow-lg shadow-twitter/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-twitter'
              }
            `}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs tracking-widest">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      {/* Google-style loading line for global search feedback */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-twitter/10 overflow-hidden ${isSearching ? 'block' : 'hidden'}`}>
         <div className="h-full bg-twitter w-1/3 animate-indeterminate-progress origin-left"></div>
      </div>
    </header>
  );
};

export default Header;
