import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { farmerId, rating, comment } = req.body;

    if (!farmerId || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const review = await prisma.review.create({
      data: {
        farmerId,
        userId: req.userId!,
        rating: Number(rating),
        comment,
        userName: user.name,
      },
    });

    const reviews = await prisma.review.findMany({ where: { farmerId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.farmerProfile.updateMany({
      where: { userId: farmerId },
      data: { rating: avgRating },
    });

    res.status(201).json({
      id: review.id,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create review" });
  }
});

export default router;
