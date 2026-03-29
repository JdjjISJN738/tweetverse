import React, { useState } from 'react';
import { tweetService } from './services/api';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Trends from './pages/Trends';
import Analytics from './pages/Analytics';
import ViralFeedPage from './pages/ViralFeed';
import EmojiPulse from './pages/EmojiPulse';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';

// 🛡️ Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
};

// 🛡️ A Strict React Error Boundary to catch render failures that cause blank screens
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("React Crashing Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#FEE2E2', color: '#B91C1C', minHeight: '100vh' }}>
          <h1 style={{ fontWeight: 900, fontSize: '2rem', marginBottom: '10px' }}>Frontend Crash Detected</h1>
          <p style={{ fontWeight: 600, marginBottom: '20px' }}>A React component failed to render. Please copy this error for your AI assistant:</p>
          <pre style={{ background: '#7F1D1D', color: 'white', padding: '20px', borderRadius: '12px', overflow: 'auto', fontSize: '12px' }}>
            {this.state.errorInfo ? this.state.errorInfo.componentStack : "No stack trace available."}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [selectedHashtag, setSelectedHashtag] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (hashtag) => {
    if (!hashtag.trim()) return;
    setSelectedHashtag(hashtag.trim());
    setIsSearching(true);
    try {
      await tweetService.updateSearch(hashtag.trim());
    } catch (err) {
      console.error('[Search] Failed to update backend query:', err);
    } finally {
      setTimeout(() => setIsSearching(false), 2000);
    }
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Dashboard Routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout onSearch={handleSearch} isSearching={isSearching}>
                  <Routes>
                    <Route path="/" element={<Dashboard selectedHashtag={selectedHashtag} setSelectedHashtag={setSelectedHashtag} />} />
                    <Route path="/trends" element={<Trends />} />
                    <Route path="/viral" element={<ViralFeedPage />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/emojis" element={<EmojiPulse selectedHashtag={selectedHashtag} />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="*" element={
                      <div className="flex h-full items-center justify-center font-black text-slate-400 text-2xl">
                        Page Under Construction
                      </div>
                    } />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
