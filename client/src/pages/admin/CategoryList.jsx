import { useState } from 'react';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../../redux/slices/categoriesApiSlice';
import Button from '../../components/ui/Button';
import { FaTrash, FaPlus, FaTags } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CategoryList = () => {
  const { data: categoriesData, isLoading, refetch } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const categories = categoriesData?.data || [];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Category name is required');
    try {
      await createCategory({ name, description }).unwrap();
      toast.success('Category created');
      setName('');
      setDescription('');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await deleteCategory(id).unwrap();
        toast.success('Category deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Category Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaPlus className="text-primary" /> Add Category
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input 
                  type="text" 
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  rows="3"
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                ></textarea>
              </div>
              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? 'Creating...' : 'Save Category'}
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-left border-collapse text-gray-900 dark:text-gray-100">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">
                  <th className="p-4">Category</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="3" className="p-4 text-center">Loading...</td></tr>
                ) : categories.map((category) => (
                  <tr key={category._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-900/20">
                    <td className="p-4 font-bold flex items-center gap-2">
                      <FaTags className="text-gray-400" /> {category.name}
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{category.description}</td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => handleDelete(category._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {categories.length === 0 && !isLoading && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">No categories found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
