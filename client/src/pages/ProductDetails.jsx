import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetProductDetailsQuery, useGetProductsQuery } from '../redux/slices/productsApiSlice';
import { FaStar, FaShoppingCart, FaLeaf, FaTruck, FaShieldAlt, FaExclamationCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useAddToCartMutation } from '../redux/slices/cartApiSlice';
import { useGetProductReviewsQuery, useCreateReviewMutation, useMarkHelpfulMutation } from '../redux/slices/reviewsApiSlice';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';
import ProductCard from '../components/common/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const { userInfo } = useSelector((state) => state.auth);
  const [addToCart, { isLoading: isAddingCart }] = useAddToCartMutation();

  const { data, isLoading, error } = useGetProductDetailsQuery(id);
  
  // Reviews state
  const [reviewSort, setReviewSort] = useState('latest');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  
  const { data: reviewsData, refetch: refetchReviews } = useGetProductReviewsQuery({ productId: id, sort: reviewSort }, { skip: !id });
  const [createReview, { isLoading: isCreatingReview }] = useCreateReviewMutation();
  const [markHelpful] = useMarkHelpfulMutation();

  const product = data?.data;

  const { data: relatedData } = useGetProductsQuery(
    { category: product?.category?._id, pageSize: 5 },
    { skip: !product?.category?._id }
  );
  
  const relatedProducts = relatedData?.data?.products?.filter(p => p._id !== product?._id).slice(0, 4) || [];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-gray-50">
        <FaExclamationCircle className="text-gray-300 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          The product you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/products" className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-dark transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const currentPrice = product.discountPrice || product.price;

  const handleAddToCart = async () => {
    if (!userInfo) return navigate('/login');
    try {
      await addToCart({ productId: id, qty }).unwrap();
      toast.success('Added to cart successfully');
      navigate('/cart');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) return navigate('/login');
    try {
      await createReview({ productId: id, rating, title, comment }).unwrap();
      toast.success('Review submitted successfully!');
      setTitle('');
      setComment('');
      setRating(5);
      refetchReviews();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!userInfo) return toast.error('Please login first');
    try {
      await markHelpful(reviewId).unwrap();
      toast.success('Marked as helpful');
      refetchReviews();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const reviews = reviewsData?.data || [];
  const ratingDistribution = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: reviews.filter(rev => rev.rating === r).length
  }));

  return (
    <div className="bg-white min-h-screen pb-16">
      
      {/* Breadcrumb Area */}
      <div className="bg-gray-50 py-4 border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex text-sm text-gray-500">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-50 rounded-3xl p-8 mb-6 border border-gray-100 flex items-center justify-center aspect-square relative">
              {discount > 0 && (
                <div className="absolute top-6 left-6 bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-md z-10">
                  {discount}% OFF
                </div>
              )}
              {product.images && product.images.length > 0 ? (
                <img src={product.images[mainImageIndex]} alt={product.name} className="max-h-full object-contain mix-blend-multiply" />
              ) : (
                <img src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c5980?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt={product.name} className="max-h-full object-contain mix-blend-multiply" />
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setMainImageIndex(idx)}
                    className={`w-24 h-24 rounded-xl border-2 flex-shrink-0 bg-gray-50 p-2 ${mainImageIndex === idx ? 'border-primary shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2">
            <div className="mb-2 text-primary font-bold tracking-wider uppercase text-sm">{product.category?.name}</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'} />
                ))}
                <span className="ml-2 font-bold text-gray-700">{product.rating}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 hover:text-primary cursor-pointer transition-colors">{product.numReviews} Reviews</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">SKU: {product.sku}</span>
            </div>

            <div className="mb-8">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-black text-gray-900">₹{currentPrice}</span>
                {product.discountPrice > 0 && (
                  <span className="text-xl text-gray-400 line-through mb-1">₹{product.price}</span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium">Inclusive of all taxes</p>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">{product.description}</p>

            <div className="bg-emerald-50 rounded-2xl p-6 mb-8 border border-emerald-100 flex gap-6">
              <div className="flex-1 text-center border-r border-emerald-200">
                <div className="text-sm text-emerald-800 mb-1">Unit</div>
                <div className="font-bold text-gray-900">{product.unit}</div>
              </div>
              {product.npkRatio && (
                <div className="flex-1 text-center border-r border-emerald-200">
                  <div className="text-sm text-emerald-800 mb-1">NPK Ratio</div>
                  <div className="font-bold text-gray-900">{product.npkRatio}</div>
                </div>
              )}
              <div className="flex-1 text-center">
                <div className="text-sm text-emerald-800 mb-1">Stock</div>
                <div className={`font-bold ${product.countInStock > 0 ? 'text-primary' : 'text-red-500'}`}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
            </div>

            {product.countInStock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white h-14">
                  <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)} className="px-5 text-gray-500 hover:text-primary font-bold text-xl h-full transition-colors">-</button>
                  <span className="px-4 font-bold text-gray-900 text-lg w-12 text-center">{qty}</span>
                  <button onClick={() => setQty(qty < product.countInStock ? qty + 1 : product.countInStock)} className="px-5 text-gray-500 hover:text-primary font-bold text-xl h-full transition-colors">+</button>
                </div>
                <Button size="lg" className="flex-1 h-14 text-lg" disabled={isAddingCart} onClick={handleAddToCart}>
                  <FaShoppingCart className="mr-2" /> {isAddingCart ? 'Adding...' : 'Add to Cart'}
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><FaTruck /></div>
                <span className="text-sm font-medium text-gray-700">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><FaLeaf /></div>
                <span className="text-sm font-medium text-gray-700">100% Genuine</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><FaShieldAlt /></div>
                <span className="text-sm font-medium text-gray-700">Secure Payment</span>
              </div>
            </div>

          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-20">
          <div className="flex border-b border-gray-200 gap-8 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-lg font-bold whitespace-nowrap transition-colors ${activeTab === 'description' ? 'text-primary border-b-4 border-primary' : 'text-gray-400 hover:text-gray-700'}`}
            >
              Full Description
            </button>
            {product.benefits && product.benefits.length > 0 && (
              <button 
                onClick={() => setActiveTab('benefits')}
                className={`pb-4 text-lg font-bold whitespace-nowrap transition-colors ${activeTab === 'benefits' ? 'text-primary border-b-4 border-primary' : 'text-gray-400 hover:text-gray-700'}`}
              >
                Key Benefits
              </button>
            )}
            {product.usageInstructions && (
              <button 
                onClick={() => setActiveTab('usage')}
                className={`pb-4 text-lg font-bold whitespace-nowrap transition-colors ${activeTab === 'usage' ? 'text-primary border-b-4 border-primary' : 'text-gray-400 hover:text-gray-700'}`}
              >
                Usage Instructions
              </button>
            )}
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-lg font-bold whitespace-nowrap transition-colors ${activeTab === 'reviews' ? 'text-primary border-b-4 border-primary' : 'text-gray-400 hover:text-gray-700'}`}
            >
              Reviews ({product.numReviews})
            </button>
          </div>

          <div className="py-8 text-gray-600 leading-loose text-lg">
            {activeTab === 'description' && (
              <div>
                <p>{product.description}</p>
                {product.manufacturer && <p className="mt-4"><strong>Manufacturer:</strong> {product.manufacturer}</p>}
                {product.brand && <p className="mt-2"><strong>Brand:</strong> {product.brand.name}</p>}
              </div>
            )}
            
            {activeTab === 'benefits' && (
              <ul className="list-disc pl-6 space-y-2">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            )}

            {activeTab === 'usage' && (
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                {product.usageInstructions}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-12 animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-2xl font-black text-gray-900">Customer Reviews</h3>
                    <div className="flex items-center gap-4">
                      <h4 className="text-5xl font-black text-gray-900">{product.rating}</h4>
                      <div>
                        <div className="flex items-center text-yellow-400 text-xl">
                          {[...Array(5)].map((_, i) => <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'} />)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Based on {product.numReviews} reviews</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {ratingDistribution.map((dist, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-700 w-12">{dist.stars} Stars</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${reviews.length > 0 ? (dist.count / reviews.length) * 100 : 0}%` }}></div>
                          </div>
                          <span className="text-sm text-gray-500 w-8">{dist.count}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4">Write a Review</h4>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div className="flex items-center gap-2 mb-2 cursor-pointer">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar key={star} onClick={() => setRating(star)} className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                        <input type="text" placeholder="Review Title" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm" />
                        <textarea placeholder="Write your experience..." rows="4" required value={comment} onChange={(e) => setComment(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm resize-none"></textarea>
                        <Button type="submit" className="w-full" disabled={isCreatingReview}>{isCreatingReview ? 'Submitting...' : 'Submit Review'}</Button>
                      </form>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Sort By</h3>
                      <select value={reviewSort} onChange={(e) => setReviewSort(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none font-bold text-gray-700 text-sm cursor-pointer">
                        <option value="latest">Latest</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                        <option value="helpful">Most Helpful</option>
                      </select>
                    </div>

                    <div className="space-y-6">
                      {reviews.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 font-medium">No reviews yet. Be the first to review!</div>
                      ) : (
                        reviews.map(review => (
                          <div key={review._id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-4">
                                <img src={review.userId?.profilePicture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-gray-900 text-base">{review.userId?.name || 'Anonymous'}</h4>
                                    {review.verifiedPurchase && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">Verified Buyer</span>}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex text-yellow-400 text-sm">
                                      {[...Array(5)].map((_, i) => <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'} />)}
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <h5 className="font-bold text-gray-900 text-lg mb-2">{review.title}</h5>
                            <p className="text-gray-600 text-base mb-4">{review.comment}</p>
                            <div className="flex justify-start">
                              <button onClick={() => handleHelpful(review._id)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                                👍 Helpful ({review.helpfulCount})
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct._id} item={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
