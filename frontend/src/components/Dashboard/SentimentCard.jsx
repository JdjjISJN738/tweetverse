import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const SentimentCard = ({ sentiment }) => {
  const hasData = sentiment && (sentiment.positive > 0 || sentiment.neutral > 0 || sentiment.negative > 0);
  const sentimentData = hasData ? [
    { name: 'Positive', value: sentiment.positive, color: '#10B981' },
    { name: 'Neutral', value: sentiment.neutral, color: '#64748B' },
    { name: 'Negative', value: sentiment.negative, color: '#EF4444' },
  ] : [{ name: 'Awaiting Data', value: 100, color: '#E2E8F0' }];

  return (
    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm h-[450px] flex flex-col transition-all duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-purple-50 rounded-xl">
          <PieChartIcon className="w-4 h-4 text-purple-500" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none">Sentiment Analysis</h2>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Pulse Distribution</p>
        </div>
      </div>
      <div className="h-56 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart 
            className={!hasData ? 'animate-pulse opacity-60' : ''}
            margin={{ top: 0, right: 10, bottom: 0, left: 10 }}
          >
            <Pie
              data={sentimentData}
              innerRadius={60}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1E293B', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className={`text-xl font-black ${hasData ? 'text-slate-800' : 'text-slate-300'}`}>{hasData ? sentiment.positive : 0}%</p>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{hasData ? 'Positive' : 'Scanning...'}</p>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2 border-t border-slate-50 pt-10">
        {sentimentData.map((s, i) => (
          <div key={i} className="text-center">
            <div className="flex items-center gap-1.5 justify-center mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></div>
                <p className="text-xs font-black text-slate-700">{s.value}%</p>
            </div>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">{s.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentCard;
