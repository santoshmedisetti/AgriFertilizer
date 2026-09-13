import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ pages, page, isAdmin = false, keyword = '' }) => {
  if (pages <= 1) return null;

  const buildLink = (pageNumber) => {
    if (isAdmin) {
      return `/admin/productlist/${pageNumber}`;
    }
    if (keyword) {
      return `/search/${keyword}/page/${pageNumber}`;
    }
    return `/page/${pageNumber}`;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button 
        disabled={page === 1}
        className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronLeft />
      </button>
      
      {[...Array(pages).keys()].map((x) => (
        <a
          key={x + 1}
          href={buildLink(x + 1)}
          className={`px-4 py-2 rounded-md font-medium ${
            x + 1 === page
              ? 'bg-primary text-white'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {x + 1}
        </a>
      ))}

      <button 
        disabled={page === pages}
        className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
