import { useGetInventoryHistoryQuery } from '../../redux/slices/inventoryApiSlice';

const InventoryHistory = () => {
  const { data: historyData, isLoading, error } = useGetInventoryHistoryQuery();
  const history = historyData?.data || [];

  if (isLoading) return <div className="p-8 flex justify-center">Loading transaction history...</div>;
  if (error) return <div className="p-8 flex justify-center text-red-500">Failed to load history</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Stock Transaction History</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-gray-900 dark:text-gray-100">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">
                <th className="p-4">Date</th>
                <th className="p-4">Product</th>
                <th className="p-4">Transaction Type</th>
                <th className="p-4 text-right">Quantity</th>
                <th className="p-4">Reason / Notes</th>
                <th className="p-4">Admin</th>
              </tr>
            </thead>
            <tbody>
              {history.map((tx) => (
                <tr key={tx._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-900/20">
                  <td className="p-4 text-sm">{new Date(tx.createdAt).toLocaleString()}</td>
                  <td className="p-4 font-bold">{tx.product?.name} <span className="block text-xs text-gray-500 font-mono">{tx.product?.sku}</span></td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold ${
                      tx.transactionType === 'Stock In' || tx.transactionType === 'Returned Stock' ? 'bg-emerald-100 text-emerald-800' :
                      tx.transactionType === 'Stock Out' || tx.transactionType === 'Damaged Stock' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {tx.transactionType}
                    </span>
                  </td>
                  <td className="p-4 text-right font-black">
                    {tx.transactionType === 'Stock In' || tx.transactionType === 'Returned Stock' ? '+' :
                     tx.transactionType === 'Stock Out' || tx.transactionType === 'Damaged Stock' ? '-' : ''}
                    {tx.quantity}
                  </td>
                  <td className="p-4 text-sm max-w-xs">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{tx.reason}</p>
                    {tx.notes && <p className="text-gray-500 dark:text-gray-400 truncate">{tx.notes}</p>}
                  </td>
                  <td className="p-4 text-sm">{tx.admin?.name || 'System Auto'}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No stock transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryHistory;
