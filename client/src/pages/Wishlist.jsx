import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../redux/slices/wishlistApiSlice';
import { useAddToCartMutation } from '../redux/slices/cartApiSlice';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { data: wishlistData, isLoading, error } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const wishlistItems = wishlistData?.data?.items || [];

  const removeHandler = async (id) => {
    try {
      await removeFromWishlist(id).unwrap();
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const moveToCartHandler = async (product) => {
    try {
      await addToCart({ productId: product._id, qty: 1 }).unwrap();
      await removeFromWishlist(product._id).unwrap();
      toast.success('Moved to cart successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <div className="min-h-screen flex justify-center py-20">Loading wishlist...</div>;
  if (error) return <div className="min-h-screen flex justify-center py-20 text-red-500">Error loading wishlist</div>;

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <FaHeart className="text-red-500" /> My Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <FaHeart className="text-6xl mx-auto mb-6 text-gray-200" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you like and buy them later.</p>
            <Link to="/products">
              <Button size="lg">Explore Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden group transition-all duration-300 flex flex-col">
                
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
                  <Link to={`/product/${product._id}`} className="block w-full h-full">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out mix-blend-multiply"
                    />
                  </Link>
                  <button 
                    onClick={() => removeHandler(product._id)}
                    className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all z-10"
                    title="Remove from Wishlist"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <Link to={`/product/${product._id}`} className="block mb-2 flex-grow">
                    <h3 className="font-bold text-gray-800 text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex flex-col mb-4">
                    <span className="text-2xl font-black text-gray-900 leading-none">₹{product.price}</span>
                  </div>
                  
                  <Button 
                    fullWidth 
                    disabled={product.countInStock === 0 || isAddingToCart}
                    onClick={() => moveToCartHandler(product)}
                    className="mt-auto flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart /> {product.countInStock > 0 ? 'Move to Cart' : 'Out of Stock'}
                  </Button>
                </div>

              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default Wishlist;
