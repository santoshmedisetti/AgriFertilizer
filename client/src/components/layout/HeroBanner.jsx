import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaRobot } from 'react-icons/fa';

const HeroBanner = () => {
  return (
    <div className="relative bg-gray-900 w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover object-center"
          src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c5980?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Agriculture Field"
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 mb-6">
            <span className="text-emerald-300 font-semibold text-sm tracking-wide uppercase">
              100% Genuine Agriculture Products
            </span>
          </div>
          
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
            Boost your yield with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              premium fertilizers
            </span>
          </h1>
          
          <p className="mt-4 text-base text-gray-300 sm:text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Discover a wide range of organic and chemical fertilizers, pesticides, and seeds tailored for modern agriculture. Get expert recommendations and lightning-fast delivery to your farm.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-primary hover:bg-secondary hover:shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all duration-300 gap-2 group"
            >
              Shop Now
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/recommendation"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300 gap-2 group"
            >
              <FaRobot className="text-emerald-400 group-hover:rotate-12 transition-transform" />
              AI Assistant
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
