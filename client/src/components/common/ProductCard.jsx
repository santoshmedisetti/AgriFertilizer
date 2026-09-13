import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaRegHeart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useAddToCartMutation } from '../../redux/slices/cartApiSlice';
import { useAddToWishlistMutation } from '../../redux/slices/wishlistApiSlice';
import { toast } from 'react-toastify';
import Badge from '../ui/Badge';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [addToCart, { isLoading: isAddingCart }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: isAddingWishlist }] = useAddToWishlistMutation();
  const item = product;

  if (!item) return null;

  const discount = item.originalPrice && item.originalPrice > item.price
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!userInfo) return navigate('/login');
    try {
      await addToCart({ productId: item._id, qty: 1 }).unwrap();
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    if (!userInfo) return navigate('/login');
    try {
      await addToWishlist({ productId: item._id }).unwrap();
      toast.success('Added to wishlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden group transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
        <Link to={`/product/${item._id}`} className="block w-full h-full">
          <img 
            src={item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5980?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'} 
            alt={item.name} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out mix-blend-multiply"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {item.isNew && <Badge variant="info" className="shadow-sm font-bold tracking-wide">NEW</Badge>}
          {discount > 0 && <Badge variant="danger" className="shadow-sm font-bold tracking-wide">{discount}% OFF</Badge>}
        </div>
        
        {/* Wishlist Button */}
        <button 
          onClick={handleAddToWishlist}
          disabled={isAddingWishlist}
          className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm hover:shadow transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
        >
          <FaRegHeart className="text-lg" />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-semibold text-emerald-600 mb-1.5 uppercase tracking-wider">{item.category?.name || item.category}</div>
        
        <Link to={`/product/${item._id}`} className="block mb-2 flex-grow">
          <h3 className="font-bold text-gray-800 text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {item.name}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-1.5 mb-4">
          <div className="flex text-yellow-400 text-sm">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(item.rating) ? "text-yellow-400" : "text-gray-200"} />
            ))}
          </div>
          <span className="text-sm font-bold text-gray-700">{item.rating}</span>
          <span className="text-xs text-gray-400 font-medium">({item.numReviews})</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-gray-900 leading-none">₹{item.price}</span>
            {item.originalPrice > item.price && (
              <span className="text-sm text-gray-400 line-through mt-1">₹{item.originalPrice}</span>
            )}
          </div>
          
          <button 
            disabled={item.countInStock === 0 || isAddingCart}
            onClick={handleAddToCart}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 shadow-sm ${
              item.countInStock > 0 
                ? 'bg-primary text-white hover:bg-secondary hover:shadow-md hover:-translate-y-0.5 active:scale-95' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title={item.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          >
            <FaShoppingCart className="text-xl" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
