import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu } from 'lucide-react';

const MobileMenuToggle: React.FC = () => {
  const { dispatch } = useApp();

  return (
    <button
      className="mobile-menu-toggle"
      onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
      aria-label="Toggle navigation menu"
    >
      <Menu size={20} />
      <span style={{ marginLeft: '8px' }}>Menu</span>
    </button>
  );
};

export default MobileMenuToggle;