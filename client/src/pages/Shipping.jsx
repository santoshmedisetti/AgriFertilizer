import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAddAddressMutation, useDeleteAddressMutation } from '../redux/slices/usersApiSlice';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';
import { FaTrash, FaCheckCircle, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

// Mocking fetch profile since we didn't build a full getProfile endpoint, 
// using local state / Redux info for now or we could just use local storage for selected address
// In a real app, you'd fetch the user profile with addresses here.
// For simplicity in this step, we will store the selected address in local storage.

const Shipping = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  
  // We'll manage addresses in local state simulating the DB for the UI 
  // since the user info slice needs a GET endpoint for addresses which we didn't write.
  // Ideally, this comes from `useGetProfileQuery()`.
  const [addresses, setAddresses] = useState(userInfo?.addresses || []);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', street: '', city: '', state: '', pinCode: '', phone: ''
  });

  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    }
    const saved = localStorage.getItem('shippingAddress');
    if (saved) {
      setSelectedAddress(JSON.parse(saved));
    }
  }, [userInfo, navigate]);

  const submitAddressHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await addAddress(formData).unwrap();
      setAddresses(res);
      setShowForm(false);
      setFormData({ fullName: '', street: '', city: '', state: '', pinCode: '', phone: '' });
      toast.success('Address added successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      const res = await deleteAddress(id).unwrap();
      setAddresses(res);
      toast.success('Address deleted');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const proceedToPayment = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    localStorage.setItem('shippingAddress', JSON.stringify(selectedAddress));
    navigate('/payment');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Checkout Steps Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center text-primary">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            <span className="ml-2 font-bold hidden sm:block">Shipping</span>
          </div>
          <div className="w-16 sm:w-24 h-1 mx-4 bg-gray-200"></div>
          <div className="flex items-center text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold">2</div>
            <span className="ml-2 font-bold hidden sm:block">Payment</span>
          </div>
          <div className="w-16 sm:w-24 h-1 mx-4 bg-gray-200"></div>
          <div className="flex items-center text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold">3</div>
            <span className="ml-2 font-bold hidden sm:block">Place Order</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" /> Select Delivery Address
            </h1>
            <Button variant="outline" onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
              <FaPlus /> Add New
            </Button>
          </div>

          {showForm && (
            <form onSubmit={submitAddressHandler} className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="px-4 py-2 border rounded-lg focus:ring-primary" />
                <input type="text" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="px-4 py-2 border rounded-lg focus:ring-primary" />
                <input type="text" placeholder="Street Address" required value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="px-4 py-2 border rounded-lg focus:ring-primary md:col-span-2" />
                <input type="text" placeholder="City" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="px-4 py-2 border rounded-lg focus:ring-primary" />
                <input type="text" placeholder="State" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="px-4 py-2 border rounded-lg focus:ring-primary" />
                <input type="text" placeholder="PIN Code" required value={formData.pinCode} onChange={e => setFormData({...formData, pinCode: e.target.value})} className="px-4 py-2 border rounded-lg focus:ring-primary" />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={isAdding}>{isAdding ? 'Saving...' : 'Save Address'}</Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                No addresses found. Please add a new address to continue.
              </div>
            ) : (
              addresses.map(addr => (
                <div 
                  key={addr._id || addr.street} 
                  onClick={() => setSelectedAddress(addr)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-colors relative flex items-start gap-4 ${selectedAddress?._id === addr._id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                >
                  <div className="mt-1">
                    {selectedAddress?._id === addr._id ? (
                      <FaCheckCircle className="text-primary text-xl" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{addr.fullName} <span className="font-normal text-gray-500 ml-2">{addr.phone}</span></h3>
                    <p className="text-gray-600 text-sm mt-1">{addr.street}, {addr.city}, {addr.state} - {addr.pinCode}</p>
                  </div>
                  {addr._id && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteHandler(addr._id); }}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <Button size="lg" onClick={proceedToPayment} disabled={!selectedAddress}>
              Continue to Payment
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Shipping;
