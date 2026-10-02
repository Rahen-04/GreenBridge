import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: "farmer" | "consumer";
  avatar: string;
  address?: string;
  cart: { items: number };
  isVerified?: boolean;
  aadhaarNumber?: string;
  location?: string;
  description?: string;
  specialties?: string[];
  phone?: string;
  rating?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  isOrganic: boolean;
  minQuantity?: string;
  harvestDate?: string;
  estimatedDelivery?: string;
  farmerId: string;
}

export interface Farmer {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  specialties: string[];
  description: string;
  email: string;
  phone: string;
  isVerified: boolean;
  products: Product[];
  reviews: Review[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FarmerListing {
  id: string;
  productId: string;
  name: string;
  avatar: string;
  rating: number;
  location: string;
  quantity: number;
  price: number;
  estimatedDelivery: string;
  harvestDate: string;
  organic: boolean;
  isVerified: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  farmerId: string;
}

export interface Order {
  id: string;
  status: string;
  total: number;
  address?: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  farmerName: string;
  amount: number;
  items: { name: string; quantity: number; price: number }[];
}

export const authApi = {
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: "farmer" | "consumer";
    aadhaarNumber?: string;
    location?: string;
    phone?: string;
  }) => api.post<{ token: string; user: UserData }>("/auth/register", data),
  login: (email: string, password: string) =>
    api.post<{ token: string; user: UserData }>("/auth/login", { email, password }),
  me: () => api.get<UserData>("/auth/me"),
  updateProfile: (data: Record<string, unknown>) => api.patch<UserData>("/auth/profile", data),
};

export const productsApi = {
  list: (params?: { category?: string; organic?: boolean; search?: string; featured?: boolean }) =>
    api.get<Product[]>("/products", { params }),
  categories: () => api.get<string[]>("/products/categories"),
  get: (id: string) => api.get<Product>(`/products/${id}`),
  listings: (id: string) => api.get<FarmerListing[]>(`/products/${id}/listings`),
  mine: () => api.get<Product[]>("/products/farmer/mine"),
  create: (data: Partial<Product>) => api.post<Product>("/products", data),
  update: (id: string, data: Partial<Product>) => api.put<Product>(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export interface FarmerAnalytics {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    completedOrders: number;
    avgOrderValue: number;
    totalUnitsSold: number;
    middlemanSavings: number;
    activeListingCount: number;
  };
  salesTrend: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    name: string;
    revenue: number;
    quantity: number;
    category: string;
  }>;
  categoryBreakdown: Array<{
    name: string;
    value: number;
  }>;
}

export const farmersApi = {
  list: () => api.get<Farmer[]>("/farmers"),
  get: (id: string) => api.get<Farmer>(`/farmers/${id}`),
  stats: (id: string) =>
    api.get<{ totalOrders: number; completedOrders: number; revenue: number }>(`/farmers/${id}/stats`),
  analytics: (id: string) => api.get<FarmerAnalytics>(`/farmers/${id}/analytics`),
};

export const ordersApi = {
  create: (data: { productId: string; farmerId: string; quantity: number; address?: string }) =>
    api.post<Order>("/orders", data),
  checkout: (data: { address?: string; couponCode?: string }) =>
    api.post<{ orders: Order[]; total: number; discount: number }>("/orders/checkout", data),
  consumer: () => api.get<Order[]>("/orders/consumer"),
  farmer: () => api.get<Order[]>("/orders/farmer"),
  updateStatus: (id: string, status: string) => api.patch<Order>(`/orders/${id}/status`, { status }),
};

export const cartApi = {
  get: () => api.get<CartItem[]>("/cart"),
  add: (productId: string, quantity = 1) => api.post<CartItem[]>("/cart/items", { productId, quantity }),
  update: (id: string, quantity: number) => api.patch<CartItem[]>(`/cart/items/${id}`, { quantity }),
  remove: (id: string) => api.delete(`/cart/items/${id}`),
};

export const reviewsApi = {
  create: (data: { farmerId: string; rating: number; comment: string }) =>
    api.post<Review>("/reviews", data),
};

export const contactApi = {
  send: (data: { name: string; email: string; subject?: string; message: string }) =>
    api.post("/contact", data),
};

export interface PriceSuggestion {
  suggestedPrice: number;
  minRecommended: number;
  maxRecommended: number;
  mandiBenchmark: number;
  platformAvg: number | null;
  organicPremiumApplied: boolean;
  confidence: "High" | "Moderate" | "Estimated";
  reasoning: string;
}

export const pricingApi = {
  suggest: (params: { name?: string; category?: string; isOrganic?: boolean }) =>
    api.get<PriceSuggestion>("/pricing/suggest", { params }),
};

export default api;
