import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Send, ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-tea-brown text-tea-cream pt-20 pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-tea-gold rounded-full flex items-center justify-center mr-3 shadow-lg">
                <ShoppingBag size={24} className="text-tea-brown" />
              </div>
              <h2 className="text-2xl font-serif font-bold tracking-tighter">
                THE <span className="text-tea-gold">STRONG</span> CUP
              </h2>
            </div>
            <p className="text-tea-cream/60 leading-relaxed max-w-xs">
              Premium Assam tea powder brand. Made with pure Assam tea without any colors or preservatives. Just pure high quality.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <button key={i} className="w-10 h-10 bg-tea-gold/10 rounded-full flex items-center justify-center hover:bg-tea-gold hover:text-tea-brown transition-all border border-tea-gold/20 group">
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-serif font-bold text-tea-gold mb-8">Quick Links</h3>
            <ul className="space-y-4">
              {['Home', 'Shop', 'Offers', 'Contact'].map((link) => (
                <li key={link}>
                  <button className="text-tea-cream/60 hover:text-tea-gold transition-colors flex items-center group">
                    <span className="w-0 h-0.5 bg-tea-gold mr-0 group-hover:w-3 group-hover:mr-2 transition-all"></span>
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-serif font-bold text-tea-gold mb-8">Contact Us</h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <MapPin size={20} className="text-tea-gold mr-4 mt-1 flex-shrink-0" />
                <span className="text-tea-cream/60 leading-relaxed">
                  123 Tea Garden Estate, <br />
                  Jorhat, Assam - 785001, India
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-tea-gold mr-4 flex-shrink-0" />
                <span className="text-tea-cream/60">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-tea-gold mr-4 flex-shrink-0" />
                <span className="text-tea-cream/60">hello@thestrongcup.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-serif font-bold text-tea-gold mb-8">Newsletter</h3>
            <p className="text-tea-cream/60 mb-6 text-sm">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-tea-gold/10 border border-tea-gold/20 rounded-full py-4 px-6 text-tea-cream placeholder:text-tea-cream/30 focus:outline-none focus:border-tea-gold transition-colors"
              />
              <button className="absolute right-2 top-2 bg-tea-gold text-tea-brown p-2.5 rounded-full hover:bg-white transition-all shadow-lg active:scale-95">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-tea-gold/10 flex flex-col md:flex-row items-center justify-between text-tea-cream/40 text-sm">
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
