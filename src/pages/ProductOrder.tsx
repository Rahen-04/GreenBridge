import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, Clock, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FarmerListing {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  distance: string;
  quantity: number;
  price: number;
  estimatedDelivery: string;
  harvestDate: string;
  organic: boolean;
}

interface ProductOrderState {
  productName: string;
  productImage: string;
  productDescription: string;
}

// Mock data - In a real app, this would come from your backend
const mockFarmerListings: FarmerListing[] = [
  {
    id: "1",
    name: "Arun Patel",
    avatar: "/avatars/farmer1.jpg",
    rating: 4.8,
    distance: "5.2 miles",
    quantity: 50,
    price: 3.99,
    estimatedDelivery: "2-3 days",
    harvestDate: "March 25, 2024",
    organic: true
  },
  {
    id: "2",
    name: "Priya Desai",
    avatar: "/avatars/farmer2.jpg",
    rating: 4.6,
    distance: "7.8 miles",
    quantity: 75,
    price: 3.49,
    estimatedDelivery: "3-4 days",
    harvestDate: "March 28, 2024",
    organic: true
  },
  {
    id: "3",
    name: "Vikram Singh",
    avatar: "/avatars/farmer3.jpg",
    rating: 4.9,
    distance: "4.1 miles",
    quantity: 30,
    price: 4.29,
    estimatedDelivery: "1-2 days",
    harvestDate: "March 23, 2024",
    organic: false
  }
];

export default function ProductOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { productName, productImage, productDescription } = location.state as ProductOrderState;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Header */}
      <div className="flex items-center gap-6 mb-8">
        <img 
          src={productImage} 
          alt={productName} 
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div>
          <h1 className="text-2xl font-bold mb-2">{productName}</h1>
          <p className="text-gray-600">{productDescription}</p>
        </div>
      </div>

      {/* Farmers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockFarmerListings.map((farmer) => (
          <Card key={farmer.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={farmer.avatar} />
                    <AvatarFallback>{farmer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{farmer.name}</CardTitle>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{farmer.rating}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{farmer.distance}</span>
                    </div>
                  </div>
                </div>
                {farmer.organic && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Organic
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Price</label>
                    <p className="font-semibold">${farmer.price.toFixed(2)} / unit</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Available Quantity</label>
                    <p className="font-semibold">{farmer.quantity} units</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-1 text-gray-500" />
                    <div>
                      <label className="text-sm text-gray-500 block">Harvest Date</label>
                      <p className="font-medium">{farmer.harvestDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Truck className="h-4 w-4 mt-1 text-gray-500" />
                    <div>
                      <label className="text-sm text-gray-500 block">Estimated Delivery</label>
                      <p className="font-medium">{farmer.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Quantity" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 10, 15, 20].map((qty) => (
                        <SelectItem key={qty} value={qty.toString()}>
                          {qty} {qty === 1 ? 'unit' : 'units'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button className="flex-1" onClick={() => navigate(`/checkout/${farmer.id}`)}>
                    Order Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 