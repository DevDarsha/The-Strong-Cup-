import { Star, ShoppingCart, Heart, Share2, Plus, Minus, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

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
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      name: 'Sarah Jenkins',
      rating: 5,
      comment: 'Absolutely love this tea! The flavor is rich and authentic. Will definitely buy again.',
      date: '2026-03-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      rating: 4,
      comment: 'Great quality leaves. The packaging is beautiful too. A bit pricey but worth it.',
      date: '2026-03-10'
    }
  ]);

  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({});
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
    
    const newErrors = { ...reviewErrors };
    if (name === 'name') {
      if (!value.trim()) newErrors.name = 'Name is required';
      else delete newErrors.name;
    } else if (name === 'comment') {
      if (!value.trim()) newErrors.comment = 'Comment is required';
      else delete newErrors.comment;
    }
    setReviewErrors(newErrors);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!newReview.name.trim()) newErrors.name = 'Name is required';
    if (!newReview.comment.trim()) newErrors.comment = 'Comment is required';
    
    setReviewErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmittingReview(true);
      
      // Simulate API call
      setTimeout(() => {
        const review: Review = {
          id: Date.now().toString(),
          name: newReview.name,
          rating: newReview.rating,
          comment: newReview.comment,
          date: new Date().toISOString().split('T')[0]
        };
        
        setReviews([review, ...reviews]);
        setNewReview({ name: '', rating: 5, comment: '' });
        setIsSubmittingReview(false);
      }, 1000);
    }
  };

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
    <div className="pb-20 bg-tea-cream min-h-screen">
      {/* Minimal Top Bar */}
      <div className="sticky top-0 z-50 bg-tea-cream/80 backdrop-blur-md border-b border-tea-brown/5 px-4 md:px-8 py-4 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center text-tea-brown hover:text-tea-gold transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <button 
          onClick={() => navigate('/cart')}
          className="text-tea-brown hover:text-tea-gold transition-colors relative"
        >
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-tea-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
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
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-tea-brown mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-2xl font-bold text-tea-brown">₹{product.price}</span>
                <span className="text-lg text-tea-brown/40 line-through">₹{product.originalPrice}</span>
                <span className="bg-tea-green/10 text-tea-green text-[10px] font-bold px-2 py-1 rounded-full border border-tea-green/20">Save ₹{product.originalPrice - product.price}</span>
              </div>
              
              {/* Trust + Urgency */}
              <div className="flex flex-col space-y-1.5 mb-4">
                <span className="text-sm font-medium text-tea-brown/80">🔥 1200+ Tea Lovers Trust This</span>
                <span className="text-sm font-medium text-red-600/90">⚠️ Only 12 packs left today</span>
              </div>
            </div>

            <p className="text-tea-brown/70 leading-relaxed text-base">
              {product.description}
            </p>

            <div className="space-y-4">
              <h3 className="font-serif font-bold text-tea-brown text-base">Key Features:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-white p-2 rounded-xl border border-tea-brown/5 shadow-sm">
                    <CheckCircle size={16} className="text-tea-green flex-shrink-0" />
                    <span className="text-xs font-medium text-tea-brown/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-tea-brown/10 space-y-4">
              {/* Quantity and Actions */}
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white rounded-xl p-1 border-2 border-tea-brown/10 shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-tea-cream rounded-lg transition-colors text-tea-brown"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-bold text-lg text-tea-brown">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-tea-cream rounded-lg transition-colors text-tea-brown"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="flex space-x-3">
                  <button className="p-2.5 rounded-xl border-2 border-tea-brown text-tea-brown hover:bg-tea-brown hover:text-tea-cream transition-all shadow-sm active:scale-95">
                    <Heart size={18} />
                  </button>
                  <button className="p-2.5 rounded-xl border-2 border-tea-brown text-tea-brown hover:bg-tea-brown hover:text-tea-cream transition-all shadow-sm active:scale-95">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* Buy Buttons */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <button 
                    onClick={() => onBuyNow(product, quantity)}
                    className="w-full bg-tea-gold text-tea-brown py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-[#e6a835] transition-all shadow-xl hover:shadow-tea-gold/30 active:scale-95"
                  >
                    Buy Now
                  </button>
                  <p className="text-center text-xs text-tea-brown/60 font-medium">
                    🚚 Free Delivery | ⚡ Fast Dispatch
                  </p>
                </div>
                
                <button 
                  onClick={() => onAddToCart(product, quantity)}
                  className="w-full bg-transparent border-2 border-tea-brown/20 text-tea-brown py-3 rounded-xl font-medium text-base flex items-center justify-center hover:border-tea-brown hover:bg-tea-brown/5 transition-all active:scale-95 group"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-between p-6 bg-tea-gold/10 rounded-2xl border border-tea-gold/20 mt-8">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-tea-brown/40 mb-1">Shipping</p>
                <p className="text-sm font-bold text-tea-brown">Free Delivery</p>
              </div>
              <div className="w-px h-8 bg-tea-gold/20" />
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-tea-brown/40 mb-1">Quality</p>
                <p className="text-sm font-bold text-tea-brown">100% Organic</p>
              </div>
              <div className="w-px h-8 bg-tea-gold/20" />
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-tea-brown/40 mb-1">Origin</p>
                <p className="text-sm font-bold text-tea-brown">Pure Assam</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-tea-brown mb-8 text-center">
            Customer <span className="text-tea-gold italic">Reviews</span>
          </h2>
          
          <div className="space-y-6 mb-12">
            {reviews.map(review => (
              <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-tea-brown/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-tea-brown">{review.name}</h4>
                    <span className="text-xs text-tea-brown/50">{review.date}</span>
                  </div>
                  <div className="flex text-tea-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-tea-brown/20"} />
                    ))}
                  </div>
                </div>
                <p className="text-tea-brown/80 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Submit Review Form */}
          <div className="bg-tea-gold/5 p-6 md:p-8 rounded-3xl border border-tea-gold/20">
            <h3 className="text-xl font-serif font-bold text-tea-brown mb-6">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-tea-brown mb-1">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={newReview.name}
                    onChange={handleReviewChange}
                    className={`w-full px-4 py-3 rounded-xl border ${reviewErrors.name ? 'border-red-400' : 'border-tea-brown/10'} focus:outline-none focus:ring-2 focus:ring-tea-gold/50 bg-white`}
                    placeholder="John Doe"
                  />
                  {reviewErrors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{reviewErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-tea-brown mb-1">Rating</label>
                  <div className="flex items-center space-x-2 h-[50px] bg-white px-4 rounded-xl border border-tea-brown/10">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="focus:outline-none"
                      >
                        <Star 
                          size={24} 
                          fill={star <= newReview.rating ? "currentColor" : "none"} 
                          className={star <= newReview.rating ? "text-tea-gold" : "text-tea-brown/20"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-tea-brown mb-1">Your Comment</label>
                <textarea 
                  name="comment"
                  value={newReview.comment}
                  onChange={handleReviewChange}
                  className={`w-full px-4 py-3 rounded-xl border ${reviewErrors.comment ? 'border-red-400' : 'border-tea-brown/10'} focus:outline-none focus:ring-2 focus:ring-tea-gold/50 bg-white min-h-[120px] resize-y`}
                  placeholder="Share your experience with this tea..."
                />
                {reviewErrors.comment && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{reviewErrors.comment}</p>}
              </div>
              <button 
                type="submit"
                disabled={isSubmittingReview}
                className="bg-tea-brown text-tea-cream px-8 py-3 rounded-xl font-bold hover:bg-tea-gold transition-colors shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmittingReview ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Related Products Section - 2x2 Grid Layout */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-tea-brown">
              Related <span className="text-tea-gold italic">Products</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {relatedProducts.slice(0, 4).map(p => (
              <div key={p.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-tea-brown/5 relative">
                <div 
                  className="relative h-48 md:h-56 overflow-hidden cursor-pointer"
                  onClick={() => onProductClick(p)}
                >
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 left-3 bg-tea-gold text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">{p.discount}</div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-serif font-bold text-tea-brown mb-2 line-clamp-1 cursor-pointer" onClick={() => onProductClick(p)}>{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-tea-brown">₹{p.price}</span>
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

      {/* Sticky Bottom Bar */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-tea-brown/10 p-3 md:p-4 shadow-[0_-10px_30px_rgba(74,44,42,0.1)]"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 md:px-8">
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-12 h-12 rounded-lg object-cover border border-tea-brown/10" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-tea-brown leading-none mb-1 hidden sm:block">{product.name}</h4>
                  <div className="flex items-center space-x-2">
                    <p className="text-xl font-bold text-tea-brown">₹{product.price}</p>
                    <p className="text-sm text-tea-brown/50 line-through">₹{product.originalPrice}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 flex-1 sm:flex-none justify-end">
                <button 
                  onClick={() => onBuyNow(product, quantity)}
                  className="w-full sm:w-auto px-8 bg-tea-gold text-tea-brown py-3 rounded-xl font-bold text-base flex items-center justify-center hover:bg-[#e6a835] transition-all shadow-lg active:scale-95"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
