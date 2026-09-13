const LoadingSkeleton = ({ count = 1, type = 'text', className = '' }) => {
  const skeletons = Array(count).fill(0);

  const getShape = () => {
    switch (type) {
      case 'text':
        return 'h-4 w-full rounded';
      case 'title':
        return 'h-8 w-3/4 rounded';
      case 'avatar':
        return 'h-12 w-12 rounded-full';
      case 'card':
        return 'h-48 w-full rounded-xl';
      default:
        return 'h-4 w-full rounded';
    }
  };

  return (
    <>
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 animate-pulse mb-2 ${getShape()} ${className}`}
        />
      ))}
    </>
  );
};

export default LoadingSkeleton;
