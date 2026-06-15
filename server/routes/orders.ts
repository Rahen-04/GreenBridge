import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

function formatOrder(order: {
  id: string;
  status: string;
  total: number;
  address: string | null;
  createdAt: Date;
  consumer: { name: string; email: string };
  farmer: { name: string };
  items: { quantity: number; price: number; product: { name: string } }[];
}) {
  return {
    id: order.id,
    status: order.status,
    total: order.total,
    address: order.address,
    orderDate: order.createdAt.toISOString().split("T")[0],
    customerName: order.consumer.name,
    customerEmail: order.consumer.email,
    customerAddress: order.address || "",
    farmerName: order.farmer.name,
    amount: order.total,
    items: order.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
    })),
  };
}

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== "consumer") {
      return res.status(403).json({ error: "Consumers only" });
    }

    const { productId, farmerId, quantity, address } = req.body;

    if (!productId || !farmerId || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.farmerId !== farmerId) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    const consumer = await prisma.user.findUnique({ where: { id: req.userId } });
    const total = product.price * quantity;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          consumerId: req.userId!,
          farmerId,
          total,
          address: address || consumer?.address || null,
          status: "pending",
          items: {
            create: {
              productId,
              quantity: Number(quantity),
              price: product.price,
            },
          },
        },
        include: {
          consumer: true,
          farmer: true,
          items: { include: { product: true } },
        },
      });

      await tx.product.update({
        where: { id: productId },
        data: { stock: product.stock - Number(quantity) },
      });

      return created;
    });

    res.status(201).json(formatOrder(order));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.post("/checkout", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== "consumer") {
      return res.status(403).json({ error: "Consumers only" });
    }

    const { address, couponCode } = req.body;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discount = couponCode?.toLowerCase() === "fresh10" ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    const orders = await prisma.$transaction(async (tx) => {
      const byFarmer = new Map<string, typeof cartItems>();
      for (const item of cartItems) {
        const farmerId = item.product.farmerId;
        if (!byFarmer.has(farmerId)) byFarmer.set(farmerId, []);
        byFarmer.get(farmerId)!.push(item);
      }

      const createdOrders = [];
      for (const [farmerId, items] of byFarmer) {
        const farmerTotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
        const order = await tx.order.create({
          data: {
            consumerId: req.userId!,
            farmerId,
            total: farmerTotal,
            address: address || null,
            status: "pending",
            items: {
              create: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
          },
          include: {
            consumer: true,
            farmer: true,
            items: { include: { product: true } },
          },
        });

        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        createdOrders.push(order);
      }

      await tx.cartItem.deleteMany({ where: { userId: req.userId } });
      return createdOrders;
    });

    res.status(201).json({
      orders: orders.map(formatOrder),
      total,
      discount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Checkout failed" });
  }
});

router.get("/consumer", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { consumerId: req.userId },
      include: {
        consumer: true,
        farmer: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders.map(formatOrder));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/farmer", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== "farmer") {
      return res.status(403).json({ error: "Farmers only" });
    }

    const orders = await prisma.order.findMany({
      where: { farmerId: req.userId },
      include: {
        consumer: true,
        farmer: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders.map(formatOrder));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.patch("/:id/status", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });

    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.farmerId !== req.userId) return res.status(403).json({ error: "Forbidden" });

    const validStatuses = ["pending", "accepted", "processing", "ready", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        consumer: true,
        farmer: true,
        items: { include: { product: true } },
      },
    });

    res.json(formatOrder(updated));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

export default router;
