import React, { useState, useEffect } from 'react';
import './WalletConnect.css';

const WalletConnect = ({ onConnected }) => {
  const [account, setAccount] = useState('');
  const [ensName, setEnsName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEns, setIsLoadingEns] = useState(false);
  const [error, setError] = useState('');

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  };

  // Check if already connected on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to use this feature.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        await resolveENSName(accounts[0]);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
      if (window.showToast) {
        window.showToast('Error checking wallet connection', 'error', 4000);
      }
    }
  };

  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to use this feature.');
      if (window.showToast) {
        window.showToast('MetaMask is required to use this feature', 'error', 5000);
      }
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        
        if (window.showToast) {
          window.showToast('Wallet connected! Resolving ENS name...', 'info', 2000);
        }
        
        await resolveENSName(accounts[0]);
      }
    } catch (err) {
      if (err.code === 4001) {
        setError('User rejected the connection request.');
        if (window.showToast) {
          window.showToast('Connection was rejected', 'warning', 3000);
        }
      } else {
        setError('Failed to connect wallet. Please try again.');
        if (window.showToast) {
          window.showToast('Failed to connect wallet', 'error', 4000);
        }
      }
      console.error('Error connecting wallet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setEnsName('');
    setIsConnected(false);
    setError('');
  };

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          if (window.showToast) {
            window.showToast('Wallet account changed, resolving ENS...', 'info', 2000);
          }
          await resolveENSName(accounts[0]);
        } else {
          setAccount('');
          setEnsName('');
          setIsConnected(false);
          if (window.showToast) {
            window.showToast('Wallet disconnected', 'warning', 3000);
          }
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      return () => {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      };
    }
  }, []);

  const resolveENSName = async (address) => {
    if (!address) return;
    
    setIsLoadingEns(true);
    console.log('Resolving ENS name for address:', address);
    
    try {
      // Method 1: Try ENS Ideas API (most reliable)
      try {
        console.log('Trying ENS Ideas API...');
        const response = await fetch(`https://api.ensideas.com/ens/resolve/${address}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('ENS Ideas API response:', data);
          
          // Check different possible response formats
          let ensName = null;
          if (data.name && data.name !== null) {
            ensName = data.name;
          } else if (data.address && data.address.name) {
            ensName = data.address.name;
          } else if (data.result && data.result.name) {
            ensName = data.result.name;
          } else if (data.displayName && !data.displayName.startsWith('0x')) {
            // Only use displayName if it's not a hex address
            ensName = data.displayName;
          }
          
          if (ensName && ensName !== address && !ensName.startsWith('0x')) {
            console.log('Found ENS name via ENS Ideas:', ensName);
            setEnsName(ensName);
            if (window.showToast) {
              window.showToast(`ENS name found: ${ensName}`, 'success', 3000);
            }
            if (onConnected) {
              onConnected(account, ensName);
            }
            return;
          } else {
            console.log('No valid ENS name found in ENS Ideas response');
          }
        } else {
          console.log('ENS Ideas API returned status:', response.status);
        }
      } catch (err) {
        console.log('ENS Ideas API failed:', err);
      }
      
             // Method 1.5: Try ENS Ideas reverse lookup
       try {
         console.log('Trying ENS Ideas reverse lookup...');
         const response = await fetch(`https://api.ensideas.com/ens/reverse/${address}`);
         
         if (response.ok) {
           const data = await response.json();
           console.log('ENS Ideas reverse API response:', data);
           
           if (data.name && data.name !== null && !data.name.startsWith('0x')) {
             console.log('Found ENS name via reverse lookup:', data.name);
             setEnsName(data.name);
             if (onConnected) {
               onConnected(account, data.name);
             }
             return;
           }
         }
       } catch (err) {
         console.log('ENS Ideas reverse API failed:', err);
       }
       
       // Method 1.6: Try ENS Ideas with specific reverse endpoint
       try {
         console.log('Trying ENS Ideas specific reverse endpoint...');
         const response = await fetch(`https://api.ensideas.com/ens/resolve/${address}?reverse=true`);
         
         if (response.ok) {
           const data = await response.json();
           console.log('ENS Ideas reverse resolve response:', data);
           
           if (data.name && data.name !== null && !data.name.startsWith('0x')) {
             console.log('Found ENS name via reverse resolve:', data.name);
             setEnsName(data.name);
             if (onConnected) {
               onConnected(account, data.name);
             }
             return;
           }
         }
       } catch (err) {
         console.log('ENS Ideas reverse resolve failed:', err);
       }
      
      // Method 2: Try direct Ethereum RPC call through MetaMask
      try {
        console.log('Trying direct Ethereum RPC call...');
        const provider = window.ethereum;
        
        // Get the current network
        const chainId = await provider.request({ method: 'eth_chainId' });
        console.log('Current chain ID:', chainId);
        
                 // Only try ENS resolution on mainnet (chainId: 0x1)
         if (chainId === '0x1') {
           // Method 2a: Try reverse resolution using the correct reverse registrar
           try {
             const reverseName = await provider.request({
               method: 'eth_call',
               params: [{
                 to: '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C', // ENS Reverse Registrar
                 data: `0x0f5a5466${address.slice(2).padStart(64, '0')}`, // name() function
               }, 'latest']
             });
             
             console.log('Reverse registrar response:', reverseName);
             
             if (reverseName && reverseName !== '0x' && reverseName !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
               const name = decodeENSName(reverseName);
                            if (name) {
               console.log('Found ENS name via reverse registrar:', name);
               setEnsName(name);
               if (onConnected) {
                 onConnected(account, name);
               }
               return;
             }
             }
           } catch (err) {
             console.log('Reverse registrar call failed:', err);
           }
           
           // Method 2b: Try direct ENS registry lookup
           try {
             const reverseName = await provider.request({
               method: 'eth_call',
               params: [{
                 to: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', // ENS Registry
                 data: `0x691f3431${address.slice(2).padStart(64, '0')}`, // name() function
               }, 'latest']
             });
             
             console.log('ENS registry response:', reverseName);
             
             if (reverseName && reverseName !== '0x' && reverseName !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
               const name = decodeENSName(reverseName);
               if (name) {
                 console.log('Found ENS name via ENS registry:', name);
                 setEnsName(name);
                 if (onConnected) {
                   onConnected(account, name);
                 }
                 return;
               }
             }
           } catch (err) {
             console.log('ENS registry call failed:', err);
           }
         }
      } catch (err) {
        console.log('Direct RPC call failed:', err);
      }
      
      // Method 3: Try a different ENS API
      try {
        console.log('Trying alternative ENS API...');
        const response = await fetch(`https://api.ensideas.com/ens/lookup/${address}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Alternative ENS API response:', data);
          
          if (data.name) {
            console.log('Found ENS name via alternative API:', data.name);
            setEnsName(data.name);
            return;
          }
        }
      } catch (err) {
        console.log('Alternative ENS API failed:', err);
      }
      
             // Method 4: Try GraphQL ENS API
       try {
         console.log('Trying GraphQL ENS API...');
         const query = `
           query {
             domains(where: {owner: "${address.toLowerCase()}"}) {
               name
             }
           }
         `;
         
         const response = await fetch('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ query })
         });
         
         if (response.ok) {
           const data = await response.json();
           console.log('GraphQL ENS API response:', data);
           
           if (data.data && data.data.domains && data.data.domains.length > 0) {
             const ensName = data.data.domains[0].name;
             console.log('Found ENS name via GraphQL:', ensName);
             setEnsName(ensName);
             if (onConnected) {
               onConnected(account, ensName);
             }
             return;
           }
         }
       } catch (err) {
         console.log('GraphQL ENS API failed:', err);
       }
       
       // Method 5: Try Etherscan API (since we know mircl.eth exists)
       try {
         console.log('Trying Etherscan API...');
         const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_call&to=0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C&data=0x0f5a5466${address.slice(2).padStart(64, '0')}&apikey=YourApiKeyToken`);
         
         if (response.ok) {
           const data = await response.json();
           console.log('Etherscan API response:', data);
           
           if (data.result && data.result !== '0x' && data.result !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
             const name = decodeENSName(data.result);
             if (name) {
               console.log('Found ENS name via Etherscan:', name);
               setEnsName(name);
               if (onConnected) {
                 onConnected(account, name);
               }
               return;
             }
           }
         }
       } catch (err) {
         console.log('Etherscan API failed:', err);
       }
       
       // Method 6: Try a different ENS API endpoint
       try {
         console.log('Trying alternative ENS API endpoint...');
         const response = await fetch(`https://api.ensideas.com/ens/domains/${address}`);
         
         if (response.ok) {
           const data = await response.json();
           console.log('Alternative ENS domains response:', data);
           
           if (data.name && data.name !== null && !data.name.startsWith('0x')) {
             console.log('Found ENS name via domains endpoint:', data.name);
             setEnsName(data.name);
             if (onConnected) {
               onConnected(account, data.name);
             }
             return;
           }
         }
       } catch (err) {
         console.log('Alternative ENS domains API failed:', err);
       }
      
      console.log('No ENS name found for address:', address);
      
      if (window.showToast) {
        window.showToast('No ENS name found for this address', 'info', 3000);
      }
      
      // Set a flag to show that ENS resolution was attempted but no name was found
      setEnsName(null);
    } catch (err) {
      console.error('ENS resolution error:', err);
      if (window.showToast) {
        window.showToast('Error resolving ENS name', 'error', 4000);
      }
    } finally {
      setIsLoadingEns(false);
    }
  };

  const decodeENSName = (hexData) => {
    try {
      if (hexData === '0x' || hexData === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        return null;
      }
      
      // Remove the function selector and decode the string
      const data = hexData.slice(10); // Remove 0x and function selector
      let name = '';
      for (let i = 0; i < data.length; i += 2) {
        const charCode = parseInt(data.substr(i, 2), 16);
        if (charCode === 0) break; // Null terminator
        name += String.fromCharCode(charCode);
      }
      return name || null;
    } catch (err) {
      console.error('Error decoding ENS name:', err);
      return null;
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(account);
      if (window.showToast) {
        window.showToast('Wallet address copied!', 'success', 2000);
      }
    } catch (err) {
      console.error('Failed to copy address:', err);
      if (window.showToast) {
        window.showToast('Failed to copy address', 'error', 3000);
      }
    }
  };

  const copyEnsToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(ensName);
      if (window.showToast) {
        window.showToast('ENS name copied!', 'success', 2000);
      }
    } catch (err) {
      console.error('Failed to copy ENS name:', err);
      if (window.showToast) {
        window.showToast('Failed to copy ENS name', 'error', 3000);
      }
    }
  };

  if (!isMetaMaskInstalled()) {
    return (
      <div className="wallet-connect">
        <div className="wallet-error">
          <h3>MetaMask Required</h3>
          <p>Please install MetaMask to use this feature.</p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="install-link"
          >
            Install MetaMask
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}
      
      {!isConnected ? (
        <button 
          onClick={connectWallet} 
          disabled={isLoading}
          className="connect-button"
        >
          {isLoading ? 'Connecting...' : 'Connect MetaMask'}
        </button>
      ) : (
        <div className="wallet-info">
          <div className="wallet-address">
            <span className="address-label">Connected:</span>
            <div className="address-display">
              {ensName && (
                <span 
                  className="ens-name" 
                  title={`ENS: ${ensName} (Click to copy)`}
                  onClick={copyEnsToClipboard}
                >
                  {ensName}
                </span>
              )}
              {!ensName && !isLoadingEns && (
                <span className="no-ens-message">
                  No ENS name found
                  <a 
                    href="https://app.ens.domains/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ens-link"
                  >
                    Get one at ENS
                  </a>
                </span>
              )}
              <span className="address-value" onClick={copyToClipboard} title="Click to copy">
                {formatAddress(account)}
              </span>
              {isLoadingEns && (
                <span className="ens-loading">
                  <div className="mini-spinner"></div>
                  Resolving ENS...
                </span>
              )}
            </div>
            <button onClick={copyToClipboard} className="copy-button" title="Copy address">
              📋
            </button>
          </div>
          <div className="wallet-actions">
            <button onClick={() => resolveENSName(account)} className="refresh-ens-button">
              Refresh ENS
            </button>
            <button onClick={disconnectWallet} className="disconnect-button">
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 