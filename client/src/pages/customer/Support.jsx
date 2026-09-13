import { useState } from 'react';
import { useGetSupportTicketsQuery, useCreateSupportTicketMutation } from '../../redux/slices/customerApiSlice';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';
import { FaHeadset, FaPaperPlane } from 'react-icons/fa';

const Support = () => {
  const { data, isLoading, refetch } = useGetSupportTicketsQuery();
  const [createTicket, { isLoading: isCreating }] = useCreateSupportTicketMutation();
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const tickets = data?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) return toast.error('Please fill all fields');

    try {
      await createTicket({ subject, message }).unwrap();
      toast.success('Ticket submitted successfully');
      setSubject('');
      setMessage('');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center text-3xl">
          <FaHeadset />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Support Center</h1>
          <p className="text-gray-500 dark:text-gray-400">We're here to help you with your orders and inquiries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Raise a Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  placeholder="e.g. Missing Item in Order"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea 
                  rows="5"
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Please describe your issue in detail..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white resize-none" 
                ></textarea>
              </div>
              <Button type="submit" disabled={isCreating} className="w-full gap-2"><FaPaperPlane /> Submit Ticket</Button>
            </form>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Ticket History</h2>
          {isLoading ? (
            <div className="text-center text-gray-500 py-8">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400">You haven't raised any support tickets yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map(ticket => (
                <div key={ticket._id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{ticket.subject}</h3>
                      <p className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      ticket.status === 'Open' ? 'bg-amber-100 text-amber-800' :
                      ticket.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {ticket.history.map((reply, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl text-sm ${reply.isAdmin ? 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ml-8' : 'bg-primary/5 border border-primary/10 mr-8'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-900 dark:text-white">{reply.isAdmin ? 'Support Team' : 'You'}</span>
                          <span className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
