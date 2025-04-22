import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Mail, Phone } from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  stock: number;
}

interface FarmerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farmer: {
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
  };
}

export default function FarmerDetailsDialog({
  open,
  onOpenChange,
  farmer,
}: FarmerDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Farmer Details</DialogTitle>
        </DialogHeader>
        
        {/* Farmer Profile Header */}
        <div className="flex items-start gap-6 mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={farmer.image} alt={farmer.name} />
            <AvatarFallback>{farmer.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold">{farmer.name}</h2>
              {farmer.isVerified && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Verified Farmer
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-gray-600 mb-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{farmer.location}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                <span>{farmer.rating}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {farmer.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>
            <p className="text-gray-600 mb-4">{farmer.description}</p>
            <div className="flex gap-4">
              <a
                href={`mailto:${farmer.email}`}
                className="flex items-center text-gray-600 hover:text-green-600"
              >
                <Mail className="h-4 w-4 mr-2" />
                {farmer.email}
              </a>
              <a
                href={`tel:${farmer.phone}`}
                className="flex items-center text-gray-600 hover:text-green-600"
              >
                <Phone className="h-4 w-4 mr-2" />
                {farmer.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Tabs for Products and Reviews */}
        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {farmer.products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  image={product.image}
                  category={product.category}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {farmer.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">{review.userName}</div>
                        <div className="text-sm text-gray-500">{review.date}</div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 