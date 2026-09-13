import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { 
  useGetCartQuery, 
  useUpdateCartItemMutation, 
  useRemoveCartItemMutation, 
  useClearCartMutation 
} from '../redux/slices/cartApiSlice';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading, error } = useGetCartQuery();
  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  const cartItems = cartData?.data?.items || [];

  const updateQtyHandler = async (id, qty) => {
    try {
      await updateCartItem({ id, qty }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || 'Error updating quantity');
    }
  };

  const removeFromCartHandler = async (id) => {
    try {
      await removeCartItem(id).unwrap();
      toast.success('Item removed');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const clearCartHandler = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart().unwrap();
        toast.success('Cart cleared');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const gst = Math.round(subtotal * 0.18); // 18% GST Example
  const deliveryCharge = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const grandTotal = subtotal + gst + deliveryCharge;

  if (isLoading) return <div className="min-h-screen flex justify-center py-20">Loading cart...</div>;
  if (error) return <div className="min-h-screen flex justify-center py-20 text-red-500">Error loading cart</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <FaShoppingCart className="text-primary" /> Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <FaShoppingCart className="text-6xl mx-auto mb-6 text-gray-200" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Cart Items */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900">Cart Items ({cartItems.length})</h2>
                  <button onClick={clearCartHandler} disabled={isClearing} className="text-sm font-semibold text-red-500 hover:text-red-700">
                    Clear Cart
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex flex-col sm:flex-row gap-6 items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <img src={item.image || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5980?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'} alt={item.name} className="w-24 h-24 object-cover rounded-2xl bg-gray-50 border border-gray-200" />
                      
                      <div className="flex-1 text-center sm:text-left">
                        <Link to={`/product/${item.product}`} className="text-lg font-bold text-gray-900 hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                        <div className="text-primary font-extrabold text-xl mt-1">₹{item.price}</div>
                        {item.discountPrice > 0 && (
                          <div className="text-sm text-gray-400 line-through">₹{item.discountPrice}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Quantity Selector */}
                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden h-10">
                          <button 
                            disabled={isUpdating}
                            onClick={() => updateQtyHandler(item._id, item.qty - 1)}
                            className="px-3 text-gray-500 hover:text-primary font-bold hover:bg-gray-50 h-full transition-colors"
                            {...(item.qty <= 1 && { disabled: true })}
                          >-</button>
                          <span className="px-3 font-bold text-gray-900 w-10 text-center">{item.qty}</span>
                          <button 
                            disabled={isUpdating || item.qty >= item.countInStock}
                            onClick={() => updateQtyHandler(item._id, item.qty + 1)}
                            className="px-3 text-gray-500 hover:text-primary font-bold hover:bg-gray-50 h-full transition-colors"
                          >+</button>
                        </div>

                        <div className="font-bold text-gray-900 w-20 text-right">
                          ₹{item.price * item.qty}
                        </div>

                        <button 
                          onClick={() => removeFromCartHandler(item._id)}
                          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                    <span className="font-semibold text-gray-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-gray-900">₹{gst}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-gray-900">{deliveryCharge === 0 ? <span className="text-emerald-500">Free</span> : `₹${deliveryCharge}`}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Grand Total</span>
                    <span className="text-3xl font-black text-primary">₹{grandTotal}</span>
                  </div>
                  {deliveryCharge > 0 && (
                    <p className="text-sm text-gray-500 mt-2 text-right">Add items worth ₹{1000 - subtotal} more for free delivery!</p>
                  )}
                </div>

                <Button fullWidth size="lg" onClick={checkoutHandler}>
                  Proceed to Checkout
                </Button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
