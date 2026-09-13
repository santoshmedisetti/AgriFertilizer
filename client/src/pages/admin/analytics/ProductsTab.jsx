import { useGetProductAnalyticsQuery } from '../../../redux/slices/adminApiSlice';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductsTab = () => {
  const { data, isLoading } = useGetProductAnalyticsQuery();

  if (isLoading) return <div className="p-12 text-center text-gray-500 font-bold">Loading Product Analytics...</div>;

  const { bestSellers, leastSelling, topCategories } = data?.data || { bestSellers: [], leastSelling: [], topCategories: [] };
  const COLORS = ['#16a34a', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6'];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Categories</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topCategories} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {topCategories.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Sellers */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Best Selling Products</h2>
          <div className="space-y-3">
            {bestSellers.map((prod, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{prod.name}</h4>
                    <p className="text-sm text-gray-500">{prod.sold} Units Sold</p>
                  </div>
                </div>
                <div className="font-black text-gray-900 dark:text-white">₹{prod.revenue.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductsTab;
