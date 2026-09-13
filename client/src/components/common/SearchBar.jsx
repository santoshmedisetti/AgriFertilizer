import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch, placeholder = "Search for fertilizers, seeds..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative flex items-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-gray-50"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 h-full px-4 text-white bg-primary rounded-r-lg hover:bg-secondary transition-colors flex items-center justify-center"
      >
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
