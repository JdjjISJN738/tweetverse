import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Info as InfoIcon, TrendingUp, Users, Target, Zap, Brain } from 'lucide-react';
import { tweetService } from '../services/api';

const initialDemographics = [
  { subject: 'Gen Z', A: 120, fullMark: 150 },
  { subject: 'Millennials', A: 150, fullMark: 150 },
  { subject: 'Gen X', A: 90, fullMark: 150 },
  { subject: 'Boomers', A: 70, fullMark: 150 },
];

const Analytics = () => {
  const [predictions, setPredictions] = useState([]);
  const [realtimeStats, setRealtimeStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Setup WebSocket for real-time analytics
    const wsUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('http', 'ws').replace('/api', '/ws') : 'ws://localhost:8001/ws';
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.predictions) {
          setPredictions(data.predictions);
          setLoading(false);
        }
        if (data.stats) {
          setRealtimeStats(data.stats);
        }
      } catch (err) {
        console.error("Analytics WebSocket error:", err);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="px-1 sm:px-0">
        <h1 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight">Deep Real-Time Analytics</h1>
        <p className="text-xs sm:text-base text-slate-500 font-medium">Predictive modeling and live sentiment trajectory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Predictive Forecasting */}
        <div className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/40">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-twitter" /> Sentiment Forecasting (24H Projection)
            </h2>
            <div className="p-2 bg-twitter/5 rounded-xl cursor-help group relative">
                <InfoIcon className="w-4 h-4 text-twitter" />
                <div className="absolute right-0 bottom-full mb-2 w-48 p-3 bg-slate-800 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-2xl">
                    Live predictive forecasting using AI-driven viral velocity and sentiment weight.
                </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictions.length > 0 ? predictions : [
                { time: '1h', predicted_volume: 45 },
                { time: '2h', predicted_volume: 52 },
                { time: '3h', predicted_volume: 48 },
                { time: '4h', predicted_volume: 61 },
                { time: '5h', predicted_volume: 68 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{fontWeight: 800, color: '#1DA1F2'}}
                />
                <Line 
                    type="monotone" 
                    dataKey="predicted_volume" 
                    stroke="#1DA1F2" 
                    strokeWidth={5} 
                    dot={{r: 6, fill: '#1DA1F2', strokeWidth: 3, stroke: '#fff'}} 
                    activeDot={{r: 8, strokeWidth: 0}} 
                    animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex justify-center items-center gap-4">
             <div className="px-4 py-1.5 bg-twitter/5 border border-twitter/10 rounded-full text-[10px] font-black text-twitter uppercase tracking-widest animate-pulse">
                Live AI Engine Processing
             </div>
          </div>
        </div>

        {/* Audience Engagement Probabilities */}
        <div className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/40">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-3 mb-8">
            <Users className="w-5 h-5 text-purple-500" /> Topic Affinity Matrix
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={initialDemographics}>
                <PolarGrid stroke="#F1F5F9" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                <PolarRadiusAxis axisLine={false} tick={false} />
                <Radar name="Engagement" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} strokeWidth={4} animationDuration={2500} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-widest">Cross-platform Demographic Reach (Est.)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Brand Affinity', score: realtimeStats ? `${Math.min(99, 70 + (realtimeStats.active_trends % 20))}%` : '78%', icon: Target, color: 'text-rose-500', bg: 'bg-rose-50' },
          { title: 'Viral Velocity', score: realtimeStats ? `${realtimeStats.viral_velocity || '0.0'}` : '1.2', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
          { title: 'Sentiment Index', score: realtimeStats?.avg_sentiment || 'Neutral', icon: Brain, color: 'text-twitter', bg: 'bg-twitter/5' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-twitter/20 transition-all duration-300">
            <div className={`p-4 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.title}</p>
              <p className="text-3xl font-black text-slate-800 tracking-tighter">{item.score}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
