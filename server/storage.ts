import {
  type User,
  type InsertUser,
  type Artwork,
  type InsertArtwork,
  type Certification,
  type InsertCertification,
  type ContactMessage,
  type InsertContactMessage,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Artworks
  getAllArtworks(): Promise<Artwork[]>;
  getArtwork(id: string): Promise<Artwork | undefined>;
  createArtwork(artwork: InsertArtwork): Promise<Artwork>;
  updateArtwork(id: string, artwork: Partial<InsertArtwork>): Promise<Artwork | undefined>;
  deleteArtwork(id: string): Promise<boolean>;

  // Certifications
  getAllCertifications(): Promise<Certification[]>;
  getCertification(id: string): Promise<Certification | undefined>;
  createCertification(certification: InsertCertification): Promise<Certification>;
  updateCertification(id: string, certification: Partial<InsertCertification>): Promise<Certification | undefined>;
  deleteCertification(id: string): Promise<boolean>;

  // Contact Messages
  getAllContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private artworks: Map<string, Artwork>;
  private certifications: Map<string, Certification>;
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.users = new Map();
    this.artworks = new Map();
    this.certifications = new Map();
    this.contactMessages = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Artworks
  async getAllArtworks(): Promise<Artwork[]> {
    return Array.from(this.artworks.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getArtwork(id: string): Promise<Artwork | undefined> {
    return this.artworks.get(id);
  }

  async createArtwork(insertArtwork: InsertArtwork): Promise<Artwork> {
    const id = randomUUID();
    const artwork: Artwork = { ...insertArtwork, id };
    this.artworks.set(id, artwork);
    return artwork;
  }

  async updateArtwork(id: string, updates: Partial<InsertArtwork>): Promise<Artwork | undefined> {
    const artwork = this.artworks.get(id);
    if (!artwork) return undefined;
    const updated = { ...artwork, ...updates };
    this.artworks.set(id, updated);
    return updated;
  }

  async deleteArtwork(id: string): Promise<boolean> {
    return this.artworks.delete(id);
  }

  // Certifications
  async getAllCertifications(): Promise<Certification[]> {
    return Array.from(this.certifications.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getCertification(id: string): Promise<Certification | undefined> {
    return this.certifications.get(id);
  }

  async createCertification(insertCertification: InsertCertification): Promise<Certification> {
    const id = randomUUID();
    const certification: Certification = { ...insertCertification, id };
    this.certifications.set(id, certification);
    return certification;
  }

  async updateCertification(id: string, updates: Partial<InsertCertification>): Promise<Certification | undefined> {
    const certification = this.certifications.get(id);
    if (!certification) return undefined;
    const updated = { ...certification, ...updates };
    this.certifications.set(id, updated);
    return updated;
  }

  async deleteCertification(id: string): Promise<boolean> {
    return this.certifications.delete(id);
  }

  // Contact Messages
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date() 
    };
    this.contactMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
