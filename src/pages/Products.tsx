import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { productsApi } from '@/lib/api';

export default function Products() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [organicOnly, setOrganicOnly] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await productsApi.categories();
      return data;
    },
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', category, organicOnly, search],
    queryFn: async () => {
      const { data } = await productsApi.list({
        category: category || undefined,
        organic: organicOnly || undefined,
        search: search || undefined,
      });
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {search ? `Results for "${search}"` : 'All Products'}
        </h1>
        <Button
          variant="outline"
          className="lg:hidden"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className={`lg:w-1/4 ${filterOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <SlidersHorizontal size={20} className="text-gray-500" />
            </div>

            <div className="mb-8">
              <h4 className="font-medium mb-4">Category</h4>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${!category ? 'text-nature-600 font-medium' : ''}`}
                  onClick={() => setCategory(null)}
                >
                  All Categories
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant="ghost"
                    className={`w-full justify-start ${category === cat ? 'text-nature-600 font-medium' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-medium mb-4">Product Type</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="organic"
                  checked={organicOnly}
                  onCheckedChange={(checked) => setOrganicOnly(checked as boolean)}
                />
                <label htmlFor="organic" className="text-sm font-medium leading-none">
                  Organic Only
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              <span className="font-medium">{products.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <button className="flex items-center text-sm font-medium">
                Newest
                <ChevronDown size={16} className="ml-1" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-500 py-12">Loading products...</p>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products found</p>
              <Button onClick={() => { setCategory(null); setOrganicOnly(false); }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
