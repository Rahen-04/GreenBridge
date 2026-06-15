import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { cartApi, ordersApi } from '@/lib/api';
import { useUser, syncCartCount } from '@/contexts/UserContext';

export default function Cart() {
  const { isLoggedIn, updateCartCount } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await cartApi.get();
      return data;
    },
    enabled: isLoggedIn,
  });

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      await cartApi.update(id, newQuantity);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      await syncCartCount(updateCartCount);
    } catch {
      toast({ title: 'Error', description: 'Failed to update quantity.', variant: 'destructive' });
    }
  };

  const removeItem = async (id: string) => {
    try {
      await cartApi.remove(id);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      await syncCartCount(updateCartCount);
      toast({ title: 'Item removed', description: 'The item has been removed from your cart.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to remove item.', variant: 'destructive' });
    }
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'fresh10') {
      setCouponApplied(true);
      toast({ title: 'Coupon applied', description: '10% discount will be applied at checkout.' });
    } else {
      toast({ title: 'Invalid coupon', description: 'Please enter a valid coupon code.', variant: 'destructive' });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 25 ? 0 : 4.99;
  const total = subtotal - discount + shipping;

  const proceedToCheckout = async () => {
    setIsCheckingOut(true);
    try {
      await ordersApi.checkout({ couponCode: couponApplied ? 'fresh10' : undefined });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      await syncCartCount(updateCartCount);
      toast({ title: 'Order placed', description: 'Your order has been placed successfully!' });
      navigate('/account');
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Checkout failed';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
        <p className="text-gray-600 mb-8">Please sign in to view your cart.</p>
        <Button asChild className="bg-nature-600 hover:bg-nature-700">
          <Link to="/account">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {isLoading ? (
        <p className="text-center text-gray-500 py-12">Loading cart...</p>
      ) : cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Your Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</h2>
                  <Link to="/products" className="text-sm text-nature-600 hover:underline">Continue Shopping</Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row p-6 gap-4">
                    <div className="w-full sm:w-24 h-24 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{item.name}</h3>
                        <button className="text-gray-400 hover:text-red-500" onClick={() => removeItem(item.id)}>
                          <X size={18} />
                        </button>
                      </div>
                      <p className="text-nature-600 font-medium mb-4">₹{item.price.toFixed(2)}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border rounded-md">
                          <button className="p-2 hover:bg-gray-50" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                            <Minus size={16} />
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          <button className="p-2 hover:bg-gray-50" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus size={16} />
                          </button>
                        </div>
                        <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Have a Coupon?</h2>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nature-500"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button className="rounded-l-none bg-nature-600 hover:bg-nature-700" onClick={applyCoupon} disabled={!couponCode}>
                  Apply
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Try "FRESH10" for 10% off</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span><span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span><span className="text-xl">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-nature-600 hover:bg-nature-700 mb-4" onClick={proceedToCheckout} disabled={isCheckingOut}>
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Truck size={18} className="mr-2 text-nature-600" />
                  <span>Free shipping on orders over ₹25</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ShieldCheck size={18} className="mr-2 text-nature-600" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Browse products and add items to your cart.</p>
          <Link to="/products">
            <Button className="bg-nature-600 hover:bg-nature-700">Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
