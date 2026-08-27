import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Sanity Live Products Proxy Endpoint (avoids browser CORS issues)
  app.get("/api/sanity-products", async (req, res) => {
    try {
      const projectId = "q9d6pxzm";
      const dataset = "production";
      const apiVersion = "2024-01-01";
      const query = (typeof req.query.query === "string" && req.query.query.trim().length > 0)
        ? req.query.query
        : `*[_type == "product" || _type in ["product", "clothingItem", "clothing", "item"] || defined(price) || defined(title) || defined(clothingImages) || defined(clothingImage)] | order(_createdAt desc) {
          _id,
          _type,
          _createdAt,
          _updatedAt,
          title,
          name,
          price,
          originalPrice,
          compareAtPrice,
          category,
          collection,
          clothingImages,
          "clothingImageUrls": clothingImages[].asset->url,
          clothingImage,
          "clothingImageUrl": clothingImage.asset->url,
          additionalImages,
          "additionalImageUrls": additionalImages[].asset->url,
          mainImage,
          "mainImageUrl": mainImage.asset->url,
          productVideo,
          "productVideoUrl": productVideo.asset->url,
          videoFile,
          "videoFileUrl": videoFile.asset->url,
          videoUrl,
          video,
          "videoAssetUrl": video.asset->url,
          tagline,
          subtitle,
          description,
          sizes,
          inStock,
          isFeatured,
          featured,
          rating,
          reviewCount,
          instagramPostUrl
        }`;

      const sanityUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
      const response = await fetch(sanityUrl, {
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Sanity HTTP Error ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as { result?: any[] };
      return res.json({
        success: true,
        result: data.result || [],
      });
    } catch (error: any) {
      console.warn("Sanity proxy fetch notice:", error?.message || error);
      return res.status(200).json({
        success: false,
        error: error?.message || "Failed to fetch from Sanity",
        result: [],
      });
    }
  });

  // AI Kids Fashion Stylist Endpoint
  app.post("/api/stylist", async (req, res) => {
    try {
      const { prompt, childAge, gender, occasion, currentItems } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({
          reply: `Here's our styling tip from Rare by KidsPro: For a ${childAge || 'young child'} attending a ${occasion || 'special event'}, we highly recommend pairing our Luxe Waffle-Knit Resort Set with lightweight breathable sneakers, or our Royale Tulle & Silk Party Twirl Dress with soft floral headbands! All made with gentle, hypoallergenic organic fabrics.`
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are the lead children's fashion consultant and size specialist for "Rare by KidsPro" (Instagram: @rare.bykidspro), a premier boutique for high-end, comfortable, breathable kids clothing.
Offer warm, practical, stylish advice for parents shopping for their children (babies, toddlers, young kids). Recommend organic fabrics, suitable fits, matching brother/sister combos, accessories (sun hats, sneakers, party headbands), and size recommendations based on child age/height.
Keep answers upbeat, elegant, helpful, and concise (under 140 words). Mention signature @rare.bykidspro styles when relevant.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemInstruction}\n\nUser Question: ${prompt}\nContext: Child Age: ${childAge || 'Not specified'}, Gender/Preference: ${gender || 'Any'}, Occasion: ${occasion || 'Everyday/Special'}, Cart items: ${JSON.stringify(currentItems || [])}`
              }
            ]
          }
        ]
      });

      const replyText = response.text || "We're thrilled to style your little one! Check out our bestselling Organic Waffle Sets and Twirl Party Dresses.";
      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Stylist API error:", error);
      return res.json({
        reply: "Welcome to Rare by KidsPro! For the best fit and look, choose our breathable organic waffle sets for everyday comfort or our signature twirl dress & linen suit for milestone celebrations."
      });
    }
  });

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rare by KidsPro server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
