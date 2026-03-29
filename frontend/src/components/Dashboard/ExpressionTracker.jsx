import React from 'react';

const ExpressionTracker = ({ expressions }) => {
  if (!expressions) return null;

  const { emotion_distribution = {}, total_signals = 0 } = expressions;

  const emotionColors = {
    joy: 'bg-yellow-400',
    sadness: 'bg-blue-400',
    anger: 'bg-red-500',
    fear: 'bg-indigo-500',
    surprise: 'bg-orange-400'
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-lg font-black text-slate-800">Expressions Now</h2>
        {total_signals > 0 && (
          <span className="text-[9px] font-black px-2.5 py-1 rounded-full border tracking-widest uppercase bg-amber-50 text-amber-600 border-amber-200">
            {total_signals} SIGNALS
          </span>
        )}
      </div>

      <div className="space-y-6 flex-1">

        <div>
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Emotion Distribution</h3>
           {Object.keys(emotion_distribution).length > 0 ? (
             <div className="space-y-3">
               {Object.entries(emotion_distribution).map(([emotion, percentage]) => (
                 <div key={emotion} className="space-y-1">
                   <div className="flex justify-between text-xs font-black text-slate-600 uppercase">
                     <span>{emotion}</span>
                     <span>{percentage}%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div 
                       className={`h-full ${emotionColors[emotion] || 'bg-slate-400'} rounded-full transition-all duration-500 ease-out`}
                       style={{ width: `${percentage}%` }}
                     />
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <p className="text-xs font-medium text-slate-400 italic">Waiting for emotional signals...</p>
           )}
        </div>
      </div>
    </div>
  );
};

export default ExpressionTracker;
