import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";
import { parseSpecialties } from "../lib/utils.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const farmers = await prisma.user.findMany({
      where: { role: "farmer", farmerProfile: { isNot: null } },
      include: {
        farmerProfile: true,
        products: { where: { stock: { gt: 0 } }, take: 5 },
        reviews: true,
      },
    });

    const result = farmers.map((farmer) => {
      const specialties = parseSpecialties(farmer.farmerProfile?.specialties);

      const avgRating =
        farmer.reviews.length > 0
          ? farmer.reviews.reduce((sum, r) => sum + r.rating, 0) / farmer.reviews.length
          : farmer.farmerProfile?.rating ?? 0;

      return {
        id: farmer.id,
        name: farmer.name,
        image: farmer.avatar || "/no-profile.svg",
        location: farmer.farmerProfile?.location || "Location not set",
        rating: Math.round(avgRating * 10) / 10,
        specialties,
        description: farmer.farmerProfile?.description || "",
        email: farmer.email,
        phone: farmer.farmerProfile?.phone || "",
        isVerified: farmer.farmerProfile?.isVerified ?? false,
        products: farmer.products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          image: p.image || "/placeholder.svg",
          category: p.category,
          price: p.price,
          stock: p.stock,
        })),
        reviews: farmer.reviews.map((r) => ({
          id: r.id,
          userName: r.userName,
          rating: r.rating,
          comment: r.comment,
          date: r.createdAt.toISOString().split("T")[0],
        })),
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch farmers" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const farmer = await prisma.user.findFirst({
      where: { id: req.params.id, role: "farmer" },
      include: {
        farmerProfile: true,
        products: true,
        reviews: true,
      },
    });

    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    const specialties = parseSpecialties(farmer.farmerProfile?.specialties);

    const avgRating =
      farmer.reviews.length > 0
        ? farmer.reviews.reduce((sum, r) => sum + r.rating, 0) / farmer.reviews.length
        : farmer.farmerProfile?.rating ?? 0;

    res.json({
      id: farmer.id,
      name: farmer.name,
      image: farmer.avatar || "/no-profile.svg",
      location: farmer.farmerProfile?.location || "Location not set",
      rating: Math.round(avgRating * 10) / 10,
      specialties,
      description: farmer.farmerProfile?.description || "",
      email: farmer.email,
      phone: farmer.farmerProfile?.phone || "",
      isVerified: farmer.farmerProfile?.isVerified ?? false,
      products: farmer.products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        image: p.image || "/placeholder.svg",
        category: p.category,
        price: p.price,
        stock: p.stock,
      })),
      reviews: farmer.reviews.map((r) => ({
        id: r.id,
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt.toISOString().split("T")[0],
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch farmer" });
  }
});

router.get("/:id/stats", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const farmerId = req.params.id as string;
    if (req.userRole !== "farmer" || req.userId !== farmerId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const orders = await prisma.order.findMany({ where: { farmerId } });
    const completed = orders.filter((o) => o.status === "delivered");
    const revenue = completed.reduce((sum, o) => sum + o.total, 0);

    res.json({
      totalOrders: orders.length,
      completedOrders: completed.length,
      revenue: Math.round(revenue * 100) / 100,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/:id/analytics", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const farmerId = req.params.id as string;
    if (req.userRole !== "farmer" || req.userId !== farmerId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const orders = await prisma.order.findMany({
      where: { farmerId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const products = await prisma.product.findMany({
      where: { farmerId },
    });

    // Compute key metrics
    const deliveredOrders = orders.filter((o) => o.status === "delivered");
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const completedOrders = deliveredOrders.length;
    const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;
    // Estimated 28% middleman commission retained by farmer
    const middlemanSavings = Math.round(totalRevenue * 0.28 * 100) / 100;

    let totalUnitsSold = 0;
    const productSalesMap = new Map<string, { name: string; revenue: number; quantity: number; category: string }>();
    const categorySalesMap = new Map<string, number>();

    // Register active products so catalog is reflected
    products.forEach((p) => {
      productSalesMap.set(p.name, {
        name: p.name,
        revenue: 0,
        quantity: 0,
        category: p.category,
      });
    });

    deliveredOrders.forEach((o) => {
      o.items.forEach((item) => {
        totalUnitsSold += item.quantity;
        const pName = item.product?.name || "Product";
        const cat = item.product?.category || "Other";
        const itemRev = item.price * item.quantity;

        const current = productSalesMap.get(pName) || { name: pName, revenue: 0, quantity: 0, category: cat };
        current.revenue += itemRev;
        current.quantity += item.quantity;
        productSalesMap.set(pName, current);

        categorySalesMap.set(cat, (categorySalesMap.get(cat) || 0) + itemRev);
      });
    });

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        revenue: Math.round(p.revenue * 100) / 100,
        quantity: p.quantity,
        category: p.category,
      }));

    const categoryBreakdown = Array.from(categorySalesMap.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
    }));

    // Monthly trends (aggregate delivered or active orders by month)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = new Map<string, { month: string; revenue: number; orders: number }>();

    // Pre-populate last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyMap.set(key, { month: key, revenue: 0, orders: 0 });
    }

    deliveredOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      if (monthlyMap.has(key)) {
        const item = monthlyMap.get(key)!;
        item.revenue += o.total;
        item.orders += 1;
      } else {
        monthlyMap.set(key, { month: key, revenue: o.total, orders: 1 });
      }
    });

    const salesTrend = Array.from(monthlyMap.values()).map((m) => ({
      ...m,
      revenue: Math.round(m.revenue * 100) / 100,
    }));

    res.json({
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        completedOrders,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        totalUnitsSold,
        middlemanSavings,
        activeListingCount: products.length,
      },
      salesTrend,
      topProducts,
      categoryBreakdown,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch farmer analytics" });
  }
});

export default router;
