import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  if (!category) return null;

  return (
    <Link to={`/products?category=${category._id}`} className="group block">
      <motion.div
        whileHover={{ y: -5 }}
        className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 h-full"
      >
        <div className="w-28 h-28 mb-5 rounded-full overflow-hidden bg-gray-50 border-4 border-emerald-50 p-1 group-hover:border-emerald-200 transition-colors duration-300 shadow-inner">
          <img 
            src={category.image || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0d30b9?w=400'} 
            alt={category.name} 
            className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        </div>
        <h3 className="text-center font-bold text-gray-800 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
