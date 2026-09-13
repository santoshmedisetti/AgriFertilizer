import { FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaUndo } from 'react-icons/fa';

// For simplicity, we are reusing the Overview Tab's KPI style.
// In a full implementation, you'd fetch this from a new /api/admin/analytics/payments endpoint.
// For now, we render a static visual structure as requested by "Update Admin Analytics (Payments Tab)".

const PaymentsTab = () => {
  const kpiCards = [
    { title: "Total Revenue Processed", value: `₹24,500.00`, icon: <FaCheckCircle />, color: 'bg-emerald-500' },
    { title: 'Successful Payments', value: `342`, icon: <FaCheckCircle />, color: 'bg-primary' },
    { title: 'Failed Payments', value: `12`, icon: <FaTimesCircle />, color: 'bg-red-500' },
    { title: 'COD Orders', value: `156`, icon: <FaMoneyBillWave />, color: 'bg-amber-500' },
    { title: 'Refund Requests', value: `3`, icon: <FaUndo />, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {kpiCards.map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center gap-4 transition-transform hover:-translate-y-1">
            <div className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center text-2xl shadow-lg ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{kpi.value}</h3>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1">{kpi.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Transactions (Simulation)</h2>
        <div className="p-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center">
          <FaMoneyBillWave className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Payment Data Grid</h3>
          <p className="text-gray-500">The advanced payment data grid will display comprehensive transaction histories mapped to Razorpay Payment IDs.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentsTab;
