import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Mail, Phone } from 'lucide-react';
import FarmerDetailsDialog from "@/components/farmer/FarmerDetailsDialog";
import { farmersApi, Farmer } from '@/lib/api';

export default function Farmers() {
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  const { data: farmers = [], isLoading } = useQuery({
    queryKey: ['farmers'],
    queryFn: async () => {
      const { data } = await farmersApi.list();
      return data;
    },
  });

  return (
    <>
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
              Get to know the passionate people behind your food. Our network of local farmers is committed to sustainable agriculture.
            </p>
          </div>
        </div>
      </div>

      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Partner Farmers</h2>
            <p className="text-gray-600">
              Each partner farmer is committed to quality, sustainable practices, and passion for agriculture.
            </p>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-500 py-12">Loading farmers...</p>
          ) : farmers.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No farmers registered yet. Sign up as a farmer to join our network.
            </p>
          ) : (
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

                    {farmer.specialties.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {farmer.specialties.map((specialty, i) => (
                          <span key={i} className="text-xs bg-nature-100 text-nature-600 rounded-full px-2 py-1">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-gray-600 mb-6 text-sm line-clamp-3">
                      {farmer.description || 'No description provided.'}
                    </p>

                    <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                      <a className="flex items-center text-sm text-gray-600 hover:text-nature-600" href={`mailto:${farmer.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        {farmer.email}
                      </a>
                      {farmer.phone && (
                        <a className="flex items-center text-sm text-gray-600 hover:text-nature-600" href={`tel:${farmer.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          {farmer.phone}
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-nature-50 py-16 px-6">
        <div className="container mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-4">Join Our Network of Farmers</h2>
                <p className="text-gray-600 mb-6">
                  Are you a farmer committed to sustainable practices? Create a farmer account and start listing your products.
                </p>
                <Button className="bg-nature-600 hover:bg-nature-700 text-white" asChild>
                  <Link to="/account">Apply Now</Link>
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

      {selectedFarmer && (
        <FarmerDetailsDialog
          open={!!selectedFarmer}
          onOpenChange={(open) => !open && setSelectedFarmer(null)}
          farmer={selectedFarmer}
        />
      )}
    </>
  );
}
