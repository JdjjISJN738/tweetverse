import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use the dynamic signup to capture the name
    await signup(name, email, password);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-twitter rounded-3xl shadow-xl shadow-twitter/20 mb-6">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">TweetVerse</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Join the real-time social layer</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-2xl shadow-slate-200/50">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800 mb-1">Create Account</h2>
            <p className="text-sm text-slate-500 font-medium">Start your analysis journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-twitter transition-colors" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-4 focus:ring-twitter/10 focus:border-twitter transition-all font-semibold text-slate-700"
                  placeholder="Alex Reed"
                  required
                />
              </div>
            </div>

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
              Create Account <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-semibold">
            Already have an account? <Link to="/login" className="text-twitter hover:underline">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
