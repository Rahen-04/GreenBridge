import { prisma } from "./prisma.js";

export interface MandiCommodity {
  category: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
  source: string;
}

// Curated Agmarknet / APMC Mandi Benchmark dataset for Indian agricultural commodities
export const MANDI_BENCHMARKS: Record<string, MandiCommodity> = {
  // Grains
  "basmati rice": { category: "Grains", modalPrice: 52.0, minPrice: 42.0, maxPrice: 65.0, unit: "kg", source: "Agmarknet APMC" },
  "wheat": { category: "Grains", modalPrice: 30.0, minPrice: 24.0, maxPrice: 38.0, unit: "kg", source: "Agmarknet APMC" },
  "organic wheat grain": { category: "Grains", modalPrice: 35.0, minPrice: 28.0, maxPrice: 44.0, unit: "kg", source: "Agmarknet APMC" },
  "brown rice": { category: "Grains", modalPrice: 45.0, minPrice: 38.0, maxPrice: 56.0, unit: "kg", source: "Agmarknet APMC" },
  "durum wheat": { category: "Grains", modalPrice: 34.0, minPrice: 28.0, maxPrice: 42.0, unit: "kg", source: "Agmarknet APMC" },
  "corn": { category: "Grains", modalPrice: 26.0, minPrice: 20.0, maxPrice: 32.0, unit: "kg", source: "Agmarknet APMC" },
  "maize": { category: "Grains", modalPrice: 26.0, minPrice: 20.0, maxPrice: 32.0, unit: "kg", source: "Agmarknet APMC" },
  "millet": { category: "Grains", modalPrice: 32.0, minPrice: 25.0, maxPrice: 40.0, unit: "kg", source: "Agmarknet APMC" },
  "barley": { category: "Grains", modalPrice: 28.0, minPrice: 22.0, maxPrice: 36.0, unit: "kg", source: "Agmarknet APMC" },

  // Legumes
  "chickpeas": { category: "Legumes", modalPrice: 68.0, minPrice: 55.0, maxPrice: 82.0, unit: "kg", source: "Agmarknet APMC" },
  "toor dal": { category: "Legumes", modalPrice: 130.0, minPrice: 110.0, maxPrice: 155.0, unit: "kg", source: "Agmarknet APMC" },
  "moong dal": { category: "Legumes", modalPrice: 115.0, minPrice: 95.0, maxPrice: 135.0, unit: "kg", source: "Agmarknet APMC" },
  "urad dal": { category: "Legumes", modalPrice: 120.0, minPrice: 100.0, maxPrice: 145.0, unit: "kg", source: "Agmarknet APMC" },
  "lentils": { category: "Legumes", modalPrice: 85.0, minPrice: 70.0, maxPrice: 105.0, unit: "kg", source: "Agmarknet APMC" },

  // Vegetables
  "tomato": { category: "Vegetables", modalPrice: 32.0, minPrice: 20.0, maxPrice: 48.0, unit: "kg", source: "Agmarknet APMC" },
  "tomatoes": { category: "Vegetables", modalPrice: 32.0, minPrice: 20.0, maxPrice: 48.0, unit: "kg", source: "Agmarknet APMC" },
  "potato": { category: "Vegetables", modalPrice: 22.0, minPrice: 16.0, maxPrice: 30.0, unit: "kg", source: "Agmarknet APMC" },
  "potatoes": { category: "Vegetables", modalPrice: 22.0, minPrice: 16.0, maxPrice: 30.0, unit: "kg", source: "Agmarknet APMC" },
  "onion": { category: "Vegetables", modalPrice: 30.0, minPrice: 22.0, maxPrice: 45.0, unit: "kg", source: "Agmarknet APMC" },
  "onions": { category: "Vegetables", modalPrice: 30.0, minPrice: 22.0, maxPrice: 45.0, unit: "kg", source: "Agmarknet APMC" },
  "spinach": { category: "Vegetables", modalPrice: 25.0, minPrice: 18.0, maxPrice: 35.0, unit: "kg", source: "Agmarknet APMC" },
  "carrot": { category: "Vegetables", modalPrice: 38.0, minPrice: 28.0, maxPrice: 50.0, unit: "kg", source: "Agmarknet APMC" },
  "carrots": { category: "Vegetables", modalPrice: 38.0, minPrice: 28.0, maxPrice: 50.0, unit: "kg", source: "Agmarknet APMC" },
  "cauliflower": { category: "Vegetables", modalPrice: 30.0, minPrice: 20.0, maxPrice: 42.0, unit: "kg", source: "Agmarknet APMC" },
  "bell pepper": { category: "Vegetables", modalPrice: 48.0, minPrice: 35.0, maxPrice: 65.0, unit: "kg", source: "Agmarknet APMC" },

  // Fruits
  "apple": { category: "Fruits", modalPrice: 110.0, minPrice: 85.0, maxPrice: 145.0, unit: "kg", source: "Agmarknet APMC" },
  "apples": { category: "Fruits", modalPrice: 110.0, minPrice: 85.0, maxPrice: 145.0, unit: "kg", source: "Agmarknet APMC" },
  "banana": { category: "Fruits", modalPrice: 35.0, minPrice: 25.0, maxPrice: 48.0, unit: "dozen", source: "Agmarknet APMC" },
  "bananas": { category: "Fruits", modalPrice: 35.0, minPrice: 25.0, maxPrice: 48.0, unit: "dozen", source: "Agmarknet APMC" },
  "mango": { category: "Fruits", modalPrice: 90.0, minPrice: 70.0, maxPrice: 130.0, unit: "kg", source: "Agmarknet APMC" },
  "mangoes": { category: "Fruits", modalPrice: 90.0, minPrice: 70.0, maxPrice: 130.0, unit: "kg", source: "Agmarknet APMC" },
  "orange": { category: "Fruits", modalPrice: 60.0, minPrice: 45.0, maxPrice: 80.0, unit: "kg", source: "Agmarknet APMC" },
  "oranges": { category: "Fruits", modalPrice: 60.0, minPrice: 45.0, maxPrice: 80.0, unit: "kg", source: "Agmarknet APMC" },
  "grapes": { category: "Fruits", modalPrice: 75.0, minPrice: 55.0, maxPrice: 100.0, unit: "kg", source: "Agmarknet APMC" },
  "papaya": { category: "Fruits", modalPrice: 40.0, minPrice: 28.0, maxPrice: 55.0, unit: "kg", source: "Agmarknet APMC" },

  // Dairy
  "milk": { category: "Dairy", modalPrice: 56.0, minPrice: 48.0, maxPrice: 66.0, unit: "L", source: "Agmarknet APMC" },
  "cow milk": { category: "Dairy", modalPrice: 56.0, minPrice: 48.0, maxPrice: 66.0, unit: "L", source: "Agmarknet APMC" },
  "ghee": { category: "Dairy", modalPrice: 580.0, minPrice: 500.0, maxPrice: 680.0, unit: "kg", source: "Agmarknet APMC" },
  "paneer": { category: "Dairy", modalPrice: 340.0, minPrice: 290.0, maxPrice: 410.0, unit: "kg", source: "Agmarknet APMC" },
  "butter": { category: "Dairy", modalPrice: 460.0, minPrice: 390.0, maxPrice: 540.0, unit: "kg", source: "Agmarknet APMC" },

  // Spices
  "turmeric": { category: "Spices", modalPrice: 135.0, minPrice: 110.0, maxPrice: 170.0, unit: "kg", source: "Agmarknet APMC" },
  "black pepper": { category: "Spices", modalPrice: 520.0, minPrice: 450.0, maxPrice: 620.0, unit: "kg", source: "Agmarknet APMC" },
  "cumin": { category: "Spices", modalPrice: 270.0, minPrice: 220.0, maxPrice: 340.0, unit: "kg", source: "Agmarknet APMC" },
  "jeera": { category: "Spices", modalPrice: 270.0, minPrice: 220.0, maxPrice: 340.0, unit: "kg", source: "Agmarknet APMC" },
  "coriander": { category: "Spices", modalPrice: 115.0, minPrice: 90.0, maxPrice: 145.0, unit: "kg", source: "Agmarknet APMC" },
  "cardamom": { category: "Spices", modalPrice: 1400.0, minPrice: 1100.0, maxPrice: 1800.0, unit: "kg", source: "Agmarknet APMC" },
};

// Generic category averages when specific crop name has no direct APMC benchmark match
export const CATEGORY_DEFAULTS: Record<string, { modal: number; min: number; max: number; unit: string }> = {
  Grains: { modal: 38.0, min: 25.0, max: 55.0, unit: "kg" },
  Legumes: { modal: 95.0, min: 65.0, max: 140.0, unit: "kg" },
  Vegetables: { modal: 32.0, min: 18.0, max: 50.0, unit: "kg" },
  Fruits: { modal: 68.0, min: 40.0, max: 110.0, unit: "kg" },
  Dairy: { modal: 120.0, min: 55.0, max: 450.0, unit: "unit" },
  Spices: { modal: 260.0, min: 110.0, max: 600.0, unit: "kg" },
  Other: { modal: 75.0, min: 35.0, max: 150.0, unit: "unit" },
};

export interface PriceSuggestionResult {
  suggestedPrice: number;
  minRecommended: number;
  maxRecommended: number;
  mandiBenchmark: number;
  platformAvg: number | null;
  organicPremiumApplied: boolean;
  confidence: "High" | "Moderate" | "Estimated";
  reasoning: string;
}

export async function calculateSuggestedPrice(
  name: string,
  category: string,
  isOrganic = false
): Promise<PriceSuggestionResult> {
  const normalizedName = (name || "").toLowerCase().trim();

  // 1. Find Mandi Benchmark
  let mandiMatch = MANDI_BENCHMARKS[normalizedName];
  if (!mandiMatch) {
    // Try substring matching (e.g. "Fresh Organic Basmati Rice" matches "basmati rice")
    for (const [key, val] of Object.entries(MANDI_BENCHMARKS)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        mandiMatch = val;
        break;
      }
    }
  }

  const categoryFallback = CATEGORY_DEFAULTS[category] || CATEGORY_DEFAULTS["Other"];
  const mandiBenchmark = mandiMatch ? mandiMatch.modalPrice : categoryFallback.modal;
  const isDirectMatch = !!mandiMatch;

  // 2. Query platform historical transaction prices
  let platformAvg: number | null = null;
  let orderCount = 0;

  try {
    const historicalItems = await prisma.orderItem.findMany({
      where: {
        product: {
          category,
          ...(name ? { name: { contains: name } } : {}),
        },
      },
      select: { price: true },
      take: 20,
    });

    if (historicalItems.length > 0) {
      const sum = historicalItems.reduce((acc, item) => acc + item.price, 0);
      platformAvg = Math.round((sum / historicalItems.length) * 100) / 100;
      orderCount = historicalItems.length;
    }
  } catch {
    // Graceful fallback if database query fails
  }

  // 3. Weighted Base Calculation
  let basePrice = mandiBenchmark;
  if (platformAvg && platformAvg > 0) {
    // 60% Mandi APMC weight, 40% Platform historical clearing price weight
    basePrice = 0.6 * mandiBenchmark + 0.4 * platformAvg;
  }

  // 4. Organic Markup (+20% certified organic value premium)
  const organicMultiplier = isOrganic ? 1.2 : 1.0;
  const rawSuggested = basePrice * organicMultiplier;
  const suggestedPrice = Math.round(rawSuggested * 10) / 10;

  // 5. Min / Max Recommended corridor
  const minRecommended = Math.round(suggestedPrice * 0.88 * 10) / 10;
  const maxRecommended = Math.round(suggestedPrice * 1.15 * 10) / 10;

  // 6. Confidence Level
  const confidence: "High" | "Moderate" | "Estimated" =
    isDirectMatch && orderCount > 0 ? "High" : isDirectMatch ? "Moderate" : "Estimated";

  // 7. Executive Rationale
  const reasoning = [
    `APMC Mandi benchmark: ₹${mandiBenchmark.toFixed(2)}`,
    platformAvg ? `platform historical average: ₹${platformAvg.toFixed(2)}` : null,
    isOrganic ? `+20% organic quality premium applied` : null,
    confidence === "Estimated" ? `derived from general ${category} regional pricing` : null,
  ]
    .filter(Boolean)
    .join("; ");

  return {
    suggestedPrice,
    minRecommended,
    maxRecommended,
    mandiBenchmark,
    platformAvg,
    organicPremiumApplied: isOrganic,
    confidence,
    reasoning: `Based on ${reasoning}.`,
  };
}
