import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.userId },
      include: { product: true },
    });

    res.json(
      items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image || "/placeholder.svg",
        quantity: item.quantity,
        farmerId: item.product.farmerId,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

router.post("/items", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID required" });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: req.userId!, productId } },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + qty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId: req.userId!,
          productId,
          quantity: qty,
        },
      });
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: req.userId },
      include: { product: true },
    });

    res.json(
      items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image || "/placeholder.svg",
        quantity: item.quantity,
        farmerId: item.product.farmerId,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

router.patch("/items/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { quantity } = req.body;
    const id = req.params.id as string;
    const item = await prisma.cartItem.findUnique({ where: { id } });

    if (!item || item.userId !== req.userId) {
      return res.status(404).json({ error: "Item not found" });
    }

    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty < 1) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: parsedQty },
      });
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: req.userId },
      include: { product: true },
    });

    res.json(
      items.map((i) => ({
        id: i.id,
        productId: i.productId,
        name: i.product.name,
        price: i.product.price,
        image: i.product.image || "/placeholder.svg",
        quantity: i.quantity,
        farmerId: i.product.farmerId,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

router.delete("/items/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const item = await prisma.cartItem.findUnique({ where: { id } });
    if (!item || item.userId !== req.userId) {
      return res.status(404).json({ error: "Item not found" });
    }

    await prisma.cartItem.delete({ where: { id: item.id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

export default router;
