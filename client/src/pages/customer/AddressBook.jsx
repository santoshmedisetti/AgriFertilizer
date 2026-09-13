import { useState } from 'react';
import { 
  useGetAddressesQuery, 
  useAddAddressMutation, 
  useUpdateAddressMutation, 
  useDeleteAddressMutation 
} from '../../redux/slices/customerApiSlice';
import Button from '../../components/ui/Button';
import { FaPlus, FaMapMarkerAlt, FaEdit, FaTrash, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddressBook = () => {
  const { data, isLoading, refetch } = useGetAddressesQuery();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const addresses = data?.data || [];
  
  const [activeModal, setActiveModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    phone: '',
    isDefault: false
  });

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditMode(true);
      setCurrentId(address._id);
      setFormData(address);
    } else {
      setEditMode(false);
      setCurrentId(null);
      setFormData({
        fullName: '', street: '', city: '', state: '', pinCode: '', phone: '', isDefault: false
      });
    }
    setActiveModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateAddress({ id: currentId, data: formData }).unwrap();
        toast.success('Address updated');
      } else {
        await addAddress(formData).unwrap();
        toast.success('Address added');
      }
      setActiveModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id).unwrap();
        toast.success('Address deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Address Book...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Address Book</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2"><FaPlus /> Add New</Button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <FaMapMarkerAlt className="mx-auto text-5xl text-gray-300 dark:text-gray-700 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No addresses saved</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Add an address to checkout faster.</p>
          <Button onClick={() => handleOpenModal()}>Add Your First Address</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(address => (
            <div key={address._id} className={`bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border transition-all ${address.isDefault ? 'border-primary ring-1 ring-primary' : 'border-gray-100 dark:border-gray-800'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-white text-lg">{address.fullName}</span>
                  {address.isDefault && <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"><FaCheckCircle /> Default</span>}
                </div>
                <div className="flex gap-2 text-gray-400">
                  <button onClick={() => handleOpenModal(address)} className="hover:text-blue-500 transition-colors"><FaEdit /></button>
                  <button onClick={() => handleDelete(address._id)} className="hover:text-red-500 transition-colors"><FaTrash /></button>
                </div>
              </div>
              
              <div className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} - {address.pinCode}</p>
                <p className="font-medium text-gray-900 dark:text-gray-300 mt-2">Phone: {address.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl relative my-8">
            <button onClick={() => setActiveModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <FaTimes size={24} />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                {editMode ? 'Edit Address' : 'Add New Address'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                  <input type="text" required value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">City</label>
                    <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">State</label>
                    <input type="text" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">PIN Code</label>
                    <input type="text" required value={formData.pinCode} onChange={e => setFormData({...formData, pinCode: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                    <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl" />
                  </div>
                </div>
                
                <label className="flex items-center gap-3 py-4 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isDefault}
                    onChange={e => setFormData({...formData, isDefault: e.target.checked})}
                    className="w-5 h-5 rounded text-primary focus:ring-primary"
                  />
                  <span className="font-bold text-gray-700 dark:text-gray-300">Set as default address</span>
                </label>

                <Button type="submit" disabled={isAdding || isUpdating} className="w-full" size="lg">
                  {editMode ? 'Update Address' : 'Save Address'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
