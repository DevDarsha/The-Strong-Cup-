import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }: CartDrawerProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-tea-brown/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-tea-cream shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-tea-brown/10 flex items-center justify-between bg-white">
              <div className="flex items-center">
                <ShoppingBag className="text-tea-gold mr-3" size={24} />
                <h2 className="text-xl font-serif font-bold text-tea-brown">Your Shopping Cart</h2>
                <span className="ml-3 bg-tea-gold/10 text-tea-gold text-xs font-bold px-2 py-1 rounded-full">
                  {cartItems.length} Items
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-tea-brown/5 rounded-full transition-colors text-tea-brown"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-tea-gold/10 rounded-full flex items-center justify-center">
                    <ShoppingBag size={48} className="text-tea-gold/40" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-tea-brown mb-2">Your cart is empty</h3>
                    <p className="text-tea-brown/50 max-w-xs">Looks like you haven't added any tea to your cart yet.</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="bg-tea-brown text-tea-cream px-8 py-3 rounded-full font-bold hover:bg-tea-gold transition-all shadow-lg"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex space-x-4 bg-white p-4 rounded-2xl shadow-sm border border-tea-brown/5 group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-serif font-bold text-tea-brown group-hover:text-tea-gold transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-xs text-tea-brown/50">{item.category}</p>
                        </div>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-tea-brown/30 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center bg-tea-cream rounded-lg p-1 border border-tea-brown/5">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white rounded-md transition-colors text-tea-brown disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-bold text-sm text-tea-brown">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white rounded-md transition-colors text-tea-brown"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-bold text-tea-brown">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-white border-t border-tea-brown/10 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-tea-brown/60">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-tea-brown/60">
                    <span>Shipping</span>
                    <span className="text-tea-green font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-xl font-serif font-bold text-tea-brown pt-2 border-t border-tea-brown/5">
                    <span>Total</span>
                    <span>₹{subtotal}</span>
                  </div>
                </div>
                
                <button 
                  onClick={onCheckout}
                  className="w-full bg-tea-brown text-tea-cream py-4 rounded-full font-bold flex items-center justify-center hover:bg-tea-gold transition-all shadow-xl hover:shadow-tea-gold/20 group"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-center text-[10px] text-tea-brown/40 uppercase tracking-widest font-bold">
                  Secure Checkout Guaranteed
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
