import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WalletConnect from './WalletConnect';

// Mock window.ethereum
const mockAddress = '0x1234567890123456789012345678901234567890';
const mockEnsName = 'nora.eth';

beforeAll(() => {
  global.window.ethereum = {
    isMetaMask: true,
    request: jest.fn(async (request) => {
      if (request.method === 'eth_requestAccounts') {
        return [mockAddress];
      }
      if (request.method === 'eth_accounts') {
        // Start as not connected
        return [];
      }
      throw new Error(`Unhandled request: ${request.method}`);
    }),
    on: jest.fn(),
    removeListener: jest.fn(),
  };

  // Mock fetch for ENS resolution
  global.fetch = jest.fn(async (url) => {
    if (url.includes(mockAddress)) {
      return {
        json: async () => ({ name: mockEnsName }),
      };
    }
    return {
      json: async () => ({ name: null }),
    };
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('WalletConnect', () => {
  test('renders connect button when not connected', () => {
    render(<WalletConnect />);
    expect(screen.getByText('Connect MetaMask')).toBeInTheDocument();
  });

  test('displays ENS name and address after connecting', async () => {
    // Mock the eth_accounts call to return a connected account
    window.ethereum.request.mockImplementation(async (request) => {
        if (request.method === 'eth_accounts') {
            return [mockAddress];
        }
        return [];
    });
    
    render(<WalletConnect />);

    // Wait for the component to check connection status and update
    await waitFor(() => {
        expect(screen.getByText(mockEnsName)).toBeInTheDocument();
    });

    const formattedAddress = `${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`;
    expect(screen.getByText(formattedAddress)).toBeInTheDocument();
  });
});
