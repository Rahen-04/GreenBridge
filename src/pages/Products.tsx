import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProductCard from '@/components/ProductCard';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';




// Sample product data - extended from featured products
const allProducts = [
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
  },
  {
    id: '5',
    name: 'Yellow Corn',
    description: 'Fresh sweet corn available in bulk quantities for wholesale.',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Grains',
    isOrganic: false,
    minQuantity: '50 kg'
  },
  {
    id: '6',
    name: 'Green Lentils',
    description: 'Nutritious green lentils perfect for bulk purchases.',
    image: 'https://images.unsplash.com/photo-1615485500710-aa71300612aa?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Legumes',
    isOrganic: true,
    minQuantity: '20 kg'
  },
  {
    id: '7',
    name: 'Black Peppercorns',
    description: 'Premium quality black peppercorns for bulk orders.',
    image: 'https://plus.unsplash.com/premium_photo-1725878606509-65c1ff545b74?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmxhY2slMjBwZXBwZXIlMjBjb3JufGVufDB8fDB8fHww',
    category: 'Spices',
    isOrganic: false,
    minQuantity: '5 kg'
  },
  {
    id: '8',
    name: 'Brown Rice',
    description: 'Wholesome brown rice available for bulk purchase.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Grains',
    isOrganic: true,
    minQuantity: '25 kg'
  },
  {
    id: '9',
    name: 'Green Cardamom',
    description: 'Aromatic green cardamom pods for wholesale buyers.',
    image: 'https://images.unsplash.com/photo-1701166627787-12d9fdd437cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JlZW4lMjBjYXJkYW1vbXxlbnwwfHwwfHx8MA%3D%3D',
    category: 'Spices',
    isOrganic: true,
    minQuantity: '2 kg'
  },
  {
    id: '10',
    name: 'Red Lentils',
    description: 'High-quality red lentils available in bulk quantities.',
    image: 'https://media.istockphoto.com/id/2046071993/photo/green-red-lentil-background-image.webp?a=1&b=1&s=612x612&w=0&k=20&c=graTfV0u47kGLvlFGcJExW_lF9FJlJ2gimm3XrS6mrs=',
    category: 'Legumes',
    isOrganic: true,
    minQuantity: '20 kg'
  }
];

export default function Products() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [organicOnly, setOrganicOnly] = useState(false);

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = !category || product.category === category;
    const matchesOrganic = !organicOnly || product.isOrganic;
    
    return matchesCategory && matchesOrganic;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">All Products</h1>
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
            {/* Filters Sidebar */}
            <div className={`lg:w-1/4 ${filterOpen ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <SlidersHorizontal size={20} className="text-gray-500" />
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Category</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start ${!category ? 'text-nature-600 font-medium' : ''}`}
                        onClick={() => setCategory(null)}
                      >
                        All Categories
                      </Button>
                    </div>
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start ${category === 'Grains' ? 'text-nature-600 font-medium' : ''}`}
                        onClick={() => setCategory('Grains')}
                      >
                        Grains
                      </Button>
                    </div>
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start ${category === 'Legumes' ? 'text-nature-600 font-medium' : ''}`}
                        onClick={() => setCategory('Legumes')}
                      >
                        Legumes
                      </Button>
                    </div>
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start ${category === 'Spices' ? 'text-nature-600 font-medium' : ''}`}
                        onClick={() => setCategory('Spices')}
                      >
                        Spices
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Organic Filter */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Product Type</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="organic"
                      checked={organicOnly}
                      onCheckedChange={(checked) => setOrganicOnly(checked as boolean)}
                    />
                    <label
                      htmlFor="organic"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Organic Only
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  <span className="font-medium">{filteredProducts.length}</span> products
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <button className="flex items-center text-sm font-medium">
                    Category
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No products match your current filters</p>
                  <Button onClick={() => {
                    setCategory(null);
                    setOrganicOnly(false);
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
