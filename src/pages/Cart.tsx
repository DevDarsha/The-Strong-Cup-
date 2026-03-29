import React from 'react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeItem, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-tea-brown/5 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag size={48} className="text-tea-brown/20" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-tea-brown mb-4">Your cart is empty</h2>
        <p className="text-tea-brown/50 mb-8">Looks like you haven't added any tea to your cart yet.</p>
        <Link 
          to="/shop"
          className="bg-tea-brown text-tea-cream px-8 py-3 rounded-xl font-medium text-base hover:bg-tea-gold transition-all shadow-xl"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-serif font-bold text-tea-brown mb-8">Shopping <span className="text-tea-gold italic">Cart</span></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-tea-brown/5 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-tea-brown text-base">{item.name}</h3>
                  <p className="text-tea-brown/40 text-xs mb-3">{item.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-tea-cream rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-tea-brown hover:bg-white rounded-md transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-bold text-tea-brown text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-tea-brown hover:bg-white rounded-md transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-bold text-tea-brown text-sm">₹{item.price * item.quantity}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-tea-brown/5 sticky top-32">
              <h3 className="text-xl font-serif font-bold text-tea-brown mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-tea-brown/60 text-sm">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-tea-brown/60 text-sm">
                  <span>Shipping</span>
                  <span className="text-tea-green font-bold">FREE</span>
                </div>
                <div className="h-px bg-tea-brown/5 my-4" />
                <div className="flex justify-between text-lg font-bold text-tea-brown">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-tea-brown text-tea-cream py-3 rounded-xl font-medium text-base hover:bg-tea-gold transition-all shadow-xl group flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-tea-brown/30 text-xs mt-6">
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
