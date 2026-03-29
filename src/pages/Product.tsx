import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import ProductDetail from '../components/ProductDetail';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

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

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h2 className="text-2xl font-bold text-tea-brown">Product not found</h2>
        <button 
          onClick={() => navigate('/shop')}
          className="mt-4 bg-tea-brown text-tea-cream px-6 py-2 rounded-full"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ProductDetail 
        product={product} 
        onAddToCart={addToCart}
        onBack={() => navigate(-1)}
        onBuyNow={(p, q) => {
          addToCart(p, q);
          navigate('/checkout');
        }}
        relatedProducts={PRODUCTS.filter(p => p.id !== product.id)}
        onProductClick={(p) => navigate(`/product/${p.id}`)}
      />
    </motion.div>
  );
};

export default ProductPage;
