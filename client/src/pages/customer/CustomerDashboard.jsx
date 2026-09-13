import { useGetDashboardStatsQuery } from '../../redux/slices/customerApiSlice';
import { FaShoppingBag, FaHeart, FaTruck, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const stats = data?.data || { totalOrders: 0, pendingOrders: 0, deliveredOrders: 0, wishlistCount: 0, recentOrders: [] };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Overview</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-2xl">
            <FaShoppingBag />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Total Orders</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalOrders}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center text-2xl">
            <FaClock />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center text-2xl">
            <FaTruck />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Delivered</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.deliveredOrders}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-900/20 text-pink-500 flex items-center justify-center text-2xl">
            <FaHeart />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Wishlist Items</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.wishlistCount}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Snapshot */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link to="/dashboard/orders" className="text-primary font-bold text-sm hover:underline">View All</Link>
        </div>
        
        {stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">You haven't placed any orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">
                  <th className="p-4">Order #</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {stats.recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                    <td className="p-4 font-mono font-bold text-primary">{order.orderNumber}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">₹{order.totalPrice.toFixed(2)}</td>
                    <td className="p-4">
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
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
