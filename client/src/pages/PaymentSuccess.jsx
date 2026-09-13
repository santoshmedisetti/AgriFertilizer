import { Link, useParams } from 'react-router-dom';
import { FaCheckCircle, FaFileDownload, FaShoppingBag } from 'react-icons/fa';
import Button from '../components/ui/Button';

const PaymentSuccess = () => {
  const { id } = useParams();

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-sm">
          <FaCheckCircle />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">Thank you for your purchase. Your order has been confirmed.</p>
        
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 text-left">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <span className="text-gray-500 font-medium">Order Number</span>
            <span className="font-bold text-gray-900">{id?.substring(0, 10).toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Status</span>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Confirmed</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" className="w-full sm:w-auto gap-2" onClick={() => window.open(`/api/invoice/${id}`, '_blank')}>
            <FaFileDownload /> Download Invoice
          </Button>
          <Link to={`/dashboard/orders`}>
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <FaShoppingBag /> View Orders
            </Button>
          </Link>
          <Link to="/products">
            <Button className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
