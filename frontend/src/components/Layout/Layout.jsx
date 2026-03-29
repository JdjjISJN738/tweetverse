import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, onSearch, isSearching }) => {
  return (
    <div className="flex h-screen bg-twitter-bg text-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header onSearch={onSearch} isSearching={isSearching} />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
