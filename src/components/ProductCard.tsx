import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { cartApi } from '@/lib/api';
import { syncCartCount } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  minQuantity?: string;
  price?: number;
}

export default function ProductCard({ id, name, description, image, category, minQuantity, price }: ProductCardProps) {
  const navigate = useNavigate();
  const { isLoggedIn, userType, updateCartCount } = useUser();

  const handleOrderClick = () => {
    navigate('/product-order', {
      state: { productId: id, productName: name, productImage: image, productDescription: description },
    });
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn || userType !== 'consumer') {
      toast({ title: 'Sign in required', description: 'Please sign in as a consumer to add items to cart.', variant: 'destructive' });
      navigate('/account');
      return;
    }
    try {
      await cartApi.add(id, 1);
      await syncCartCount(updateCartCount);
      toast({ title: 'Added to cart', description: `${name} has been added to your cart.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to add to cart.', variant: 'destructive' });
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative overflow-hidden">
        <img src={image} alt={name} className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" />
        <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          {category}
        </span>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        {minQuantity && <p className="text-sm text-gray-500 mt-2">Minimum order: {minQuantity}</p>}
        {price != null && <p className="text-nature-600 font-semibold mt-2">₹{price.toFixed(2)}</p>}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Button className="flex-1" onClick={handleOrderClick}>
          Order Now
        </Button>
      </CardFooter>
    </Card>
  );
}
