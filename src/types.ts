export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  description: string;
  features: string[];
  category: string;
  status?: 'Bestseller' | 'Limited Stock' | 'Trending' | 'New Arrival' | 'Premium';
  shortBenefit?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
