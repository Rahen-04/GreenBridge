import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Mail, Phone } from 'lucide-react';
import FarmerDetailsDialog from "@/components/farmer/FarmerDetailsDialog";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  stock: number;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Farmer {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  specialties: string[];
  description: string;
  email: string;
  phone: string;
  isVerified: boolean;
  products: Product[];
  reviews: Review[];
}

// Sample farmers data with products and reviews
const farmers: Farmer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    image: '/farmers/farmer1.jpg',
    location: 'Green Fields Farm, Maharashtra',
    rating: 4.8,
    specialties: ['Organic Vegetables', 'Fruits'],
    description: 'Passionate about sustainable farming practices...',
    email: 'rajesh.kumar@farmfresh.com',
    phone: '(555) 123-4567',
    isVerified: true,
    products: [
      {
        id: 'p1',
        name: 'Fresh Tomatoes',
        description: 'Organic vine-ripened tomatoes',
        image: '/products/tomatoes.jpg',
        category: 'Vegetables',
        price: 3.99,
        stock: 100
      }
    ],
    reviews: [
      {
        id: 'r1',
        userName: 'Alice Brown',
        rating: 5,
        comment: 'Excellent produce, always fresh!',
        date: '2024-03-15'
      }
    ]
  },
  {
    id: '2',
    name: 'Priya Sharma',
    image: '/farmers/farmer2.jpg',
    location: 'Sunny Valley Farm, Punjab',
    rating: 4.6,
    specialties: ['Dairy', 'Free-range Eggs'],
    description: 'Family-owned dairy farm since 1985...',
    email: 'priya.sharma@farmfresh.com',
    phone: '(555) 234-5678',
    isVerified: true,
    products: [
      {
        id: 'p2',
        name: 'Fresh Milk',
        description: 'Organic whole milk',
        image: '/products/milk.jpg',
        category: 'Dairy',
        price: 4.99,
        stock: 50
      }
    ],
    reviews: [
      {
        id: 'r2',
        userName: 'Bob Wilson',
        rating: 4,
        comment: 'Great dairy products!',
        date: '2024-03-14'
      }
    ]
  },
  {
    id: '3',
    name: 'Arjun Reddy',
    image: '/farmers/farmer3.jpg',
    location: 'Heritage Fields, Karnataka',
    rating: 4.9,
    specialties: ['Heritage Grains', 'Honey'],
    description: 'Specializing in heritage grain varieties...',
    email: 'arjun.reddy@farmfresh.com',
    phone: '(555) 345-6789',
    isVerified: false,
    products: [
      {
        id: 'p3',
        name: 'Raw Honey',
        description: 'Pure, unfiltered honey',
        image: '/products/honey.jpg',
        category: 'Honey',
        price: 8.99,
        stock: 30
      }
    ],
    reviews: [
      {
        id: 'r3',
        userName: 'Carol Davis',
        rating: 5,
        comment: 'The honey is amazing!',
        date: '2024-03-13'
      }
    ]
  },
  {
    id: '4',
    name: 'Anjali Malhotra',
    image: 'https://images.unsplash.com/photo-1618512496248-a07b0ff2ff6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Riverside Farm, Gujarat',
    rating: 4.6,
    specialties: ['Root Vegetables', 'Leafy Greens'],
    description: 'Urban farmer focused on year-round production of nutritious vegetables. Practices regenerative agriculture to improve soil health.',
    email: 'anjali@farmfresh.com',
    phone: '(555) 456-7890',
    isVerified: true,
    products: [
      {
        id: 'p4',
        name: 'Fresh Carrots',
        description: 'Organic carrots grown using regenerative practices',
        image: '/products/carrots.jpg',
        category: 'Vegetables',
        price: 2.99,
        stock: 200
      },
      {
        id: 'p5',
        name: 'Spinach',
        description: 'Fresh, locally grown spinach',
        image: '/products/spinach.jpg',
        category: 'Vegetables',
        price: 3.49,
        stock: 150
      }
    ],
    reviews: [
      {
        id: 'r4',
        userName: 'David Chen',
        rating: 5,
        comment: 'The vegetables are always fresh and delicious!',
        date: '2024-03-12'
      }
    ]
  },
  {
    id: '5',
    name: 'Suresh Patel',
    image: 'https://images.unsplash.com/photo-1591812922923-19c1ab7add68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Pleasant Valley Farm, Rajasthan',
    rating: 4.9,
    specialties: ['Mushrooms', 'Specialty Herbs'],
    description: 'Specialty grower of gourmet mushrooms and culinary herbs. Using innovative indoor growing techniques for year-round harvests.',
    email: 'suresh@farmfresh.com',
    phone: '(555) 567-8901',
    isVerified: true,
    products: [
      {
        id: 'p6',
        name: 'Shiitake Mushrooms',
        description: 'Fresh gourmet shiitake mushrooms',
        image: '/products/mushrooms.jpg',
        category: 'Mushrooms',
        price: 6.99,
        stock: 80
      },
      {
        id: 'p7',
        name: 'Fresh Basil',
        description: 'Aromatic fresh basil',
        image: '/products/basil.jpg',
        category: 'Herbs',
        price: 2.99,
        stock: 100
      }
    ],
    reviews: [
      {
        id: 'r5',
        userName: 'Emily Wong',
        rating: 5,
        comment: 'Best mushrooms in the area!',
        date: '2024-03-10'
      }
    ]
  },
  {
    id: '6',
    name: 'Meena Iyer',
    image: 'https://images.unsplash.com/photo-1620662736427-b8a198f52a4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Golden Orchards, Tamil Nadu',
    rating: 4.8,
    specialties: ['Apples', 'Pears', 'Small Batch Preserves'],
    description: 'Orchardist specializing in heritage apple and pear varieties. Creates artisanal preserves and apple cider from farm harvests.',
    email: 'meena@farmfresh.com',
    phone: '(555) 678-9012',
    isVerified: true,
    products: [
      {
        id: 'p8',
        name: 'Heritage Apples',
        description: 'Mixed variety of heritage apples',
        image: '/products/apples.jpg',
        category: 'Fruits',
        price: 4.99,
        stock: 150
      },
      {
        id: 'p9',
        name: 'Apple Cider',
        description: 'Fresh pressed apple cider',
        image: '/products/cider.jpg',
        category: 'Beverages',
        price: 7.99,
        stock: 50
      }
    ],
    reviews: [
      {
        id: 'r6',
        userName: 'Michael Lee',
        rating: 5,
        comment: 'The apple cider is incredible!',
        date: '2024-03-08'
      }
    ]
  }
];

export default function Farmers() {
  const [selectedFarmer, setSelectedFarmer] = useState<typeof farmers[0] | null>(null);

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
                <Card 
                  key={farmer.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-up cursor-pointer" 
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                  onClick={() => setSelectedFarmer(farmer)}
                >
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
                    
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{farmer.name}</h3>
                      {farmer.isVerified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mb-4 flex flex-wrap gap-2">
                      {farmer.specialties.map((specialty, i) => (
                        <span key={i} className="text-xs bg-nature-100 text-nature-600 rounded-full px-2 py-1">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-gray-600 mb-6 text-sm line-clamp-3">{farmer.description}</p>
                    
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
                <div className="md:w-1/2 p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-4">Join Our Network of Farmers</h2>
                  <p className="text-gray-600 mb-6">
                    Are you a farmer committed to sustainable practices? Join our network and reach customers who value quality produce and sustainable farming.
                  </p>
                  <Button className="bg-nature-600 hover:bg-nature-700 text-white">
                    Apply Now
                  </Button>
                </div>
                <div className="md:w-1/2 bg-nature-100">
                  <img
                    src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Farmer in field"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Farmer Details Dialog */}
      {selectedFarmer && (
        <FarmerDetailsDialog
          open={!!selectedFarmer}
          onOpenChange={(open) => !open && setSelectedFarmer(null)}
          farmer={selectedFarmer}
        />
      )}
    </div>
  );
}

