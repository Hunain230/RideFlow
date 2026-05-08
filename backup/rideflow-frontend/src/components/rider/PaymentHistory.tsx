import React, { useState, useEffect } from 'react';
import { riderAPI } from '../../lib/rider';
import { 
  CreditCard, 
  Wallet, 
  Banknote, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  RefreshCw,
  Download,
  Receipt
} from 'lucide-react';

interface Payment {
  PaymentID: number;
  RideID: number;
  Amount: number;
  DiscountApplied: number;
  PaymentMethod: 'Cash' | 'CreditCard' | 'Wallet';
  PaymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  TransactionDate: string;
  PromoCode?: string;
}

export const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await riderAPI.getPayments();
      setPayments(response.data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Failed': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Refunded': return <Receipt className="w-5 h-5 text-blue-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Cash': return <Banknote className="w-5 h-5 text-green-600" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'Wallet': return <Wallet className="w-5 h-5 text-purple-600" />;
      default: return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'Cash': return 'Cash';
      case 'CreditCard': return 'Credit Card';
      case 'Wallet': return 'Wallet';
      default: return method;
    }
  };

  const filteredPayments = payments.filter(payment => 
    filterStatus === 'all' || payment.PaymentStatus === filterStatus
  );

  const totalSpent = payments
    .filter(p => p.PaymentStatus === 'Paid')
    .reduce((sum, p) => sum + p.Amount, 0);

  const totalDiscounts = payments
    .filter(p => p.PaymentStatus === 'Paid')
    .reduce((sum, p) => sum + (p.DiscountApplied || 0), 0);

  const exportToCSV = () => {
    const headers = ['Payment ID', 'Ride ID', 'Amount (PKR)', 'Discount (PKR)', 'Method', 'Status', 'Date', 'Promo Code'];
    const rows = filteredPayments.map(p => [
      p.PaymentID,
      p.RideID,
      p.Amount,
      p.DiscountApplied || 0,
      p.PaymentMethod,
      p.PaymentStatus,
      new Date(p.TransactionDate).toLocaleDateString(),
      p.PromoCode || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
          <p className="text-gray-600">View and manage your ride payments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            disabled={payments.length === 0}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={loadPayments}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Receipt className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold">PKR {totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Savings</p>
              <p className="text-2xl font-bold">PKR {totalDiscounts.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-sm underline">Dismiss</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Payment ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ride ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Discount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Method</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.PaymentID} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">#{payment.PaymentID}</td>
                    <td className="px-4 py-3 font-mono text-sm">#{payment.RideID}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">PKR {payment.Amount.toFixed(2)}</div>
                      {payment.DiscountApplied > 0 && (
                        <div className="text-xs text-green-600">
                          -PKR {payment.DiscountApplied.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {payment.DiscountApplied > 0 ? (
                        <span className="text-green-600 font-medium">
                          PKR {payment.DiscountApplied.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                      {payment.PromoCode && (
                        <div className="text-xs text-purple-600 mt-1">
                          Code: {payment.PromoCode}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(payment.PaymentMethod)}
                        <span className="text-sm">{getPaymentMethodLabel(payment.PaymentMethod)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.PaymentStatus)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.PaymentStatus)}`}>
                          {payment.PaymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(payment.TransactionDate).toLocaleDateString()}
                      <div className="text-xs text-gray-400">
                        {new Date(payment.TransactionDate).toLocaleTimeString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPayments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Receipt className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No payments found</p>
            </div>
          )}
        </div>
      )}

      {/* Summary Footer */}
      {filteredPayments.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <div className="flex flex-wrap gap-4 justify-between">
            <span>Showing {filteredPayments.length} of {payments.length} payments</span>
            <span>
              Subtotal: PKR {filteredPayments.reduce((sum, p) => sum + p.Amount + (p.DiscountApplied || 0), 0).toFixed(2)} | 
              Discounts: PKR {filteredPayments.reduce((sum, p) => sum + (p.DiscountApplied || 0), 0).toFixed(2)} | 
              Net: PKR {filteredPayments.reduce((sum, p) => sum + p.Amount, 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
