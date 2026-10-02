import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";
import { parseSpecialties } from "../lib/utils.js";

const router = Router();

function formatUser(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  address: string | null;
  farmerProfile?: {
    location: string | null;
    description: string | null;
    specialties: string;
    phone: string | null;
    isVerified: boolean;
    aadhaarNumber: string | null;
    rating: number;
  } | null;
}, cartCount = 0) {
  const specialties = parseSpecialties(user.farmerProfile?.specialties);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || "/no-profile.svg",
    address: user.address,
    cart: { items: cartCount },
    ...(user.role === "farmer" && user.farmerProfile
      ? {
          isVerified: user.farmerProfile.isVerified,
          aadhaarNumber: user.farmerProfile.aadhaarNumber,
          location: user.farmerProfile.location,
          description: user.farmerProfile.description,
          specialties,
          phone: user.farmerProfile.phone,
          rating: user.farmerProfile.rating,
        }
      : {}),
  };
}

async function getCartCount(userId: string) {
  const items = await prisma.cartItem.findMany({ where: { userId } });
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role, aadhaarNumber, location, phone } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!["farmer", "consumer"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    if (role === "farmer" && aadhaarNumber && !/^\d{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({ error: "Aadhaar must be 12 digits" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
        ...(role === "farmer"
          ? {
              farmerProfile: {
                create: {
                  aadhaarNumber: aadhaarNumber || null,
                  isVerified: false,
                  location: location || null,
                  phone: phone || null,
                  specialties: "[]",
                },
              },
            }
          : {}),
      },
      include: { farmerProfile: true },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user: formatUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { farmerProfile: true },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const cartCount = await getCartCount(user.id);
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.json({ token, user: formatUser(user, cartCount) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { farmerProfile: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartCount = await getCartCount(user.id);
    res.json(formatUser(user, cartCount));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.patch("/profile", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, address, location, description, phone, specialties } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(address !== undefined && { address }),
      },
      include: { farmerProfile: true },
    });

    if (user.role === "farmer" && user.farmerProfile) {
      await prisma.farmerProfile.update({
        where: { userId: user.id },
        data: {
          ...(location !== undefined && { location }),
          ...(description !== undefined && { description }),
          ...(phone !== undefined && { phone }),
          ...(specialties !== undefined && {
            specialties: Array.isArray(specialties) ? JSON.stringify(specialties) : "[]",
          }),
        },
      });
    }

    const updated = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { farmerProfile: true },
    });

    const cartCount = await getCartCount(req.userId!);
    res.json(formatUser(updated!, cartCount));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
