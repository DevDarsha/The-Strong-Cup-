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
          className="bg-tea-brown text-tea-cream px-10 py-4 rounded-full font-bold hover:bg-tea-gold transition-all shadow-xl"
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
        <h1 className="text-4xl font-serif font-bold text-tea-brown mb-12">Shopping <span className="text-tea-gold italic">Cart</span></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-tea-brown/5 flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-tea-brown text-lg">{item.name}</h3>
                  <p className="text-tea-brown/40 text-sm mb-4">{item.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-tea-cream rounded-xl p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-tea-brown hover:bg-white rounded-lg transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-bold text-tea-brown">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-tea-brown hover:bg-white rounded-lg transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-bold text-tea-brown">₹{item.price * item.quantity}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-tea-brown/5 sticky top-32">
              <h3 className="text-2xl font-serif font-bold text-tea-brown mb-8">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-tea-brown/60">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-tea-brown/60">
                  <span>Shipping</span>
                  <span className="text-tea-green font-bold">FREE</span>
                </div>
                <div className="h-px bg-tea-brown/5 my-4" />
                <div className="flex justify-between text-xl font-bold text-tea-brown">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-tea-brown text-tea-cream py-5 rounded-2xl font-bold text-lg hover:bg-tea-gold transition-all shadow-xl group"
              >
                Proceed to Checkout
                <ArrowRight size={20} className="ml-2 inline group-hover:translate-x-1 transition-transform" />
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
