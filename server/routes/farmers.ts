import { Router } from "express";
import { prisma } from "../lib/prisma.js";

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
      const specialties = farmer.farmerProfile?.specialties
        ? JSON.parse(farmer.farmerProfile.specialties)
        : [];

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

    const specialties = farmer.farmerProfile?.specialties
      ? JSON.parse(farmer.farmerProfile.specialties)
      : [];

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

router.get("/:id/stats", async (req, res) => {
  try {
    const farmerId = req.params.id;
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

export default router;
