import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Repeat2, Zap, Filter, Search, MoreHorizontal, Activity, TrendingUp, Users, Target } from 'lucide-react';
import { tweetService } from '../services/api';

const ViralFeed = () => {
  const [filter, setFilter] = useState('All');
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViralTweets = async () => {
      try {
        setLoading(true);
        const res = await tweetService.getViral();
        setTweets(res.data);
      } catch (error) {
        console.error("Error fetching viral tweets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchViralTweets();

    // Setup WebSocket for real-time updates
    const wsUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('http', 'ws').replace('/api', '/ws') : 'ws://localhost:8001/ws';
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.tweet) {
          setTweets(prev => {
            const list = Array.isArray(prev) ? prev : [];
            const exists = list.some(t => t.id === data.tweet.id);
            if (exists) return list;
            return [data.tweet, ...list].slice(0, 20);
          });
        }
      } catch (err) {
        console.error("ViralFeed WebSocket error:", err);
      }
    };

    return () => ws.close();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-twitter rounded-full animate-spin"></div>
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Syncing Viral Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Viral Feed</h1>
          <p className="text-slate-500 font-medium">Real-time high-velocity social content from X</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Filter by keyword..." 
              className="bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-twitter/20 w-48 transition-all"
            />
          </div>
          <button className="p-2 text-slate-400 hover:text-twitter transition-colors"><Filter className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {['All', 'Tech', 'AI', 'Finance', 'Space', 'Entertainment'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === cat 
                ? 'bg-twitter text-white shadow-lg shadow-twitter/20' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-twitter/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {tweets.map((tweet) => (
          <div key={tweet.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Activity className="w-32 h-32 text-twitter" />
            </div>

            <div className="absolute top-0 right-0 p-8">
                <div className="text-[10px] font-black text-twitter bg-twitter/5 px-3 py-1.5 rounded-xl border border-twitter/10 shadow-sm flex items-center gap-2">
                  <Zap className="w-3 h-3 fill-twitter" /> Viral Score: {tweet.viral_score || '0.0'}
                </div>
            </div>
            
            <div className="flex gap-6 relative z-10">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-twitter border border-slate-200 shadow-sm text-xl transform group-hover:rotate-6 transition-transform">
                  {tweet.user ? tweet.user[0].toUpperCase() : 'X'}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-slate-800 text-lg leading-none group-hover:text-twitter transition-colors">{tweet.name || 'Social Analyst'}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-1.5">@{tweet.user || 'analyst'} • {tweet.timestamp ? 'Just now' : '2h'}</p>
                  </div>
                </div>
                
                <p className="text-slate-600 text-lg leading-relaxed font-semibold mb-6">
                  {tweet.text}
                </p>

                {/* Predictive Insights Panel */}
                {tweet.prediction_reason && (
                  <div className="mb-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-3 h-3 text-twitter" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Predictive Insights</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Velocity</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs font-black text-slate-700">+{tweet.viral_velocity || '0'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Est. Reach</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-twitter" />
                          <span className="text-xs font-black text-slate-700">{tweet.predicted_reach?.toLocaleString() || '0'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Growth</span>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-orange-500" />
                          <span className="text-xs font-black text-slate-700">{tweet.growth_probability || '0%'}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-twitter/20 pl-3">
                      "{tweet.prediction_reason}"
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-8 text-slate-400 border-t border-slate-50 pt-6">
                  <div className="flex items-center gap-2.5 hover:text-rose-500 transition-colors cursor-pointer group/icon">
                    <Heart className="w-5 h-5 group-hover/icon:fill-rose-500/10" />
                    <span className="text-sm font-black text-slate-500">{tweet.likes >= 1000 ? `${(tweet.likes / 1000).toFixed(1)}K` : tweet.likes}</span>
                  </div>
                  <div className="flex items-center gap-2.5 hover:text-emerald-500 transition-colors cursor-pointer group/icon">
                    <Repeat2 className="w-5 h-5" />
                    <span className="text-sm font-black text-slate-500">{tweet.retweets >= 1000 ? `${(tweet.retweets / 1000).toFixed(1)}K` : tweet.retweets}</span>
                  </div>
                  <div className="flex items-center gap-2.5 hover:text-twitter transition-colors cursor-pointer group/icon">
                    <MessageCircle className="w-5 h-5 group-hover/icon:fill-twitter/10" />
                    <span className="text-sm font-black text-slate-500">{tweet.replies >= 1000 ? `${(tweet.replies / 1000).toFixed(1)}K` : tweet.replies}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViralFeed;
