import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

function formatProduct(product: {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string | null;
  isOrganic: boolean;
  minQuantity: string | null;
  harvestDate: string | null;
  estimatedDelivery: string | null;
  farmerId: string;
  farmer?: { id: string; name: string; avatar: string | null; farmerProfile?: { location: string | null; rating: number; isVerified: boolean } | null };
  createdAt: Date;
}) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    stock: product.stock,
    image: product.image || "/placeholder.svg",
    isOrganic: product.isOrganic,
    minQuantity: product.minQuantity,
    harvestDate: product.harvestDate,
    estimatedDelivery: product.estimatedDelivery,
    farmerId: product.farmerId,
    farmer: product.farmer
      ? {
          id: product.farmer.id,
          name: product.farmer.name,
          avatar: product.farmer.avatar || "/no-profile.svg",
          location: product.farmer.farmerProfile?.location,
          rating: product.farmer.farmerProfile?.rating ?? 0,
          isVerified: product.farmer.farmerProfile?.isVerified ?? false,
        }
      : undefined,
    createdAt: product.createdAt,
  };
}

router.get("/", async (req, res) => {
  try {
    const { category, organic, search, featured } = req.query;

    const products = await prisma.product.findMany({
      where: {
        ...(category && category !== "all" ? { category: String(category) } : {}),
        ...(organic === "true" ? { isOrganic: true } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: String(search) } },
                { description: { contains: String(search) } },
                { category: { contains: String(search) } },
              ],
            }
          : {}),
      },
      include: {
        farmer: { include: { farmerProfile: true } },
      },
      orderBy: { createdAt: "desc" },
      ...(featured === "true" ? { take: 4 } : {}),
    });

    res.json(products.map(formatProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/categories", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({ select: { category: true } });
    const categories = [...new Set(products.map((p) => p.category))].sort();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/farmer/mine", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== "farmer") {
      return res.status(403).json({ error: "Farmers only" });
    }

    const products = await prisma.product.findMany({
      where: { farmerId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(products.map((p) => formatProduct(p)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/:id/listings", async (req, res) => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { farmer: { include: { farmerProfile: true } } },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const sameNameProducts = await prisma.product.findMany({
      where: { name: product.name, stock: { gt: 0 } },
      include: { farmer: { include: { farmerProfile: true } } },
    });

    const listings = sameNameProducts.map((p) => ({
      id: p.farmerId,
      productId: p.id,
      name: p.farmer.name,
      avatar: p.farmer.avatar || "/no-profile.svg",
      rating: p.farmer.farmerProfile?.rating ?? 0,
      location: p.farmer.farmerProfile?.location || "Location not set",
      quantity: p.stock,
      price: p.price,
      estimatedDelivery: p.estimatedDelivery || "2-3 days",
      harvestDate: p.harvestDate || "Not specified",
      organic: p.isOrganic,
      isVerified: p.farmer.farmerProfile?.isVerified ?? false,
    }));

    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { farmer: { include: { farmerProfile: true } } },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(formatProduct(product));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== "farmer") {
      return res.status(403).json({ error: "Farmers only" });
    }

    const {
      name,
      description,
      category,
      price,
      stock,
      image,
      isOrganic,
      minQuantity,
      harvestDate,
      estimatedDelivery,
    } = req.body;

    if (!name || !description || !category || price == null || stock == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await prisma.product.create({
      data: {
        farmerId: req.userId!,
        name,
        description,
        category,
        price: Number(price),
        stock: Number(stock),
        image: image || null,
        isOrganic: Boolean(isOrganic),
        minQuantity: minQuantity || null,
        harvestDate: harvestDate || null,
        estimatedDelivery: estimatedDelivery || null,
      },
    });

    res.status(201).json(formatProduct(product));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Product not found" });
    if (existing.farmerId !== req.userId) return res.status(403).json({ error: "Forbidden" });

    const {
      name,
      description,
      category,
      price,
      stock,
      image,
      isOrganic,
      minQuantity,
      harvestDate,
      estimatedDelivery,
    } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: String(name) }),
        ...(description !== undefined && { description: String(description) }),
        ...(category !== undefined && { category: String(category) }),
        ...(price !== undefined && { price: Number(price) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(image !== undefined && { image: image || null }),
        ...(isOrganic !== undefined && { isOrganic: Boolean(isOrganic) }),
        ...(minQuantity !== undefined && { minQuantity: minQuantity || null }),
        ...(harvestDate !== undefined && { harvestDate: harvestDate || null }),
        ...(estimatedDelivery !== undefined && { estimatedDelivery: estimatedDelivery || null }),
      },
    });

    res.json(formatProduct(product));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Product not found" });
    if (existing.farmerId !== req.userId) return res.status(403).json({ error: "Forbidden" });

    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
