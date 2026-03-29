import React, { useState } from 'react';
import { Brain, ChevronRight } from 'lucide-react';

const InsightPanel = ({ insights, selectedHashtag, systemSource }) => {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!insights) return null;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm h-[450px] flex flex-col relative overflow-y-auto overflow-x-hidden transition-all duration-500 custom-scrollbar">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-50 rounded-xl">
            <Brain className="w-4 h-4 text-pink-500" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none">Thought Mining</h2>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Intelligence Layer</p>
          </div>
        </div>
        {systemSource && (
          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border tracking-widest uppercase ${
            systemSource === 'scraper' 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
              : 'bg-amber-50 text-amber-600 border-amber-200'
          }`}>
            {systemSource === 'scraper' ? 'LIVE (SCRAPER)' : 'HISTORIC ARCHIVE'}
          </span>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
        <div>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Public Mood</p>
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl italic text-slate-700 text-[13px] leading-relaxed shadow-inner">
            "{insights.public_mood}"
          </div>
        </div>

        <div>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2.5">AI Thematic Mining</p>
          <div className="flex flex-wrap gap-1.5">
            {insights.top_keywords.map((kw, i) => (
              <span key={i} className="text-[10px] font-black bg-twitter/5 border border-twitter/10 text-twitter px-2.5 py-1 rounded-lg hover:bg-twitter/10 transition-colors cursor-default">
                #{kw}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 pb-2">
          <h3 className="text-xs font-black text-slate-800 mb-2.5">Predictive Context</h3>
          <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
            {insights.thought_mining}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightPanel;
