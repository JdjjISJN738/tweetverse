import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Github, Chrome, Mail, Lock, Activity, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, oauthLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/');
  };

  const handleOAuth = async (provider) => {
    await oauthLogin(provider);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-twitter rounded-3xl shadow-xl shadow-twitter/20 mb-6 animate-bounce-subtle">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">TweetVerse</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Real-Time Intelligence Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-2xl shadow-slate-200/50">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800 mb-1">Welcome Back</h2>
            <p className="text-sm text-slate-500 font-medium">Log in to your analyst dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-twitter transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-4 focus:ring-twitter/10 focus:border-twitter transition-all font-semibold text-slate-700"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-twitter transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-4 focus:ring-twitter/10 focus:border-twitter transition-all font-semibold text-slate-700"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-twitter text-white font-black py-4 rounded-2xl shadow-lg shadow-twitter/30 hover:shadow-twitter/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4"
            >
              Enter Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Or Secure Login via</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleOAuth('Github')}
              className="flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all font-bold text-slate-700 text-sm"
            >
              <Github className="w-5 h-5" /> Github
            </button>
            <button 
              onClick={() => handleOAuth('Google')}
              className="flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all font-bold text-slate-700 text-sm"
            >
              <Chrome className="w-5 h-5" /> Google
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 font-semibold">
            New analyst? <Link to="/signup" className="text-twitter hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
