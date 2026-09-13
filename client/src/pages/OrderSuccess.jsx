import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../redux/slices/ordersApiSlice';
import Button from '../components/ui/Button';
import { FaCheckCircle, FaDownload, FaShoppingBag } from 'react-icons/fa';

const OrderSuccess = () => {
  const { id: orderId } = useParams();
  const { data: orderData, isLoading, error } = useGetOrderDetailsQuery(orderId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownloadInvoice = () => {
    window.print();
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">Error loading order</div>;

  const order = orderData.data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-center print:py-0 print:px-0">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 print:shadow-none print:border-none">
        
        <div className="print:hidden">
          <FaCheckCircle className="text-6xl text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order Successful!</h1>
          <p className="text-lg text-gray-500 mt-2">Thank you for your purchase.</p>
        </div>

        <div className="mt-10 border-t border-b border-gray-100 py-8 text-left">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Order Number</p>
              <p className="text-xl font-black text-gray-900">{order.orderNumber}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Estimated Delivery</p>
              <p className="text-lg font-bold text-primary">
                {new Date(order.expectedDeliveryDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div>
            <h3 className="font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2">Shipping Address</h3>
            <p className="text-gray-600 font-medium">{order.shippingAddress.address}</p>
            <p className="text-gray-600 font-medium">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p className="text-gray-600 font-medium">{order.shippingAddress.country}</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2">Payment Details</h3>
            <p className="text-gray-600 font-medium">Method: <span className="font-bold">{order.paymentMethod}</span></p>
            <p className="text-gray-600 font-medium">Status: <span className={`font-bold ${order.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>{order.isPaid ? 'Paid' : 'Pending Payment (COD)'}</span></p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 print:hidden flex flex-col sm:flex-row justify-center gap-4">
          <Link to={`/order/${order._id}`}>
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
              <FaShoppingBag /> Track Order
            </Button>
          </Link>
          <Button variant="primary" size="lg" onClick={() => window.open(`/api/invoice/${orderId}`, '_blank')} className="w-full sm:w-auto gap-2">
            <FaDownload /> Download Invoice
          </Button>
        </div>
        
        <div className="mt-6 print:hidden">
          <Link to="/" className="text-primary hover:text-secondary font-semibold transition-colors">
            &larr; Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
