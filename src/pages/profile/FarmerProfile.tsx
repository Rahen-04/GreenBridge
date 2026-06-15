import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Star, Package, ShoppingBag, TrendingUp, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import MyProducts from '@/components/farmer/MyProducts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, User, MapPin, DollarSign } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { farmersApi, ordersApi, Order } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface FarmerProfileProps {
  onLogout: () => void;
}

type OrderStatus = Order['status'];

export default function FarmerProfile({ onLogout }: FarmerProfileProps) {
  const { userData } = useUser();
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ['farmer-stats', userData?.id],
    queryFn: async () => {
      const { data } = await farmersApi.stats(userData!.id);
      return data;
    },
    enabled: !!userData?.id,
  });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['farmer-orders'],
    queryFn: async () => {
      const { data } = await ordersApi.farmer();
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      ready: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await ordersApi.updateStatus(orderId, 'accepted');
      queryClient.invalidateQueries({ queryKey: ['farmer-orders'] });
      toast({ title: 'Order accepted' });
    } catch {
      toast({ title: 'Error', description: 'Failed to update order.', variant: 'destructive' });
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      queryClient.invalidateQueries({ queryKey: ['farmer-orders'] });
      toast({ title: 'Status updated' });
    } catch {
      toast({ title: 'Error', description: 'Failed to update order.', variant: 'destructive' });
    }
  };

  const newOrders = orders.filter((o) => o.status === 'pending');
  const ongoingOrders = orders.filter((o) => o.status !== 'pending' && o.status !== 'cancelled' && o.status !== 'delivered');

  if (!userData) return null;

  const completionRate = stats && stats.totalOrders > 0
    ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)
    : '0';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
        <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
          <LogOut size={16} /> Logout
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={userData.avatar} alt={userData.name} />
          <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{userData.name}</h2>
            {userData.isVerified ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">Verified Farmer</Badge>
            ) : (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Verification Pending</Badge>
            )}
          </div>
          <p className="text-gray-500">{userData.email}</p>
          {userData.location && (
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" /> {userData.location}
            </div>
          )}
          {(userData.rating ?? 0) > 0 && (
            <div className="flex items-center mt-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-semibold">{userData.rating}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders ?? 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.completedOrders ?? 0} completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.revenue ?? 0}</div>
            <p className="text-xs text-muted-foreground">From delivered orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <MyProducts />
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader><CardTitle>New Orders</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-500 text-center py-4">Loading orders...</p>
          ) : newOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No new orders</p>
          ) : (
            <div className="space-y-6">
              {newOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                        <Badge variant="secondary" className={getStatusColor(order.status)}>New</Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2"><User size={16} className="text-gray-500" /><span>{order.customerName}</span></div>
                        <div className="flex items-center gap-2"><Clock size={16} className="text-gray-500" /><span>{order.orderDate}</span></div>
                        <div className="flex items-center gap-2"><DollarSign size={16} className="text-gray-500" /><span>₹{order.amount.toFixed(2)}</span></div>
                      </div>
                    </div>
                    <Button onClick={() => handleAcceptOrder(order.id)}>Accept Order</Button>
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Ongoing Orders</CardTitle></CardHeader>
        <CardContent>
          {ongoingOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No ongoing orders</p>
          ) : (
            <div className="space-y-6">
              {ongoingOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2"><User size={16} className="text-gray-500" /><span>{order.customerName}</span></div>
                        <div className="flex items-center gap-2"><DollarSign size={16} className="text-gray-500" /><span>₹{order.amount.toFixed(2)}</span></div>
                      </div>
                    </div>
                    <Select defaultValue={order.status} onValueChange={(v) => handleStatusUpdate(order.id, v)}>
                      <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
