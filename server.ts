import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "100mb", extended: true }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Check which Kaya image assets are currently uploaded and available on disk
  app.get("/api/kaya-assets", (req, res) => {
    try {
      const kayaPublicDir = path.join(process.cwd(), "public", "images", "kaya");
      if (!fs.existsSync(kayaPublicDir)) {
        fs.mkdirSync(kayaPublicDir, { recursive: true });
      }
      const files = fs.readdirSync(kayaPublicDir);
      return res.json({ success: true, files });
    } catch (err: any) {
      return res.json({ success: false, files: [], error: err?.message });
    }
  });

  // Comprehensive photoshoot assets retrieval for all collections
  app.get("/api/photoshoot-assets", (req, res) => {
    try {
      const collectionQuery = typeof req.query.collection === 'string' ? req.query.collection.trim().toLowerCase() : '';
      const baseImagesDir = path.join(process.cwd(), "public", "images");
      if (!fs.existsSync(baseImagesDir)) {
        fs.mkdirSync(baseImagesDir, { recursive: true });
      }

      // Ensure primary collections exist
      ['kaya', 'moyo', 'accessories', 'bundles', 'general'].forEach((c) => {
        const dirPath = path.join(baseImagesDir, c);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      });

      const allSubdirs = fs.readdirSync(baseImagesDir).filter((f) => {
        try {
          return fs.statSync(path.join(baseImagesDir, f)).isDirectory();
        } catch {
          return false;
        }
      });

      const dirsToScan = collectionQuery
        ? allSubdirs.filter((d) => d.toLowerCase() === collectionQuery)
        : allSubdirs;

      const assets: Array<{ filename: string; url: string; collection: string; sizeBytes: number; modifiedAt: string; isVideo?: boolean }> = [];

      for (const dir of dirsToScan) {
        const fullDir = path.join(baseImagesDir, dir);
        if (fs.existsSync(fullDir)) {
          const files = fs.readdirSync(fullDir);
          for (const file of files) {
            if (file.match(/\.(png|jpg|jpeg|webp|gif|svg|mp4|webm|mov|m4v|ogg)$/i)) {
              try {
                const stat = fs.statSync(path.join(fullDir, file));
                const isVideo = /\.(mp4|webm|mov|m4v|ogg)$/i.test(file);
                assets.push({
                  filename: file,
                  url: `/images/${dir}/${file}`,
                  collection: dir,
                  sizeBytes: stat.size,
                  modifiedAt: stat.mtime.toISOString(),
                  isVideo,
                });
              } catch (_) {}
            }
          }
        }
      }

      return res.json({ success: true, assets });
    } catch (err: any) {
      return res.json({ success: false, assets: [], error: err?.message });
    }
  });

  // Direct Raw Photoshoot Asset Upload for any collection (images and videos)
  app.post("/api/upload-photoshoot-asset", (req, res) => {
    try {
      const { filename, base64Data, collection } = req.body;
      if (!filename || !base64Data) {
        return res.status(400).json({ success: false, error: "filename and base64Data are required" });
      }

      const collectionDir = (typeof collection === 'string' && collection.trim().length > 0)
        ? collection.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-")
        : "general";

      // Clean base64 header if present (handles any image or video mime type)
      const cleanedBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(cleanedBase64, "base64");

      const targetDir = path.join(process.cwd(), "public", "images", collectionDir);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const safeFilename = path.basename(filename);
      const targetPathPublic = path.join(targetDir, safeFilename);
      fs.writeFileSync(targetPathPublic, buffer);

      // Also mirror to src/assets/images if directory exists
      try {
        const srcAssetsDir = path.join(process.cwd(), "src", "assets", "images");
        if (fs.existsSync(srcAssetsDir)) {
          fs.writeFileSync(path.join(srcAssetsDir, safeFilename), buffer);
        }
      } catch (copyErr) {
        console.warn("Notice: could not copy to src/assets/images:", copyErr);
      }

      const isVideo = /\.(mp4|webm|mov|m4v|ogg)$/i.test(safeFilename);
      console.log(`Saved raw photoshoot asset as-is to [${collectionDir}]: ${safeFilename} (${buffer.length} bytes, isVideo: ${isVideo})`);
      return res.json({
        success: true,
        filename: safeFilename,
        collection: collectionDir,
        url: `/images/${collectionDir}/${safeFilename}`,
        sizeBytes: buffer.length,
        isVideo,
      });
    } catch (err: any) {
      console.error("Photoshoot asset upload error:", err);
      return res.status(500).json({ success: false, error: err?.message || "Failed to write asset" });
    }
  });

  // Direct Asset Upload Endpoint (allows user to upload their original uncompressed Kaya photoshoot PNGs)
  app.post("/api/upload-kaya-asset", (req, res) => {
    try {
      const { filename, base64Data } = req.body;
      if (!filename || !base64Data) {
        return res.status(400).json({ success: false, error: "filename and base64Data are required" });
      }

      // Clean base64 header if present (e.g. data:image/png;base64,...)
      const cleanedBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(cleanedBase64, "base64");

      // Save to public/images/kaya directory for zero-compilation static serving
      const kayaPublicDir = path.join(process.cwd(), "public", "images", "kaya");
      if (!fs.existsSync(kayaPublicDir)) {
        fs.mkdirSync(kayaPublicDir, { recursive: true });
      }
      const safeFilename = path.basename(filename);
      const targetPathPublic = path.join(kayaPublicDir, safeFilename);
      fs.writeFileSync(targetPathPublic, buffer);

      // Also save copy to src/assets/images if directory exists
      try {
        const srcAssetsDir = path.join(process.cwd(), "src", "assets", "images");
        if (fs.existsSync(srcAssetsDir)) {
          fs.writeFileSync(path.join(srcAssetsDir, safeFilename), buffer);
        }
      } catch (copyErr) {
        console.warn("Notice: could not copy to src/assets/images:", copyErr);
      }

      console.log(`Saved original asset as-is: ${safeFilename} (${buffer.length} bytes)`);
      return res.json({
        success: true,
        filename: safeFilename,
        url: `/images/kaya/${safeFilename}`,
        sizeBytes: buffer.length,
      });
    } catch (err: any) {
      console.error("Asset upload error:", err);
      return res.status(500).json({ success: false, error: err?.message || "Failed to write asset" });
    }
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

  // Create / Sync Order and Gift Note to Sanity Studio endpoint
  app.post("/api/create-order", async (req, res) => {
    try {
      const order = req.body;
      const projectId = "q9d6pxzm";
      const dataset = "production";
      const apiVersion = "2024-01-01";
      const token = process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN;

      if (!token) {
        // Return clear notice that order is recorded locally and token is needed for Sanity Studio write
        return res.json({
          success: true,
          syncedToSanity: false,
          message: "Order recorded in local store engine. To sync directly to Sanity Studio, add SANITY_API_TOKEN in environment settings.",
        });
      }

      const sanityDoc = {
        _type: "order",
        _id: `order-${order.orderNumber || Date.now()}`,
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber,
        orderDate: order.createdAt || new Date().toISOString(),
        customer: {
          fullName: order.customer?.fullName,
          phone: order.customer?.phone,
          email: order.customer?.email,
          instagramHandle: order.customer?.instagramHandle,
          streetAddress: order.customer?.streetAddress,
          city: order.customer?.city,
          region: order.customer?.stateOrRegion,
          deliveryNotes: order.customer?.deliveryNotes,
        },
        giftNote: order.giftNote ? {
          to: order.giftNote.to,
          from: order.giftNote.from,
          message: order.giftNote.message,
          packagingBox: order.giftNote.boxStyle || order.giftNote.packagingBox,
          ribbonColor: order.giftNote.ribbonColor,
          isCalligraphyRequired: true,
        } : null,
        giftCardNote: order.giftNote ? {
          to: order.giftNote.to,
          from: order.giftNote.from,
          message: order.giftNote.message,
          packagingBox: order.giftNote.boxStyle || order.giftNote.packagingBox,
          ribbonColor: order.giftNote.ribbonColor,
          isCalligraphyRequired: true,
        } : null,
        giftNoteMessage: order.giftNote?.message || null,
        itemsSummary: (order.items || []).map((i: any) => `${i.quantity}x ${i.product?.name} (${i.selectedSize || 'Standard'})`),
        totalAmount: order.totalAmount,
        currency: order.currency || "TZS",
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus || "paid",
        orderStatus: order.orderStatus || "processing",
      };

      const sanityMutationUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
      const mutateResponse = await fetch(sanityMutationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          mutations: [
            {
              createOrReplace: sanityDoc,
            },
          ],
        }),
      });

      const mutateData = await mutateResponse.json();
      return res.json({
        success: mutateResponse.ok,
        syncedToSanity: mutateResponse.ok,
        sanityResult: mutateData,
      });
    } catch (err: any) {
      console.error("Sanity order sync notice:", err);
      return res.json({
        success: false,
        syncedToSanity: false,
        error: err?.message || "Failed to sync with Sanity",
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
