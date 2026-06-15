import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/ProductCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productsApi } from '@/lib/api';

export default function FeaturedProducts() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await productsApi.list({ featured: true });
      return data;
    },
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-nature-600 hover:text-nature-700 font-medium inline-flex items-center">
            View All
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No products yet. Farmers can add products from their account dashboard.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
