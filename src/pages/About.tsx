import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, ShieldCheck, Truck, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-tea-brown leading-tight">
              Our Story: <br />
              <span className="text-tea-gold italic">The Strong Cup</span>
            </h1>
            <p className="text-tea-brown/60 text-base leading-relaxed">
              Founded in the heart of Assam, THE STRONG CUP was born out of a simple desire: to bring the authentic, bold, and pure taste of garden-fresh tea to every household. We believe that a great cup of tea shouldn't need artificial colors or preservatives to be strong.
            </p>
            <p className="text-tea-brown/60 text-base leading-relaxed">
              Our journey starts in the lush green tea gardens of Upper Assam, where only the finest leaves are hand-picked and processed using traditional methods to preserve their natural strength and aroma.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div>
                <h4 className="text-2xl font-bold text-tea-brown">100%</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-tea-brown/40">Pure Assam Tea</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-tea-brown">0%</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-tea-brown/40">Added Colors</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1544787210-2213d84ad96b?auto=format&fit=crop&q=80&w=1000" 
                alt="Tea Garden" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-tea-gold p-6 rounded-3xl shadow-2xl hidden md:block">
              <Award size={36} className="text-white mb-3" />
              <p className="text-white font-bold text-sm">Premium Quality <br /> Certified</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: Leaf, title: 'Natural Sourcing', desc: 'Directly sourced from the best tea estates in Assam.' },
            { icon: ShieldCheck, title: 'Purity Guaranteed', desc: 'No artificial colors, flavors, or preservatives.' },
            { icon: Truck, title: 'Fresh Delivery', desc: 'Packed at source to ensure maximum freshness.' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-xl border border-tea-brown/5 text-center">
              <div className="w-14 h-14 bg-tea-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <item.icon size={28} className="text-tea-gold" />
              </div>
              <h3 className="text-lg font-bold text-tea-brown mb-3">{item.title}</h3>
              <p className="text-tea-brown/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-tea-brown rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=1200" alt="BG" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-tea-cream mb-6">Ready to taste the difference?</h2>
            <p className="text-tea-cream/60 text-base mb-10">Experience the real strength of pure Assam tea today.</p>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-tea-gold text-tea-brown px-10 py-4 rounded-full font-bold text-base hover:bg-white transition-all shadow-xl"
            >
              Shop Our Collection
              <ArrowRight size={20} className="ml-2 inline" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
