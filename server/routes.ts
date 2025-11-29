import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import archiver from "archiver";
import nodemailer from "nodemailer";
import { insertContactMessageSchema } from "@shared/schema";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Admin password (in production, use environment variable)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "shahzadart2024";

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve uploaded files
  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(uploadDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      next();
    }
  });

  // ============ ARTWORKS API ============
  
  // Get all artworks
  app.get("/api/artworks", async (_req, res) => {
    try {
      const artworks = await storage.getAllArtworks();
      res.json(artworks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artworks" });
    }
  });

  // Get single artwork
  app.get("/api/artworks/:id", async (req, res) => {
    try {
      const artwork = await storage.getArtwork(req.params.id);
      if (!artwork) {
        return res.status(404).json({ error: "Artwork not found" });
      }
      res.json(artwork);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artwork" });
    }
  });

  // Create artwork (with image upload)
  app.post("/api/artworks", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image is required" });
      }

      const { title, description, medium, dimensions } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      const artwork = await storage.createArtwork({
        title,
        description: description || null,
        medium: medium || null,
        dimensions: dimensions || null,
        imageUrl,
        order: 0,
      });

      res.status(201).json(artwork);
    } catch (error) {
      res.status(500).json({ error: "Failed to create artwork" });
    }
  });

  // Update artwork
  app.patch("/api/artworks/:id", upload.single("image"), async (req, res) => {
    try {
      const { title, description, medium, dimensions, order } = req.body;
      const updates: Record<string, any> = {};
      
      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (medium !== undefined) updates.medium = medium;
      if (dimensions !== undefined) updates.dimensions = dimensions;
      if (order !== undefined) updates.order = parseInt(order);
      if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;

      const artwork = await storage.updateArtwork(req.params.id, updates);
      if (!artwork) {
        return res.status(404).json({ error: "Artwork not found" });
      }
      res.json(artwork);
    } catch (error) {
      res.status(500).json({ error: "Failed to update artwork" });
    }
  });

  // Delete artwork
  app.delete("/api/artworks/:id", async (req, res) => {
    try {
      const success = await storage.deleteArtwork(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Artwork not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete artwork" });
    }
  });

  // ============ CERTIFICATIONS API ============

  // Get all certifications
  app.get("/api/certifications", async (_req, res) => {
    try {
      const certifications = await storage.getAllCertifications();
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch certifications" });
    }
  });

  // Get single certification
  app.get("/api/certifications/:id", async (req, res) => {
    try {
      const certification = await storage.getCertification(req.params.id);
      if (!certification) {
        return res.status(404).json({ error: "Certification not found" });
      }
      res.json(certification);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch certification" });
    }
  });

  // Create certification (with image upload)
  app.post("/api/certifications", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image is required" });
      }

      const { title, issuer, date } = req.body;
      if (!title || !issuer) {
        return res.status(400).json({ error: "Title and issuer are required" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      const certification = await storage.createCertification({
        title,
        issuer,
        date: date || null,
        imageUrl,
        order: 0,
      });

      res.status(201).json(certification);
    } catch (error) {
      res.status(500).json({ error: "Failed to create certification" });
    }
  });

  // Update certification
  app.patch("/api/certifications/:id", upload.single("image"), async (req, res) => {
    try {
      const { title, issuer, date, order } = req.body;
      const updates: Record<string, any> = {};
      
      if (title !== undefined) updates.title = title;
      if (issuer !== undefined) updates.issuer = issuer;
      if (date !== undefined) updates.date = date;
      if (order !== undefined) updates.order = parseInt(order);
      if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;

      const certification = await storage.updateCertification(req.params.id, updates);
      if (!certification) {
        return res.status(404).json({ error: "Certification not found" });
      }
      res.json(certification);
    } catch (error) {
      res.status(500).json({ error: "Failed to update certification" });
    }
  });

  // Delete certification
  app.delete("/api/certifications/:id", async (req, res) => {
    try {
      const success = await storage.deleteCertification(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Certification not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete certification" });
    }
  });

  // ============ CONTACT API ============

  app.post("/api/contact", async (req, res) => {
    try {
      const validation = insertContactMessageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid contact data", details: validation.error.errors });
      }

      const { name, email, message } = validation.data;

      // Save to storage
      const contactMessage = await storage.createContactMessage({ name, email, message });

      // Try to send email notification
      let emailSent = false;
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const transporter = createTransporter();
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "alyakram786@gmail.com",
            subject: `Portfolio Contact: ${name}`,
            html: `
              <h2>New Contact Message</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br>")}</p>
            `,
            replyTo: email,
          });
          emailSent = true;
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
        }
      } else {
        console.log("Email not configured - message saved to storage only");
      }

      res.status(201).json({ 
        success: true, 
        message: "Message received successfully",
        emailSent 
      });
    } catch (error) {
      console.error("Contact error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // ============ ADMIN API ============

  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  // ============ DOWNLOAD SOURCE CODE API ============

  app.get("/api/download-source", async (_req, res) => {
    try {
      const projectRoot = process.cwd();
      
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=shahzad-akram-portfolio-source.zip");

      const archive = archiver("zip", { zlib: { level: 9 } });
      
      archive.on("error", (err) => {
        console.error("Archive error:", err);
        res.status(500).end();
      });

      archive.pipe(res);

      // Add directories and files
      const includeDirs = ["client", "server", "shared"];
      const includeFiles = [
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "tailwind.config.ts",
        "postcss.config.js",
        "drizzle.config.ts",
        "vite.config.ts",
        "components.json",
      ];

      // Add directories
      for (const dir of includeDirs) {
        const dirPath = path.join(projectRoot, dir);
        if (fs.existsSync(dirPath)) {
          archive.directory(dirPath, dir);
        }
      }

      // Add individual files
      for (const file of includeFiles) {
        const filePath = path.join(projectRoot, file);
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: file });
        }
      }

      // Add attached assets
      const assetsPath = path.join(projectRoot, "attached_assets");
      if (fs.existsSync(assetsPath)) {
        archive.directory(assetsPath, "attached_assets");
      }

      // Add design guidelines
      const designGuidelinesPath = path.join(projectRoot, "design_guidelines.md");
      if (fs.existsSync(designGuidelinesPath)) {
        archive.file(designGuidelinesPath, { name: "design_guidelines.md" });
      }

      // Add a README for the downloaded source
      const readme = `# Shahzad Akram - Artist Portfolio

A stunning, fully-animated artist portfolio website with:
- Artwork gallery with masonry grid layout
- Certifications and achievements showcase
- Contact form
- Admin panel for content management
- Light/dark mode with multiple gradient themes
- Parallax effects and smooth animations

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

3. Open http://localhost:5000 in your browser

## Admin Access

Click the + button in the bottom-right corner and enter the admin password to upload artworks and certifications.

## Customization

- Edit \`client/src/index.css\` to change colors and themes
- Modify \`tailwind.config.ts\` for design tokens
- Update \`client/index.html\` for SEO meta tags

---
Created with love by Shahzad Akram
`;
      archive.append(readme, { name: "README.md" });

      await archive.finalize();
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ error: "Failed to create download" });
    }
  });

  return httpServer;
}
