import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';

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
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}
