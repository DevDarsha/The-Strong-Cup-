import React from 'react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';
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

const Shop: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-tea-brown mb-4">
            Our <span className="text-tea-gold italic">Collection</span>
          </h1>
          <p className="text-tea-brown/50 max-w-2xl mx-auto text-base">
            Explore our range of premium Assam tea, crafted for strength and purity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </div>
    </motion.div>
  );
};

export default Shop;
