import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { ContractService } from '../services/contractService';
import LoadingSpinner from '../components/LoadingSpinner';

const ReceiverPage = () => {
  const { wallet, connected, connect, client, account } = useWallet();
  const [stellarWallet, setStellarWallet] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [escrowData, setEscrowData] = useState({
    claimedAmount: 0,
    timeRemaining: 0,
    claimableBalance: 0,
    senderApproved: false,
    payoutMode: 'aptos',
    isVerified: true,
  });

  const contractService = new ContractService(client);

  const handleClaim = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const tx = await contractService.claim(wallet);
      setSuccess(`Claimed! Transaction hash: ${tx.hash}`);
    } catch (err: any) {
      setError(err.message || 'Failed to claim');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveContinue = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const tx = await contractService.approveContinueContractor(wallet);
      setSuccess(`Approved! Transaction hash: ${tx.hash}`);
    } catch (err: any) {
      setError(err.message || 'Failed to approve');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Receiver Dashboard</h1>

          {!connected ? (
            <button
              onClick={connect}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          ) : (
            <>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Connected Account:</p>
                <p className="font-mono text-sm break-all">{account}</p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-4">Escrow Details</h2>
                  <div className="space-y-2">
                    <p>Claimed Amount: {escrowData.claimedAmount} APT</p>
                    <p>Time Remaining: {escrowData.timeRemaining} hours</p>
                    <p>Claimable Balance: {escrowData.claimableBalance} APT</p>
                    <p>Sender Approved: {escrowData.senderApproved ? 'Yes' : 'No'}</p>
                    <p>Payout Mode: {escrowData.payoutMode}</p>
                    {escrowData.isVerified && (
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        Forte Verified
                      </span>
                    )}
                  </div>
                </div>

                {escrowData.payoutMode === 'stellar' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Stellar Wallet Address
                    </label>
                    <input
                      type="text"
                      value={stellarWallet}
                      onChange={(e) => setStellarWallet(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your Stellar wallet address"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={handleApproveContinue}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-green-300"
                  >
                    Approve Continue 65%
                  </button>

                  <button
                    onClick={handleClaim}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    Claim Funds
                  </button>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiverPage; 