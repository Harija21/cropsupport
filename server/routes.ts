import express, { type Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { GoogleGenAI, Modality } from "@google/genai";
import multer from "multer";
import fs from "fs";

const JWT_SECRET = process.env.SESSION_SECRET || "fallback_secret";
const upload = multer({ dest: "uploads/" });

// Setup Gemini AI for text & image based tasks
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Serve uploads
  app.use("/uploads", express.static("uploads"));

  // ===================================
  // AUTH ROUTES
  // ===================================
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByUsername(input.username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists", field: "username" });
      }
      
      const user = await storage.createUser(input);
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
      res.status(201).json({ token, user });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(input.username);
      
      // In a real app we would use bcrypt, but keeping it simple as per requirements
      if (!user || user.password !== input.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
      res.status(200).json({ token, user });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.auth.me.path, authMiddleware, async (req: any, res: any) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ===================================
  // AI CHATBOT ROUTES
  // ===================================
  app.post(api.ai.chat.path, authMiddleware, async (req: any, res: any) => {
    try {
      const { question } = api.ai.chat.input.parse(req.body);
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `You are an expert agricultural advisor. Answer this farmer's question: ${question}` }] }
        ],
      });

      const answer = response.text || "I'm sorry, I could not generate an answer at this time.";
      
      const query = await storage.createQuery({
        userId: req.userId,
        question,
        answer
      });

      res.status(200).json(query);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid input" });
      console.error(error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  app.get(api.ai.history.path, authMiddleware, async (req: any, res: any) => {
    try {
      const queries = await storage.getUserQueries(req.userId);
      res.status(200).json(queries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  // ===================================
  // CROP DISEASE DETECTION ROUTES
  // ===================================
  app.post(api.disease.detect.path, authMiddleware, upload.single("image"), async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image is required", field: "image" });
      }

      // Read image file as base64 for Gemini
      const imageBytes = fs.readFileSync(req.file.path);
      const base64Image = Buffer.from(imageBytes).toString("base64");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { 
            role: "user", 
            parts: [
              { text: "Analyze this image of a crop. Identify any disease or issues, and provide detailed treatment advice. Format your response strictly as: 'Prediction: [Disease name or Healthy]\\nAdvice: [Treatment instructions]'" },
              { inlineData: { data: base64Image, mimeType: req.file.mimetype } }
            ] 
          }
        ],
      });

      const aiResponse = response.text || "";
      
      // Parse the output
      let prediction = "Unknown";
      let advice = "Please consult an expert.";
      
      if (aiResponse.includes("Prediction:") && aiResponse.includes("Advice:")) {
        const parts = aiResponse.split("Advice:");
        prediction = parts[0].replace("Prediction:", "").trim();
        advice = parts[1].trim();
      } else {
        advice = aiResponse;
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      const report = await storage.createDiseaseReport({
        userId: req.userId,
        imageUrl,
        prediction,
        advice
      });

      res.status(200).json(report);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  app.get(api.disease.history.path, authMiddleware, async (req: any, res: any) => {
    try {
      const reports = await storage.getUserDiseaseReports(req.userId);
      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  // ===================================
  // WEATHER ADVISORY ROUTES
  // ===================================
  app.get(api.weather.get.path, authMiddleware, async (req: any, res: any) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user) return res.status(401).json({ message: "User not found" });

      // We don't have OpenWeather API key here yet, so simulating it based on the location
      // This allows the app to function immediately, and we can swap it for real API calls
      // if an integration key is provided.
      const isRainy = Math.random() > 0.7;
      const temp = Math.floor(Math.random() * 20) + 15; // 15-35 C
      const condition = isRainy ? "Rain" : (temp > 28 ? "Sunny" : "Cloudy");
      
      let suggestion = "Good conditions for general farming activities.";
      if (isRainy) suggestion = "Expect rain. Postpone pesticide spraying and ensure proper drainage.";
      else if (temp > 30) suggestion = "High temperatures. Ensure adequate irrigation for crops early in the morning.";

      res.status(200).json({
        temp,
        condition,
        suggestion,
        location: user.location
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  // ===================================
  // COMMUNITY ROUTES
  // ===================================
  app.get(api.community.list.path, async (req: any, res: any) => {
    try {
      const posts = await storage.getCommunityPosts();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  app.post(api.community.create.path, authMiddleware, async (req: any, res: any) => {
    try {
      const input = api.community.create.input.parse(req.body);
      const user = await storage.getUser(req.userId);
      if (!user) return res.status(401).json({ message: "User not found" });

      const post = await storage.createCommunityPost({
        ...input,
        userId: req.userId,
        authorName: user.name
      });

      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid input" });
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Call the seed function
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const existingPosts = await storage.getCommunityPosts();
  if (existingPosts.length === 0) {
    // Create a dummy user for posts
    const user = await storage.createUser({
      username: "demo_farmer",
      password: "password123",
      name: "John Doe",
      location: "Iowa, USA"
    });

    await storage.createCommunityPost({
      userId: user.id,
      authorName: user.name,
      title: "Best time to plant corn this season?",
      content: "I'm looking at the weather forecast and wondering if I should wait another week before planting. Any thoughts from others in the Midwest?"
    });

    await storage.createCommunityPost({
      userId: user.id,
      authorName: user.name,
      title: "Success with organic pest control",
      content: "I've started using neem oil instead of synthetic pesticides and I'm seeing great results on my tomato plants. Highly recommend!"
    });
  }
}
