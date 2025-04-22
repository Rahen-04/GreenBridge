import React from 'react';
import { Star, Package, ShoppingBag, TrendingUp, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import MyProducts from '@/components/farmer/MyProducts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, User, MapPin, DollarSign } from 'lucide-react';

interface OrderStatus {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  status: 'pending' | 'accepted' | 'processing' | 'ready' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  amount: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

interface FarmerProfileProps {
  onLogout: () => void;
}

// Mock data - In a real app, this would come from your backend
const mockOrders: OrderStatus[] = [
  {
    id: 'ORD-001',
    customerName: 'Arjun Patel',
    customerEmail: 'arjun@example.com',
    customerAddress: '123 Main St, City, State 12345',
    status: 'pending',
    orderDate: '2024-03-20',
    amount: 150.00,
    items: [
      { name: 'Organic Strawberries', quantity: 2, price: 4.99 },
      { name: 'Fresh Tomatoes', quantity: 3, price: 3.99 }
    ]
  },
  {
    id: 'ORD-002',
    customerName: 'Priya Sharma',
    customerEmail: 'priya@example.com',
    customerAddress: '456 Oak Ave, City, State 12345',
    status: 'processing',
    orderDate: '2024-03-19',
    amount: 85.50,
    items: [
      { name: 'Green Lettuce', quantity: 1, price: 2.99 },
      { name: 'Organic Carrots', quantity: 2, price: 3.49 }
    ]
  }
];

export default function FarmerProfile({ onLogout }: FarmerProfileProps) {
  const [orders, setOrders] = React.useState(mockOrders);

  // In a real app, this data would come from your backend
  const farmerData = {
    name: 'Rajesh Mehta',
    email: 'rajesh@farmfresh.com',
    avatar: '/avatars/farmer1.jpg',
    rating: 4.8,
    totalOrders: 156,
    completedOrders: 150,
    revenue: 12500,
    specialties: ['Premium Rice Varieties', 'Organic Wheat', 'Bulk Grain Supply'],
    isVerified: true,
    aadhaarNumber: '123456789012'
  };

  const getStatusColor = (status: OrderStatus['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      ready: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getOrderProgress = (status: OrderStatus['status']) => {
    const progress = {
      pending: 25,
      processing: 50,
      shipped: 75,
      delivered: 100
    };
    return progress[status];
  };

  const handleAcceptOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'accepted' } : order
    ));
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const newOrders = orders.filter(order => order.status === 'pending');
  const ongoingOrders = orders.filter(order => order.status !== 'pending' && order.status !== 'cancelled');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
          <LogOut size={16} />
          Logout
        </Button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={farmerData.avatar} alt={farmerData.name} />
            <AvatarFallback>{farmerData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{farmerData.name}</h1>
              {farmerData.isVerified && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Verified Farmer
                </Badge>
              )}
            </div>
            <p className="text-gray-500">{farmerData.email}</p>
            <div className="flex items-center mt-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-semibold">{farmerData.rating}</span>
              <span className="text-gray-500 ml-1">rating</span>
            </div>
            {!farmerData.isVerified && (
              <div className="mt-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Verification Pending
                </Badge>
                <p className="text-sm text-gray-500 mt-1">
                  Your account is pending verification. We'll review your Aadhaar details shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmerData.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {farmerData.completedOrders} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${farmerData.revenue}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((farmerData.completedOrders / farmerData.totalOrders) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Order completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Specialties */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Specialties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {farmerData.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* My Products Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <MyProducts />
        </CardContent>
      </Card>

      {/* New Orders Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>New Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {newOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No new orders at the moment</p>
            ) : (
              newOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                          New Order
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-500" />
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-500" />
                          <span>{order.orderDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-500" />
                          <span>{order.customerAddress}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-gray-500" />
                          <span>${order.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <Button 
                        className="w-[200px]"
                        onClick={() => handleAcceptOrder(order.id)}
                      >
                        Accept Order
                      </Button>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ongoing Orders Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ongoing Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {ongoingOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No ongoing orders</p>
            ) : (
              ongoingOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-500" />
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-500" />
                          <span>{order.orderDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-500" />
                          <span>{order.customerAddress}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-gray-500" />
                          <span>${order.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <Select
                        defaultValue={order.status}
                        onValueChange={(value) => handleStatusUpdate(order.id, value as OrderStatus['status'])}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="ready">Ready for Shipment</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancel Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 