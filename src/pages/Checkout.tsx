import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Truck, CreditCard, CheckCircle2, User, MapPin, Loader2 } from 'lucide-react';
import { userService, UserAddress } from '../services/userService';

const Checkout: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [paymentMethod, setPaymentMethod] = useState('upi');

  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState(false);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [userFoundMessage, setUserFoundMessage] = useState('');

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }
    
    setIsApplyingDiscount(true);
    setDiscountError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsApplyingDiscount(false);
      // Example valid codes: TEA10, WELCOME20
      if (discountCode.toUpperCase() === 'TEA10') {
        setDiscountAmount(Math.round(cartTotal * 0.1));
        setDiscountSuccess(true);
        setDiscountError('');
      } else if (discountCode.toUpperCase() === 'WELCOME20') {
        setDiscountAmount(Math.round(cartTotal * 0.2));
        setDiscountSuccess(true);
        setDiscountError('');
      } else {
        setDiscountAmount(0);
        setDiscountSuccess(false);
        setDiscountError('Invalid discount code');
      }
    }, 1000);
  };

  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const newErrors = { ...errors };
    switch (name) {
      case 'email':
        if (!value) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'Invalid email';
        else delete newErrors.email;
        break;
      case 'phone':
        if (!value) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(value)) newErrors.phone = 'Invalid phone (10 digits)';
        else delete newErrors.phone;
        
        // Auto-fill logic
        if (/^\d{10}$/.test(value)) {
          setIsFetchingUser(true);
          setUserFoundMessage('');
          try {
            const user = await userService.getUserByPhone(value);
            if (user) {
              setFormData(prev => ({
                ...prev,
                email: user.email || prev.email,
                fullName: user.fullName || prev.fullName,
                address: user.address || prev.address,
                city: user.city || prev.city,
                state: user.state || prev.state,
                pincode: user.pincode || prev.pincode
              }));
              setUserFoundMessage('Welcome back! We auto-filled your previous shipping details.');
              
              // Clear any existing errors for auto-filled fields
              const updatedErrors = { ...newErrors };
              if (user.email) delete updatedErrors.email;
              if (user.fullName) delete updatedErrors.fullName;
              if (user.address) delete updatedErrors.address;
              if (user.city) delete updatedErrors.city;
              if (user.state) delete updatedErrors.state;
              if (user.pincode) delete updatedErrors.pincode;
              setErrors(updatedErrors);
            }
          } catch (error) {
            console.error('Error fetching user:', error);
          } finally {
            setIsFetchingUser(false);
          }
        } else {
          setUserFoundMessage('');
        }
        break;
      case 'fullName':
        if (!value) newErrors.fullName = 'Full name is required';
        else delete newErrors.fullName;
        break;
      case 'address':
        if (!value) newErrors.address = 'Address is required';
        else delete newErrors.address;
        break;
      case 'city':
        if (!value) newErrors.city = 'City is required';
        else delete newErrors.city;
        break;
      case 'state':
        if (!value) newErrors.state = 'State is required';
        else delete newErrors.state;
        break;
      case 'pincode':
        if (!value) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(value)) newErrors.pincode = 'Invalid pincode';
        else delete newErrors.pincode;
        break;
    }
    setErrors(newErrors);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextField?: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextField) {
        const nextInput = formRef.current?.querySelector(`[name="${nextField}"]`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'Invalid email';
        break;
      case 'phone':
        if (!value) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(value)) newErrors.phone = 'Invalid phone (10 digits)';
        break;
      case 'fullName':
        if (!value) newErrors.fullName = 'Full name is required';
        break;
      case 'address':
        if (!value) newErrors.address = 'Address is required';
        break;
      case 'city':
        if (!value) newErrors.city = 'City is required';
        break;
      case 'state':
        if (!value) newErrors.state = 'State is required';
        break;
      case 'pincode':
        if (!value) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(value)) newErrors.pincode = 'Invalid pincode';
        break;
    }
    
    setErrors(newErrors);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    
    if (!formData.phone) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone (10 digits)';
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isNavigating = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    
    isNavigating.current = true;
    
    // Save user address for future auto-fill
    await userService.saveUserAddress(formData);
    
    const orderData = {
      orderId: `TSC-${Math.floor(Math.random() * 1000000)}`,
      items: [...cartItems],
      subtotal: cartTotal,
      discount: discountAmount,
      total: cartTotal - discountAmount,
      shipping: { ...formData }
    };

    if (paymentMethod === 'upi') {
      navigate('/payment', { state: { orderData } });
    } else {
      navigate('/success', { state: { orderData } });
      clearCart();
    }
  };

  if (cartItems.length === 0 && !isNavigating.current) {
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
        <div className="flex items-center justify-center mb-12 max-w-2xl mx-auto">
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

        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-tea-brown hover:text-tea-gold transition-colors mb-8 font-bold"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-tea-brown mb-8">Secure <span className="text-tea-gold italic">Checkout</span></h2>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              
              {/* User Identity Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-tea-brown/5">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-tea-brown mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyDown={(e) => handleKeyDown(e, 'phone')}
                        placeholder="your@email.com"
                        className={`w-full bg-tea-cream/30 border-2 ${errors.email ? 'border-red-400' : 'border-tea-brown/5'} p-3 rounded-xl focus:border-tea-gold outline-none transition-all`}
                      />
                      {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Phone Number</label>
                      <div className="relative">
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onKeyDown={(e) => handleKeyDown(e, 'fullName')}
                          placeholder="10-digit mobile"
                          className={`w-full bg-tea-cream/30 border-2 ${errors.phone ? 'border-red-400' : 'border-tea-brown/5'} p-3 rounded-xl focus:border-tea-gold outline-none transition-all`}
                        />
                        {isFetchingUser && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 size={16} className="animate-spin text-tea-gold" />
                          </div>
                        )}
                      </div>
                      {errors.phone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.phone}</p>}
                    </div>
                  </div>
                  {userFoundMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-tea-green/10 border border-tea-green/30 text-tea-green p-3 rounded-xl text-sm font-medium flex items-center gap-2 mt-4"
                    >
                      <CheckCircle2 size={16} />
                      {userFoundMessage}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Shipping Address Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-tea-brown/5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-tea-brown">Shipping Address</h3>
                </div>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={(e) => handleKeyDown(e, 'address')}
                      placeholder="John Doe"
                      className={`w-full bg-tea-cream/30 border-2 ${errors.fullName ? 'border-red-400' : 'border-tea-brown/5'} p-3 rounded-xl focus:border-tea-gold outline-none transition-all`}
                    />
                    {errors.fullName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.fullName}</p>}
                  </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Address Line</label>
                      <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyDown={(e) => handleKeyDown(e, 'city')}
                        placeholder="House No, Street, Area"
                        className={`w-full bg-tea-cream/30 border-2 ${errors.address ? 'border-red-400' : 'border-tea-brown/5'} p-3 rounded-xl focus:border-tea-gold outline-none transition-all`}
                      />
                      {errors.address && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">City</label>
                        <input 
                          type="text" 
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onKeyDown={(e) => handleKeyDown(e, 'state')}
                          placeholder="City"
                          className={`w-full bg-tea-cream/30 border-2 ${errors.city ? 'border-red-400' : 'border-tea-brown/5'} p-3 rounded-xl focus:border-tea-gold outline-none transition-all`}
                        />
                        {errors.city && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.city}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">State</label>
                        <input 
                          type="text" 
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onKeyDown={(e) => handleKeyDown(e, 'pincode')}
                          placeholder="State"
                          className={`w-full bg-tea-cream/30 border-2 ${errors.state ? 'border-red-400' : 'border-tea-brown/5'} p-3 rounded-xl focus:border-tea-gold outline-none transition-all`}
                        />
                        {errors.state && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.state}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Pincode</label>
                        <input 
                          type="text" 
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="6-digit"
                          className={`w-full bg-tea-cream/30 border-2 ${errors.pincode ? 'border-red-400' : 'border-tea-brown/5'} p-3 rounded-xl focus:border-tea-gold outline-none transition-all`}
                        />
                        {errors.pincode && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.pincode}</p>}
                      </div>
                    </div>
                  </motion.div>
              </div>

              {/* Payment Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-tea-brown/5">
                <h3 className="text-lg font-bold text-tea-brown mb-4">Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-center space-x-4 ${paymentMethod === 'upi' ? 'border-tea-gold bg-tea-gold/5' : 'border-tea-brown/5 hover:border-tea-gold/30'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-tea-gold' : 'border-tea-brown/20'}`}>
                      {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-tea-gold rounded-full" />}
                    </div>
                    <CreditCard size={20} className={paymentMethod === 'upi' ? 'text-tea-gold' : 'text-tea-brown/40'} />
                    <span className="font-bold text-tea-brown text-sm">UPI QR Payment</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-center space-x-4 ${paymentMethod === 'cod' ? 'border-tea-gold bg-tea-gold/5' : 'border-tea-brown/5 hover:border-tea-gold/30'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-tea-gold' : 'border-tea-brown/20'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-tea-gold rounded-full" />}
                    </div>
                    <Truck size={20} className={paymentMethod === 'cod' ? 'text-tea-gold' : 'text-tea-brown/40'} />
                    <span className="font-bold text-tea-brown text-sm">Cash on Delivery</span>
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full bg-tea-brown text-tea-cream py-3 rounded-xl font-medium text-base hover:bg-tea-gold transition-all shadow-xl active:scale-95 group flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
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
                    {paymentMethod === 'upi' ? 'Proceed to Payment' : 'Place Order'}
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-tea-brown/5 sticky top-32">
              <h3 className="text-xl font-serif font-bold text-tea-brown mb-6">Order Summary</h3>
              <div className="space-y-6 mb-8">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-tea-brown/5 relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute -top-2 -right-2 bg-tea-brown text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-tea-brown text-base">{item.name}</p>
                        <p className="text-tea-brown/40">₹{item.price} each</p>
                      </div>
                    </div>
                    <span className="font-bold text-tea-brown text-base">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                
                <div className="h-px bg-tea-brown/5 my-6" />
                
                {/* Discount Code */}
                <div className="mb-6">
                  <form onSubmit={handleApplyDiscount} className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value);
                        if (discountError) setDiscountError('');
                      }}
                      placeholder="Discount code"
                      className={`flex-grow bg-tea-cream/30 border-2 ${discountError ? 'border-red-400' : discountSuccess ? 'border-tea-green' : 'border-tea-brown/5'} p-3 rounded-xl focus:border-tea-gold outline-none transition-all uppercase`}
                      disabled={discountSuccess || isApplyingDiscount}
                    />
                    <button
                      type="submit"
                      disabled={!discountCode.trim() || discountSuccess || isApplyingDiscount}
                      className="bg-tea-brown text-tea-cream px-6 py-3 rounded-xl font-bold hover:bg-tea-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                    >
                      {isApplyingDiscount ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : discountSuccess ? (
                        'Applied'
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </form>
                  {discountError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2">{discountError}</p>}
                  {discountSuccess && <p className="text-tea-green text-[10px] font-bold uppercase tracking-widest mt-2">Discount applied successfully!</p>}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-tea-brown/60">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  {discountSuccess && (
                    <div className="flex justify-between text-tea-green font-bold">
                      <span>Discount ({discountCode.toUpperCase()})</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-tea-brown/60">
                    <span>Shipping</span>
                    <span className="text-tea-green font-bold">FREE</span>
                  </div>
                </div>

                <div className="h-px bg-tea-brown/5 my-6" />
                
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-tea-brown">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-tea-brown">₹{cartTotal - discountAmount}</span>
                    <p className="text-[10px] text-tea-brown/40 uppercase tracking-widest mt-1">Including all taxes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-tea-cream/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center text-xs text-tea-brown/60 gap-3">
                  <ShieldCheck size={16} className="text-tea-green" />
                  <span>Secure SSL Encrypted Checkout</span>
                </div>
                <div className="flex items-center text-xs text-tea-brown/60 gap-3">
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
