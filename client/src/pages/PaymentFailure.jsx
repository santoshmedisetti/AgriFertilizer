import { Link } from 'react-router-dom';
import { FaTimesCircle, FaRedo } from 'react-icons/fa';
import Button from '../components/ui/Button';

const PaymentFailure = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-sm">
          <FaTimesCircle />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-8">We couldn't process your payment. Please check your details and try again.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/placeorder">
            <Button className="w-full sm:w-auto gap-2">
              <FaRedo /> Retry Payment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
