import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AptosClient } from 'aptos';

interface WalletContextType {
  wallet: any;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  client: AptosClient;
  account: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const client = new AptosClient('https://fullnode.testnet.aptoslabs.com');

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWallet = async () => {
      if ('aptos' in window) {
        const wallet = (window as any).aptos;
        try {
          const isConnected = await wallet.isConnected();
          if (isConnected) {
            setWallet(wallet);
            setConnected(true);
            const account = await wallet.account();
            setAccount(account.address);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkWallet();
  }, []);

  const connect = async () => {
    try {
      if ('aptos' in window) {
        const wallet = (window as any).aptos;
        console.log('Connecting to wallet...');
        
        // Connect to wallet
        await wallet.connect();
        console.log('Wallet connected');
        
        // Get account info
        const account = await wallet.account();
        console.log('Account:', account);

        setWallet(wallet);
        setConnected(true);
        setAccount(account.address);
      } else {
        throw new Error('Please install Petra or Martian wallet');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      if (wallet) {
        await wallet.disconnect();
      }
      setWallet(null);
      setConnected(false);
      setAccount(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, connected, connect, disconnect, client, account }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 