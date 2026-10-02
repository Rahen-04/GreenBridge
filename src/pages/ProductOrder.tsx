import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Clock, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productsApi } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';

interface ProductOrderState {
  productId: string;
  productName: string;
  productImage: string;
  productDescription: string;
}

export default function ProductOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useUser();
  const state = location.state as ProductOrderState | null;
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const productId = state?.productId || searchParams.get('productId') || '';

  const { data: fetchedProduct } = useQuery({
    queryKey: ['product-details', productId],
    queryFn: async () => {
      if (!productId) return null;
      const { data } = await productsApi.get(productId);
      return data;
    },
    enabled: !!productId && !state?.productName,
  });

  const productName = state?.productName || fetchedProduct?.name || 'Product';
  const productImage = state?.productImage || fetchedProduct?.image || '/placeholder.svg';
  const productDescription = state?.productDescription || fetchedProduct?.description || '';

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings', productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data } = await productsApi.listings(productId);
      return data;
    },
    enabled: !!productId,
  });

  if (!productId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">No product selected.</p>
        <Button asChild><Link to="/products">Browse Products</Link></Button>
      </div>
    );
  }

  const handleOrder = (farmerId: string, listingProductId: string) => {
    if (!isLoggedIn) {
      navigate('/account');
      return;
    }
    const qty = quantities[farmerId] || '1';
    navigate(`/checkout/${listingProductId}`, {
      state: { farmerId, quantity: Number(qty), productName },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-6 mb-8">
        <img src={productImage} alt={productName} className="w-24 h-24 object-cover rounded-lg" />
        <div>
          <h1 className="text-2xl font-bold mb-2">{productName}</h1>
          <p className="text-gray-600">{productDescription}</p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500 py-8">Loading farmer listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No farmers currently offer this product.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((farmer) => (
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
                        <span className="text-sm text-gray-600">{farmer.location}</span>
                      </div>
                    </div>
                  </div>
                  {farmer.organic && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Organic</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Price</label>
                      <p className="font-semibold">₹{farmer.price.toFixed(2)} / unit</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Available</label>
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
                        <label className="text-sm text-gray-500 block">Delivery</label>
                        <p className="font-medium">{farmer.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <Select
                      value={quantities[farmer.id] || '1'}
                      onValueChange={(val) => setQuantities({ ...quantities, [farmer.id]: val })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Quantity" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 10, 15, 20].filter((q) => q <= farmer.quantity).map((qty) => (
                          <SelectItem key={qty} value={qty.toString()}>
                            {qty} {qty === 1 ? 'unit' : 'units'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button className="flex-1" onClick={() => handleOrder(farmer.id, farmer.productId)}>
                      Order Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
