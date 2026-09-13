import { useGetInventoryAnalyticsQuery } from '../../../redux/slices/adminApiSlice';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InventoryTab = () => {
  const { data, isLoading } = useGetInventoryAnalyticsQuery();

  if (isLoading) return <div className="p-12 text-center text-gray-500 font-bold">Loading Inventory Data...</div>;

  const { stockDistribution } = data?.data || { stockDistribution: [] };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return '#10b981'; // emerald
      case 'Low Stock': return '#f59e0b'; // amber
      case 'Out of Stock': return '#ef4444'; // red
      default: return '#9ca3af';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Current Stock Status Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stockDistribution}
                cx="50%"
                cy="45%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
              >
                {stockDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Stock Alerts</h2>
        <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
          <p className="text-gray-500 dark:text-gray-400 mb-2">Check the full Inventory module to view specific Low Stock and Out of Stock products.</p>
          <a href="/admin/inventory" className="text-primary font-bold hover:underline">Go to Inventory Manager &rarr;</a>
        </div>
      </div>
    </div>
  );
};

export default InventoryTab;
