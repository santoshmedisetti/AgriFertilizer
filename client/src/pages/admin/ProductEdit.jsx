import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  useGetProductDetailsQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation, 
  useUploadProductImageMutation 
} from '../../redux/slices/productsApiSlice';
import { useGetCategoriesQuery } from '../../redux/slices/categoriesApiSlice';
import { useGetBrandsQuery } from '../../redux/slices/brandsApiSlice';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';

const ProductEdit = () => {
  const { id: productId } = useParams();
  const isNew = !productId;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [unit, setUnit] = useState('kg');
  const [npkRatio, setNpkRatio] = useState('');
  
  const { data: productData, isLoading, error } = useGetProductDetailsQuery(productId, { skip: isNew });
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: isUploading }] = useUploadProductImageMutation();

  useEffect(() => {
    if (!isNew && productData) {
      const p = productData.data;
      setName(p.name);
      setSku(p.sku);
      setPrice(p.price);
      setDiscountPrice(p.discountPrice || 0);
      setDescription(p.description);
      setImages(p.images || []);
      setBrand(p.brand?._id || '');
      setCategory(p.category?._id || '');
      setCountInStock(p.countInStock);
      setUnit(p.unit);
      setNpkRatio(p.npkRatio || '');
    }
  }, [productData, isNew]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success('Image uploaded');
      setImages([...images, res.url]);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!category || !brand) {
      toast.error('Please select category and brand');
      return;
    }
    
    try {
      const pData = {
        name, sku: sku || `SKU-${Date.now()}`, price, discountPrice, description, images, brand, category,
        countInStock, unit, npkRatio
      };

      if (isNew) {
        await createProduct(pData).unwrap();
        toast.success('Product created');
      } else {
        await updateProduct({ productId, ...pData }).unwrap();
        toast.success('Product updated');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error fetching product</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{isNew ? 'Create Product' : 'Edit Product'}</h1>
        
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Auto-generated if empty" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input type="number" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} required className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary bg-white">
                <option value="">Select Category</option>
                {categoriesData?.data?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select value={brand} onChange={(e) => setBrand(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary bg-white">
                <option value="">Select Brand</option>
                {brandsData?.data?.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g., kg, litre" required className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NPK Ratio</label>
              <input type="text" value={npkRatio} onChange={(e) => setNpkRatio(e.target.value)} placeholder="e.g., 19-19-19" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <input type="file" onChange={uploadFileHandler} className="w-full px-4 py-2 border rounded-lg focus:ring-primary mb-4" />
            {isUploading && <p className="text-sm text-gray-500 mb-2">Uploading...</p>}
            <div className="flex gap-4 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                  <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4 border-t">
            <Button variant="ghost" onClick={() => navigate('/admin/products')}>Cancel</Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : (isNew ? 'Create Product' : 'Update Product')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
