import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import Button from '../ui/Button';

const ErrorState = ({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred. Please try again later.", 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-red-100 shadow-sm">
      <motion.div
        initial={{ rotate: -10, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
          <FaExclamationTriangle className="text-4xl" />
        </div>
      </motion.div>
      <h3 className="text-xl font-semibold text-dark mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-8">{message}</p>
      
      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
