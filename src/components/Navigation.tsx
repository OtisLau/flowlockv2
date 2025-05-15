import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Navigation = () => {
  const location = useLocation();
  const { connected, disconnect } = useWallet();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">FlowLock</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {connected && (
              <button
                onClick={disconnect}
                className="text-gray-600 hover:text-gray-900"
              >
                Disconnect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 