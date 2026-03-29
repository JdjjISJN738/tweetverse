import React from 'react';
import { TrendingUp } from 'lucide-react';

const TrendList = ({ trends, selectedHashtag, onSelect }) => {
  return (
    <div className="bg-white rounded-[2rem] lg:rounded-3xl p-5 md:p-6 border border-slate-200 shadow-sm lg:h-[420px] overflow-y-auto overflow-x-hidden relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black flex items-center gap-2.5 text-slate-800">
          <TrendingUp className="w-5 h-5 text-twitter" /> Trending Now
        </h2>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global</span>
      </div>
      <div className="space-y-1.5">
        {trends.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => onSelect(item.hashtag)}
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 group ${
              selectedHashtag === item.hashtag 
                ? 'bg-twitter bg-opacity-5 border border-twitter/20 shadow-sm' 
                : 'hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className={`font-bold transition-colors ${selectedHashtag === item.hashtag ? 'text-twitter' : 'text-slate-700 group-hover:text-twitter'}`}>
                  {item.hashtag}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-bold uppercase">{(item.volume / 1000).toFixed(1)}K Tweets</p>
              </div>
              <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                item.growth_rate > 0 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                  : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}>
                {item.growth_rate > 0 ? '↑' : '↓'} {Math.abs(item.growth_rate)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendList;
