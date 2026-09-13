import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) navigate('/login');
    const shippingAddress = localStorage.getItem('shippingAddress');
    if (!shippingAddress) navigate('/shipping');
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('paymentMethod', paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Checkout Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center text-primary">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            <span className="ml-2 font-bold hidden sm:block">Shipping</span>
          </div>
          <div className="w-16 sm:w-24 h-1 mx-4 bg-primary"></div>
          <div className="flex items-center text-primary">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
            <span className="ml-2 font-bold hidden sm:block">Payment</span>
          </div>
          <div className="w-16 sm:w-24 h-1 mx-4 bg-gray-200"></div>
          <div className="flex items-center text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold">3</div>
            <span className="ml-2 font-bold hidden sm:block">Place Order</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Payment Method</h1>

          <form onSubmit={submitHandler} className="space-y-6">
            
            <label className={`block p-6 rounded-2xl border-2 cursor-pointer transition-colors ${paymentMethod === 'Razorpay' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="Razorpay"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary focus:ring-primary"
                />
                <FaCreditCard className="text-2xl text-primary ml-4 mr-3" />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Online Payment</h3>
                  <p className="text-sm text-gray-500">Credit/Debit Card, UPI, NetBanking via Razorpay</p>
                </div>
              </div>
            </label>

            <label className={`block p-6 rounded-2xl border-2 cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary focus:ring-primary"
                />
                <FaMoneyBillWave className="text-2xl text-primary ml-4 mr-3" />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Cash on Delivery</h3>
                  <p className="text-sm text-gray-500">Pay directly to the delivery executive</p>
                </div>
              </div>
            </label>

            <Button type="submit" size="lg" fullWidth className="mt-8">
              Continue
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Payment;
