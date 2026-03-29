import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ORDER_SUCCESS_SOUND } from '../constants/sounds';

const Payment: React.FC = () => {
  const { cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Play success sound
    const audio = new Audio(ORDER_SUCCESS_SOUND);
    audio.play().catch(err => console.log('Audio playback failed:', err));

    clearCart();
    setIsProcessing(false);
    navigate('/success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-16 max-w-2xl mx-auto">
          <div className="flex flex-col items-center relative z-10">
            <div className="w-10 h-10 bg-tea-green text-white rounded-full flex items-center justify-center font-bold shadow-lg">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-xs font-bold text-tea-green mt-2 uppercase tracking-widest">Shipping</span>
          </div>
          <div className="flex-grow h-1 bg-tea-green mx-4 -mt-6" />
          <div className="flex flex-col items-center relative z-10">
            <div className="w-10 h-10 bg-tea-brown text-tea-cream rounded-full flex items-center justify-center font-bold shadow-lg">2</div>
            <span className="text-xs font-bold text-tea-brown mt-2 uppercase tracking-widest">Payment</span>
          </div>
          <div className="flex-grow h-1 bg-tea-brown/10 mx-4 -mt-6" />
          <div className="flex flex-col items-center relative z-10">
            <div className="w-10 h-10 bg-tea-cream text-tea-brown/20 rounded-full flex items-center justify-center font-bold border-2 border-tea-brown/5">3</div>
            <span className="text-xs font-bold text-tea-brown/20 mt-2 uppercase tracking-widest">Success</span>
          </div>
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-tea-brown hover:text-tea-gold transition-colors mb-8 font-bold"
        >
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <h2 className="text-4xl font-serif font-bold text-tea-brown mb-12">Payment <span className="text-tea-gold italic">Method</span></h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <button 
            onClick={() => setPaymentMethod('card')}
            className={`p-8 rounded-[2rem] border-2 transition-all text-left group ${paymentMethod === 'card' ? 'border-tea-gold bg-white shadow-xl' : 'border-tea-brown/5 bg-tea-cream/30 hover:border-tea-gold/30'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${paymentMethod === 'card' ? 'bg-tea-gold text-white' : 'bg-white text-tea-brown/40'}`}>
              <CreditCard size={24} />
            </div>
            <h3 className="text-xl font-bold text-tea-brown mb-2">Credit / Debit Card</h3>
            <p className="text-tea-brown/40 text-sm">Pay securely with your Visa, Mastercard, or AMEX.</p>
          </button>

          <button 
            onClick={() => setPaymentMethod('cod')}
            className={`p-8 rounded-[2rem] border-2 transition-all text-left group ${paymentMethod === 'cod' ? 'border-tea-gold bg-white shadow-xl' : 'border-tea-brown/5 bg-tea-cream/30 hover:border-tea-gold/30'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${paymentMethod === 'cod' ? 'bg-tea-gold text-white' : 'bg-white text-tea-brown/40'}`}>
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-tea-brown mb-2">Cash on Delivery</h3>
            <p className="text-tea-brown/40 text-sm">Pay with cash when your premium tea arrives.</p>
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-tea-brown/5 mb-12">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-tea-brown">Total Amount</h3>
            <span className="text-3xl font-bold text-tea-brown">₹{cartTotal}</span>
          </div>
          
          <button 
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full bg-tea-brown text-tea-cream py-5 rounded-2xl font-bold text-lg hover:bg-tea-gold transition-all shadow-xl group flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                Place Order Now
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <div className="flex items-center justify-center mt-8 gap-4 text-tea-brown/30">
            <ShieldCheck size={20} className="text-tea-green" />
            <span className="text-xs font-bold uppercase tracking-widest">100% Secure Transaction</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Payment;
