import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Truck, CreditCard } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    pincode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextField?: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextField) {
        const nextInput = formRef.current?.querySelector(`[name="${nextField}"]`) as HTMLInputElement;
        nextInput?.focus();
      } else {
        handleSubmit(e as any);
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.phone) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number (10 digits)';
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Full address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode (6 digits)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    navigate('/payment');
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-16 max-w-2xl mx-auto">
          <div className="flex flex-col items-center relative z-10">
            <div className="w-10 h-10 bg-tea-brown text-tea-cream rounded-full flex items-center justify-center font-bold shadow-lg">1</div>
            <span className="text-xs font-bold text-tea-brown mt-2 uppercase tracking-widest">Shipping</span>
          </div>
          <div className="flex-grow h-1 bg-tea-brown/10 mx-4 -mt-6" />
          <div className="flex flex-col items-center relative z-10">
            <div className="w-10 h-10 bg-tea-cream text-tea-brown/20 rounded-full flex items-center justify-center font-bold border-2 border-tea-brown/5">2</div>
            <span className="text-xs font-bold text-tea-brown/20 mt-2 uppercase tracking-widest">Payment</span>
          </div>
          <div className="flex-grow h-1 bg-tea-brown/10 mx-4 -mt-6" />
          <div className="flex flex-col items-center relative z-10">
            <div className="w-10 h-10 bg-tea-cream text-tea-brown/20 rounded-full flex items-center justify-center font-bold border-2 border-tea-brown/5">3</div>
            <span className="text-xs font-bold text-tea-brown/20 mt-2 uppercase tracking-widest">Success</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-tea-brown hover:text-tea-gold transition-colors mb-8 font-bold"
            >
              <ArrowLeft size={20} className="mr-2" /> Back
            </button>
            <h2 className="text-4xl font-serif font-bold text-tea-brown mb-12">Shipping <span className="text-tea-gold italic">Details</span></h2>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'phone')}
                    placeholder="your@email.com"
                    className={`w-full bg-white border-2 ${errors.email ? 'border-red-400' : 'border-tea-brown/5'} p-4 rounded-2xl focus:border-tea-gold outline-none transition-all`}
                  />
                  {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'firstName')}
                    placeholder="10-digit mobile"
                    className={`w-full bg-white border-2 ${errors.phone ? 'border-red-400' : 'border-tea-brown/5'} p-4 rounded-2xl focus:border-tea-gold outline-none transition-all`}
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'lastName')}
                    placeholder="John"
                    className={`w-full bg-white border-2 ${errors.firstName ? 'border-red-400' : 'border-tea-brown/5'} p-4 rounded-2xl focus:border-tea-gold outline-none transition-all`}
                  />
                  {errors.firstName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'address')}
                    placeholder="Doe"
                    className={`w-full bg-white border-2 ${errors.lastName ? 'border-red-400' : 'border-tea-brown/5'} p-4 rounded-2xl focus:border-tea-gold outline-none transition-all`}
                  />
                  {errors.lastName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Full Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 'city')}
                  placeholder="House No, Street, Area"
                  className={`w-full bg-white border-2 ${errors.address ? 'border-red-400' : 'border-tea-brown/5'} p-4 rounded-2xl focus:border-tea-gold outline-none transition-all`}
                />
                {errors.address && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">City</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'pincode')}
                    placeholder="Guwahati"
                    className={`w-full bg-white border-2 ${errors.city ? 'border-red-400' : 'border-tea-brown/5'} p-4 rounded-2xl focus:border-tea-gold outline-none transition-all`}
                  />
                  {errors.city && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Pincode</label>
                  <input 
                    type="text" 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e)}
                    placeholder="6-digit code"
                    className={`w-full bg-white border-2 ${errors.pincode ? 'border-red-400' : 'border-tea-brown/5'} p-4 rounded-2xl focus:border-tea-gold outline-none transition-all`}
                  />
                  {errors.pincode && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.pincode}</p>}
                </div>
              </div>

              <button 
                type="submit"
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
                    Continue to Payment
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-tea-brown/5 sticky top-32">
              <h3 className="text-2xl font-serif font-bold text-tea-brown mb-8">Order Summary</h3>
              <div className="space-y-4 mb-8">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-tea-brown/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-tea-brown">{item.name}</p>
                        <p className="text-tea-brown/40">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-tea-brown">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="h-px bg-tea-brown/5 my-4" />
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
              
              <div className="space-y-4">
                <div className="flex items-center text-xs text-tea-brown/40 gap-3">
                  <ShieldCheck size={16} className="text-tea-green" />
                  <span>Secure SSL Encrypted Checkout</span>
                </div>
                <div className="flex items-center text-xs text-tea-brown/40 gap-3">
                  <Truck size={16} className="text-tea-gold" />
                  <span>Free Delivery on all orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
