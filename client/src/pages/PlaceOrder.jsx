import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../redux/slices/ordersApiSlice';
import { useCreateRazorpayOrderMutation, useVerifyPaymentMutation, useRecordCODMutation } from '../redux/slices/paymentApiSlice';
import { useApplyCouponMutation } from '../redux/slices/couponsApiSlice';
import { useGetCartQuery, useClearCartMutation } from '../redux/slices/cartApiSlice';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: cartData, refetch } = useGetCartQuery();
  const cartItems = cartData?.data?.items || [];
  
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [recordCOD] = useRecordCODMutation();
  const [clearCart] = useClearCartMutation();

  useEffect(() => {
    const address = localStorage.getItem('shippingAddress');
    const method = localStorage.getItem('paymentMethod');
    if (!address) navigate('/shipping');
    
    setShippingAddress(JSON.parse(address));
    if (method) setPaymentMethod(method);
  }, [navigate]);

  // Calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shippingPrice = itemsPrice > 1000 || itemsPrice === 0 ? 0 : 50;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const discountedSubtotal = itemsPrice - discountAmount;
  const taxPrice = Number((discountedSubtotal * 0.18).toFixed(2));
  const grandTotal = Number((discountedSubtotal + taxPrice + shippingPrice).toFixed(2));

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await applyCoupon({ code: couponCode, orderAmount: itemsPrice }).unwrap();
      setAppliedCoupon(res.data);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const initRazorpay = (orderData, dbOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YourKey', 
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Agriftilizer",
      description: "Order Payment",
      order_id: orderData.id,
      handler: async (response) => {
        try {
          await verifyPayment({
            orderId: dbOrder._id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }).unwrap();
          toast.success('Payment Successful');
          navigate(`/payment-success/${dbOrder._id}`);
        } catch (err) {
          toast.error(err?.data?.message || err.error);
          navigate(`/payment-failure`);
        }
      },
      prefill: {
        name: shippingAddress.fullName,
        contact: shippingAddress.phone,
      },
      theme: { color: "#16a34a" },
    };
    
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const placeOrderHandler = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderPayload = {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discount: discountAmount,
        totalPrice: grandTotal,
        couponApplied: appliedCoupon ? appliedCoupon.code : undefined,
      };

      const res = await createOrder(orderPayload).unwrap();
      await clearCart().unwrap();
      refetch();
      
      if (paymentMethod === 'Razorpay') {
        const rpRes = await createRazorpayOrder({ orderId: res.data._id }).unwrap();
        initRazorpay(rpRes.data, res.data);
      } else {
        await recordCOD({ orderId: res.data._id }).unwrap();
        toast.success('Order placed successfully (COD)');
        navigate(`/payment-success/${res.data._id}`);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (!shippingAddress) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">Shipping Details</h2>
              <p className="font-bold text-gray-900">{shippingAddress.fullName}</p>
              <p className="text-gray-600 mt-1">{shippingAddress.street}, {shippingAddress.city}</p>
              <p className="text-gray-600">{shippingAddress.state} - {shippingAddress.pinCode}</p>
              <p className="text-gray-600 mt-2"><strong>Phone:</strong> {shippingAddress.phone}</p>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">Payment Method</h2>
              <div className="flex items-center gap-2 font-bold text-gray-700">
                <FaCheckCircle className="text-primary" /> 
                {paymentMethod === 'Razorpay' ? 'Online Payment (Razorpay)' : 'Cash on Delivery'}
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <h2 className="text-xl font-bold text-gray-900 p-8 pb-4 border-b bg-gray-50/50">Order Items</h2>
              <div className="p-8 space-y-4">
                {cartItems.map((item, index) => (
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
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">Order Summary</h2>
              <div className="p-4 bg-gray-50 rounded-xl border mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Have a coupon?</label>
                {appliedCoupon ? (
                  <div className="flex justify-between items-center bg-emerald-50 text-emerald-700 p-3 rounded-lg border border-emerald-200">
                    <span className="font-bold">✓ {appliedCoupon.code} Applied</span>
                    <button onClick={handleRemoveCoupon} className="text-sm font-bold hover:text-red-500">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter code" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary" />
                    <Button onClick={handleApplyCoupon} disabled={!couponCode || isApplyingCoupon}>Apply</Button>
                  </div>
                )}
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold text-gray-900">₹{itemsPrice.toFixed(2)}</span></div>
                {appliedCoupon && <div className="flex justify-between text-emerald-600 font-bold"><span>Discount ({appliedCoupon.code})</span><span>- ₹{discountAmount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-gray-600"><span>GST (18%)</span><span className="font-semibold text-gray-900">₹{taxPrice.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span className="font-semibold text-gray-900">{shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toFixed(2)}`}</span></div>
              </div>
              <div className="border-t border-gray-100 pt-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Order Total</span>
                  <span className="text-3xl font-black text-primary">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>              <Button 
                fullWidth 
                size="lg" 
                onClick={placeOrderHandler} 
                disabled={cartItems.length === 0 || isLoading}
              >
                {isLoading ? 'Processing...' : (paymentMethod === 'Razorpay' ? 'Pay Now' : 'Place Order')}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
