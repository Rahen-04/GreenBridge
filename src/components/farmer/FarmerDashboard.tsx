import React, { useState } from "react";
import { 
  Plus, PenLine, Trash2, Package, ShoppingCart, 
  FileText, Settings, ListFilter 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import AddProductForm from "./AddProductForm";

// Sample product data for demonstration
const sampleProducts = [
  {
    id: "p1",
    name: "Premium Basmati Rice",
    price: 45.99,
    description: "High-quality long-grain basmati rice, perfect for bulk orders.",
    stock: 2500,
    image: "https://images.unsplash.com/photo-1568347355280-d33fdf77d42a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Grains",
  },
  {
    id: "p2",
    name: "Organic Wheat Grain",
    price: 35.99,
    description: "Premium quality wheat grain suitable for flour production.",
    stock: 3000,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Grains",
  },
  {
    id: "p3",
    name: "Brown Rice",
    price: 42.99,
    description: "Nutritious whole grain brown rice for health-conscious buyers.",
    stock: 2000,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Grains",
  },
  {
    id: "p4",
    name: "Durum Wheat",
    price: 38.99,
    description: "High-protein durum wheat, ideal for pasta and semolina production.",
    stock: 2800,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Grains",
  }
];

export default function FarmerDashboard() {
  const { toast } = useToast();
  const [products, setProducts] = useState(sampleProducts);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Sample stats for the dashboard
  const stats = [
    { name: "Total Products", value: products.length },
    { name: "Total Orders", value: 24 },
    { name: "Revenue (Monthly)", value: "$1,234.56" },
    { name: "New Customers", value: 8 },
  ];

  const handleAddProduct = (product: any) => {
    if (selectedProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === selectedProduct.id ? { ...product, id: selectedProduct.id } : p
      ));
      toast({
        title: "Product Updated",
        description: `${product.name} has been updated successfully.`,
      });
    } else {
      // Add new product
      const newProduct = {
        ...product,
        id: `p${Date.now()}`,
      };
      setProducts([...products, newProduct]);
      toast({
        title: "Product Added",
        description: `${product.name} has been added to your products.`,
      });
    }
    setShowAddProductForm(false);
    setSelectedProduct(null);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setShowAddProductForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Product Deleted",
      description: "The product has been removed from your inventory.",
    });
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          {!showAddProductForm && (
            <Button 
              onClick={() => setShowAddProductForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          )}
        </div>
        
        {showAddProductForm ? (
          <Card>
            <CardHeader>
              <CardTitle>{selectedProduct ? "Edit Product" : "Add New Product"}</CardTitle>
              <CardDescription>
                {selectedProduct 
                  ? "Update your product information" 
                  : "Fill in the details to add a new product to your inventory"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddProductForm 
                onSubmit={handleAddProduct} 
                onCancel={() => {
                  setShowAddProductForm(false);
                  setSelectedProduct(null);
                }}
                initialData={selectedProduct}
              />
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="products">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Your recent activity will appear here.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Your Products</CardTitle>
                    <Button variant="outline" size="sm">
                      <ListFilter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {products.length > 0 ? (
                    <div className="divide-y">
                      {products.map((product) => (
                        <div key={product.id} className="py-4 flex items-center gap-4">
                          <div className="h-16 w-16 rounded-md overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <div className="flex flex-col sm:flex-row sm:gap-6 text-sm text-muted-foreground">
                              <span>${product.price.toFixed(2)}</span>
                              <span>{product.stock} in stock</span>
                              <span>{product.category}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEditProduct(product)}
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      You haven't added any products yet. Click "Add New Product" to get started.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    You don't have any orders yet.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Start selling to see your analytics here.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
