
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Sample cart data
const initialCartItems = [
  {
    id: '1',
    name: 'Fresh Organic Strawberries',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    quantity: 1,
  },
  {
    id: '3',
    name: 'Ripe Avocado Set',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    quantity: 2,
  },
  {
    id: '5',
    name: 'Organic Carrots',
    price: 3.29,
    image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    quantity: 1,
  }
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart."
    });
  };
  
  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'fresh10') {
      setCouponApplied(true);
      toast({
        title: "Coupon applied",
        description: "10% discount has been applied to your order."
      });
    } else {
      toast({
        title: "Invalid coupon",
        description: "Please enter a valid coupon code.",
        variant: "destructive"
      });
    }
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 25 ? 0 : 4.99;
  const total = subtotal - discount + shipping;
  
  const proceedToCheckout = () => {
    toast({
      title: "Order processed",
      description: "Your order has been placed successfully!"
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
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
                      <div key={item.id} className="flex flex-col sm:flex-row p-6 gap-4 animate-fade-up">
                        {/* Product Image */}
                        <div className="w-full sm:w-24 h-24 flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-grow">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium">{item.name}</h3>
                            <button 
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              onClick={() => removeItem(item.id)}
                              aria-label="Remove item"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          <p className="text-nature-600 font-medium mb-4">${item.price.toFixed(2)}</p>
                          
                          <div className="flex justify-between items-center">
                            {/* Quantity Controls */}
                            <div className="flex items-center border rounded-md">
                              <button 
                                className="p-2 hover:bg-gray-50"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4">{item.quantity}</span>
                              <button 
                                className="p-2 hover:bg-gray-50"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            
                            {/* Item Total */}
                            <div className="text-right">
                              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Coupon Code */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">Have a Coupon?</h2>
                  <div className="flex">
                    <input 
                      type="text" 
                      className="flex-grow rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent" 
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button 
                      className="rounded-l-none bg-nature-600 hover:bg-nature-700"
                      onClick={applyCoupon}
                      disabled={!couponCode}
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Try "FRESH10" for 10% off your order</p>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {couponApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (10%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-xl">${total.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-nature-600 hover:bg-nature-700 mb-4"
                    onClick={proceedToCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Truck size={18} className="mr-2 text-nature-600" />
                      <span>Free shipping on orders over $25</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ShieldCheck size={18} className="mr-2 text-nature-600" />
                      <span>100% Money-Back Guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gray-100 rounded-full">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
              <Link to="/products">
                <Button className="bg-nature-600 hover:bg-nature-700">
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}
          
          {/* Featured Products */}
          {cartItems.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    id: '2',
                    name: 'Green Lettuce Pack',
                    price: 3.99,
                    image: 'https://images.unsplash.com/photo-1622205313162-be1d5712a43f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    id: '4',
                    name: 'Fresh Tomatoes',
                    price: 4.49,
                    image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    id: '8',
                    name: 'Green Apples',
                    price: 3.99,
                    image: 'https://images.unsplash.com/photo-1591735179859-a049994205de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    id: '10',
                    name: 'Organic Bananas',
                    price: 2.49,
                    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                  },
                ].map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 animate-fade-up">
                    <div className="aspect-square">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2">{product.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-nature-600 font-semibold">${product.price.toFixed(2)}</span>
                        <Button 
                          size="sm"
                          className="bg-nature-600 hover:bg-nature-700"
                          onClick={() => {
                            setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
                            toast({
                              title: "Item added",
                              description: `${product.name} has been added to your cart.`
                            });
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
