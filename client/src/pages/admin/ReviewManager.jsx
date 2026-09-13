import { useState } from 'react';
import { useGetAdminReviewsQuery, useUpdateReviewStatusMutation } from '../../redux/slices/reviewsApiSlice';
import { FaCheckCircle, FaTimesCircle, FaStar, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ReviewManager = () => {
  const [filter, setFilter] = useState('');
  const { data, isLoading, refetch } = useGetAdminReviewsQuery(filter);
  const [updateStatus] = useUpdateReviewStatusMutation();

  if (isLoading) return <div className="p-12 text-center text-gray-500 font-bold">Loading Reviews...</div>;

  const reviews = data?.data || [];

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Review marked as ${status}`);
      refetch();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Review Moderation</h1>
        
        <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-100 p-2">
          <FaFilter className="text-gray-400 ml-2" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none outline-none font-bold text-sm text-gray-700 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold uppercase tracking-wider text-xs">Product</th>
                <th className="p-4 font-bold uppercase tracking-wider text-xs">Customer</th>
                <th className="p-4 font-bold uppercase tracking-wider text-xs">Rating & Review</th>
                <th className="p-4 font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="p-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map(review => (
                <tr key={review._id} className="hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={review.productId.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                      <span className="font-bold text-gray-900 max-w-[150px] truncate">{review.productId.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{review.userId?.name || 'Unknown'}</td>
                  <td className="p-4 max-w-[300px]">
                    <div className="flex text-yellow-400 mb-1">
                      {[...Array(5)].map((_, i) => <FaStar key={i} size={12} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'} />)}
                    </div>
                    <p className="font-bold text-gray-900 text-xs truncate">{review.title}</p>
                    <p className="text-gray-500 text-xs truncate">{review.comment}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
                      review.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      review.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {review.status !== 'Approved' && (
                        <button onClick={() => handleStatusChange(review._id, 'Approved')} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                          <FaCheckCircle size={18} />
                        </button>
                      )}
                      {review.status !== 'Rejected' && (
                        <button onClick={() => handleStatusChange(review._id, 'Rejected')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                          <FaTimesCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">No reviews found matching criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewManager;
