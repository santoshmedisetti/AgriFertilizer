import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  FaChartPie, 
  FaBoxOpen, 
  FaTags, 
  FaShoppingCart, 
  FaUsers,
  FaReceipt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaClipboardList,
  FaImage,
  FaStar,
  FaMoon,
  FaSun,
  FaComments,
  FaCog
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../redux/slices/usersApiSlice';
import { logout } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('adminDarkMode') === 'true'
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('adminDarkMode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FaChartPie /> },
    { name: 'Orders', path: '/admin/orders', icon: <FaShoppingCart /> },
    { name: 'Products', path: '/admin/products', icon: <FaBoxOpen /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <FaClipboardList /> },
    { name: 'Categories', path: '/admin/categories', icon: <FaTags /> },
    { name: 'Brands', path: '/admin/brands', icon: <FaStar /> },
    { name: 'Customers', path: '/admin/customers', icon: <FaUsers /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <FaComments /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <FaReceipt /> },
    { name: 'Banners', path: '/admin/banners', icon: <FaImage /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-900 text-white transition-colors duration-300">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-2xl font-black text-primary tracking-tight">Agri<span className="text-white">Admin</span></h2>
        <button onClick={toggleDarkMode} className="text-gray-400 hover:text-white transition-colors">
          {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
        </button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'bg-primary text-white font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white font-medium'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 font-medium transition-colors"
        >
          <FaSignOutAlt className="text-lg" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-full w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-72 flex-col">
          <SidebarContent />
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <aside className="fixed inset-y-0 left-0 w-72 max-w-sm flex-col bg-gray-900 z-50">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* Top Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 h-16 lg:hidden transition-colors duration-300">
            <h2 className="text-xl font-black text-primary tracking-tight">Agri<span className="text-gray-900 dark:text-white">Admin</span></h2>
            <div className="flex items-center gap-4">
              <button onClick={toggleDarkMode} className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
                {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaBars className="text-xl" />
              </button>
            </div>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
