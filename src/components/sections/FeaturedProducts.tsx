import React from 'react';
import ProductCard from '@/components/ProductCard';
import { ArrowRight } from 'lucide-react';

// Sample featured products data
const featuredProducts = [
  {
    id: '1',
    name: 'Premium Wheat Grain',
    description: 'High-quality wheat grain suitable for flour production and bulk purchases.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Grains',
    isOrganic: true,
    minQuantity: '50 kg'
  },
  {
    id: '2',
    name: 'Basmati Rice',
    description: 'Premium long-grain basmati rice, perfect for bulk orders and wholesale.',
    image: 'https://images.unsplash.com/photo-1627482265910-5c0ff6bee088?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Grains',
    isOrganic: true,
    minQuantity: '25 kg'
  },
  {
    id: '3',
    name: 'Red Chilli ',
    description: 'Fresh red chillies, ideal for bulk purchases and processing.',
    image: 'https://images.unsplash.com/photo-1526346698789-22fd84314424?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Spices',
    isOrganic: true,
    minQuantity: '10 kg'
  },
  {
    id: '4',
    name: 'Organic Soybeans',
    description: 'High-protein soybeans, perfect for bulk orders and processing.',
    image: 'https://plus.unsplash.com/premium_photo-1661917261139-5ae376c32c47?q=80&w=1944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Legumes',
    isOrganic: true,
    minQuantity: '25 kg'
  }
];

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <a href="/products" className="text-nature-600 hover:text-nature-700 font-medium inline-flex items-center">
            View All
            <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
