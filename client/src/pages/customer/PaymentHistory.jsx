import { useGetPaymentHistoryQuery } from '../../redux/slices/paymentApiSlice';
import { FaReceipt, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';

const PaymentHistory = () => {
  const { data, isLoading } = useGetPaymentHistoryQuery();

  if (isLoading) return <div className="p-12 text-center text-gray-500 font-bold">Loading payment history...</div>;

  const payments = data?.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Payment History</h1>

      {payments.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
          <FaReceipt className="text-6xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No payments yet</h2>
          <p className="text-gray-500 dark:text-gray-400">Your transaction history will appear here.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="p-4 font-bold uppercase tracking-wider text-xs">Transaction Date</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-xs">Order Number</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-xs">Method</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-xs">Amount</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20">
                    <td className="p-4 font-medium">{new Date(payment.transactionDate).toLocaleString()}</td>
                    <td className="p-4 font-bold text-primary">{payment.orderId?.orderNumber || payment.orderId?._id?.substring(0,8) || 'N/A'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {payment.paymentMethod === 'Razorpay' ? <FaCheckCircle className="text-emerald-500" /> : <FaMoneyBillWave className="text-amber-500" />}
                        <span className="font-bold text-gray-700 dark:text-gray-300">{payment.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="p-4 font-black text-gray-900 dark:text-white">₹{payment.amount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-md ${
                        payment.paymentStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        payment.paymentStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {payment.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
