import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Package, CheckCircle2, Truck, Box, MapPin, ArrowRight } from 'lucide-react';

const TrackOrder: React.FC = () => {
  const [trackingInput, setTrackingInput] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTrackingInput(value);
    
    if (!value.trim()) {
      setError('Please enter your Order ID or Mobile Number');
    } else if (value.trim().length < 5) {
      setError('Input is too short');
    } else {
      setError('');
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) {
      setError('Please enter your Order ID or Mobile Number');
      return;
    }
    if (trackingInput.trim().length < 5) {
      setError('Input is too short');
      return;
    }
    
    setError('');
    setIsTracking(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsTracking(false);
      setTrackingResult({
        orderId: trackingInput.startsWith('TSC') ? trackingInput.toUpperCase() : `TSC-${Math.floor(Math.random() * 1000000)}`,
        status: 'shipped', // 'placed', 'packed', 'shipped', 'out_for_delivery', 'delivered'
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        items: 2,
        total: 1299
      });
    }, 1500);
  };

  const steps = [
    { id: 'placed', label: 'Order Placed', icon: CheckCircle2 },
    { id: 'packed', label: 'Packed', icon: Box },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
    { id: 'delivered', label: 'Delivered', icon: Package }
  ];

  const getStepIndex = (status: string) => {
    return steps.findIndex(s => s.id === status);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-tea-gold/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Package size={28} className="text-tea-gold" />
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-tea-brown mb-3">
            Track Your <span className="text-tea-gold italic">Order</span>
          </h1>
          <p className="text-tea-brown/60 text-base max-w-xl mx-auto">
            Enter your Order ID or Mobile Number to get real-time updates on your premium tea delivery.
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-tea-brown/5 mb-10">
          <form onSubmit={handleTrack} className="max-w-2xl mx-auto relative">
            <div className="relative">
              <input
                type="text"
                value={trackingInput}
                onChange={handleInputChange}
                placeholder="e.g. TSC-123456 or 9876543210"
                className={`w-full bg-tea-cream/30 border-2 ${error ? 'border-red-400' : 'border-tea-brown/10'} pl-12 pr-32 py-3.5 rounded-xl focus:border-tea-gold outline-none transition-all text-base text-tea-brown placeholder:text-tea-brown/30`}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-tea-brown/40" size={20} />
              
              <button
                type="submit"
                disabled={isTracking}
                className="absolute right-2 top-2 bottom-2 bg-tea-brown text-tea-cream px-5 rounded-lg font-medium text-sm hover:bg-tea-gold transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isTracking ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>Track <ArrowRight size={18} className="ml-2" /></>
                )}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm font-bold mt-3 ml-2">{error}</p>}
          </form>
        </div>

        <AnimatePresence mode="wait">
          {trackingResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-tea-brown/5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 border-b border-tea-brown/5 pb-6">
                <div>
                  <p className="text-[10px] font-bold text-tea-brown/40 uppercase tracking-widest mb-1">Order Details</p>
                  <h3 className="text-xl font-bold text-tea-brown">{trackingResult.orderId}</h3>
                </div>
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-tea-brown/40 uppercase tracking-widest mb-1">Date</p>
                    <p className="font-bold text-tea-brown text-sm">{trackingResult.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-tea-brown/40 uppercase tracking-widest mb-1">Total</p>
                    <p className="font-bold text-tea-brown text-sm">₹{trackingResult.total}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative pt-6 pb-12">
                {/* Connecting Line */}
                <div className="absolute top-14 left-[10%] right-[10%] h-1.5 bg-tea-cream rounded-full" />
                
                {/* Active Line */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(getStepIndex(trackingResult.status) / (steps.length - 1)) * 80 + 10}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute top-14 left-[10%] h-1.5 bg-tea-green rounded-full" 
                />

                <div className="flex justify-between relative z-10">
                  {steps.map((step, index) => {
                    const currentIndex = getStepIndex(trackingResult.status);
                    const isCompleted = index <= currentIndex;
                    const isActive = index === currentIndex;
                    const Icon = step.icon;

                    return (
                      <div key={step.id} className="flex flex-col items-center w-1/5">
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500 z-10
                            ${isCompleted ? 'bg-tea-green text-white' : 'bg-tea-cream text-tea-brown/20'}
                            ${isActive ? 'scale-110 ring-4 ring-tea-green/20' : ''}
                          `}
                        >
                          <Icon size={24} className={isActive && step.id === 'shipped' ? 'animate-bounce' : ''} />
                        </motion.div>
                        <div className="mt-4 text-center">
                          <p className={`text-xs md:text-sm font-bold ${isCompleted ? 'text-tea-brown' : 'text-tea-brown/40'}`}>
                            {step.label}
                          </p>
                          {isActive && (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-tea-green mt-1">
                              Current Status
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TrackOrder;
