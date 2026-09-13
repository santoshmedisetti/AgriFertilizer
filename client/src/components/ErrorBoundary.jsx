import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // In a real production app, log this to Sentry or similar service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-4xl" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              We're sorry, but an unexpected error occurred. Our team has been notified.
            </p>
            <Button onClick={() => window.location.href = '/'} variant="primary" className="w-full">
              Return to Home
            </Button>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 text-left bg-gray-100 dark:bg-gray-900 p-4 rounded-xl overflow-auto text-xs font-mono text-gray-800 dark:text-gray-300 max-h-48">
                <p className="font-bold text-red-500 mb-2">{this.state.error && this.state.error.toString()}</p>
                <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
