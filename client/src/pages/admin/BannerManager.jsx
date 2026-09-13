import { useState } from 'react';
import { useGetBannersQuery, useCreateBannerMutation, useDeleteBannerMutation } from '../../redux/slices/erpApiSlice';
import { useUploadProductImageMutation } from '../../redux/slices/productsApiSlice';
import Button from '../../components/ui/Button';
import { FaTrash, FaPlus, FaImage, FaLink, FaHeading } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BannerManager = () => {
  const { data: bannersData, isLoading, refetch } = useGetBannersQuery();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadProductImageMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', subtitle: '', image: '', link: '/products' });

  const banners = bannersData?.data || [];

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await uploadImage(data).unwrap();
      setFormData({ ...formData, image: res.imageUrl });
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBanner(formData).unwrap();
      toast.success('Banner created successfully');
      setIsFormOpen(false);
      setFormData({ title: '', subtitle: '', image: '', link: '/products' });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner?')) {
      try {
        await deleteBanner(id).unwrap();
        toast.success('Banner deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Banner Management</h1>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="gap-2">
          {isFormOpen ? 'Close Form' : <><FaPlus /> Add Banner</>}
        </Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <div className="relative">
                <FaHeading className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" required
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
              <input 
                type="text" 
                value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Link URL</label>
              <div className="relative">
                <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Banner Image URL</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" required
                    value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                  />
                </div>
                <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-200 transition-colors flex items-center">
                  <input type="file" className="hidden" onChange={handleUpload} />
                  {isUploading ? '...' : 'Upload'}
                </label>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={isCreating} variant="primary" className="w-full md:w-auto">
            {isCreating ? 'Creating...' : 'Create Banner'}
          </Button>
        </form>
      )}

      {isLoading ? (
        <div>Loading banners...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
              <div className="h-48 relative overflow-hidden">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white">{banner.title}</h3>
                  {banner.subtitle && <p className="text-gray-200 text-sm mt-1">{banner.subtitle}</p>}
                </div>
              </div>
              <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 font-mono truncate max-w-[200px]">{banner.link}</span>
                <button 
                  onClick={() => handleDelete(banner._id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              No banners found. Create one to display on the storefront.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BannerManager;
