import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  minQuantity?: string;
}

export default function ProductCard({ id, name, description, image, category, minQuantity }: ProductCardProps) {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    navigate('/product-order', {
      state: {
        productName: name,
        productImage: image,
        productDescription: description
      }
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          {category}
        </span>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        {minQuantity && (
          <p className="text-sm text-gray-500 mt-2">Minimum order: {minQuantity}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleOrderClick}>
          Order Now
        </Button>
      </CardFooter>
    </Card>
  );
} 