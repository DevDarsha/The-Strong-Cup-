import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Send, ShoppingBag, Loader2, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (!value.trim()) {
      setError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail('');
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1000);
  };
  return (
    <footer className="bg-tea-brown text-tea-cream pt-16 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-tea-gold rounded-lg flex items-center justify-center mr-2 shadow-lg">
                <ShoppingBag size={16} className="text-tea-brown" />
              </div>
              <h2 className="text-lg font-serif font-bold tracking-tighter">
                THE <span className="text-tea-gold">STRONG</span> CUP
              </h2>
            </div>
            <p className="text-tea-cream/60 leading-relaxed max-w-xs text-xs">
              Premium Assam tea powder brand. Made with pure Assam tea without any colors or preservatives. Just pure high quality.
            </p>
            <div className="flex space-x-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <button key={i} className="w-8 h-8 bg-tea-gold/10 rounded-full flex items-center justify-center hover:bg-tea-gold hover:text-tea-brown transition-all border border-tea-gold/20 group">
                  <Icon size={14} className="group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-bold text-tea-gold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Shop', 'Offers', 'Contact'].map((link) => (
                <li key={link}>
                  <button className="text-tea-cream/60 hover:text-tea-gold transition-colors flex items-center group text-sm">
                    <span className="w-0 h-0.5 bg-tea-gold mr-0 group-hover:w-2 group-hover:mr-2 transition-all"></span>
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-bold text-tea-gold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={16} className="text-tea-gold mr-3 mt-1 flex-shrink-0" />
                <span className="text-tea-cream/60 leading-relaxed text-sm">
                  123 Tea Garden Estate, <br />
                  Jorhat, Assam - 785001, India
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="text-tea-gold mr-3 flex-shrink-0" />
                <span className="text-tea-cream/60 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="text-tea-gold mr-3 flex-shrink-0" />
                <span className="text-tea-cream/60 text-sm">hello@thestrongcup.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-serif font-bold text-tea-gold mb-6">Newsletter</h3>
            <p className="text-tea-cream/60 mb-4 text-xs">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input 
                type="email" 
                value={email}
                onChange={handleEmailChange}
                placeholder="Your email address" 
                className={`w-full bg-tea-gold/10 border ${error ? 'border-red-400/50' : 'border-tea-gold/20'} rounded-full py-3 px-4 text-sm text-tea-cream placeholder:text-tea-cream/30 focus:outline-none focus:border-tea-gold transition-colors`}
              />
              <button 
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`absolute right-1.5 top-1.5 p-2 rounded-full transition-all shadow-lg flex items-center justify-center ${
                  isSuccess ? 'bg-green-500 text-white' : 'bg-tea-gold text-tea-brown hover:bg-white active:scale-95'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : isSuccess ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <Send size={14} />
                )}
              </button>
            </form>
            {error && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mt-2 ml-4">{error}</p>}
          </div>
        </div>

        <div className="pt-8 border-t border-tea-gold/10 flex flex-col md:flex-row items-center justify-between text-tea-cream/40 text-xs">
          <p>© 2026 THE STRONG CUP. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button className="hover:text-tea-gold transition-colors">Privacy</button>
            <button className="hover:text-tea-gold transition-colors">Terms</button>
            <button className="hover:text-tea-gold transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
