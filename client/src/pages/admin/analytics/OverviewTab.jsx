import { useGetOverviewAnalyticsQuery } from '../../../redux/slices/adminApiSlice';
import { FaRupeeSign, FaShoppingCart, FaUsers, FaBoxOpen, FaHourglassHalf, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const OverviewTab = () => {
  const { data, isLoading, error } = useGetOverviewAnalyticsQuery();

  if (isLoading) return <div className="p-12 text-center text-gray-500 font-bold">Loading Overview Data...</div>;
  if (error) return <div className="p-12 text-center text-red-500 font-bold">Failed to load analytics</div>;

  const kpis = data?.data || {};

  const kpiCards = [
    { title: "Today's Revenue", value: `₹${kpis.todayRevenue}`, icon: <FaRupeeSign />, color: 'bg-emerald-500' },
    { title: 'Total Revenue', value: `₹${kpis.totalRevenue}`, icon: <FaRupeeSign />, color: 'bg-primary' },
    { title: 'Total Orders', value: kpis.totalOrders, icon: <FaShoppingCart />, color: 'bg-blue-500' },
    { title: 'Total Customers', value: kpis.totalCustomers, icon: <FaUsers />, color: 'bg-purple-500' },
    { title: 'Total Products', value: kpis.totalProducts, icon: <FaBoxOpen />, color: 'bg-indigo-500' },
    { title: 'Pending Orders', value: kpis.pendingOrders, icon: <FaHourglassHalf />, color: 'bg-amber-500' },
    { title: 'Delivered Orders', value: kpis.deliveredOrders, icon: <FaCheckCircle />, color: 'bg-teal-500' },
    { title: 'Low Stock Alert', value: kpis.lowStockProducts, icon: <FaExclamationTriangle />, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center text-2xl shadow-lg ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{kpi.title}</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 font-bold uppercase tracking-wider text-xs">
                <th className="py-3">Order #</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Date</th>
                <th className="py-3">Total</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {kpis.recentOrders?.map(order => (
                <tr key={order._id} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-900/20">
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{order.orderNumber || order._id.substring(0,8)}</td>
                  <td className="py-3 font-medium">{order.user?.name || 'Guest'}</td>
                  <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 font-bold text-primary">₹{order.totalPrice.toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
