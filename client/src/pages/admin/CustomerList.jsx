import { useGetUsersQuery } from '../../redux/slices/usersApiSlice';
import { FaUserShield, FaUser, FaCheck, FaTimes } from 'react-icons/fa';

const CustomerList = () => {
  const { data: usersData, isLoading, error } = useGetUsersQuery();

  if (isLoading) return <div className="flex h-64 items-center justify-center">Loading customers...</div>;
  if (error) return <div className="flex h-64 items-center justify-center text-red-500">Failed to load customers</div>;

  const users = usersData.data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Customer Management</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-bold uppercase tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Addresses</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 text-sm">{user._id.substring(0, 8)}</td>
                  <td className="p-4 font-bold text-gray-800">{user.name}</td>
                  <td className="p-4 text-gray-500 font-medium">
                    <a href={`mailto:${user.email}`} className="hover:text-primary transition-colors">
                      {user.email}
                    </a>
                  </td>
                  <td className="p-4">
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                        <FaUserShield /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                        <FaUser /> Customer
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-600 font-medium">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold">
                      {user.addresses?.length || 0}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
