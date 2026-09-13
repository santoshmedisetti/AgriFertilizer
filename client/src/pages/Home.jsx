import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/layout/HeroBanner';
import CategoryCard from '../components/common/CategoryCard';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/ui/Button';
import { FaLeaf, FaTruck, FaHeadset, FaShieldAlt, FaStar, FaArrowRight } from 'react-icons/fa';
import { useGetProductsQuery } from '../redux/slices/productsApiSlice';
import { useGetCategoriesQuery } from '../redux/slices/categoriesApiSlice';

const features = [
  { icon: FaLeaf, title: '100% Genuine', desc: 'Sourced from trusted brands' },
  { icon: FaTruck, title: 'Fast Delivery', desc: 'Free shipping over ₹1000' },
  { icon: FaShieldAlt, title: 'Secure Payment', desc: '100% secure gateway' },
  { icon: FaHeadset, title: '24/7 Support', desc: 'Dedicated farmer support' },
];

const reviews = [
  { id: 1, name: 'Rajesh Kumar', role: 'Farmer, Punjab', content: 'The organic compost significantly improved my soil quality. Fast delivery and great service!', rating: 5 },
  { id: 2, name: 'Amit Singh', role: 'Farm Owner, Haryana', content: 'Very reasonable prices for bulk urea. The UI is easy to use and order tracking is accurate.', rating: 4 },
  { id: 3, name: 'Priya Patel', role: 'Gardener, Gujarat', content: 'Loved the hybrid seeds! My tomato yield doubled this season. Highly recommend AgriFertilizer.', rating: 5 },
];

const Home = () => {
  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery({ sort: 'rating_desc' });
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();

  const categories = categoriesData?.data || [];
  const products = productsData?.data?.products?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeroBanner />

      {/* Categories Grid */}
      <section className="py-16 md:py-24 bg-white relative z-10 -mt-10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Shop by Category</h2>
              <p className="mt-2 text-lg text-gray-500 font-medium">Explore our wide range of agricultural products</p>
            </div>
          </div>
          {isLoadingCategories ? (
            <div className="text-center py-8 text-gray-500">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Featured Products</h2>
              <p className="mt-2 text-lg text-gray-500 font-medium">Handpicked premium items for your farm</p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="hidden sm:inline-flex items-center gap-2 group">
                View All <FaArrowRight className="group-hover:translate-x-1 transition-transform"/>
              </Button>
            </Link>
          </div>
          {isLoadingProducts ? (
            <div className="text-center py-8 text-gray-500">Loading featured products...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="mt-10 text-center sm:hidden">
                <Link to="/products">
                  <Button variant="outline" fullWidth>View All Products</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Latest Offers Banner */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-800 to-primary rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 px-6 py-12 md:py-16 md:px-16 lg:flex lg:items-center lg:justify-between text-white">
              <div>
                <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wider rounded-full mb-4">Limited Time Offer</span>
                <h2 className="text-3xl font-extrabold sm:text-5xl tracking-tight mb-2">
                  Monsoon Special Sale!
                </h2>
                <p className="mt-2 text-xl text-emerald-100 font-medium">
                  Get up to <span className="text-yellow-400 font-bold text-2xl">30% OFF</span> on all Pesticides.
                </p>
                <p className="mt-4 text-base text-emerald-50 max-w-xl opacity-90">
                  Prepare your crops for the monsoon season. Use code <span className="font-bold bg-white/20 px-2 py-1 rounded">MONSOON30</span> at checkout.
                </p>
              </div>
              <div className="mt-10 lg:mt-0 flex-shrink-0">
                <Link to="/products">
                  <Button variant="secondary" size="lg" className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 hover:text-yellow-900 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Why Choose AgriFertilizer?</h2>
            <p className="mt-3 text-lg text-gray-500 font-medium">We are committed to empowering farmers with the best quality.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 text-center flex flex-col items-center transition-all duration-300 group"
              >
                <div className="w-20 h-20 bg-green-50 text-primary rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <feature.icon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">What Farmers Say</h2>
            <p className="mt-3 text-lg text-gray-500 font-medium">Trusted by over 10,000+ farmers across India</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 relative">
                <div className="absolute top-8 right-8 text-6xl text-gray-200 font-serif leading-none">"</div>
                <div className="flex text-yellow-400 mb-6 text-lg relative z-10">
                  {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p className="text-gray-700 mb-8 italic text-lg leading-relaxed relative z-10">"{review.content}"</p>
                <div className="flex items-center relative z-10">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
                    {review.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-bold text-gray-900">{review.name}</p>
                    <p className="text-sm font-medium text-gray-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
