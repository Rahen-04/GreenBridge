import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Clock, MapPin, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { ordersApi } from '@/lib/api';

interface ConsumerProfileProps {
  onLogout: () => void;
}

export default function ConsumerProfile({ onLogout }: ConsumerProfileProps) {
  const { userData } = useUser();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['consumer-orders'],
    queryFn: async () => {
      const { data } = await ordersApi.consumer();
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-500',
      accepted: 'text-blue-500',
      processing: 'text-blue-500',
      ready: 'text-indigo-500',
      shipped: 'text-purple-500',
      delivered: 'text-green-500',
      cancelled: 'text-red-500',
    };
    return colors[status] || 'text-gray-500';
  };

  const getOrderProgress = (status: string) => {
    const progress: Record<string, number> = {
      pending: 20, accepted: 35, processing: 50, ready: 65, shipped: 80, delivered: 100,
    };
    return progress[status] ?? 25;
  };

  const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);
  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const completedOrders = orders.filter((o) => o.status === 'delivered');

  if (!userData) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-gray-500">{userData.email}</p>
            {userData.address && (
              <div className="flex items-center mt-2">
                <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">{userData.address}</span>
              </div>
            )}
          </div>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={onLogout}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Order History ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {isLoading ? (
                <p className="text-center text-gray-500 py-4">Loading orders...</p>
              ) : activeOrders.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No active orders</p>
              ) : (
                activeOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-gray-500">Farmer: {order.farmerName}</p>
                      </div>
                      <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <Progress value={getOrderProgress(order.status)} className="mb-2" />
                    <div className="mt-4 space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm mt-4 pt-4 border-t">
                      <span>{order.orderDate}</span>
                      <span className="font-semibold">Total: ₹{order.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {completedOrders.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No completed orders yet</p>
              ) : (
                completedOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-gray-500">Farmer: {order.farmerName}</p>
                      </div>
                      <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>Delivered</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm mt-4 pt-4 border-t">
                      <span>{order.orderDate}</span>
                      <span className="font-semibold">Total: ₹{order.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
