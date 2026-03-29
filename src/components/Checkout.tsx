import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutProps {
  cartItems: CartItem[];
  onBack: () => void;
  onOrderComplete: () => void;
}

export default function Checkout({ cartItems, onBack, onOrderComplete }: CheckoutProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      onOrderComplete();
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <h2 className="text-3xl font-serif font-bold text-tea-brown mb-4">Your cart is empty</h2>
        <button onClick={onBack} className="bg-tea-brown text-tea-cream px-8 py-3 rounded-full font-bold">
          Go Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-tea-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <button 
          onClick={onBack}
          className="flex items-center text-tea-brown/60 hover:text-tea-gold transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-tea-brown/5">
              {/* Progress Bar */}
              <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-tea-brown/10 -translate-y-1/2 z-0" />
                {[1, 2].map((i) => (
                  <div 
                    key={i}
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= i ? 'bg-tea-gold text-white shadow-lg' : 'bg-tea-cream text-tea-brown/40'}`}
                  >
                    {step > i ? <CheckCircle2 size={20} /> : i}
                    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap text-tea-brown/40">
                      {i === 1 ? 'Shipping' : 'Payment'}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-serif font-bold text-tea-brown flex items-center">
                      <Truck className="mr-3 text-tea-gold" /> Shipping Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-tea-brown/60 uppercase tracking-wider">Email Address</label>
                        <input required name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-tea-cream/50 border border-tea-brown/10 rounded-xl py-3 px-4 focus:outline-none focus:border-tea-gold transition-colors" placeholder="your@email.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-tea-brown/60 uppercase tracking-wider">Phone Number</label>
                        <input required name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="w-full bg-tea-cream/50 border border-tea-brown/10 rounded-xl py-3 px-4 focus:outline-none focus:border-tea-gold transition-colors" placeholder="+91 00000 00000" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-tea-brown/60 uppercase tracking-wider">First Name</label>
                        <input required name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} className="w-full bg-tea-cream/50 border border-tea-brown/10 rounded-xl py-3 px-4 focus:outline-none focus:border-tea-gold transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-tea-brown/60 uppercase tracking-wider">Last Name</label>
                        <input required name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} className="w-full bg-tea-cream/50 border border-tea-brown/10 rounded-xl py-3 px-4 focus:outline-none focus:border-tea-gold transition-colors" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold text-tea-brown/60 uppercase tracking-wider">Full Address</label>
                        <input required name="address" type="text" value={formData.address} onChange={handleInputChange} className="w-full bg-tea-cream/50 border border-tea-brown/10 rounded-xl py-3 px-4 focus:outline-none focus:border-tea-gold transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-tea-brown/60 uppercase tracking-wider">City</label>
                        <input required name="city" type="text" value={formData.city} onChange={handleInputChange} className="w-full bg-tea-cream/50 border border-tea-brown/10 rounded-xl py-3 px-4 focus:outline-none focus:border-tea-gold transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-tea-brown/60 uppercase tracking-wider">Pincode</label>
                        <input required name="pincode" type="text" value={formData.pincode} onChange={handleInputChange} className="w-full bg-tea-cream/50 border border-tea-brown/10 rounded-xl py-3 px-4 focus:outline-none focus:border-tea-gold transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-serif font-bold text-tea-brown flex items-center">
                      <CreditCard className="mr-3 text-tea-gold" /> Payment Method
                    </h3>
                    <div className="space-y-4">
                      {['Credit/Debit Card', 'UPI / Google Pay', 'Cash on Delivery'].map((method) => (
                        <label key={method} className="flex items-center p-4 bg-tea-cream/30 border border-tea-brown/10 rounded-2xl cursor-pointer hover:border-tea-gold transition-colors group">
                          <input type="radio" name="payment" className="w-5 h-5 text-tea-gold focus:ring-tea-gold mr-4" defaultChecked={method === 'Credit/Debit Card'} />
                          <span className="font-bold text-tea-brown group-hover:text-tea-gold transition-colors">{method}</span>
                        </label>
                      ))}
                    </div>
                    
                    <div className="p-6 bg-tea-gold/5 rounded-2xl border border-tea-gold/20 flex items-start space-x-4">
                      <ShieldCheck className="text-tea-gold flex-shrink-0" />
                      <p className="text-sm text-tea-brown/60 leading-relaxed">
                        Your transaction is secured with 256-bit SSL encryption. We do not store your full card details.
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="pt-8 border-t border-tea-brown/10 flex justify-between items-center">
                  {step > 1 && (
                    <button 
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="text-tea-brown font-bold hover:text-tea-gold transition-colors"
                    >
                      Back to Shipping
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="ml-auto bg-tea-brown text-tea-cream px-10 py-4 rounded-full font-bold hover:bg-tea-gold transition-all shadow-xl hover:shadow-tea-gold/20 active:scale-95"
                  >
                    {step === 1 ? 'Continue to Payment' : 'Complete Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-tea-brown/5 sticky top-24">
              <h3 className="text-xl font-serif font-bold text-tea-brown mb-8 pb-4 border-b border-tea-brown/5">Order Summary</h3>
              
              <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-tea-brown line-clamp-1">{item.name}</p>
                        <p className="text-xs text-tea-brown/40">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-tea-brown">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-tea-brown/10">
                <div className="flex justify-between text-tea-brown/60">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-tea-brown/60">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-tea-green font-bold' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-serif font-bold text-tea-brown pt-4 border-t border-tea-brown/5">
                  <span>Total</span>
                  <span className="text-tea-gold">₹{total}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-tea-cream/50 rounded-2xl border border-dashed border-tea-brown/20">
                <p className="text-[10px] uppercase tracking-widest font-bold text-tea-brown/40 mb-2">Applied Promo Code</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-tea-brown">17JAN</span>
                  <span className="text-xs text-tea-green font-bold">-₹{Math.round(subtotal * 0.2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
