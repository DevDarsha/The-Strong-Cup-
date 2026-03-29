import { Star, ShoppingCart, Heart, Share2, Plus, Minus, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBack: () => void;
  onBuyNow: (product: Product, quantity: number) => void;
  relatedProducts: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductDetail({ 
  product, 
  onAddToCart, 
  onBack, 
  onBuyNow, 
  relatedProducts,
  onProductClick 
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      // Show sticky bar after scrolling past the main content area
      setShowSticky(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [product.id]);

  const images = [
    product.image,
    `https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=800`,
    `https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=800`,
    `https://images.unsplash.com/photo-1563911191470-397364428a48?auto=format&fit=crop&q=80&w=800`,
  ];

  return (
    <div className="pt-24 pb-20 bg-tea-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center text-tea-brown/60 hover:text-tea-gold transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative group"
            >
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-tea-gold text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                {product.discount}
              </div>
            </motion.div>
            
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === i ? 'border-tea-gold shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex text-tea-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <span className="text-tea-brown/50 font-medium border-l border-tea-brown/20 pl-4">120+ Customer Reviews</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-tea-brown mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-tea-brown">₹{product.price}</span>
                <span className="text-xl text-tea-brown/40 line-through">₹{product.originalPrice}</span>
                <span className="bg-tea-green/10 text-tea-green text-xs font-bold px-3 py-1 rounded-full border border-tea-green/20">Save ₹{product.originalPrice - product.price}</span>
              </div>
              
              {/* Urgency Element */}
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-100 w-fit">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Only 5 packs left in stock!</span>
              </div>
            </div>

            <p className="text-tea-brown/70 leading-relaxed text-lg">
              {product.description}
            </p>

            <div className="space-y-4">
              <h3 className="font-serif font-bold text-tea-brown text-xl">Key Features:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-tea-brown/5 shadow-sm">
                    <CheckCircle size={18} className="text-tea-green flex-shrink-0" />
                    <span className="text-sm font-medium text-tea-brown/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-tea-brown/10 space-y-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center bg-white rounded-2xl p-2 border-2 border-tea-brown/10 shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-tea-cream rounded-xl transition-colors text-tea-brown"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-bold text-xl text-tea-brown">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-tea-cream rounded-xl transition-colors text-tea-brown"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="flex space-x-4 flex-1 min-w-[200px]">
                  <button 
                    onClick={() => onAddToCart(product, quantity)}
                    className="flex-1 bg-tea-brown text-tea-cream py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-tea-gold transition-all shadow-xl hover:shadow-tea-gold/20 active:scale-95 group"
                  >
                    <ShoppingCart size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                    Add to Cart
                  </button>
                  <button className="p-4 rounded-2xl border-2 border-tea-brown text-tea-brown hover:bg-tea-brown hover:text-tea-cream transition-all shadow-sm active:scale-95">
                    <Heart size={20} />
                  </button>
                  <button className="p-4 rounded-2xl border-2 border-tea-brown text-tea-brown hover:bg-tea-brown hover:text-tea-cream transition-all shadow-sm active:scale-95">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <button 
                onClick={() => onBuyNow(product, quantity)}
                className="w-full bg-tea-gold text-tea-brown py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-white transition-all shadow-xl hover:shadow-white/20 active:scale-95"
              >
                Buy It Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-between p-6 bg-tea-gold/10 rounded-3xl border border-tea-gold/20">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-tea-brown/40 mb-1">Shipping</p>
                <p className="text-sm font-bold text-tea-brown">Free Delivery</p>
              </div>
              <div className="w-px h-8 bg-tea-gold/20" />
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-tea-brown/40 mb-1">Quality</p>
                <p className="text-sm font-bold text-tea-brown">100% Organic</p>
              </div>
              <div className="w-px h-8 bg-tea-gold/20" />
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-tea-brown/40 mb-1">Origin</p>
                <p className="text-sm font-bold text-tea-brown">Pure Assam</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products Section - 2x2 Grid Layout */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-tea-brown">
              Related <span className="text-tea-gold italic">Products</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:gap-8 max-w-2xl mx-auto">
            {relatedProducts.slice(0, 4).map(p => (
              <div key={p.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-tea-brown/5 relative">
                <div 
                  className="relative h-48 md:h-64 overflow-hidden cursor-pointer"
                  onClick={() => onProductClick(p)}
                >
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 left-3 bg-tea-gold text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">{p.discount}</div>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg font-serif font-bold text-tea-brown mb-2 line-clamp-1 cursor-pointer" onClick={() => onProductClick(p)}>{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-tea-brown">₹{p.price}</span>
                    <button 
                      onClick={() => onAddToCart(p, 1)}
                      className="bg-tea-brown text-tea-cream p-2 rounded-lg hover:bg-tea-gold transition-all"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart Bar */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-tea-brown/10 p-4 md:px-8 shadow-[0_-10px_30px_rgba(74,44,42,0.1)]"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="hidden sm:flex items-center space-x-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-12 h-12 rounded-lg object-cover border border-tea-brown/10" 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-serif font-bold text-tea-brown leading-none mb-1">{product.name}</h4>
                  <p className="text-tea-gold font-bold">₹{product.price}</p>
                </div>
              </div>
              
              <div className="flex-1 sm:flex-none flex items-center space-x-4">
                <div className="hidden md:flex items-center bg-white rounded-xl p-1 border border-tea-brown/10">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="p-1 text-tea-brown hover:bg-tea-cream rounded-md transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-tea-brown">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="p-1 text-tea-brown hover:bg-tea-cream rounded-md transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => onAddToCart(product, quantity)}
                  className="flex-1 sm:w-48 bg-tea-brown text-tea-cream py-3 rounded-xl font-bold flex items-center justify-center hover:bg-tea-gold transition-all shadow-lg active:scale-95 group"
                >
                  <ShoppingCart size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
