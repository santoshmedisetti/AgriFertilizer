import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaFileCsv } from 'react-icons/fa';
import { useGetProductsQuery, useDeleteProductMutation } from '../../redux/slices/productsApiSlice';
import { useExportProductsMutation } from '../../redux/slices/erpApiSlice';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';

const ProductList = () => {
  const { data, isLoading, error, refetch } = useGetProductsQuery({ pageSize: 50 });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [exportProducts] = useExportProductsMutation();

  const handleExport = async () => {
    try {
      const csvData = await exportProducts().unwrap();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', 'products_export.csv');
      a.click();
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error?.data?.message || 'Error fetching products'}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <FaFileCsv /> Export CSV
          </Button>
          <Link to="/admin/product/new">
            <Button className="flex items-center gap-2">
              <FaPlus /> Create Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.data.products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product._id.substring(0, 8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center gap-3">
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <button className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 p-2 rounded-lg transition-colors">
                          <FaEdit />
                        </button>
                      </Link>
                      <button 
                        onClick={() => deleteHandler(product._id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
