import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Truck, ShieldCheck, Headphones, Phone, Mail, FileText, ArrowRight, Quote } from 'lucide-react';

const Success: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-20 px-4 text-center min-h-screen flex flex-col items-center justify-center max-w-3xl mx-auto"
    >
      <div className="w-24 h-24 bg-tea-green/10 rounded-full flex items-center justify-center mb-8">
        <CheckCircle2 size={64} className="text-tea-green" />
      </div>
      <h2 className="text-4xl md:text-6xl font-serif font-bold text-tea-brown mb-6">Order Successful!</h2>
      <p className="text-tea-brown/60 text-lg max-w-md mx-auto mb-12 leading-relaxed">
        Thank you for choosing THE STRONG CUP. Your order #TSC-{Math.floor(Math.random() * 1000000)} has been placed.
      </p>
      
      {/* Order Tracking Section */}
      <div className="w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-tea-brown/5 mb-12 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h3 className="text-2xl font-serif font-bold text-tea-brown mb-2">Track Your Order</h3>
            <p className="text-tea-brown/50 text-sm">Real-time delivery status for your premium tea.</p>
          </div>
          <div className="bg-tea-green/10 text-tea-green px-6 py-3 rounded-2xl border border-tea-green/20 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Estimated Delivery</span>
            <span className="text-lg font-bold">{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</span>
          </div>
        </div>

        <div className="relative flex justify-between items-center mb-12">
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-tea-brown/5 -translate-y-1/2 z-0 rounded-full" />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '40%' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-0 h-1.5 bg-tea-green -translate-y-1/2 z-0 rounded-full" 
          />
          
          {[
            { label: 'Confirmed', status: 'completed', date: 'Today' },
            { label: 'Processing', status: 'active', date: 'In Progress' },
            { label: 'Shipped', status: 'pending', date: 'Tomorrow' },
            { label: 'Delivered', status: 'pending', date: '31 Mar' }
          ].map((item, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500 ${item.status === 'completed' || item.status === 'active' ? 'bg-tea-green text-white scale-110' : 'bg-tea-cream text-tea-brown/20'}`}>
                {item.status === 'completed' ? <CheckCircle2 size={24} /> : item.status === 'active' ? <Truck size={24} className="animate-bounce" /> : <div className="w-2.5 h-2.5 bg-current rounded-full" />}
              </div>
              <div className="absolute top-14 flex flex-col items-center min-w-[80px]">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${item.status === 'completed' || item.status === 'active' ? 'text-tea-green' : 'text-tea-brown/30'}`}>
                  {item.label}
                </span>
                <span className="text-[8px] font-bold text-tea-brown/20 mt-1">{item.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Map Visualization */}
        <div className="mt-20 relative h-64 bg-tea-cream rounded-[2rem] overflow-hidden border border-tea-brown/10 shadow-inner group">
          <div className="absolute inset-0 opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" 
              alt="Map Background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-tea-cream via-transparent to-transparent opacity-60" />
          
          <svg className="absolute inset-0 w-full h-full p-8" viewBox="0 0 400 200" preserveAspectRatio="none">
            <path 
              d="M 50 150 Q 150 50 250 150 T 350 50" 
              fill="none" 
              stroke="#4A2C2A" 
              strokeWidth="2" 
              strokeDasharray="8,8"
              className="opacity-20"
            />
            <motion.path 
              d="M 50 150 Q 150 50 250 150 T 350 50" 
              fill="none" 
              stroke="#4D7C0F" 
              strokeWidth="4" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 0.45 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
            
            {/* Start Point */}
            <circle cx="50" cy="150" r="8" fill="#4A2C2A" className="shadow-lg" />
            <circle cx="50" cy="150" r="15" fill="#4A2C2A" className="opacity-10 animate-ping" />
            
            {/* Current Position */}
            <motion.g
              initial={{ x: 0, y: 0 }}
              animate={{ x: 135, y: -65 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            >
              <circle cx="50" cy="150" r="10" fill="#4D7C0F" className="shadow-xl" />
              <circle cx="50" cy="150" r="20" fill="#4D7C0F" className="opacity-20 animate-pulse" />
              <Truck size={12} className="text-white absolute" style={{ transform: 'translate(44px, 144px)' }} />
            </motion.g>

            {/* End Point */}
            <circle cx="350" cy="50" r="8" fill="#4A2C2A" className="opacity-20" />
          </svg>

          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-tea-brown/5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-tea-gold/10 rounded-full flex items-center justify-center">
                  <Truck size={20} className="text-tea-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-tea-brown/40">Current Location</p>
                  <p className="text-sm font-bold text-tea-brown">Guwahati Hub, Assam</p>
                </div>
              </div>
            </div>
            <div className="bg-tea-brown text-tea-cream px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg">
              In Transit
            </div>
          </div>
        </div>

        {/* Carrier Info */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-tea-cream/30 p-6 rounded-3xl border border-tea-brown/5 flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Truck size={24} className="text-tea-gold" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-tea-brown/40 mb-1">Shipping Carrier</p>
              <p className="text-lg font-bold text-tea-brown">BlueDart Express</p>
            </div>
          </div>
          <div className="bg-tea-cream/30 p-6 rounded-3xl border border-tea-brown/5 flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <ShieldCheck size={24} className="text-tea-green" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-tea-brown/40 mb-1">Tracking Number</p>
              <div className="flex items-center space-x-2">
                <p className="text-lg font-bold text-tea-brown">TSC-992837465</p>
                <button className="text-tea-gold hover:text-tea-brown transition-colors">
                  <Quote size={14} className="rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Support & Invoice Section */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Customer Support */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-tea-brown/5 text-left">
          <h3 className="text-xl font-serif font-bold text-tea-brown mb-6 flex items-center">
            <Headphones size={24} className="mr-3 text-tea-gold" />
            Customer Support
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-tea-gold/10 rounded-xl flex items-center justify-center">
                <Phone size={18} className="text-tea-gold" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-tea-brown/40">24/7 Helpline</p>
                <p className="text-sm font-bold text-tea-brown">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-tea-gold/10 rounded-xl flex items-center justify-center">
                <Mail size={18} className="text-tea-gold" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-tea-brown/40">Email Support</p>
                <p className="text-sm font-bold text-tea-brown">support@thestrongcup.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Download */}
        <div className="bg-tea-brown text-tea-cream rounded-[2rem] p-8 shadow-xl border border-tea-brown/10 text-left flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-tea-gold mb-2 flex items-center">
              <FileText size={24} className="mr-3 text-tea-gold" />
              Order Invoice
            </h3>
            <p className="text-tea-cream/60 text-sm mb-6">
              Your digital invoice is ready for download. Keep it for your records and warranty.
            </p>
          </div>
          <button className="w-full bg-tea-gold text-tea-brown py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-white transition-all group">
            Download PDF Invoice
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => navigate('/')}
          className="bg-tea-brown text-tea-cream px-10 py-4 rounded-full font-bold flex items-center justify-center hover:bg-tea-gold transition-all shadow-xl hover:shadow-tea-gold/20 group w-full sm:w-auto"
        >
          <ShoppingBag size={20} className="mr-2 group-hover:scale-110 transition-transform" />
          Continue Shopping
        </button>
      </div>
    </motion.div>
  );
};

export default Success;
