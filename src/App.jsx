import React, { useState, useEffect } from 'react';
import WalletConnect from './WalletConnect';
import OwnerCalendar from './components/OwnerCalendar';
import VisitorCalendar from './components/VisitorCalendar';
import Navigation from './components/Navigation';
import ToastContainer from './components/ToastContainer';
import './App.css';

function App() {
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [ensName, setEnsName] = useState('');
  const [userMode, setUserMode] = useState('owner'); // 'owner' or 'visitor'
  const [targetEns, setTargetEns] = useState(''); // For visitor mode

  // Check if we're in visitor mode (URL contains calendar subdomain)
  useEffect(() => {
    const url = window.location.href;
    // Support multiple patterns: calendar.ensname.eth, cal.ensname.eth, ensname.eth/calendar
    const patterns = [
      /calendar\.([^.]+)\.eth/,
      /cal\.([^.]+)\.eth/,
      /([^.]+)\.eth\/calendar/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        setUserMode('visitor');
        setTargetEns(match[1]);
        return;
      }
    }
    
    // For development/testing, check for query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const testEns = urlParams.get('ens');
    if (testEns) {
      setUserMode('visitor');
      setTargetEns(testEns);
    }
  }, []);

  const handleWalletConnected = (account, ens) => {
    setConnectedWallet(account);
    setEnsName(ens);
  };

  const handleDisconnect = () => {
    setConnectedWallet(null);
    setEnsName('');
  };

  const handleSwitchMode = (mode, ensName = '') => {
    setUserMode(mode);
    if (mode === 'visitor' && ensName) {
      setTargetEns(ensName);
      // Update URL for visitor mode
      const newUrl = `${window.location.origin}?ens=${ensName}`;
      window.history.pushState({}, '', newUrl);
    } else if (mode === 'owner') {
      setTargetEns('');
      // Reset URL for owner mode
      window.history.pushState({}, '', window.location.origin);
    }
  };

  const handleGoHome = () => {
    setUserMode('owner');
    setTargetEns('');
    setConnectedWallet(null);
    setEnsName('');
    window.history.pushState({}, '', window.location.origin);
  };

  return (
    <div className="App">
      <Navigation 
        userMode={userMode}
        targetEns={targetEns}
        onSwitchMode={handleSwitchMode}
        onGoHome={handleGoHome}
      />
      
      <main className="App-main">
        {userMode === 'owner' ? (
          // Owner Flow: Connect wallet to manage own calendar
          !connectedWallet ? (
            <div className="welcome-section">
              <div className="welcome-content">
                <h2>Manage Your ENS Calendar</h2>
                <p>Connect your wallet to view and manage your personal calendar</p>
                <WalletConnect onConnected={handleWalletConnected} />
              </div>
            </div>
          ) : (
            <OwnerCalendar 
              walletAddress={connectedWallet}
              ensName={ensName}
              onDisconnect={handleDisconnect}
            />
          )
        ) : (
          // Visitor Flow: View someone else's calendar
          <VisitorCalendar 
            targetEns={targetEns}
            connectedWallet={connectedWallet}
            connectedEnsName={ensName}
            onWalletConnect={handleWalletConnected}
            onDisconnect={handleDisconnect}
          />
        )}
      </main>
      <ToastContainer />
    </div>
  );
}

export default App; 