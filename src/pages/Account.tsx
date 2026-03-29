import React from 'react';
import { motion } from 'motion/react';
import { User, Package, Settings, LogOut, ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Account: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-tea-brown/5 text-center mb-8">
              <div className="w-24 h-24 bg-tea-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User size={48} className="text-tea-gold" />
              </div>
              <h3 className="text-xl font-bold text-tea-brown">John Doe</h3>
              <p className="text-tea-brown/40 text-sm">john.doe@example.com</p>
            </div>

            <div className="bg-white p-4 rounded-[2rem] shadow-xl border border-tea-brown/5 space-y-2">
              {[
                { icon: User, label: 'Profile Info', active: true },
                { icon: Package, label: 'My Orders', active: false },
                { icon: Settings, label: 'Settings', active: false },
                { icon: LogOut, label: 'Logout', active: false, color: 'text-red-400' }
              ].map((item, i) => (
                <button 
                  key={i}
                  className={`w-full flex items-center p-4 rounded-2xl transition-all ${item.active ? 'bg-tea-brown text-tea-cream shadow-lg' : 'text-tea-brown/60 hover:bg-tea-cream/50'} ${item.color || ''}`}
                >
                  <item.icon size={20} className="mr-4" />
                  <span className="font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-tea-brown/5">
              <h2 className="text-3xl font-serif font-bold text-tea-brown mb-8">Profile <span className="text-tea-gold italic">Information</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Full Name</label>
                  <p className="text-lg font-bold text-tea-brown p-4 bg-tea-cream/30 rounded-2xl border border-tea-brown/5">John Doe</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Email Address</label>
                  <p className="text-lg font-bold text-tea-brown p-4 bg-tea-cream/30 rounded-2xl border border-tea-brown/5">john.doe@example.com</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Phone Number</label>
                  <p className="text-lg font-bold text-tea-brown p-4 bg-tea-cream/30 rounded-2xl border border-tea-brown/5">+91 98765 43210</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Default Address</label>
                  <p className="text-lg font-bold text-tea-brown p-4 bg-tea-cream/30 rounded-2xl border border-tea-brown/5">Guwahati, Assam</p>
                </div>
              </div>
              <button className="mt-12 bg-tea-brown text-tea-cream px-10 py-4 rounded-full font-bold hover:bg-tea-gold transition-all shadow-xl">
                Edit Profile
              </button>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-tea-brown/5">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-tea-brown">Recent <span className="text-tea-gold italic">Orders</span></h2>
                <button className="text-tea-gold font-bold flex items-center hover:text-tea-brown transition-colors">
                  View All <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
              
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-tea-brown/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag size={40} className="text-tea-brown/20" />
                </div>
                <h3 className="text-xl font-bold text-tea-brown mb-2">No orders yet</h3>
                <p className="text-tea-brown/40 mb-8">Start your tea journey with us today.</p>
                <button 
                  onClick={() => navigate('/shop')}
                  className="bg-tea-brown text-tea-cream px-8 py-3 rounded-full font-bold hover:bg-tea-gold transition-all shadow-xl"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Account;
