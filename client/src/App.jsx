import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';
import CustomerLayout from './components/layout/CustomerLayout';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for code splitting
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Home = React.lazy(() => import('./pages/Home'));
const ProductListing = React.lazy(() => import('./pages/ProductListing'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Wishlist = React.lazy(() => import('./pages/Wishlist'));
const Shipping = React.lazy(() => import('./pages/Shipping'));
const Payment = React.lazy(() => import('./pages/Payment'));
const PlaceOrder = React.lazy(() => import('./pages/PlaceOrder'));
const OrderDetails = React.lazy(() => import('./pages/OrderDetails'));
const OrderSuccess = React.lazy(() => import('./pages/OrderSuccess'));
const Recommendation = React.lazy(() => import('./pages/Recommendation'));
const PaymentSuccess = React.lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailure = React.lazy(() => import('./pages/PaymentFailure'));
const MyOrders = React.lazy(() => import('./pages/MyOrders'));

const ProductList = React.lazy(() => import('./pages/admin/ProductList'));
const ProductEdit = React.lazy(() => import('./pages/admin/ProductEdit'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const OrderList = React.lazy(() => import('./pages/admin/OrderList'));
const CustomerList = React.lazy(() => import('./pages/admin/CustomerList'));
const InventoryManager = React.lazy(() => import('./pages/admin/InventoryManager'));
const InventoryHistory = React.lazy(() => import('./pages/admin/InventoryHistory'));
const CouponManager = React.lazy(() => import('./pages/admin/CouponManager'));
const BannerManager = React.lazy(() => import('./pages/admin/BannerManager'));

const CustomerDashboard = React.lazy(() => import('./pages/customer/CustomerDashboard'));
const Profile = React.lazy(() => import('./pages/customer/Profile'));
const AddressBook = React.lazy(() => import('./pages/customer/AddressBook'));
const Notifications = React.lazy(() => import('./pages/customer/Notifications'));
const Support = React.lazy(() => import('./pages/customer/Support'));
const MyReviews = React.lazy(() => import('./pages/customer/MyReviews'));
const PaymentHistory = React.lazy(() => import('./pages/customer/PaymentHistory'));
const CategoryList = React.lazy(() => import('./pages/admin/CategoryList'));
const BrandList = React.lazy(() => import('./pages/admin/BrandList'));
const ReviewManager = React.lazy(() => import('./pages/admin/ReviewManager'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen">
          <ToastContainer position="top-right" autoClose={3000} />
          
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-primary font-bold">Loading AgriFtilizer...</div>}>
            <Routes>
          {/* User Routes */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="products" element={<ProductListing />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="" element={<PrivateRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/payment-success/:id" element={<PaymentSuccess />} />
              <Route path="/payment-failure" element={<PaymentFailure />} />
            </Route>
          </Route>

          {/* Customer Dashboard Routes (Separate Layout) */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route element={<CustomerLayout />}>
              <Route index element={<CustomerDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="addresses" element={<AddressBook />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="payments" element={<PaymentHistory />} />
              <Route path="reviews" element={<MyReviews />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="support" element={<Support />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="product/new" element={<ProductEdit />} />
              <Route path="product/edit/:id" element={<ProductEdit />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="brands" element={<BrandList />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="customers" element={<CustomerList />} />
              <Route path="inventory" element={<InventoryManager />} />
              <Route path="inventory/history" element={<InventoryHistory />} />
              <Route path="coupons" element={<CouponManager />} />
              <Route path="banners" element={<BannerManager />} />
              <Route path="reviews" element={<ReviewManager />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
