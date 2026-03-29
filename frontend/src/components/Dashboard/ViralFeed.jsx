import React from 'react';
import { Heart, MessageCircle, Repeat2, Zap, MoreHorizontal, User, TrendingUp, Users, Target, Activity } from 'lucide-react';

const ViralFeed = ({ tweets, hashtag }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-50 rounded-2xl">
            <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Viral Intelligence</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Real-time Feed for {hashtag || 'Global'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Stream</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {tweets.map((tweet) => (
          <div key={tweet.id} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-twitter/30 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 group relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Activity className="w-32 h-32 text-twitter" />
            </div>

            {/* Viral Score Badge */}
            <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm z-10">
                <Zap className="w-3 h-3 text-twitter fill-twitter/20" />
                <span className="text-[10px] font-black text-twitter">{tweet.viral_score || '0.0'}</span>
            </div>

            <div className="flex gap-5 relative z-10">
              {/* Profile Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-twitter shadow-sm transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <User className="w-5 h-5" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800 text-base group-hover:text-twitter transition-colors">{tweet.name || 'Social Analyst'}</span>
                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                      <span className="text-xs font-bold text-slate-400">{tweet.timestamp ? 'Just now' : '2h'}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">@{tweet.user || 'analyst'}</p>
                  </div>
                </div>

                <p className="text-slate-600 text-base leading-relaxed font-semibold mt-4 pr-12">
                  {tweet.text}
                </p>

                {/* Predictive Insights Panel */}
                {tweet.prediction_reason && (
                  <div className="mt-5 p-4 bg-white/60 rounded-2xl border border-slate-100/80 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-3 h-3 text-twitter" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Predictive Analytics</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Viral Velocity</span>
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
                        <span className="text-[8px] font-black text-slate-400 uppercase">Growth Prob.</span>
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

                {/* Metrics & Sentiment */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-8 mt-6 pt-4 border-t border-slate-100/50">
                  <div className="flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-pointer group/stat">
                    <div className="p-2 rounded-xl group-hover/stat:bg-rose-50 transition-colors">
                      <Heart className="w-4 h-4 group-hover/stat:fill-rose-500/20" />
                    </div>
                    <span className="text-[11px] font-black text-slate-500">
                        {tweet.likes >= 1000 ? `${(tweet.likes / 1000).toFixed(1)}K` : tweet.likes}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors cursor-pointer group/stat">
                    <div className="p-2 rounded-xl group-hover/stat:bg-emerald-50 transition-colors">
                      <Repeat2 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-black text-slate-500">
                        {tweet.retweets >= 1000 ? `${(tweet.retweets / 1000).toFixed(1)}K` : tweet.retweets}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 hover:text-twitter transition-colors cursor-pointer group/stat">
                    <div className="p-2 rounded-xl group-hover/stat:bg-twitter/5 transition-colors">
                      <MessageCircle className="w-4 h-4 group-hover/stat:fill-twitter/20" />
                    </div>
                    <span className="text-[11px] font-black text-slate-500">
                        {tweet.replies >= 1000 ? `${(tweet.replies / 1000).toFixed(1)}K` : tweet.replies}
                    </span>
                  </div>

                  <div className="ml-auto sm:ml-auto">
                    <div className={`px-2.5 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest whitespace-nowrap bg-white border border-slate-200 shadow-sm ${
                      tweet.sentiment === 'Positive' ? 'text-emerald-600 border-emerald-100 bg-emerald-50/30' :
                      tweet.sentiment === 'Negative' ? 'text-rose-600 border-rose-100 bg-rose-50/30' :
                      'text-slate-500 border-slate-200 bg-slate-50/30'
                    }`}>
                      {tweet.sentiment || 'Neutral'} Sentiment
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-white hover:shadow-lg border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-twitter transition-all">
        View Full Stream Analysis
      </button>
    </div>
  );
};

export default ViralFeed;
