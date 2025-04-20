
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Mail, Phone } from 'lucide-react';

// Sample farmers data
const farmers = [
  {
    id: '1',
    name: 'John Mitchell',
    image: 'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Oakville, CA',
    rating: 4.8,
    specialties: ['Organic Vegetables', 'Heirloom Tomatoes'],
    description: 'Third-generation farmer with 25 years of experience in organic farming practices. Specialized in heirloom vegetables and sustainable farming methods.',
    email: 'john@farmfresh.com',
    phone: '(555) 123-4567',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Green Valley, CA',
    rating: 4.9,
    specialties: ['Berries', 'Stone Fruits'],
    description: 'Passionate fruit farmer dedicated to growing the sweetest berries and stone fruits. Using integrated pest management to minimize chemical use.',
    email: 'sarah@farmfresh.com',
    phone: '(555) 234-5678',
  },
  {
    id: '3',
    name: 'Miguel Rodriguez',
    image: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Sunnyvale, CA',
    rating: 4.7,
    specialties: ['Citrus', 'Avocados'],
    description: 'Family-owned citrus grove operating for over 40 years. Specializing in various citrus varieties and avocados grown with sustainable practices.',
    email: 'miguel@farmfresh.com',
    phone: '(555) 345-6789',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    image: 'https://images.unsplash.com/photo-1618512496248-a07b0ff2ff6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Riverside, CA',
    rating: 4.6,
    specialties: ['Root Vegetables', 'Leafy Greens'],
    description: 'Urban farmer focused on year-round production of nutritious vegetables. Practices regenerative agriculture to improve soil health.',
    email: 'emma@farmfresh.com',
    phone: '(555) 456-7890',
  },
  {
    id: '5',
    name: 'David Chen',
    image: 'https://images.unsplash.com/photo-1591812922923-19c1ab7add68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Pleasant Hills, CA',
    rating: 4.9,
    specialties: ['Mushrooms', 'Specialty Herbs'],
    description: 'Specialty grower of gourmet mushrooms and culinary herbs. Using innovative indoor growing techniques for year-round harvests.',
    email: 'david@farmfresh.com',
    phone: '(555) 567-8901',
  },
  {
    id: '6',
    name: 'Maria Garcia',
    image: 'https://images.unsplash.com/photo-1620662736427-b8a198f52a4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Santa Rosa, CA',
    rating: 4.8,
    specialties: ['Apples', 'Pears', 'Small Batch Preserves'],
    description: 'Orchardist specializing in heritage apple and pear varieties. Creates artisanal preserves and apple cider from farm harvests.',
    email: 'maria@farmfresh.com',
    phone: '(555) 678-9012',
  }
];

export default function Farmers() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <div className="relative bg-nature-600 text-white py-16 md:py-24">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80" 
              alt="Farmers field background" 
              className="object-cover w-full h-full"
            />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Meet Our Local Farmers</h1>
              <p className="text-lg md:text-xl mb-8">
                Get to know the passionate people behind your food. Our network of local farmers is committed to sustainable agriculture and bringing you the freshest produce possible.
              </p>
              <Button className="bg-white text-nature-600 hover:bg-gray-100">
                Join Our Network
              </Button>
            </div>
          </div>
        </div>

        {/* Farmer Profiles */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Featured Farmers</h2>
              <p className="text-gray-600">
                Each of our partner farmers has been carefully selected for their commitment to quality, sustainable practices, and passion for agriculture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {farmers.map((farmer, index) => (
                <Card key={farmer.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-up" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
                  <div className="relative aspect-[4/3]">
                    <img 
                      src={farmer.image} 
                      alt={farmer.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center text-sm font-medium">
                      <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                      {farmer.rating}
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">{farmer.location}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{farmer.name}</h3>
                    
                    <div className="mb-4 flex flex-wrap gap-2">
                      {farmer.specialties.map((specialty, i) => (
                        <span key={i} className="text-xs bg-nature-100 text-nature-600 rounded-full px-2 py-1">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-gray-600 mb-6 text-sm">{farmer.description}</p>
                    
                    <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                      <a className="flex items-center text-sm text-gray-600 hover:text-nature-600 transition-colors" href={`mailto:${farmer.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        {farmer.email}
                      </a>
                      <a className="flex items-center text-sm text-gray-600 hover:text-nature-600 transition-colors" href={`tel:${farmer.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        {farmer.phone}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Become a Farmer CTA */}
        <section className="bg-nature-50 py-16 px-6">
          <div className="container mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Farmer with harvest" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold mb-4">Join Our Farmer Network</h2>
                  <p className="text-gray-600 mb-8">
                    Are you a local farmer committed to sustainable practices? Partner with us to reach more customers and grow your business while being part of a community that values quality and sustainability.
                  </p>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-nature-100 rounded-full mr-4">
                        <svg className="h-5 w-5 text-nature-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm">Direct access to local customers passionate about fresh produce</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-nature-100 rounded-full mr-4">
                        <svg className="h-5 w-5 text-nature-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm">Fair pricing and transparent business model</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-nature-100 rounded-full mr-4">
                        <svg className="h-5 w-5 text-nature-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm">Marketing support and digital presence for your farm</p>
                    </div>
                  </div>
                  <Button className="mt-8 bg-nature-600 hover:bg-nature-700 text-white">
                    Apply to Become a Partner
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
