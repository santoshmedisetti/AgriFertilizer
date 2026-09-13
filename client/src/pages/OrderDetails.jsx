import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../redux/slices/ordersApiSlice';
import { FaCheckCircle, FaTimesCircle, FaBoxOpen, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';
import Button from '../components/ui/Button';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderDetails = () => {
  const { id } = useParams();
  const { data: orderData, isLoading, error } = useGetOrderDetailsQuery(id);
  const [isDownloading, setIsDownloading] = useState(false);

  if (isLoading) return <div className="min-h-screen flex justify-center py-20">Loading order details...</div>;
  if (error) return <div className="min-h-screen flex justify-center py-20 text-red-500">Error loading order</div>;

  const order = orderData.data;

  const handleDownloadInvoice = async () => {
    try {
      setIsDownloading(true);
      const response = await axios.get(`http://localhost:5000/api/invoice/${order._id}`, {
        withCredentials: true,
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.orderNumber || order._id.substring(0, 8).toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Your session has expired. Please login again.');
      } else if (err.response?.status === 403) {
        toast.error('You are not authorized to download this invoice.');
      } else if (err.response?.status === 404) {
        toast.error('Invoice/order not found.');
      } else {
        toast.error('Unable to download invoice. Please try again.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex flex-wrap items-center gap-3">
              Order #{order.orderNumber || order._id.substring(0, 8).toUpperCase()}
              <span className={`text-sm px-3 py-1 rounded-full border ${order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-primary/10 text-primary border-primary/20'}`}>
                {order.status}
              </span>
            </h1>
            <p className="text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="primary" onClick={handleDownloadInvoice} disabled={isDownloading}>
              {isDownloading ? 'Downloading...' : 'Download PDF Invoice'}
            </Button>
            <Link to="/products" className="hidden sm:block">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 print:block">
          
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Order Timeline */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 print:hidden">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <FaTruck className="text-primary" /> Track Order
              </h2>
              <div className="relative border-l-2 border-gray-100 ml-3 md:ml-4 space-y-8">
                {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                  const historyItem = order.statusHistory?.find(h => h.status === step);
                  const isCompleted = !!historyItem;
                  const isCancelled = order.status === 'Cancelled';
                  if (isCancelled && (step !== 'Pending' && step !== 'Cancelled')) return null;

                  return (
                    <div key={idx} className="relative pl-8">
                      <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 flex items-center justify-center
                        ${isCompleted ? 'bg-primary border-white ring-2 ring-primary' : 'bg-gray-100 border-white ring-2 ring-gray-200'}
                      `}></div>
                      <div>
                        <h4 className={`text-lg font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step}</h4>
                        {isCompleted && (
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(historyItem.timestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                {order.status === 'Cancelled' && (
                  <div className="relative pl-8">
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 bg-red-500 border-white ring-2 ring-red-500"></div>
                    <div>
                      <h4 className="text-lg font-bold text-red-600">Cancelled</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.statusHistory.find(h => h.status === 'Cancelled')?.timestamp || Date.now()).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaCheckCircle className="text-primary" /> Payment Status
              </h2>
              <div className="mb-4">
                <strong>Method:</strong> {order.paymentMethod === 'Razorpay' ? 'Online Payment' : 'Cash on Delivery (COD)'}
              </div>
              {order.isPaid ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl font-bold flex items-center gap-2 border border-emerald-100">
                  <FaCheckCircle className="text-xl" /> Paid on {new Date(order.paidAt).toLocaleDateString()}
                </div>
              ) : (
                <div className="p-4 bg-red-50 text-red-800 rounded-xl font-bold flex items-center gap-2 border border-red-100">
                  <FaTimesCircle className="text-xl" /> Not Paid
                </div>
              )}
            </div>

            {/* Shipping Details */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" /> Shipping Address
              </h2>
              <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
              <p className="text-gray-600 mt-1">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
              <p className="text-gray-600">{order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
              <p className="text-gray-600 mt-2"><strong>Phone:</strong> {order.shippingAddress.phone}</p>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <h2 className="text-xl font-bold text-gray-900 p-8 pb-4 border-b bg-gray-50/50 flex items-center gap-2">
                <FaBoxOpen className="text-primary" /> Order Items
              </h2>
              <div className="p-8 space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-gray-200" />
                    <Link to={`/product/${item.product}`} className="flex-1 font-bold text-gray-800 hover:text-primary">
                      {item.name}
                    </Link>
                    <div className="text-sm font-semibold text-gray-600">
                      {item.qty} x ₹{item.price} = <span className="text-gray-900">₹{item.qty * item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">Invoice Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items</span>
                  <span className="font-semibold text-gray-900">₹{order.itemsPrice}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-gray-900">₹{order.taxPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-black text-primary">₹{order.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
