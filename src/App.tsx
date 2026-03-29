import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { AdminRoute } from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Success from './pages/Success';
import About from './pages/About';
import Contact from './pages/Contact';
import TrackOrder from './pages/TrackOrder';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import OrderDetails from './pages/admin/OrderDetails';
import Products from './pages/admin/Products';
import Inventory from './pages/admin/Inventory';
import Payments from './pages/admin/Payments';
import Settings from './pages/admin/Settings';

function AppContent() {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product/');

  return (
    <div className="min-h-screen bg-tea-cream selection:bg-tea-gold selection:text-tea-brown flex flex-col">
      {!isProductPage && <Navbar />}
      
      <main className="flex-grow">
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
          {/* @ts-ignore - key is valid in React but missing in RoutesProps types */}
          <Routes location={location} key={location.pathname}>
            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/success" element={<Success />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/track-order" element={<TrackOrder />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <Orders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders/:orderId"
              element={
                <AdminRoute>
                  <OrderDetails />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <Products />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/inventory"
              element={
                <AdminRoute>
                  <Inventory />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <AdminRoute>
                  <Payments />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <Settings />
                </AdminRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      {!isProductPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AdminProvider>
        <Router>
          <AppContent />
        </Router>
      </AdminProvider>
    </CartProvider>
  );
}
