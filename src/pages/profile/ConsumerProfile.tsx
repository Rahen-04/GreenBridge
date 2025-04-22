import React from 'react';
import { ShoppingBag, Clock, MapPin, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  farmerName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  amount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface ConsumerProfileProps {
  onLogout: () => void;
}

// Mock data - In a real app, this would come from your backend
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    farmerName: 'Rajesh Mehta',
    status: 'processing',
    date: '2024-03-20',
    amount: 150.00,
    items: [
      { name: 'Organic Tomatoes', quantity: 2, price: 45.00 },
      { name: 'Fresh Herbs', quantity: 1, price: 60.00 }
    ]
  },
  {
    id: 'ORD-002',
    farmerName: 'Anita Desai',
    status: 'delivered',
    date: '2024-03-15',
    amount: 85.50,
    items: [
      { name: 'Farm Fresh Eggs', quantity: 2, price: 42.75 },
      { name: 'Organic Spinach', quantity: 1, price: 42.75 }
    ]
  }
];

export default function ConsumerProfile({ onLogout }: ConsumerProfileProps) {
  // In a real app, this data would come from your backend
  const consumerData = {
    name: 'Meera Reddy',
    email: 'meera@example.com',
    avatar: '/avatars/consumer1.jpg',
    totalOrders: 12,
    totalSpent: 1250,
    address: '123 Green Street, Farmville, CA 94123'
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'text-yellow-500',
      processing: 'text-blue-500',
      shipped: 'text-purple-500',
      delivered: 'text-green-500'
    };
    return colors[status];
  };

  const getOrderProgress = (status: Order['status']) => {
    const progress = {
      pending: 25,
      processing: 50,
      shipped: 75,
      delivered: 100
    };
    return progress[status];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={consumerData.avatar} alt={consumerData.name} />
            <AvatarFallback>{consumerData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{consumerData.name}</h1>
            <p className="text-gray-500">{consumerData.email}</p>
            <div className="flex items-center mt-2">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-500">{consumerData.address}</span>
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consumerData.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${consumerData.totalSpent}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime spending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Order History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {mockOrders
                .filter(order => order.status !== 'delivered')
                .map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-gray-500">Farmer: {order.farmerName}</p>
                      </div>
                      <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <Progress value={getOrderProgress(order.status)} className="mb-2" />
                    <div className="mt-4 space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm mt-4 pt-4 border-t">
                      <span>{order.date}</span>
                      <span className="font-semibold">Total: ${order.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {mockOrders
                .filter(order => order.status === 'delivered')
                .map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-gray-500">Farmer: {order.farmerName}</p>
                      </div>
                      <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm mt-4 pt-4 border-t">
                      <span>{order.date}</span>
                      <span className="font-semibold">Total: ${order.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 