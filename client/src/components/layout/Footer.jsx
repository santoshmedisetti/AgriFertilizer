import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLeaf, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-[8px] border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 text-white group">
              <div className="bg-primary p-2 rounded-lg group-hover:bg-secondary transition-colors">
                <FaLeaf className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold">AgriFertilizer</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Empowering farmers with high-quality fertilizers, seeds, and modern agricultural tools. Your trusted partner for a bountiful harvest.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"><FaFacebook className="text-lg" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"><FaTwitter className="text-lg" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"><FaInstagram className="text-lg" /></a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg tracking-wide uppercase">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-primary hover:translate-x-1 inline-block transition-transform duration-300">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary hover:translate-x-1 inline-block transition-transform duration-300">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary hover:translate-x-1 inline-block transition-transform duration-300">FAQ & Support</Link></li>
              <li><Link to="/blog" className="hover:text-primary hover:translate-x-1 inline-block transition-transform duration-300">Agriculture Blog</Link></li>
              <li><Link to="/policy" className="hover:text-primary hover:translate-x-1 inline-block transition-transform duration-300">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg tracking-wide uppercase">Contact Info</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary mt-1 text-lg flex-shrink-0" />
                <span>123 Agri Tower, Kisan Marg,<br/>New Delhi, 110001, India</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-primary text-lg flex-shrink-0" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary text-lg flex-shrink-0" />
                <span>support@agrifertilizer.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg tracking-wide uppercase">Newsletter</h3>
            <p className="text-sm mb-4 text-gray-400 leading-relaxed">Subscribe for the latest farming tips and exclusive offers.</p>
            <form className="flex flex-col gap-3">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-500 transition-colors"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-colors duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Subscribe</span>
                <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} AgriFertilizer. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
            <span className="cursor-pointer hover:text-white transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-white transition-colors">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
