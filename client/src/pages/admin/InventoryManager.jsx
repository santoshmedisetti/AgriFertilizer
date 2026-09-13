import { useState } from 'react';
import { useGetInventoryOverviewQuery, useStockInMutation, useStockOutMutation, useAdjustStockMutation } from '../../redux/slices/inventoryApiSlice';
import Button from '../../components/ui/Button';
import { FaExclamationTriangle, FaSearch, FaWarehouse, FaBoxOpen, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { toast } from 'react-toastify';

const InventoryManager = () => {
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading, refetch } = useGetInventoryOverviewQuery({ keyword, status: statusFilter });
  const [stockIn, { isLoading: isStockIn }] = useStockInMutation();
  const [stockOut, { isLoading: isStockOut }] = useStockOutMutation();
  const [adjustStock, { isLoading: isAdjusting }] = useAdjustStockMutation();

  const [activeModal, setActiveModal] = useState(null);
  const [modalType, setModalType] = useState(''); // 'IN', 'OUT', 'ADJUST'
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustNotes, setAdjustNotes] = useState('');

  const inventories = data?.data?.inventories || [];
  const metrics = data?.data?.metrics || { totalProducts: 0, inStock: 0, lowStock: 0, outOfStock: 0, totalQuantity: 0 };
  
  const lowStockProducts = inventories.filter(i => i.stockStatus === 'Low Stock' || i.stockStatus === 'Out of Stock');

  const chartData = [
    { name: 'In Stock', value: metrics.inStock, color: '#10b981' },
    { name: 'Low Stock', value: metrics.lowStock, color: '#f59e0b' },
    { name: 'Out of Stock', value: metrics.outOfStock, color: '#ef4444' }
  ].filter(item => item.value > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adjustQty || !adjustReason) {
      return toast.error('Please provide quantity and reason');
    }
    try {
      const payload = {
        productId: activeModal.productId._id,
        quantity: adjustQty,
        reason: adjustReason,
        notes: adjustNotes
      };

      if (modalType === 'IN') {
        await stockIn(payload).unwrap();
      } else if (modalType === 'OUT') {
        await stockOut(payload).unwrap();
      } else {
        await adjustStock(payload).unwrap();
      }

      toast.success('Inventory updated successfully');
      setActiveModal(null);
      setAdjustQty('');
      setAdjustReason('');
      setAdjustNotes('');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Inventory Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/admin/inventory/history">
            <Button variant="outline" className="gap-2 bg-white dark:bg-gray-800"><FaChartLine /> View History</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 text-sm font-bold">Total Products</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{metrics.totalProducts}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-800/50">
          <p className="text-emerald-700 dark:text-emerald-400 text-sm font-bold">In Stock</p>
          <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">{metrics.inStock}</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl shadow-sm border border-amber-100 dark:border-amber-800/50">
          <p className="text-amber-700 dark:text-amber-400 text-sm font-bold">Low Stock</p>
          <p className="text-2xl font-black text-amber-900 dark:text-amber-100">{metrics.lowStock}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl shadow-sm border border-red-100 dark:border-red-800/50">
          <p className="text-red-700 dark:text-red-400 text-sm font-bold">Out of Stock</p>
          <p className="text-2xl font-black text-red-900 dark:text-red-100">{metrics.outOfStock}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-800/50">
          <p className="text-blue-700 dark:text-blue-400 text-sm font-bold">Total Units</p>
          <p className="text-2xl font-black text-blue-900 dark:text-blue-100">{metrics.totalQuantity}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
              />
            </div>
            <select 
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-gray-900 dark:text-gray-100">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">
                  <th className="p-4">Product</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="4" className="p-4 text-center">Loading inventory...</td></tr>
                ) : inventories.map((inv) => (
                  <tr key={inv._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors">
                    <td className="p-4 font-bold flex items-center gap-3">
                      {inv.productId?.image && <img src={inv.productId.image} alt={inv.productId.name} className="w-10 h-10 rounded-lg object-cover" />}
                      <div>
                        <span className="line-clamp-1 block">{inv.productId?.name}</span>
                        <span className="text-gray-500 text-xs font-mono">{inv.productId?.sku}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        inv.stockStatus === 'In Stock' ? 'bg-emerald-100 text-emerald-800' :
                        inv.stockStatus === 'Low Stock' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {inv.stockStatus}
                      </span>
                    </td>
                    <td className="p-4 font-black">
                      <FaWarehouse className="inline mr-1 text-gray-400" /> {inv.currentStock}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => { setActiveModal(inv); setModalType('IN'); }} className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-md font-bold text-xs" title="Stock In">+ IN</button>
                        <button onClick={() => { setActiveModal(inv); setModalType('OUT'); }} className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md font-bold text-xs" title="Stock Out">- OUT</button>
                        <button onClick={() => { setActiveModal(inv); setModalType('ADJUST'); }} className="p-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-bold text-xs" title="Adjust"><FaBoxOpen /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Stock Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {lowStockProducts.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
              <h3 className="text-red-800 dark:text-red-400 font-bold flex items-center gap-2 mb-4">
                <FaExclamationTriangle /> Critical Alerts
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {lowStockProducts.map(p => (
                  <div key={p._id} className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-red-100 dark:border-red-900/50 shadow-sm flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{p.productId?.name}</span>
                    <span className="text-red-600 font-black">{p.currentStock} left</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {modalType === 'IN' ? 'Stock In' : modalType === 'OUT' ? 'Stock Out' : 'Manual Adjustment'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 truncate">{activeModal.productId?.name}</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                <input 
                  type="number" min="1" required
                  value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Reason (required)</label>
                <input 
                  type="text" required placeholder="e.g. Received shipment, Damaged goods"
                  value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
                <textarea 
                  rows="2"
                  value={adjustNotes} onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                ></textarea>
              </div>

              <div className="mt-8">
                <Button type="submit" disabled={isStockIn || isStockOut || isAdjusting} className={`w-full ${modalType === 'IN' ? 'bg-emerald-500 hover:bg-emerald-600' : modalType === 'OUT' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}>
                  Confirm {modalType === 'IN' ? 'Stock In' : modalType === 'OUT' ? 'Stock Out' : 'Adjustment'}
                </Button>
              </div>
            </form>
            
            <button 
              onClick={() => { setActiveModal(null); setModalType(''); }}
              className="mt-4 w-full py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
