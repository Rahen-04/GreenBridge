import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { productsApi, pricingApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  stock: z.coerce.number().min(1, 'Stock must be at least 1'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  harvestDate: z.string().optional(),
  estimatedDelivery: z.string().optional(),
  image: z.string().optional(),
  isOrganic: z.boolean().default(false),
  minQuantity: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const CATEGORIES = ['Grains', 'Legumes', 'Spices', 'Vegetables', 'Fruits', 'Dairy', 'Other'];

export default function MyProducts() {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['my-products'],
    queryFn: async () => {
      const { data } = await productsApi.mine();
      return data;
    },
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '', description: '', category: '', stock: 1, price: 0,
      harvestDate: '', estimatedDelivery: '', image: '', isOrganic: false, minQuantity: '',
    },
  });

  const watchedName = form.watch('name');
  const watchedCategory = form.watch('category');
  const watchedIsOrganic = form.watch('isOrganic');

  const { data: priceSuggestion, isFetching: isPricingLoading } = useQuery({
    queryKey: ['price-suggestion', watchedName, watchedCategory, watchedIsOrganic],
    queryFn: async () => {
      if (!watchedCategory) return null;
      const { data } = await pricingApi.suggest({
        name: watchedName,
        category: watchedCategory,
        isOrganic: watchedIsOrganic,
      });
      return data;
    },
    enabled: !!watchedCategory && isAddDialogOpen,
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await productsApi.create(data);
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({ title: 'Product added', description: `${data.name} has been listed.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to add product.', variant: 'destructive' });
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await productsApi.delete(productId);
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product deleted' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete product.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Products</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2"><Plus size={16} /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="stock" render={({ field }) => (
                    <FormItem><FormLabel>Stock (Quantity)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price (₹ / unit)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                {watchedCategory && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
                        <span className="font-semibold text-emerald-950">AI Market Price Intelligence</span>
                        {priceSuggestion && (
                          <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-medium">
                            {priceSuggestion.confidence} Confidence
                          </span>
                        )}
                      </div>
                      {priceSuggestion && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-emerald-500 text-emerald-800 hover:bg-emerald-100"
                          onClick={() => form.setValue('price', priceSuggestion.suggestedPrice, { shouldValidate: true })}
                        >
                          Apply ₹{priceSuggestion.suggestedPrice}
                        </Button>
                      )}
                    </div>
                    {isPricingLoading ? (
                      <p className="text-xs text-gray-500">Querying Mandi benchmark & platform clearing price...</p>
                    ) : priceSuggestion ? (
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-emerald-700">₹{priceSuggestion.suggestedPrice.toFixed(2)}</span>
                          <span className="text-xs text-gray-600">
                            Recommended Corridor: ₹{priceSuggestion.minRecommended.toFixed(2)} – ₹{priceSuggestion.maxRecommended.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 leading-relaxed">
                          {priceSuggestion.reasoning}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Select a category and enter name to see market guidance.</p>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="harvestDate" render={({ field }) => (
                    <FormItem><FormLabel>Harvest Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="estimatedDelivery" render={({ field }) => (
                    <FormItem><FormLabel>Delivery Time</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {['1-2 days', '2-3 days', '3-5 days', '5-7 days'].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="image" render={({ field }) => (
                  <FormItem><FormLabel>Image URL (optional)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="minQuantity" render={({ field }) => (
                  <FormItem><FormLabel>Minimum Order</FormLabel><FormControl><Input placeholder="e.g. 25 kg" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="isOrganic" render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel>Organic product</FormLabel>
                  </FormItem>
                )} />
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Add Product</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-center py-8">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No products listed yet. Add your first product above.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">{product.category}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div><span className="text-gray-500">Stock:</span> {product.stock}</div>
                  <div><span className="text-gray-500">Price:</span> ₹{product.price}</div>
                </div>
                <div className="flex justify-end">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                    <Trash2 size={16} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
