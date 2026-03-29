import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-tea-brown mb-4">
            Get in <span className="text-tea-gold italic">Touch</span>
          </h1>
          <p className="text-tea-brown/50 max-w-2xl mx-auto text-base leading-relaxed">
            Have questions about our premium tea? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-tea-brown/5 text-center group hover:border-tea-gold/20 transition-all">
            <div className="w-14 h-14 bg-tea-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-tea-gold group-hover:text-white transition-all">
              <Phone size={28} className="text-tea-gold group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-tea-brown mb-2">Call Us</h3>
            <p className="text-tea-brown/40 text-[10px] mb-3 uppercase tracking-widest font-bold">24/7 Helpline</p>
            <p className="text-base font-bold text-tea-brown">+91 98765 43210</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-tea-brown/5 text-center group hover:border-tea-gold/20 transition-all">
            <div className="w-14 h-14 bg-tea-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-tea-gold group-hover:text-white transition-all">
              <Mail size={28} className="text-tea-gold group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-tea-brown mb-2">Email Us</h3>
            <p className="text-tea-brown/40 text-[10px] mb-3 uppercase tracking-widest font-bold">Support Team</p>
            <p className="text-base font-bold text-tea-brown">support@thestrongcup.com</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-tea-brown/5 text-center group hover:border-tea-gold/20 transition-all">
            <div className="w-14 h-14 bg-tea-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-tea-gold group-hover:text-white transition-all">
              <MapPin size={28} className="text-tea-gold group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-tea-brown mb-2">Visit Us</h3>
            <p className="text-tea-brown/40 text-[10px] mb-3 uppercase tracking-widest font-bold">Our Office</p>
            <p className="text-base font-bold text-tea-brown">Guwahati, Assam, India</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-tea-brown/5 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-tea-brown mb-10 text-center">Send us a <span className="text-tea-gold italic">Message</span></h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-tea-cream/30 border-2 border-tea-brown/5 p-3 rounded-xl focus:border-tea-gold outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Email Address</label>
                <input type="email" placeholder="your@email.com" className="w-full bg-tea-cream/30 border-2 border-tea-brown/5 p-3 rounded-xl focus:border-tea-gold outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Subject</label>
              <input type="text" placeholder="How can we help?" className="w-full bg-tea-cream/30 border-2 border-tea-brown/5 p-3 rounded-xl focus:border-tea-gold outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-tea-brown/40 uppercase tracking-widest">Message</label>
              <textarea placeholder="Tell us more..." rows={5} className="w-full bg-tea-cream/30 border-2 border-tea-brown/5 p-3 rounded-xl focus:border-tea-gold outline-none transition-all resize-none" />
            </div>
            <button className="w-full bg-tea-brown text-tea-cream py-4 rounded-xl font-bold text-base hover:bg-tea-gold transition-all shadow-xl group flex items-center justify-center">
              Send Message
              <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
