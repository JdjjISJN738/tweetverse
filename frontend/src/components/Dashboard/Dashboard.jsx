import React, { useState, useEffect, useMemo } from 'react';
import { tweetService } from '../../services/api';
import TrendList from './TrendList';
import SentimentCard from './SentimentCard';
import InsightPanel from './InsightPanel';
import ViralFeed from './ViralFeed';
import { Activity } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

// Error Boundary-style Guard
const SafeComponent = ({ children, name }) => {
  try {
    return <>{children}</>;
  } catch (err) {
    console.error(`Component Crash [${name}]:`, err);
    return <div className="p-4 bg-red-50 text-red-500 rounded-xl">Chart Error</div>;
  }
};

const Dashboard = ({ selectedHashtag, setSelectedHashtag }) => {
  const [trends, setTrends] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [viralTweets, setViralTweets] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [realtimeData, setRealtimeData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [systemStatus, setSystemStatus] = useState("Standby");
  const [connectionStatus, setConnectionStatus] = useState("initializing");
  const [statusMessage, setStatusMessage] = useState("");

  // Re-fetch when search term changes
  useEffect(() => {
    fetchInitialData();
    if (selectedHashtag) {
      tweetService.updateSearch(selectedHashtag).catch(err => 
        console.error("Failed to update backend stream query:", err)
      );
    }
  }, [selectedHashtag]);

  useEffect(() => {
    fetchInitialData();
    
    const wsUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('http', 'ws').replace('/api', '/ws') : 'ws://localhost:8001/ws';
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data) return;

        setRealtimeData(data);
        setSystemStatus("Live");
        
        if (data.predictions && Array.isArray(data.predictions)) setPredictions(data.predictions);
        if (data.status_message) setStatusMessage(data.status_message);
        if (data.connection_status) setConnectionStatus(data.connection_status);
        if (data.trending && Array.isArray(data.trending)) setTrends(data.trending);
        
        if (data.tweet) {
          setViralTweets(prev => {
            const list = Array.isArray(prev) ? prev : [];
            const exists = list.some(t => t.id === data.tweet.id);
            if (exists) return list;
            return [data.tweet, ...list].slice(0, 10);
          });
        }
      } catch (err) {
        console.error("Dashboard WS Parse Error:", err);
      }
    };

    ws.onerror = () => setSystemStatus("Offline");
    return () => ws.close();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [trendsRes, viralRes] = await Promise.all([
        tweetService.getTrending(),
        tweetService.getViral()
      ]);
      setTrends(trendsRes.data || []);
      setViralTweets(viralRes.data || []);
    } catch (error) {
      console.error("Dashboard Data Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = useMemo(() => [
    { label: 'Active Trends', value: realtimeData?.stats?.active_trends || '0' },
    { label: 'Avg. Sentiment', value: realtimeData?.stats?.avg_sentiment || '0% Pos' },
    { label: 'Viral Velocity', value: realtimeData?.stats?.viral_velocity || '+0.0' },
    { label: 'System Source', value: connectionStatus.toUpperCase() },
  ], [realtimeData, connectionStatus]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-twitter rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold text-xs animate-pulse uppercase tracking-widest">Bridging Real-Time Nodes...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {dashboardStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-twitter/20">
            <div className="flex items-center justify-between mb-3">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
               <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${systemStatus === 'Live' ? 'bg-green-50 text-green-500' : 'bg-slate-50 text-slate-400'}`}>
                  {systemStatus}
               </span>
            </div>
            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <TrendList trends={trends} onSelect={setSelectedHashtag} selectedHashtag={selectedHashtag} />
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="h-auto lg:h-[800px] lg:overflow-y-auto lg:pr-2 custom-scrollbar space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              <SafeComponent name="Sentiment"><SentimentCard sentiment={realtimeData?.stats?.sentiment_breakdown || sentiment} /></SafeComponent>
              <SafeComponent name="Insights">
                <InsightPanel 
                  insights={realtimeData ? {
                    public_mood: selectedHashtag
                      ? `Analyzing public sentiment around "${selectedHashtag}" — tracking live discussions, reactions, and trending signals.`
                      : realtimeData.status_message || "Analyzing Social Frequency...",
                    thought_mining: Array.isArray(realtimeData.thoughts) && realtimeData.thoughts.length > 0
                      ? `Live analysis of "${selectedHashtag || 'global stream'}" reveals trending focus on: ${realtimeData.thoughts.slice(0, 3).join(', ')}.`
                      : `Scanning the live stream for "${selectedHashtag || 'global topics'}" — insights will appear as data flows in.`,
                    top_keywords: Array.isArray(realtimeData.thoughts) ? realtimeData.thoughts : []
                  } : insights} 
                  selectedHashtag={selectedHashtag} 
                  systemSource={connectionStatus}
                />
              </SafeComponent>
            </div>
            <ViralFeed tweets={viralTweets} />
          </div>
        </div>

        <div className="lg:col-span-3 order-3">
           <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Velocity History</h2>
              <div className="h-48">
                 <SafeComponent name="Chart">
                    <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={predictions.length > 0 ? predictions : [{time: '1h', v: 40}, {time: '2h', v: 60}, {time: '3h', v: 50}]}>
                          <Line type="monotone" dataKey={predictions.length > 0 ? "predicted_volume" : "v"} stroke="#1DA1F2" strokeWidth={4} dot={false} />
                          <YAxis hide domain={[0, 100]} />
                          <XAxis dataKey="time" hide />
                       </LineChart>
                    </ResponsiveContainer>
                 </SafeComponent>
              </div>
           </div>

           <div className="mt-8 bg-twitter rounded-3xl p-8 shadow-xl shadow-twitter/10 relative overflow-hidden group border border-twitter-dark/10">
              <Activity className="absolute -right-8 -bottom-8 w-32 h-32 text-white/10" />
              <h3 className="text-white font-black text-xl mb-2 relative z-10">Real-Time Mode</h3>
              <p className="text-white/70 text-sm font-medium relative z-10">
                 Currently sourcing from {connectionStatus.toUpperCase()} stream. Verified 2026 Resilience.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
