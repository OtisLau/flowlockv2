import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center">FlowLock</h1>
        <p className="text-gray-600 text-center">Secure multi-chain escrow and streaming payments</p>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/sender')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
          >
            I'm the Sender
          </button>
          
          <button
            onClick={() => navigate('/receiver')}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
          >
            I'm the Receiver
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 