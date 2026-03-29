import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const savedUser = localStorage.getItem('tweetverse_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login logic
    const mockUser = { id: '1', name: 'Alex Reed', email, role: 'PRO ANALYST', avatar: 'AR' };
    setUser(mockUser);
    localStorage.setItem('tweetverse_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const signup = async (name, email, password) => {
    // Generate avatar initials
    const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
    const mockUser = { id: '2', name, email, role: 'PRO ANALYST', avatar: initials };
    setUser(mockUser);
    localStorage.setItem('tweetverse_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const oauthLogin = async (provider) => {
    // Mock OAuth logic
    const mockUser = { 
      id: 'oauth_1', 
      name: `${provider} User`, 
      email: `${provider.toLowerCase()}@example.com`, 
      role: 'PRO ANALYST',
      provider 
    };
    setUser(mockUser);
    localStorage.setItem('tweetverse_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const updateUser = (updates) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    // update avatar if name changed
    if (updates.name) {
       updatedUser.avatar = updates.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    }
    setUser(updatedUser);
    localStorage.setItem('tweetverse_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tweetverse_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, oauthLogin, updateUser, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
