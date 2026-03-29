import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  MessageCircle, 
  Heart, 
  Repeat2, 
  PieChart as PieChartIcon, 
  Activity, 
  Brain, 
  AlertCircle,
  Search,
  ChevronRight,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8001';

const Dashboard = () => {
  const [trends, setTrends] = useState([]);
  const [selectedHashtag, setSelectedHashtag] = useState('#AI');
  const [sentiment, setSentiment] = useState(null);
  const [viralTweets, setViralTweets] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [influencers, setInfluencers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('initializing');

  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    fetchInitialData();
    
    // Setup WebSocket
    const wsUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('http', 'ws').replace('/api', '/ws') : 'ws://localhost:8001/ws';
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('📡 Connected to TweetVerse Real-Time Stream');
      setWsConnected(true);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📥 WebSocket Data:', data);
      
      // Update Viral Feed
      if (data.tweet) {
        setViralTweets(prev => [data.tweet, ...prev].slice(0, 10));
      }

      if (data.connection_status) {
        setConnectionStatus(data.connection_status);
      }
      
      // Update Trends
      if (data.trending) {
        setTrends(data.trending.map(t => ({
          hashtag: t.hashtag,
          volume: t.count * 100, // Scaling for UI
          growth_rate: 10.5 // Static for now
        })));
      }
      
      // Update stats, influencers, and thoughts
      if (data.stats) {
        setInsights(prev => ({
          ...prev,
          presence_score: data.stats.presence_score,
          active_trends: data.stats.active_trends,
          avg_sentiment: data.stats.avg_sentiment,
          sentiment_breakdown: data.stats.sentiment_breakdown
        }));
      }

      if (data.thoughts) {
        setInsights(prev => ({
          ...prev,
          top_keywords: data.thoughts.slice(0, 5),
          public_mood: `Highly active discussions around ${data.thoughts.slice(0, 3).join(', ')}`,
          thought_mining: `Real-time stream analysis reveals a strong focus on ${data.thoughts[0] || 'innovation'}.`
        }));
      }

      if (data.influencers) {
        setInfluencers(data.influencers);
      }
    };
    
    ws.onclose = () => {
      console.warn('❌ WebSocket Disconnected');
      setWsConnected(false);
    };
    
    return () => ws.close();
  }, []);

  useEffect(() => {
    if (selectedHashtag) {
      fetchHashtagData(selectedHashtag);
      setShowExplanation(false);
    }
  }, [selectedHashtag]);

  const fetchInitialData = async () => {
    try {
      const [trendsRes, viralRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/trending`),
        axios.get(`${API_BASE_URL}/viral`),
        axios.get(`${API_BASE_URL}/stats`)
      ]);
      setTrends(trendsRes.data);
      setViralTweets(viralRes.data);
      
      if (statsRes.data) {
        setInsights(prev => ({
          ...prev,
          presence_score: statsRes.data.stats.presence_score,
          active_trends: statsRes.data.stats.active_trends,
          avg_sentiment: statsRes.data.stats.avg_sentiment,
          sentiment_breakdown: statsRes.data.stats.sentiment_breakdown,
          top_keywords: statsRes.data.thoughts,
          public_mood: `Highly active discussions around ${statsRes.data.thoughts.slice(0, 3).join(', ')}`,
        }));
        setInfluencers(statsRes.data.influencers);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setLoading(false);
    }
  };

  const fetchHashtagData = async (hashtag) => {
    try {
      // Tell the backend to restart the stream/simulation for this query
      await axios.post(`${API_BASE_URL}/search?query=${encodeURIComponent(hashtag)}`);
      
      const [sentimentRes, insightsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/sentiment?hashtag=${encodeURIComponent(hashtag)}`),
        axios.get(`${API_BASE_URL}/insights?hashtag=${encodeURIComponent(hashtag)}`)
      ]);
      setSentiment(sentimentRes.data.sentiment);
      setInsights(insightsRes.data);
    } catch (error) {
      console.error("Error fetching hashtag data:", error);
    }
  };

  const sentimentData = sentiment ? [
    { name: 'Positive', value: sentiment.positive, color: '#10B981' },
    { name: 'Neutral', value: sentiment.neutral, color: '#6B7280' },
    { name: 'Negative', value: sentiment.negative, color: '#EF4444' },
  ] : [];

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-twitter-dark">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-twitter"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-twitter-dark text-white p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-twitter p-2 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">TweetVerse</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
                <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-[10px] font-bold text-gray-400 mr-1">WS</span>
                <span className="text-xs font-medium text-gray-300">{wsConnected ? 'CONNECTED' : 'OFFLINE'}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Source:</span>
                <span className={`text-xs font-bold ${
                  connectionStatus === 'x-api' ? 'text-twitter' : 
                  connectionStatus === 'scraper' ? 'text-green-500' : 
                  'text-yellow-500'
                }`}>
                  {connectionStatus === 'x-api' ? 'Official X-API' : 
                   connectionStatus === 'scraper' ? 'Web Scraper' : 
                   connectionStatus === 'simulation' ? 'Simulation' : 'Initializing...'}
                </span>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search hashtag..." 
                    className="bg-twitter-card border border-gray-700 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-twitter text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedHashtag(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
                />
            </div>
            <button className="bg-twitter hover:bg-opacity-90 px-4 py-2 rounded-full font-medium text-sm transition-all">
                Upgrade Pro
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Trends */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-twitter-card rounded-2xl p-5 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-twitter" /> Trending Now
            </h2>
            <div className="space-y-4">
              {trends.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedHashtag(item.hashtag)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${selectedHashtag === item.hashtag ? 'bg-twitter bg-opacity-10 border border-twitter' : 'hover:bg-gray-800 border border-transparent'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-twitter font-medium">{item.hashtag}</p>
                      <p className="text-xs text-gray-400">{(item.volume / 1000).toFixed(1)}K Tweets</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${item.growth_rate > 0 ? 'bg-green-500 bg-opacity-10 text-green-500' : 'bg-red-500 bg-opacity-10 text-red-500'}`}>
                      {item.growth_rate > 0 ? '+' : ''}{item.growth_rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-twitter-card rounded-2xl p-5 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" /> Smart Alerts
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-xl text-sm text-yellow-200">
                🚀 <span className="font-medium">{selectedHashtag}</span> is going viral in your region!
              </div>
              <div className="p-3 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-xl text-sm text-blue-200">
                📊 Negative sentiment spike detected for #AI.
              </div>
            </div>
          </div>

          <div className="bg-twitter-card rounded-2xl p-5 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-pink-500" /> Thought Mining
            </h2>
            {insights ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Public Mood</p>
                  <p className="text-sm italic text-gray-200">"{insights.public_mood}"</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Top Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {insights.top_keywords?.map((kw, i) => (
                      <span key={i} className="text-xs bg-gray-800 px-2 py-1 rounded-md border border-gray-700">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : <p className="text-gray-500 text-sm">Waiting for live stream...</p>}
          </div>
        </div>

        {/* Middle Column - Analytics */}
        <div className="lg:col-span-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Sentiment Ring */}
            <div className="bg-twitter-card rounded-2xl p-5 border border-gray-800">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-purple-500" /> Sentiment Analysis
              </h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around text-xs mt-2">
                {sentimentData.map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="font-bold" style={{ color: s.color }}>{s.value}%</p>
                    <p className="text-gray-400">{s.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Presence Score (Brand24 Style) */}
            <div className="bg-twitter-card rounded-2xl p-5 border border-gray-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-16 h-16 text-yellow-500" />
              </div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" /> Social Presence
              </h2>
              <div className="flex flex-col items-center justify-center h-32">
                 <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
                    {insights?.presence_score || '0.0'}
                 </div>
                 <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest font-bold">Authority Index</p>
                 <div className="w-full bg-gray-800 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div 
                      className="bg-yellow-500 h-full transition-all duration-1000" 
                      style={{ width: `${Math.min(100, (insights?.presence_score || 0) * 2)}%` }}
                    ></div>
                 </div>
              </div>
            </div>
          </div>

          {/* Viral Feed */}
          <div className="bg-twitter-card rounded-2xl p-5 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Repeat2 className="w-5 h-5 text-green-500" /> Viral Tweets Feed
            </h2>
            <div className="space-y-4">
              {viralTweets.map((tweet) => (
                <div key={tweet.id} className="p-4 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 hover:border-gray-500 transition-all">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-twitter flex items-center justify-center font-bold">
                       {tweet.name ? tweet.name[0] : 'T'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm">{tweet.name || 'TweetVerse User'}</span>
                        <span className="text-xs text-gray-400">2h ago</span>
                      </div>
                      <p className="text-sm mt-1 text-gray-200">{tweet.text}</p>
                      <div className="flex gap-6 mt-4 text-gray-400">
                        <div className="flex items-center gap-1 text-xs">
                          <Heart className="w-4 h-4 text-red-500" /> {tweet.likes}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Repeat2 className="w-4 h-4 text-green-500" /> {tweet.retweets}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <MessageCircle className="w-4 h-4 text-blue-500" /> {tweet.replies}
                        </div>
                        <div className="flex items-center gap-1 text-xs ml-auto font-bold text-twitter">
                          Score: {tweet.viral_score}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Deep Insights */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-twitter-card rounded-2xl p-5 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4">Why is {selectedHashtag} trending?</h2>
            {showExplanation ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="p-3 bg-twitter bg-opacity-10 rounded-xl border border-twitter border-opacity-20">
                  <p className="text-xs font-bold text-twitter uppercase mb-1">AI Reason</p>
                  <p className="text-sm text-gray-200">The recent spike in {selectedHashtag} is due to a sudden surge in discussions regarding its practical applications in modern industries.</p>
                </div>
                <div className="p-3 bg-green-500 bg-opacity-10 rounded-xl border border-green-500 border-opacity-20">
                  <p className="text-xs font-bold text-green-500 uppercase mb-1">Viral Factors</p>
                  <p className="text-sm text-gray-200">Three high-profile accounts shared content related to {selectedHashtag} in the last 4 hours.</p>
                </div>
                <button 
                  onClick={() => setShowExplanation(false)}
                  className="w-full text-xs text-twitter hover:underline"
                >
                  Hide details
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {insights?.thought_mining || "AI-powered analysis of the current trend highlights significant interest in new technology releases and industry-wide shifts towards automation."}
                </p>
                <button 
                  onClick={() => setShowExplanation(true)}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-sm font-medium transition-all"
                >
                  Explain Further <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="bg-twitter-card rounded-2xl p-5 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> Top Influencers
            </h2>
            <div className="space-y-4">
              {influencers.length > 0 ? influencers.map((inf, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-xl transition-all border border-transparent hover:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs">
                    {inf.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{inf.name}</p>
                    <p className="text-xs text-gray-400">@{inf.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-twitter">{inf.score}</p>
                    <p className="text-[10px] text-gray-500">Impact</p>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-gray-500 italic text-center py-4">Scanning for elite voices...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
