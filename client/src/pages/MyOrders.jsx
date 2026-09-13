import { useGetMyOrdersQuery } from '../redux/slices/ordersApiSlice';
import { Link } from 'react-router-dom';
import { FaBox, FaChevronRight, FaEye } from 'react-icons/fa';
import Button from '../components/ui/Button';

const MyOrders = () => {
  const { data: ordersData, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading orders...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">Failed to load orders</div>;

  const orders = ordersData.data;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Packed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Out for Delivery': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'Returned': return 'bg-gray-200 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <FaBox className="text-3xl text-primary" />
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
          <FaBox className="text-6xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No orders found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't made your first purchase yet.</p>
          <Link to="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                  <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order Placed</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</p>
                    <p className="text-sm font-black text-primary">₹{order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order #</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.orderNumber || order._id.substring(0, 10)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to={`/order/${order._id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FaEye /> Track Order
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  {order.status === 'Delivered' && (
                    <span className="text-sm text-gray-500 font-medium">on {new Date(order.deliveredAt).toLocaleDateString()}</span>
                  )}
                </div>

                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-800 pt-4 first:border-0 first:pt-0">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-gray-100 dark:border-gray-800" />
                      <div className="flex-1">
                        <Link to={`/product/${item.product}`} className="font-bold text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-1">
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.qty}</p>
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white">₹{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
