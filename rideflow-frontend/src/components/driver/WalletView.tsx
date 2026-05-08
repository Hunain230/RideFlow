import React, { useState, useEffect } from 'react';
import { driverAPI } from '../../lib/driver';
import { 
  Wallet, 
  ArrowUpRight, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  History
} from 'lucide-react';

interface WalletData {
  DriverID: number;
  WalletBalance: number;
  CommissionRate: number;
}

interface Payment {
  PaymentID: number;
  RideID: number;
  Amount: number;
  DiscountApplied: number;
  PaymentMethod: string;
  PaymentStatus: string;
  TransactionDate: string;
}

export const WalletView: React.FC = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPayoutConfirm, setShowPayoutConfirm] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [walletResponse, paymentsResponse] = await Promise.all([
        driverAPI.getWallet(),
        driverAPI.getMyPayments()
      ]);
      
      setWallet(walletResponse.data.data);
      setPayments(paymentsResponse.data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    if (!wallet || wallet.WalletBalance <= 0) return;
    
    try {
      setPayoutLoading(true);
      await driverAPI.requestPayout(wallet.WalletBalance);
      setPayoutSuccess(true);
      setShowPayoutConfirm(false);
      loadWalletData();
      
      // Reset success message after 5 seconds
      setTimeout(() => setPayoutSuccess(false), 5000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payout request failed');
    } finally {
      setPayoutLoading(false);
    }
  };

  const totalEarnings = payments
    .filter(p => p.PaymentStatus === 'Paid')
    .reduce((sum, p) => sum + p.Amount, 0);

  const recentPayments = payments.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Wallet</h2>
          <p className="text-gray-600">Manage your earnings and payouts</p>
        </div>
        <button
          onClick={loadWalletData}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-sm underline">Dismiss</button>
        </div>
      )}

      {/* Success Message */}
      {payoutSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <p>Payout request submitted successfully!</p>
        </div>
      )}

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <p className="text-blue-100">Current Balance</p>
            <p className="text-4xl font-bold">
              PKR {wallet?.WalletBalance.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <span className="text-blue-200">Commission Rate:</span>
            <span className="font-semibold">{wallet?.CommissionRate || 10}%</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <span className="text-blue-200">Total Earnings:</span>
            <span className="font-semibold">PKR {totalEarnings.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => setShowPayoutConfirm(true)}
          disabled={!wallet || wallet.WalletBalance <= 0}
          className="mt-6 w-full sm:w-auto px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Request Payout
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <History className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          <span className="text-sm text-gray-500">Last 5 payments</span>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentPayments.length > 0 ? (
            recentPayments.map((payment) => (
              <div key={payment.PaymentID} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    payment.PaymentStatus === 'Paid' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {payment.PaymentStatus === 'Paid' ? (
                      <ArrowUpRight className={`w-5 h-5 text-green-600`} />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Ride #{payment.RideID}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(payment.TransactionDate).toLocaleDateString()} • {' '}
                      {payment.PaymentMethod}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    +PKR {(payment.Amount * (1 - (wallet?.CommissionRate || 10) / 100)).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    After {wallet?.CommissionRate || 10}% commission
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recent transactions</p>
            </div>
          )}
        </div>
      </div>

      {/* Commission Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How Earnings Work</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• You earn {100 - (wallet?.CommissionRate || 10)}% of each ride fare</li>
          <li>• Platform commission is {wallet?.CommissionRate || 10}% per ride</li>
          <li>• Earnings are added to your wallet automatically</li>
          <li>• Request a payout anytime to withdraw your balance</li>
        </ul>
      </div>

      {/* Payout Confirmation Modal */}
      {showPayoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Payout Request</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Current Balance</span>
                  <span className="font-semibold">PKR {wallet?.WalletBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-semibold text-red-600">-PKR 0.00</span>
                </div>
                <div className="border-t mt-2 pt-2 flex justify-between items-center">
                  <span className="font-semibold">You will receive</span>
                  <span className="text-xl font-bold text-green-600">
                    PKR {wallet?.WalletBalance.toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Your payout will be processed within 1-2 business days. Are you sure you want to proceed?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPayoutConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestPayout}
                  disabled={payoutLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {payoutLoading ? 'Processing...' : 'Confirm Payout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletView;
