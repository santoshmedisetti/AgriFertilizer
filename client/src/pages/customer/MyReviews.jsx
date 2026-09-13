import { useState } from 'react';
import { useGetMyReviewsQuery, useDeleteReviewMutation } from '../../redux/slices/reviewsApiSlice';
import { FaStar, FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const MyReviews = () => {
  const { data, isLoading, refetch } = useGetMyReviewsQuery();
  const [deleteReview] = useDeleteReviewMutation();

  if (isLoading) return <div className="p-12 text-center text-gray-500 font-bold">Loading your reviews...</div>;

  const reviews = data?.data || [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(id).unwrap();
        toast.success('Review deleted');
        refetch();
      } catch (err) {
        toast.error('Failed to delete review');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">My Reviews</h1>
      
      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
          <FaStar className="text-6xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No reviews yet</h2>
          <p className="text-gray-500 dark:text-gray-400">Share your experience with products you've purchased.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-6">
              
              <div className="w-24 h-24 shrink-0 bg-gray-50 dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700">
                <img src={review.productId.images[0]} alt={review.productId.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/product/${review.productId._id}`} className="font-bold text-lg text-gray-900 dark:text-white hover:text-primary transition-colors">
                      {review.productId.name}
                    </Link>
                    <div className="flex items-center gap-1 mt-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'} size={14} />
                      ))}
                      <span className="text-xs text-gray-500 ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
                      review.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      review.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {review.status}
                    </span>
                    <button onClick={() => handleDelete(review._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mt-2">{review.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
