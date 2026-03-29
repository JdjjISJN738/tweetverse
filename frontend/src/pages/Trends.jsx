import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Clock, Globe, ArrowUpRight } from 'lucide-react';
import { tweetService } from '../services/api';

const Trends = () => {
  const [activeTrends, setActiveTrends] = useState([]);
  const [topTrend, setTopTrend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Fetch
    const fetchTrends = async () => {
        try {
            setLoading(true);
            const res = await tweetService.getTrending();
            if (res.data && res.data.length > 0) {
                const formatted = res.data.map(t => ({
                    hashtag: t.hashtag,
                    volume: `${(t.volume / 1000).toFixed(1)}K`,
                    growth: `${t.growth_rate > 0 ? '+' : ''}${t.growth_rate}%`,
                    status: t.growth_rate > 20 ? 'Sprinting' : t.growth_rate > 10 ? 'Rising' : 'Stable',
                    reason: `High social velocity for ${t.hashtag} detected in recent nodes.`
                }));
                setActiveTrends(formatted);
                setTopTrend(formatted[0]);
            }
        } catch (err) {
            console.error("Error fetching trends:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchTrends();

    // 2. WebSocket for Real-time Updates
    const wsUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('http', 'ws').replace('/api', '/ws') : 'ws://localhost:8001/ws';
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.trending && data.trending.length > 0) {
                const formatted = data.trending.map(t => ({
                    hashtag: t.hashtag,
                    volume: `${(t.volume / 1000).toFixed(1)}K`,
                    growth: `${t.growth_rate > 0 ? '+' : ''}${t.growth_rate}%`,
                    status: t.growth_rate > 20 ? 'Sprinting' : t.growth_rate > 10 ? 'Rising' : 'Stable',
                    reason: `Real-time spike detected for ${t.hashtag}.`
                }));
                setActiveTrends(formatted);
                // Update top trend if the new list has a higher growth top
                if (formatted[0]) setTopTrend(formatted[0]);
            }
        } catch (err) {
            console.error("Trends WebSocket error:", err);
        }
    };

    return () => ws.close();
  }, []);

  if (loading && activeTrends.length === 0) return (
      <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-twitter rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Compiling Global Trends...</p>
      </div>
  );

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 md:gap-3">
             <Globe className="w-5 h-5 md:w-8 md:h-8 text-twitter" /> Global Live Trends
          </h1>
          <p className="text-xs sm:text-base text-slate-500 font-medium">Real-time volume and growth rate tracking</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button className="px-4 py-2 bg-twitter text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-twitter/20 animate-pulse">Live Tracking</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Trend Volume Chart */}
        <div className="lg:col-span-2 bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-200 shadow-sm transform transition-all hover:shadow-xl hover:shadow-slate-200/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-3">
              <Clock className="w-5 h-5 text-twitter" /> Volume Timeline ({topTrend?.hashtag || '#Scanning'})
            </h2>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 tracking-widest">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-twitter animate-ping"></div> Live Monitoring</div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                  { time: '10:00', volume: 4000 },
                  { time: '12:00', volume: 5500 },
                  { time: '14:00', volume: 4800 },
                  { time: '16:00', volume: topTrend ? parseInt(topTrend.volume) * 800 : 7000 },
                  { time: '18:00', volume: topTrend ? parseInt(topTrend.volume) * 900 : 8500 },
                  { time: 'Now', volume: topTrend ? parseInt(topTrend.volume) * 1000 : 9500 },
              ]}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1DA1F2" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#1DA1F2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{color: '#1DA1F2', fontWeight: 800}}
                />
                <Area type="monotone" dataKey="volume" stroke="#1DA1F2" strokeWidth={5} fillOpacity={1} fill="url(#colorVolume)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Growth Card */}
        {topTrend && (
            <div className={`p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] shadow-xl shadow-twitter/20 relative overflow-hidden group transition-all duration-500 bg-twitter`}>
            <div className="absolute -right-8 -bottom-8 opacity-10 transform group-hover:scale-110 transition-transform duration-700">
                <TrendingUp className="w-48 h-48 text-white" />
            </div>
            <div className="relative z-10 h-full flex flex-col">
                <p className="text-twitter-dark/60 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Fastest Growing Node</p>
                <h3 className="text-2xl sm:text-4xl font-black text-white mb-2 tracking-tighter">{topTrend.hashtag}</h3>
                <div className="mt-auto">
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-5xl font-black text-white">{topTrend.growth}</span>
                    <span className="text-white/60 font-bold">In last cycle</span>
                </div>
                <p className="text-white/80 text-sm mt-4 font-medium leading-relaxed">
                    {topTrend.reason} Analysis indicates viral saturation probability is high.
                </p>
                <button className="mt-8 w-full bg-white text-twitter py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all hover:scale-[1.02] shadow-lg">
                    Deep Dive Archive
                </button>
                </div>
            </div>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeTrends.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-twitter/30 transition-all group cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-twitter/5 transition-colors">
                <Globe className="w-4 h-4 text-slate-400 group-hover:text-twitter" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${item.growth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {item.growth}
              </span>
            </div>
            <h4 className="font-black text-slate-800 group-hover:text-twitter transition-colors text-lg tracking-tight">{item.hashtag}</h4>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.volume} Mentions</span>
              <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                  item.status === 'Sprinting' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
              }`}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trends;
