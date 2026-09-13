import { motion } from 'framer-motion';
import { FaBoxOpen } from 'react-icons/fa';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  title = "No items found", 
  message = "We couldn't find anything matching your criteria.", 
  actionText = "Go Back Home",
  actionLink = "/" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaBoxOpen className="text-4xl text-gray-400" />
        </div>
      </motion.div>
      <h3 className="text-xl font-semibold text-dark mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-8">{message}</p>
      
      {actionLink && (
        <Link to={actionLink}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
