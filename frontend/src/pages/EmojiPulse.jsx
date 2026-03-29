import React, { useState, useEffect } from 'react';
import { Smile, Zap } from 'lucide-react';

const EmojiPulse = ({ selectedHashtag }) => {
  const [emojis, setEmojis] = useState([]);
  const [totalMentions, setTotalMentions] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Open a dedicated WebSocket to receive the lively stream
    const wsUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('http', 'ws').replace('/api', '/ws') : 'ws://localhost:8001/ws';
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => setIsConnected(true);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setIsProcessing(true);
        
        if (data?.expressions?.all_emojis) {
          setEmojis(data.expressions.all_emojis);
        }
        if (data?.expressions?.total_mentions !== undefined) {
          setTotalMentions(data.expressions.total_mentions);
        }

        // Pulse the processing state
        setTimeout(() => setIsProcessing(false), 800);
      } catch (err) {
        console.error(err);
      }
    };

    ws.onclose = () => setIsConnected(false);

    return () => ws.close();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div className="bg-twitter p-6 lg:p-8 rounded-3xl shadow-xl shadow-twitter/10 relative overflow-hidden group">
         <Smile className="absolute -right-8 -top-8 w-48 h-48 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
         <div className="relative z-10">
           <h1 className="text-2xl sm:text-3xl font-black text-white mb-4 lg:mb-2">3,790 Unicode Emoji Pulse</h1>
           <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
             <p className="text-white/80 font-medium text-sm sm:text-base">
               Monitoring signals for 
               <span className="font-black bg-white/20 px-2 py-1 rounded ml-1 sm:ml-2">
                 {selectedHashtag || 'Global Trends'}
               </span>
             </p>
             <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 w-fit">
               <span className="text-white font-black text-xl">{totalMentions.toLocaleString()}</span>
               <span className="text-white/60 text-[10px] uppercase font-bold ml-2 tracking-tighter">Live Mentions</span>
             </div>
           </div>
           {!isConnected && (
             <p className="mt-4 text-xs font-black text-yellow-300 uppercase tracking-widest flex items-center gap-2">
               <Zap className="w-4 h-4 animate-pulse" /> Connecting to stream...
             </p>
           )}
         </div>
         {/* Google-style loading line below the box */}
         <div className={`absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden ${(isProcessing || (emojis.length === 0 && isConnected)) ? 'block' : 'hidden'}`}>
            <div className="h-full bg-white w-1/3 animate-indeterminate-progress origin-left"></div>
         </div>
      </div>

      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center relative">
         {emojis.length > 0 ? (
           <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 justify-center items-center align-middle">
             {emojis.map((item, idx) => {
               const baseSize = 1.8;
               const sizeScaling = Math.min(item.count * 0.4, 3.5);
               const fontSize = `${baseSize + sizeScaling}rem`;
               
               return (
                 <div 
                   key={idx} 
                   className="animate-in zoom-in duration-300 transition-all hover:scale-125 cursor-default flex flex-col items-center justify-center group"
                   style={{ fontSize }}
                   title={`${item.emoji}: ${item.count} mentions`}
                 >
                   <span className="drop-shadow-sm">{item.emoji}</span>
                   <div className="h-0 group-hover:h-6 overflow-hidden transition-all duration-300">
                     <span className="text-[12px] font-black text-twitter bg-twitter/5 px-2 py-0.5 rounded-full whitespace-nowrap">
                       {item.count} hits
                     </span>
                   </div>
                 </div>
               );
             })}
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
             <div className="relative">
                <div className="w-20 h-20 border-4 border-slate-100 border-t-twitter rounded-full animate-spin"></div>
                <Smile className="absolute inset-0 m-auto w-8 h-8 text-twitter animate-bounce" />
             </div>
             <div className="mt-8 text-center">
                <p className="font-black text-slate-800 text-lg uppercase tracking-tight">Waiting for expressive signals on the lively stream...</p>
                <p className="text-slate-400 font-medium mt-1 italic">Scanning social datasets for {selectedHashtag || 'Global Trends'}</p>
             </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default EmojiPulse;
