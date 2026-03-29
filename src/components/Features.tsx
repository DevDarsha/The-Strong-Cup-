import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, RefreshCcw, Award, Star } from 'lucide-react';

const features = [
  {
    icon: <Award className="text-tea-gold" size={32} />,
    title: "100% Pure Assam Tea",
    description: "No chemical processing, natural leaves sourced directly from Assam gardens."
  },
  {
    icon: <ShieldCheck className="text-tea-gold" size={32} />,
    title: "No Colours, No Preservatives",
    description: "Clean and safe daily consumption. Pure high quality tea."
  },
  {
    icon: <Star className="text-tea-gold" size={32} />,
    title: "Strong Natural Taste",
    description: "High-quality Assam leaves for the perfect strong chai experience."
  },
  {
    icon: <RefreshCcw className="text-tea-gold" size={32} />,
    title: "Fresh & Direct from Source",
    description: "Authentic origin, better flavor, and direct from gardens to your cup."
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-tea-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-tea-brown mb-6">
            Why <span className="text-tea-gold italic">Choose Us</span>
          </h2>
          <p className="text-tea-brown/50 max-w-2xl mx-auto text-lg">
            We bring the finest tea heritage of Assam directly to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass p-10 rounded-[2.5rem] text-center shadow-xl hover:shadow-2xl transition-all group border border-tea-brown/5"
            >
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-tea-gold group-hover:text-white transition-all transform group-hover:rotate-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-tea-brown mb-4">{feature.title}</h3>
              <p className="text-tea-brown/60 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
