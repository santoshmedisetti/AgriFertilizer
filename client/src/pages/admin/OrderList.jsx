import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../redux/slices/ordersApiSlice';
import { FaEye, FaCheck, FaTimes, FaSearch, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import { useState } from 'react';

const OrderList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: ordersData, isLoading, error, refetch } = useGetOrdersQuery({ search, status: statusFilter });
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (id, newStatus) => {
    if (window.confirm(`Change order status to ${newStatus}?`)) {
      try {
        await updateOrderStatus({ orderId: id, status: newStatus, comment: `Updated by Admin` }).unwrap();
        toast.success(`Order status updated to ${newStatus}`);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center">Loading orders...</div>;
  if (error) return <div className="flex h-64 items-center justify-center text-red-500">Failed to load orders</div>;

  const orders = ordersData.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Management</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Order #" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-bold uppercase tracking-wider">
                <th className="p-4">Order #</th>
                <th className="p-4">User</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 text-sm">{order.orderNumber || order._id.substring(0, 8)}</td>
                  <td className="p-4 text-gray-600 font-medium">{order.user?.name || 'Deleted User'}</td>
                  <td className="p-4 text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-black text-primary">₹{order.totalPrice}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold border 
                      ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                      order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <select 
                        className="text-xs p-1.5 border border-gray-200 rounded-lg outline-none"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={isUpdating}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <Link to={`/order/${order._id}`}>
                        <Button variant="outline" size="sm" className="px-3 py-1.5">
                          <FaEye />
                        </Button>
                      </Link>
                    </div>
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

export default OrderList;
