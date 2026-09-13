import React from 'react';
import { FaCog, FaStore, FaBell, FaShieldAlt } from 'react-icons/fa';

const AdminSettings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your store preferences and system configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Info Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-xl text-primary">
              <FaStore className="text-xl" />
            </div>
            <h2 className="text-xl font-bold dark:text-white">Store Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Store Name</label>
              <input type="text" defaultValue="AgriFertilizer" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email</label>
              <input type="email" defaultValue="admin@agrifertilizer.com" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-orange-500/10 p-3 rounded-xl text-orange-500">
              <FaBell className="text-xl" />
            </div>
            <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary focus:ring-primary" />
              <span className="text-gray-700 dark:text-gray-300">Order Alerts</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary focus:ring-primary" />
              <span className="text-gray-700 dark:text-gray-300">Low Stock Warnings</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary" />
              <span className="text-gray-700 dark:text-gray-300">Daily Digest Email</span>
            </label>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-500/10 p-3 rounded-xl text-red-500">
              <FaShieldAlt className="text-xl" />
            </div>
            <h2 className="text-xl font-bold dark:text-white">Security & Maintenance</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Change Password
            </button>
            <button className="px-6 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
              Clear System Cache
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-secondary transition-all transform hover:scale-105 active:scale-95">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
