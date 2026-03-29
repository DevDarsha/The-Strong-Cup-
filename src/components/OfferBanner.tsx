import React from 'react';
import { motion } from 'framer-motion';
import { Gift, ArrowRight, Sparkles } from 'lucide-react';

interface OfferBannerProps {
  onShopNow: () => void;
}

const OFFERS = [
  {
    title: "Buy 2 Get 10% OFF",
    desc: "Special Tea Offer",
    price: "₹540",
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=600",
    tag: "🔥 Selling Fast"
  },
  {
    title: "Family Pack Combo",
    desc: "Best Value Pack",
    price: "₹999",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=600",
    tag: "Best Value"
  }
];

export default function OfferBanner({ onShopNow }: OfferBannerProps) {
  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-tea-brown mb-4">
            Special <span className="text-tea-gold italic">Offers</span>
          </h2>
          <p className="text-tea-brown/50 max-w-2xl mx-auto text-base md:text-lg">
            Exclusive bundles crafted for your special occasions.
          </p>
        </div>

        <div className="flex overflow-x-auto pb-8 gap-6 snap-x no-scrollbar">
          {OFFERS.map((offer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[300px] md:min-w-[400px] snap-center glass rounded-[2.5rem] overflow-hidden border border-tea-brown/5 shadow-xl group hover:shadow-2xl transition-all"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-tea-gold text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  {offer.tag}
                </div>
              </div>
              <div className="p-8 space-y-5">
                <div>
                  <h3 className="text-xl font-serif font-bold text-tea-brown mb-1">{offer.title}</h3>
                  <p className="text-tea-gold font-bold text-base">{offer.desc}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-tea-brown">{offer.price}</span>
                  <button 
                    onClick={onShopNow}
                    className="bg-tea-brown text-tea-cream px-6 py-3 rounded-xl font-bold text-sm hover:bg-tea-gold transition-all shadow-lg group flex items-center"
                  >
                    Grab Deal
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
