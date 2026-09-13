import { 
  useGetNotificationsQuery, 
  useMarkNotificationReadMutation, 
  useDeleteNotificationMutation 
} from '../../redux/slices/customerApiSlice';
import { FaBell, FaCheck, FaTrash, FaShoppingBag, FaTag, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Notifications = () => {
  const { data, isLoading, refetch } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [deleteNotif] = useDeleteNotificationMutation();

  const notifications = data?.data || [];

  const handleMarkRead = async (id) => {
    try {
      await markRead(id).unwrap();
      refetch();
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotif(id).unwrap();
      refetch();
      toast.success('Deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'Order': return <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><FaShoppingBag /></div>;
      case 'Promo': return <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full"><FaTag /></div>;
      default: return <div className="p-3 bg-gray-100 text-gray-600 rounded-full"><FaInfoCircle /></div>;
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Notifications...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Notifications</h1>
      
      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
          <FaBell className="mx-auto text-5xl text-gray-300 dark:text-gray-700 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">All caught up!</h3>
          <p className="text-gray-500 dark:text-gray-400">You don't have any new notifications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notif => (
            <div 
              key={notif._id} 
              className={`bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border transition-all flex items-start gap-4 ${
                !notif.isRead ? 'border-primary ring-1 ring-primary/30' : 'border-gray-100 dark:border-gray-800'
              }`}
            >
              <div className="shrink-0">{getIcon(notif.type)}</div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold ${!notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${!notif.isRead ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-500 dark:text-gray-500'}`}>
                  {notif.message}
                </p>
                {notif.link && (
                  <a href={notif.link} className="mt-3 inline-block text-sm font-bold text-primary hover:underline">View Details</a>
                )}
              </div>

              <div className="shrink-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
                {!notif.isRead && (
                  <button onClick={() => handleMarkRead(notif._id)} className="p-2 text-gray-400 hover:text-primary transition-colors bg-gray-50 dark:bg-gray-800 rounded-full" title="Mark as read">
                    <FaCheck size={12} />
                  </button>
                )}
                <button onClick={() => handleDelete(notif._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-gray-800 rounded-full" title="Delete">
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
