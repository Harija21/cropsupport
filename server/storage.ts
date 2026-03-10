import { db } from "./db";
import { 
  users, queries, diseaseReports, communityPosts,
  type InsertUser, type User,
  type InsertQuery, type Query,
  type InsertDiseaseReport, type DiseaseReport,
  type InsertCommunityPost, type CommunityPost 
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createQuery(query: InsertQuery): Promise<Query>;
  getUserQueries(userId: number): Promise<Query[]>;
  
  createDiseaseReport(report: InsertDiseaseReport): Promise<DiseaseReport>;
  getUserDiseaseReports(userId: number): Promise<DiseaseReport[]>;
  
  createCommunityPost(post: InsertCommunityPost & { authorName: string }): Promise<CommunityPost>;
  getCommunityPosts(): Promise<CommunityPost[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createQuery(insertQuery: InsertQuery): Promise<Query> {
    const [query] = await db.insert(queries).values(insertQuery).returning();
    return query;
  }

  async getUserQueries(userId: number): Promise<Query[]> {
    return await db.select().from(queries).where(eq(queries.userId, userId)).orderBy(desc(queries.createdAt));
  }

  async createDiseaseReport(report: InsertDiseaseReport): Promise<DiseaseReport> {
    const [diseaseReport] = await db.insert(diseaseReports).values(report).returning();
    return diseaseReport;
  }

  async getUserDiseaseReports(userId: number): Promise<DiseaseReport[]> {
    return await db.select().from(diseaseReports).where(eq(diseaseReports.userId, userId)).orderBy(desc(diseaseReports.createdAt));
  }

  async createCommunityPost(post: InsertCommunityPost & { authorName: string }): Promise<CommunityPost> {
    const [communityPost] = await db.insert(communityPosts).values(post).returning();
    return communityPost;
  }

  async getCommunityPosts(): Promise<CommunityPost[]> {
    return await db.select().from(communityPosts).orderBy(desc(communityPosts.createdAt));
  }
}

export const storage = new DatabaseStorage();
