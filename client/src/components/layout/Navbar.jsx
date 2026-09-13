import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaLeaf, FaHeart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import SearchBar from '../common/SearchBar';
import MiniCartDrawer from './MiniCartDrawer';
import { useGetCartQuery } from '../../redux/slices/cartApiSlice';
import { useGetWishlistQuery } from '../../redux/slices/wishlistApiSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Fetch cart and wishlist counts if user is logged in
  const { data: cartData } = useGetCartQuery(undefined, { skip: !userInfo });
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !userInfo });

  const cartCount = cartData?.data?.items?.reduce((acc, item) => acc + item.qty, 0) || 0;
  const wishlistCount = wishlistData?.data?.items?.length || 0;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <FaLeaf className="text-2xl text-primary" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              AgriFertilizer
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-12">
            <SearchBar placeholder="Search for fertilizers, seeds, pesticides..." />
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to={userInfo ? "/dashboard/wishlist" : "/login"} className="text-gray-700 hover:text-red-500 transition-colors flex items-center relative group">
              <div className="p-2 bg-gray-50 rounded-full group-hover:bg-red-50 transition-colors">
                <FaHeart className="text-xl" />
              </div>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button 
              onClick={() => userInfo ? setIsCartOpen(true) : window.location.assign('/login')} 
              className="text-gray-700 hover:text-primary transition-colors flex items-center relative group"
            >
              <div className="p-2 bg-gray-50 rounded-full group-hover:bg-green-50 transition-colors">
                <FaShoppingCart className="text-xl" />
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            
            {userInfo ? (
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FaUser className="text-lg text-primary" />
                  </div>
                  <span className="font-semibold pr-2">{(userInfo?.name || "Guest").split(' ')[0]}</span>
                </div>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 hidden group-hover:block border border-gray-100 transform origin-top-right transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{userInfo?.name || "Guest"}</p>
                    <p className="text-xs text-gray-500 truncate">{userInfo?.email || "No email"}</p>
                  </div>
                  {userInfo.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-primary transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-primary transition-colors">
                    My Profile
                  </Link>
                  <Link to="/dashboard/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-primary transition-colors">
                    My Orders
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-primary font-semibold p-2 rounded-full hover:bg-green-50 transition-colors">
                <div className="bg-gray-100 p-2 rounded-full">
                  <FaUser className="text-primary" />
                </div>
                <span className="pr-2">Login / Register</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link to="/cart" className="text-gray-700 relative">
              <div className="p-2 bg-gray-50 rounded-full">
                <FaShoppingCart className="text-xl" />
              </div>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                0
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-primary focus:outline-none bg-gray-50 rounded-full hover:bg-green-50 transition-colors"
            >
              {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Search - Visible only on small screens */}
        <div className="lg:hidden pb-4">
          <SearchBar placeholder="Search products..." />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0"
          >
            <div className="px-4 py-4 space-y-2">
              {userInfo ? (
                <>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center gap-3">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <FaUser className="text-primary text-xl" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{userInfo?.name || "Guest"}</p>
                      <p className="text-xs text-gray-500">{userInfo?.email || "No email"}</p>
                    </div>
                  </div>
                  
                  {userInfo.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-primary rounded-lg font-medium transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/dashboard/profile" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-primary rounded-lg font-medium transition-colors">
                    My Profile
                  </Link>
                  <Link to="/dashboard/orders" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-primary rounded-lg font-medium transition-colors">
                    My Orders
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center justify-center gap-2 bg-primary text-white p-3 rounded-xl font-bold hover:bg-secondary transition-colors">
                  <FaUser />
                  Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Cart Drawer */}
      <MiniCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartData={cartData} />
    </nav>
  );
};

export default Navbar;
