import { Router } from "express";
import { calculateSuggestedPrice } from "../lib/pricingEngine.js";

const router = Router();

router.get("/suggest", async (req, res) => {
  try {
    const name = String(req.query.name || "");
    const category = String(req.query.category || "Other");
    const isOrganic = req.query.isOrganic === "true";

    const suggestion = await calculateSuggestedPrice(name, category, isOrganic);
    res.json(suggestion);
  } catch (error) {
    console.error("Pricing suggestion error:", error);
    res.status(500).json({ error: "Failed to generate price suggestion" });
  }
});

router.post("/suggest", async (req, res) => {
  try {
    const { name = "", category = "Other", isOrganic = false } = req.body;
    const suggestion = await calculateSuggestedPrice(String(name), String(category), Boolean(isOrganic));
    res.json(suggestion);
  } catch (error) {
    console.error("Pricing suggestion error:", error);
    res.status(500).json({ error: "Failed to generate price suggestion" });
  }
});

export default router;
