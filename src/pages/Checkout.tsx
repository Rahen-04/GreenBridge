import React, { useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { productsApi, ordersApi } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

interface CheckoutState {
  farmerId: string;
  quantity: number;
  productName: string;
}

export default function Checkout() {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, userData } = useUser();
  const state = location.state as CheckoutState | null;
  const [address, setAddress] = useState(userData?.address || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await productsApi.get(productId!);
      return data;
    },
    enabled: !!productId,
  });

  const farmerId = state?.farmerId || product?.farmerId;
  const quantity = state?.quantity || 1;
  const total = product ? product.price * quantity : 0;

  React.useEffect(() => {
    if (userData?.address && !address) {
      setAddress(userData.address);
    }
  }, [userData?.address, address]);

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">Please sign in to place an order.</p>
        <Button asChild><Link to="/account">Sign In</Link></Button>
      </div>
    );
  }

  if (!productId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">Invalid checkout session.</p>
        <Button asChild><Link to="/products">Browse Products</Link></Button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!farmerId) {
      toast({ title: 'Error', description: 'Unable to identify farmer for this order.', variant: 'destructive' });
      return;
    }
    if (!address.trim()) {
      toast({ title: 'Address required', description: 'Please enter your delivery address.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      await ordersApi.create({
        productId: productId!,
        farmerId,
        quantity,
        address: address.trim(),
      });
      toast({ title: 'Order placed', description: 'Your order has been submitted to the farmer.' });
      navigate('/account');
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to place order';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : product ? (
        <Card>
          <CardHeader>
            <CardTitle>{state.productName || product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Price per unit</span>
              <span>₹{product.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-4">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <div>
              <label className="text-sm font-medium">Delivery Address</label>
              <Input
                className="mt-1"
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <Button className="w-full bg-nature-600 hover:bg-nature-700" onClick={handlePlaceOrder} disabled={isSubmitting}>
              {isSubmitting ? 'Placing order...' : 'Place Order'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <p className="text-gray-500">Product not found.</p>
      )}
    </div>
  );
}
