export enum ItemCategory {
  Electronics = "Electronics",
  Furniture = "Furniture",
  Clothing = "Clothing",
  Books = "Books",
  Kitchenware = "Kitchenware",
  Other = "Other",
}

export enum ItemCondition {
  New = "New",
  LikeNew = "Like New",
  Good = "Good",
  Fair = "Fair",
}

export interface Donation {
  id: string;
  category: ItemCategory;
  description: string;
  condition: ItemCondition;
  photo: string; // Base64 data URL
  createdAt: Date;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  donorLocation: string;
}

export interface Request {
  id: string;
  category: ItemCategory;
  description: string;
  createdAt: Date;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  requesterLocation: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export type View = 'home' | 'donate' | 'request' | 'contact' | 'admin' | 'login';

export interface MatchResult {
  requestId: string;
  donationId: string | null;
  confidence: 'high' | 'medium' | 'low' | null;
  reasoning: string;
}
