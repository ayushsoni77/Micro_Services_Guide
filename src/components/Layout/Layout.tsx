import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import MobileMenuToggle from './MobileMenuToggle';

const Layout: React.FC = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch({ type: 'CLOSE_MOBILE_MENU' });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return (
    <div className="app-layout">
      <MobileMenuToggle />
      <Sidebar />
      {state.isMobileMenuOpen && (
        <div 
          className="sidebar-overlay active"
          onClick={() => dispatch({ type: 'CLOSE_MOBILE_MENU' })}
        />
      )}
      <MainContent />
    </div>
  );
};

export default Layout;