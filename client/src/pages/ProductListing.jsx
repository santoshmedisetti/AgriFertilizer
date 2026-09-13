import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../redux/slices/productsApiSlice';
import { useGetCategoriesQuery } from '../redux/slices/categoriesApiSlice';
import { useGetBrandsQuery } from '../redux/slices/brandsApiSlice';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/ui/Button';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const keyword = searchParams.get('keyword') || '';
  const pageNumber = searchParams.get('pageNumber') || 1;
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const { data, isLoading, error } = useGetProductsQuery({
    keyword, pageNumber, category, brand, sort, minPrice, maxPrice
  });

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery();

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset page to 1 when filters change
    if (key !== 'pageNumber') newParams.delete('pageNumber');
    
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Shop Products</h1>
          {keyword && <p className="text-gray-500 mt-2">Showing search results for "{keyword}"</p>}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={handleClearFilters} className="text-sm text-primary hover:underline">Clear All</button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="radio" name="category" checked={category === ''} onChange={() => handleFilterChange('category', '')} className="text-primary focus:ring-primary" />
                    <label className="ml-2 text-gray-600">All Categories</label>
                  </div>
                  {categoriesData?.data?.map(c => (
                    <div key={c._id} className="flex items-center">
                      <input type="radio" name="category" checked={category === c._id} onChange={() => handleFilterChange('category', c._id)} className="text-primary focus:ring-primary" />
                      <label className="ml-2 text-gray-600">{c.name}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Brands</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="radio" name="brand" checked={brand === ''} onChange={() => handleFilterChange('brand', '')} className="text-primary focus:ring-primary" />
                    <label className="ml-2 text-gray-600">All Brands</label>
                  </div>
                  {brandsData?.data?.map(b => (
                    <div key={b._id} className="flex items-center">
                      <input type="radio" name="brand" checked={brand === b._id} onChange={() => handleFilterChange('brand', b._id)} className="text-primary focus:ring-primary" />
                      <label className="ml-2 text-gray-600">{b.name}</label>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            {/* Top Bar (Sorting) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
              <span className="text-gray-600 font-medium">
                {data?.data?.total || 0} Products Found
              </span>
              <select 
                value={sort} 
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Sort By: Default</option>
                <option value="newest">Sort By: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Top Rated</option>
              </select>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error?.data?.message || 'Error fetching products'}</div>
            ) : data?.data?.products?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.data.products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {data?.data?.pages > 1 && (
                  <div className="flex justify-center mt-12 gap-2">
                    {[...Array(data.data.pages).keys()].map(x => (
                      <button
                        key={x + 1}
                        onClick={() => handleFilterChange('pageNumber', x + 1)}
                        className={`w-10 h-10 rounded-xl font-bold transition-colors ${
                          Number(pageNumber) === x + 1
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {x + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
