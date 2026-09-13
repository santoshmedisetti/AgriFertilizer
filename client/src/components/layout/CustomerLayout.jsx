import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../../redux/slices/usersApiSlice';
import { logout } from '../../redux/slices/authSlice';
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaShoppingBag, 
  FaHeart, 
  FaBell, 
  FaHeadset, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaHome,
  FaMoneyBillWave,
  FaStar
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // If user is admin, they shouldn't ideally be in customer dashboard (or they can, but let's keep it safe)
    if (!userInfo) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
    { name: 'My Profile', path: '/dashboard/profile', icon: <FaUser /> },
    { name: 'Address Book', path: '/dashboard/addresses', icon: <FaMapMarkerAlt /> },
    { name: 'My Orders', path: '/dashboard/orders', icon: <FaShoppingBag /> },
    { name: 'Payment History', path: '/dashboard/payments', icon: <FaMoneyBillWave /> },
    { name: 'My Reviews', path: '/dashboard/reviews', icon: <FaStar /> },
    { name: 'Wishlist', path: '/dashboard/wishlist', icon: <FaHeart /> },
    { name: 'Notifications', path: '/dashboard/notifications', icon: <FaBell /> },
    { name: 'Support', path: '/dashboard/support', icon: <FaHeadset /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-colors">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-primary tracking-tight">Agri<span className="text-gray-900 dark:text-white">Ftilizer</span></Link>
      </div>
      
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
        <img 
          src={userInfo?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
          alt="Profile" 
          className="w-12 h-12 rounded-full object-cover border-2 border-primary"
        />
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{userInfo?.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-1">{userInfo?.email}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-primary text-white font-bold shadow-md shadow-primary/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary font-medium'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold transition-colors"
        >
          <FaSignOutAlt className="text-lg" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[80vw] flex-col bg-white dark:bg-gray-900 z-50 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header Mobile */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 h-16 lg:hidden z-10">
          <Link to="/" className="text-xl font-black text-primary tracking-tight">Agri<span className="text-gray-900 dark:text-white">Ftilizer</span></Link>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FaBars className="text-xl" />
          </button>
        </header>

        {/* Scrollable Content with Framer Motion Page Transitions */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
