import { useState } from 'react';
import { 
  useGetCouponsQuery, 
  useCreateCouponMutation, 
  useUpdateCouponMutation, 
  useDeleteCouponMutation 
} from '../../redux/slices/couponsApiSlice';
import Button from '../../components/ui/Button';
import { FaTag, FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CouponManager = () => {
  const { data: couponsData, isLoading, refetch } = useGetCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const [activeModal, setActiveModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    code: '', title: '', description: '', discountType: 'percentage', 
    discountValue: '', minimumOrderAmount: 0, maximumDiscount: '',
    expiryDate: '', usageLimit: '', usagePerUser: 1, status: 'Active'
  });
  const [currentId, setCurrentId] = useState(null);

  const coupons = couponsData?.data || [];
  
  const activeCoupons = coupons.filter(c => c.status === 'Active').length;
  const expiredCoupons = coupons.filter(c => c.status === 'Expired').length;
  const totalDiscountGiven = coupons.reduce((acc, c) => acc + (c.totalUsed * (c.discountType === 'fixed' ? c.discountValue : 0)), 0);

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditMode(true);
      setCurrentId(coupon._id);
      setFormData({
        code: coupon.code,
        title: coupon.title,
        description: coupon.description || '',
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderAmount: coupon.minimumOrderAmount || 0,
        maximumDiscount: coupon.maximumDiscount || '',
        expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
        usageLimit: coupon.usageLimit || '',
        usagePerUser: coupon.usagePerUser || 1,
        status: coupon.status,
      });
    } else {
      setEditMode(false);
      setCurrentId(null);
      setFormData({
        code: '', title: '', description: '', discountType: 'percentage', 
        discountValue: '', minimumOrderAmount: 0, maximumDiscount: '',
        expiryDate: '', usageLimit: '', usagePerUser: 1, status: 'Active'
      });
    }
    setActiveModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.usageLimit) payload.usageLimit = null;
      if (!payload.maximumDiscount) payload.maximumDiscount = null;

      if (editMode) {
        await updateCoupon({ id: currentId, data: payload }).unwrap();
        toast.success('Coupon updated');
      } else {
        await createCoupon(payload).unwrap();
        toast.success('Coupon created');
      }
      setActiveModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id).unwrap();
        toast.success('Coupon deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Promotions & Coupons</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2"><FaPlus /> Create Coupon</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 text-sm font-bold">Total Coupons</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{coupons.length}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-800/50">
          <p className="text-emerald-700 dark:text-emerald-400 text-sm font-bold">Active Coupons</p>
          <p className="text-3xl font-black text-emerald-900 dark:text-emerald-100">{activeCoupons}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-800/50">
          <p className="text-red-700 dark:text-red-400 text-sm font-bold">Expired</p>
          <p className="text-3xl font-black text-red-900 dark:text-red-100">{expiredCoupons}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-800/50">
          <p className="text-blue-700 dark:text-blue-400 text-sm font-bold">Total Discount</p>
          <p className="text-3xl font-black text-blue-900 dark:text-blue-100">₹{totalDiscountGiven}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-gray-900 dark:text-gray-100">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">
                <th className="p-4">Code</th>
                <th className="p-4">Details</th>
                <th className="p-4">Status</th>
                <th className="p-4">Usage</th>
                <th className="p-4">Expiry</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" className="p-8 text-center">Loading coupons...</td></tr>
              ) : coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-900/20">
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md font-mono font-bold text-gray-800 dark:text-gray-200">
                      <FaTag className="text-primary" /> {coupon.code}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold">{coupon.title}</div>
                    <div className="text-xs text-gray-500">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                      {coupon.minimumOrderAmount > 0 && ` (Min ₹${coupon.minimumOrderAmount})`}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      coupon.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                      coupon.status === 'Expired' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {coupon.totalUsed} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'used'}
                  </td>
                  <td className="p-4 text-sm">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenModal(coupon)} className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg"><FaEdit /></button>
                      <button onClick={() => handleDelete(coupon._id)} className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && !isLoading && (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No coupons found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl relative my-8">
            <button onClick={() => setActiveModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <FaTimes size={24} />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                {editMode ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Coupon Code</label>
                    <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-xl font-mono uppercase" placeholder="SUMMER25" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-xl" placeholder="Summer Sale 25% Off" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Discount Type</label>
                    <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-xl">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Discount Value</label>
                    <input type="number" min="1" required value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Min Order Amount (₹)</label>
                    <input type="number" min="0" value={formData.minimumOrderAmount} onChange={e => setFormData({...formData, minimumOrderAmount: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Max Discount Cap (₹) - Optional</label>
                    <input type="number" min="0" value={formData.maximumDiscount} onChange={e => setFormData({...formData, maximumDiscount: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-xl" placeholder="Leave blank for no limit" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                    <input type="date" required value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Global Usage Limit</label>
                    <input type="number" min="1" value={formData.usageLimit} onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-xl" placeholder="Unlimited" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Per User Limit</label>
                    <input type="number" min="1" required value={formData.usagePerUser} onChange={e => setFormData({...formData, usagePerUser: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-xl" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-xl">
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                <div className="pt-6">
                  <Button type="submit" disabled={isCreating || isUpdating} className="w-full" size="lg">
                    {editMode ? 'Update Coupon' : 'Create Coupon'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManager;
