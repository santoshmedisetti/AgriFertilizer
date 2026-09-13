import { useState } from 'react';
import { 
  FaChartPie, 
  FaMoneyBillWave, 
  FaShoppingCart, 
  FaBoxOpen, 
  FaWarehouse, 
  FaUsers, 
  FaFileAlt,
  FaCreditCard
} from 'react-icons/fa';

// Import Tabs
import OverviewTab from './analytics/OverviewTab';
import RevenueTab from './analytics/RevenueTab';
import OrdersTab from './analytics/OrdersTab';
import ProductsTab from './analytics/ProductsTab';
import InventoryTab from './analytics/InventoryTab';
import CustomersTab from './analytics/CustomersTab';
import PaymentsTab from './analytics/PaymentsTab';
import ReportsTab from './analytics/ReportsTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    { name: 'Overview', icon: <FaChartPie />, component: <OverviewTab /> },
    { name: 'Revenue', icon: <FaMoneyBillWave />, component: <RevenueTab /> },
    { name: 'Orders', icon: <FaShoppingCart />, component: <OrdersTab /> },
    { name: 'Products', icon: <FaBoxOpen />, component: <ProductsTab /> },
    { name: 'Inventory', icon: <FaWarehouse />, component: <InventoryTab /> },
    { name: 'Customers', icon: <FaUsers />, component: <CustomersTab /> },
    { name: 'Payments', icon: <FaCreditCard />, component: <PaymentsTab /> },
    { name: 'Reports', icon: <FaFileAlt />, component: <ReportsTab /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Deep dive into your store's performance metrics and data.</p>
      </div>

      {/* Custom Tabs Navigation */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.name 
                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Render Active Tab */}
      <div className="min-h-[500px]">
        {tabs.find(t => t.name === activeTab)?.component}
      </div>
    </div>
  );
};

export default AdminDashboard;
