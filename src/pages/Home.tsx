import React from 'react';
import { motion } from 'motion/react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import OfferBanner from '../components/OfferBanner';
import Features from '../components/Features';
import { Star, ArrowRight, Quote } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Strong Cup Classic',
    price: 199,
    originalPrice: 249,
    discount: '20% OFF',
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=800',
    description: 'Strong Taste | Daily Use. Our signature bold CTC tea for the perfect morning kick.',
    features: ['100% Pure Assam Tea', 'No Added Colors', 'Strong & Bold Taste', 'Freshly Packed'],
    category: 'CTC Tea',
    status: 'Bestseller',
    shortBenefit: 'Strong Taste'
  },
  {
    id: '2',
    name: 'Strong Cup Gold Blend',
    price: 299,
    originalPrice: 399,
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=800',
    description: 'Rich Aroma | Premium Quality. A sophisticated blend of the finest Assam orthodox and CTC leaves.',
    features: ['Premium Quality', 'Rich Natural Aroma', 'Hand-Picked Leaves', 'Direct from Gardens'],
    category: 'Gold Blend',
    status: 'Trending',
    shortBenefit: 'Rich Aroma'
  },
  {
    id: '3',
    name: 'Strong Cup Premium Leaf',
    price: 349,
    originalPrice: 449,
    discount: '22% OFF',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    description: 'Natural Leaves | Authentic Flavor. Whole leaf orthodox tea for true tea connoisseurs.',
    features: ['Whole Leaf Grade', 'Authentic Flavor', 'High Antioxidants', 'No Preservatives'],
    category: 'Premium Leaf',
    status: 'Premium',
    shortBenefit: 'Authentic Flavor'
  }
];

const TESTIMONIALS = [
  {
    name: "Rahul",
    location: "Guwahati",
    rating: 5,
    text: "Strong taste without bitterness. Feels pure. Better than any market tea I've tried."
  },
  {
    name: "Pooja",
    location: "Delhi",
    rating: 5,
    text: "Real Assam flavor. The aroma is incredible and it stays fresh for a long time."
  }
];

const Home: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Section 1: Hero */}
      <Hero onShopNow={() => navigate('/shop')} />
      
      {/* Section 2: Best Sellers */}
      <section id="products" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-tea-brown mb-4">
              🔥 Strong Cup <span className="text-tea-gold italic">Best Sellers</span>
            </h2>
            <p className="text-tea-brown/60 max-w-2xl mx-auto text-base md:text-lg">
              Pure Assam tea, freshly packed and delivered to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {PRODUCTS.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={(p) => addToCart(p)}
                onProductClick={(p) => navigate(`/product/${p.id}`)}
                onBuyNow={(p) => {
                  addToCart(p);
                  navigate('/checkout');
                }}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button 
              onClick={() => navigate('/shop')}
              className="bg-tea-brown text-tea-cream px-8 py-3 rounded-xl font-medium text-base hover:bg-tea-gold transition-all shadow-xl group"
            >
              View All Best Sellers
              <ArrowRight size={20} className="ml-2 inline group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Combo / Offers */}
      <OfferBanner onShopNow={() => navigate('/shop')} />
      
      {/* Section 4: Why Choose Us */}
      <Features />
      
      {/* Section 5: Customer Reviews */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-tea-brown mb-4">
              What <span className="text-tea-gold italic">Tea Lovers Say</span>
            </h2>
            <p className="text-tea-brown/60 max-w-2xl mx-auto text-base md:text-lg">
              Join 1000+ Happy Customers who trust us for the perfect strong chai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-[2.5rem] relative group hover:shadow-2xl transition-all duration-500 border border-tea-brown/5"
              >
                <Quote className="absolute top-6 right-6 text-tea-gold/10 group-hover:text-tea-gold/20 transition-colors" size={48} />
                <div className="flex text-tea-gold mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-tea-brown/70 italic mb-6 text-base leading-relaxed relative z-10">
                  "{t.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-tea-brown/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-tea-brown font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-tea-brown text-sm">{t.name}</h4>
                    <p className="text-[10px] text-tea-brown/40 uppercase tracking-widest font-bold">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <button 
              onClick={() => navigate('/shop')}
              className="inline-flex items-center bg-tea-gold text-tea-brown px-8 py-3 rounded-xl font-medium text-base hover:bg-tea-brown hover:text-tea-cream transition-all shadow-xl group"
            >
              Read All Reviews
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 6: Featured Product */}
      <section className="py-16 md:py-20 bg-tea-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden shadow-2xl rounded-[2.5rem]"
          >
            <img 
              src={PRODUCTS[1].image} 
              alt="Featured Tea" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 left-6 bg-tea-gold text-white px-4 py-2 text-xs font-bold shadow-lg rounded-full">
              🔥 Limited Stock Available
            </div>
          </motion.div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-tea-brown leading-tight">
              Strong Cup <br />
              <span className="text-tea-gold italic">Gold Blend</span>
            </h2>
            <p className="text-tea-brown/70 text-base leading-relaxed">
              Crafted from premium Assam leaves, delivering rich color and strong aroma without any artificial additives. Just pure high-quality tea.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-tea-brown">₹{PRODUCTS[1].price}</span>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest">25% OFF</span>
            </div>
            <button 
              onClick={() => navigate(`/product/${PRODUCTS[1].id}`)}
              className="bg-tea-brown text-tea-cream px-8 py-3 rounded-xl font-medium text-base hover:bg-tea-gold transition-all shadow-xl group inline-flex items-center"
            >
              Order Now
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 7: Brand Story */}
      <section className="py-16 md:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-tea-brown leading-tight">
              From Assam Gardens <br />
              <span className="text-tea-gold italic">to Your Cup</span>
            </h2>
            <p className="text-tea-brown/70 text-base leading-relaxed">
              Strong Cup is made from carefully selected Assam tea leaves, processed naturally without adding any colour or preservatives. We focus on purity, strength, and authentic taste in every sip.
            </p>
            <button 
              onClick={() => navigate('/about')}
              className="bg-tea-brown/5 text-tea-brown px-8 py-3 rounded-xl font-medium text-base hover:bg-tea-brown hover:text-tea-cream transition-all group inline-flex items-center"
            >
              Our Story
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="relative order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 overflow-hidden shadow-2xl border-8 border-white rounded-[2.5rem]"
            >
              <img 
                src="https://images.unsplash.com/photo-1544787210-2213d84ad96b?auto=format&fit=crop&q=80&w=1000" 
                alt="Tea Garden" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 8: Final CTA Banner */}
      <section className="py-16 md:py-20 bg-tea-brown relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=1200" 
            alt="Background" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-tea-cream mb-6 leading-tight">
            Taste the Real <br />
            <span className="text-tea-gold italic">Strength of Assam</span>
          </h2>
          <p className="text-tea-cream/70 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            No chemicals. No shortcuts. Just pure high-quality tea. Order your pack today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button 
              onClick={() => navigate('/shop')}
              className="bg-tea-gold text-tea-brown px-8 py-3 rounded-xl font-medium text-base hover:bg-white transition-all shadow-xl hover:shadow-white/20 group"
            >
              Order Your Pack Today
              <ArrowRight size={20} className="ml-2 inline group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
