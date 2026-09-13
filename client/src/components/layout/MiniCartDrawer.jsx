import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useRemoveCartItemMutation } from '../../redux/slices/cartApiSlice';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

const MiniCartDrawer = ({ isOpen, onClose, cartData }) => {
  const [removeCartItem, { isLoading }] = useRemoveCartItemMutation();

  const removeFromCartHandler = async (id) => {
    try {
      await removeCartItem(id).unwrap();
      toast.success('Item removed');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const cartItems = cartData?.data?.items || [];
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaShoppingCart className="text-primary" /> Shopping Cart
              </h2>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <FaShoppingCart className="text-5xl mx-auto mb-4 text-gray-200" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl bg-white border border-gray-200" />
                    <div className="flex-1">
                      <Link to={`/product/${item.product}`} className="font-semibold text-gray-800 hover:text-primary text-sm line-clamp-2" onClick={onClose}>
                        {item.name}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1">Qty: {item.qty}</div>
                      <div className="font-bold text-primary">₹{item.price * item.qty}</div>
                    </div>
                    <button 
                      onClick={() => removeFromCartHandler(item._id)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between mb-4 font-bold text-lg text-gray-900">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                <Link to="/cart" onClick={onClose}>
                  <Button fullWidth size="lg">View Full Cart & Checkout</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MiniCartDrawer;
