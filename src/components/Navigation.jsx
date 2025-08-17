import React from 'react';
import './Navigation.css';

const Navigation = ({ userMode, targetEns, onSwitchMode, onGoHome }) => {
  const handleSwitchToVisitor = () => {
    const ensName = prompt('Enter ENS name to visit (e.g., mircl):');
    if (ensName && ensName.trim()) {
      onSwitchMode('visitor', ensName.trim());
    }
  };

  const handleSwitchToOwner = () => {
    onSwitchMode('owner');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-left">
          <button className="nav-home" onClick={onGoHome}>
            🏠 ENS Calendar
          </button>
        </div>
        
        <div className="nav-center">
          {userMode === 'owner' ? (
            <span className="nav-mode">Owner Mode</span>
          ) : (
            <span className="nav-mode">Viewing {targetEns}.eth</span>
          )}
        </div>
        
        <div className="nav-right">
          {userMode === 'owner' ? (
            <button className="nav-switch" onClick={handleSwitchToVisitor}>
              Visit Calendar
            </button>
          ) : (
            <button className="nav-switch" onClick={handleSwitchToOwner}>
              My Calendar
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 