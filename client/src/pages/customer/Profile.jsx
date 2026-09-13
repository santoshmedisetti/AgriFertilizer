import { useState, useEffect } from 'react';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../redux/slices/customerApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';
import { FaUserEdit, FaLock } from 'react-icons/fa';

const Profile = () => {
  const { data, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (data?.data) {
      setName(data.data.name);
      setEmail(data.data.email);
      setPhoneNumber(data.data.phoneNumber || '');
      setProfilePicture(data.data.profilePicture || '');
    }
  }, [data]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    try {
      const res = await updateProfile({
        name,
        phoneNumber,
        profilePicture,
        password: password || undefined, // Only send if updating
      }).unwrap();
      
      dispatch(setCredentials({ ...res.data }));
      toast.success('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Profile...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">My Profile</h1>
      
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <form onSubmit={submitHandler} className="p-8">
          
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-8 border-b border-gray-100 dark:border-gray-800">
            <div className="relative group">
              <img 
                src={profilePicture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary transition-colors"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Profile Picture URL</label>
              <input 
                type="text" 
                value={profilePicture} 
                onChange={(e) => setProfilePicture(e.target.value)}
                placeholder="https://image-url.com/avatar.jpg"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <FaUserEdit className="text-primary" /> Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address (Read Only)</label>
                  <input type="email" value={email} readOnly className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <FaLock className="text-primary" /> Update Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep unchanged" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
            <Button type="submit" disabled={isUpdating} size="lg" className="w-full sm:w-auto px-12">
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
