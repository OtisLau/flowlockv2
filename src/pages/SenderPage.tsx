import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { ContractService } from '../services/contractService';
import LoadingSpinner from '../components/LoadingSpinner';

const SenderPage = () => {
  const { wallet, connected, connect, client, account } = useWallet();
  const [contractor, setContractor] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [payoutType, setPayoutType] = useState('aptos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const contractService = new ContractService(client);

  const handleCreateEscrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      await connect();
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const tx = await contractService.createEscrow(
        wallet,
        contractor,
        parseFloat(amount),
        parseInt(duration)
      );

      setSuccess(`Escrow created! Transaction hash: ${tx.hash}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create escrow');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveContinue = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const tx = await contractService.approveContinueClient(wallet);
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
          <h1 className="text-2xl font-bold mb-6">Create Escrow</h1>

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
              
              <form onSubmit={handleCreateEscrow} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contractor Address
                  </label>
                  <input
                    type="text"
                    value={contractor}
                    onChange={(e) => setContractor(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount (APT)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payout Type
                  </label>
                  <select
                    value={payoutType}
                    onChange={(e) => setPayoutType(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="aptos">Aptos Wallet</option>
                    <option value="stellar">Stellar Fiat</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loading ? 'Creating...' : 'Create Escrow'}
                </button>
              </form>
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

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Escrow Status</h2>
            <div className="space-y-2">
              <p>Status: Active</p>
              <p>Amount Claimed: 0 APT</p>
              <p>Time Left: 24 hours</p>
              <p>Contractor Wallet Linked: Yes</p>
            </div>

            <button
              onClick={handleApproveContinue}
              disabled={loading}
              className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-green-300"
            >
              Approve 65% Unlock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SenderPage; 