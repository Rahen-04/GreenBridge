import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Image, DollarSign, Box, Tag, Calendar, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ✅ Form validation schema (now includes image file)
const productSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters" }),
  price: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: "Price must be a positive number" }
  ),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  stock: z.string().refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
    { message: "Stock must be a positive number" }
  ),
  category: z.string().min(1, { message: "Please select a category" }),
  image: z.union([z.string(), z.instanceof(File)]),
  date: z.string().min(1, { message: "Please provide a date" }),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface AddProductFormProps {
  onSubmit: (data: {
    name: string;
    price: number;
    date: string;
    description: string;
    stock: number;
    category: string;
    image: string;
  }) => void;
  onCancel: () => void;
  initialData?: Partial<ProductFormValues>;
}

export default function AddProductForm({ onSubmit, onCancel, initialData }: AddProductFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      price: "",
      date: "",
      description: "",
      stock: "",
      category: "",
      image: "",
    },
  });

  useEffect(() => {
    // Cleanup preview URL when component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        form.setError("image", { message: "Please upload an image file" });
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        form.setError("image", { message: "Image size should be less than 5MB" });
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue("image", file);
    }
  };

  const handleSubmit = (values: ProductFormValues) => {
    // Ensure we have a string URL for the image
    const imageValue = values.image instanceof File ? previewUrl : values.image;
    
    if (!imageValue) {
      form.setError("image", { message: "Image is required" });
      return;
    }

    onSubmit({
      name: values.name,
      description: values.description,
      category: values.category,
      date: values.date,
      price: parseFloat(values.price),
      stock: parseInt(values.stock),
      image: imageValue,
    });
  };

  const categories = [
    "Fruits",
    "Vegetables",
    "Dairy",
    "Eggs",
    "Meat",
    "Grains",
    "Baked Goods",
    "Preserves",
    "Other",
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Box className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Organic Apples" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="number" step="0.01" min="0" placeholder="25" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Date</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Select {...field}>
                    <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your product here..." className="min-h-24" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="relative">
                    <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Image URL"
                      className="pl-10"
                      value={typeof field.value === 'string' ? field.value : ''}
                      onChange={(e) => {
                        setPreviewUrl("");
                        field.onChange(e.target.value);
                      }}
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      className="pl-10"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageChange(e);
                        }
                      }}
                    />
                  </div>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mt-2 max-h-40 rounded-md"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            {initialData ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
