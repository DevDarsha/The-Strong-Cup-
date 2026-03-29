import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Award } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-tea-cream">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              x: Math.random() * 100 - 50 + '%',
              y: Math.random() * 100 - 50 + '%',
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              opacity: [0, 0.2, 0],
              y: ['-10%', '110%'],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute w-4 h-4 bg-tea-gold/20 rounded-full blur-sm"
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center bg-tea-brown/5 border border-tea-brown/10 px-4 py-2 rounded-full"
            >
              <Award size={16} className="text-tea-gold mr-2" />
              <span className="text-xs font-bold text-tea-brown uppercase tracking-widest">Premium Assam Tea</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-tea-brown leading-[1.15]">
              Pure Assam Tea. <br />
              <span className="text-tea-gold italic">Nothing Added.</span>
            </h1>
            <p className="text-base md:text-lg text-tea-brown/60 font-medium tracking-wide">
              No Colours | No Preservatives | Just Strong Natural Taste
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onShopNow}
              className="bg-tea-brown text-tea-cream px-8 py-3 rounded-xl font-medium text-base hover:bg-tea-gold transition-all shadow-xl hover:shadow-tea-gold/20 flex items-center justify-center group"
            >
              Order Now
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onShopNow}
              className="bg-white text-tea-brown border-2 border-tea-brown/10 px-8 py-3 rounded-xl font-medium text-base hover:border-tea-brown transition-all flex items-center justify-center"
            >
              View Best Sellers
            </button>
          </div>

          <div className="pt-4 flex items-center space-x-8">
            <div className="flex flex-col">
              <div className="flex text-tea-gold mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-sm font-bold text-tea-brown">4.8 | 1200+ Tea Lovers</p>
            </div>
            <div className="h-10 w-px bg-tea-brown/10" />
            <div className="flex items-center space-x-2">
              <ShieldCheck size={24} className="text-tea-green" />
              <span className="text-sm font-bold text-tea-brown/70">100% Pure & Natural</span>
            </div>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white aspect-[4/5]">
            <img 
              src="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=1000" 
              alt="Strong Cup Premium Tea Powder" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Price Badge Overlay */}
            <div className="absolute bottom-6 left-6 glass p-5 rounded-2xl border border-white/20 shadow-xl">
              <div className="flex items-center space-x-3 mb-1">
                <span className="text-2xl font-bold text-tea-brown">₹299</span>
                <span className="text-sm text-tea-brown/40 line-through">₹399</span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">20% OFF</span>
              </div>
              <p className="text-tea-brown/60 text-xs font-bold uppercase tracking-widest">Strong Cup Premium Tea Powder</p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-tea-gold/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-tea-brown/5 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
