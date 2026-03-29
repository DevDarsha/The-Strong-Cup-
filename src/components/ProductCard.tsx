import { ShoppingCart, Star, Zap, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import React, { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onProductClick, onBuyNow }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="glass overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 border border-tea-brown/5 flex flex-col h-full"
    >
      {/* Image Container */}
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer"
        onClick={() => onProductClick(product)}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        {/* Darken Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        
        {/* Hover Add to Cart Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center space-x-2 px-6 py-3 rounded-full font-bold shadow-2xl ${
              isAdded 
                ? 'bg-tea-green text-white scale-105' 
                : 'bg-white text-tea-brown hover:bg-tea-brown hover:text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={18} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.status && (
            <span className="bg-tea-brown text-tea-cream text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              {product.status}
            </span>
          )}
          <span className="bg-tea-gold text-tea-brown text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            {product.discount}
          </span>
        </div>

        {/* Urgency Tag */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
          <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl flex items-center justify-center space-x-2 shadow-xl">
            <Zap size={14} className="text-red-500 fill-current animate-pulse" />
            <span className="text-[10px] font-bold text-tea-brown uppercase tracking-wider">Selling Fast! Only 10 left</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="text-base font-serif font-bold text-tea-brown group-hover:text-tea-gold transition-colors cursor-pointer line-clamp-1"
            onClick={() => onProductClick(product)}
          >
            {product.name}
          </h3>
          <div className="flex items-center text-tea-gold">
            <Star size={12} fill="currentColor" />
            <span className="text-[10px] font-bold ml-1">4.8</span>
          </div>
        </div>
        
        <p className="text-tea-brown/50 text-[11px] mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-tea-brown">₹{product.price}</span>
              <span className="text-xs text-tea-brown/40 line-through">₹{product.originalPrice}</span>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`p-2 rounded-xl transition-all active:scale-90 ${
                isAdded 
                  ? 'bg-tea-green text-white' 
                  : 'bg-tea-brown/5 text-tea-brown hover:bg-tea-brown hover:text-tea-cream'
              }`}
            >
              {isAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
            </button>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow(product);
            }}
            className="w-full bg-tea-gold text-tea-brown py-2.5 rounded-xl font-medium text-sm shadow-lg hover:bg-tea-brown hover:text-tea-cream transition-all active:scale-95 flex items-center justify-center group/btn"
          >
            Buy Now
            <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
