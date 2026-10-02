import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-nature-50/50 to-transparent z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="max-w-xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-nature-100 text-nature-600 rounded-full text-sm font-medium mr-2">
                Buy Fresh
              </span>
              <span className="inline-block px-3 py-1 bg-nature-100 text-nature-600 rounded-full text-sm font-medium">
                Buy Fair
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance">
              <span className="block">From Farm to Table,</span>
              <span className="text-nature-600">Fresh and Sustainable</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              GreenBridge helps farmers secure buyers in advance of harvest time, reduce post-harvest losses, and promote fair pricing by eliminating middlemen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/products" 
                className="inline-flex items-center justify-center bg-nature-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-nature-700 transition-colors"
              >
                Shop now
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="lg:pl-10 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1594056113573-f8faae5ac78e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Fresh vegetables and fruits" 
                  className="w-full h-full object-cover"
                />
              </div>
            
              <div className="absolute -top-6 -right-6 p-4 bg-white rounded-lg shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-nature-100 rounded-full flex items-center justify-center">
                    <span className="text-nature-600 text-xl font-bold">100%</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Quality Guarantee</p>
                    <p className="text-sm font-medium">Organic & Fresh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
