
import { Donation, Request, User, ItemCategory, ItemCondition } from '../types';

// --- MOCK DATABASE ---

const users: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@sharecycle.com', role: 'admin' },
  { id: 'u2', name: 'Regular User', email: 'user@sharecycle.com', role: 'user' },
];

const donations: Donation[] = [
    { id: 'd1', category: ItemCategory.Electronics, description: '24-inch Dell Monitor, works perfectly', condition: ItemCondition.Good, photo: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1', createdAt: new Date('2023-10-01'), donorName: 'Alice Johnson', donorEmail: 'alice.j@example.com', donorPhone: '555-0101', donorLocation: 'City Center' },
    { id: 'd2', category: ItemCategory.Furniture, description: 'Sturdy wooden desk with three drawers', condition: ItemCondition.LikeNew, photo: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1', createdAt: new Date('2023-10-02'), donorName: 'Bob Williams', donorEmail: 'bob.w@example.com', donorPhone: '555-0102', donorLocation: 'North Suburbs' },
    { id: 'd3', category: ItemCategory.Clothing, description: "Men's winter jacket, size Large", condition: ItemCondition.Good, photo: 'https://images.pexels.com/photos/52573/winter-jacket-winter-clothes-jacket-52573.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1', createdAt: new Date('2023-10-03'), donorName: 'Charlie Brown', donorEmail: 'charlie.b@example.com', donorPhone: '555-0103', donorLocation: 'Eastside' },
    { id: 'd4', category: ItemCategory.Books, description: 'Collection of 5 classic novels, paperback', condition: ItemCondition.Fair, photo: 'https://images.pexels.com/photos/220326/pexels-photo-220326.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1', createdAt: new Date('2023-10-04'), donorName: 'Diana Prince', donorEmail: 'diana.p@example.com', donorPhone: '555-0104', donorLocation: 'West End' },
    { id: 'd5', category: ItemCategory.Kitchenware, description: 'Complete set of pots and pans', condition: ItemCondition.LikeNew, photo: 'https://images.pexels.com/photos/6605207/pexels-photo-6605207.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1', createdAt: new Date('2023-10-05'), donorName: 'Eve Adams', donorEmail: 'eve.a@example.com', donorPhone: '555-0105', donorLocation: 'City Center' },
    { id: 'd6', category: ItemCategory.Electronics, description: 'Old but functional laser printer', condition: ItemCondition.Fair, photo: 'https://images.pexels.com/photos/265076/pexels-photo-265076.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1', createdAt: new Date('2023-10-06'), donorName: 'Frank Miller', donorEmail: 'frank.m@example.com', donorPhone: '555-0106', donorLocation: 'South Park' },
];

const requests: Request[] = [
    { id: 'r1', category: ItemCategory.Electronics, description: 'Need a computer monitor for remote work.', createdAt: new Date(), requesterName: 'Gary Smith', requesterEmail: 'gary.s@example.com', requesterPhone: '555-0107', requesterLocation: 'West End' },
    { id: 'r2', category: ItemCategory.Furniture, description: 'Looking for a small desk for my child to do homework.', createdAt: new Date(), requesterName: 'Helen White', requesterEmail: 'helen.w@example.com', requesterPhone: '555-0108', requesterLocation: 'North Suburbs' },
    { id: 'r3', category: ItemCategory.Clothing, description: 'I need a warm coat for the upcoming winter season.', createdAt: new Date(), requesterName: 'Ian Green', requesterEmail: 'ian.g@example.com', requesterPhone: '555-0109', requesterLocation: 'Eastside' },
    { id: 'r4', category: ItemCategory.Books, description: 'Any fiction books would be appreciated to start a small library.', createdAt: new Date(), requesterName: 'Jane Doe', requesterEmail: 'jane.d@example.com', requesterPhone: '555-0110', requesterLocation: 'City Center' },
];

// --- API FUNCTIONS ---

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  login: async (email: string, password?: string): Promise<User | null> => {
    await delay(500);
    const user = users.find(u => u.email === email);
    // Password check is ignored in this mock API
    return user || null;
  },

  getDonations: async (): Promise<Donation[]> => {
    await delay(800);
    return [...donations].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  getRequests: async (): Promise<Request[]> => {
    await delay(800);
    return [...requests].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  
  addDonation: async (donationData: Omit<Donation, 'id' | 'createdAt'>): Promise<Donation> => {
    await delay(1000);
    const newDonation: Donation = {
        ...donationData,
        id: `d${Date.now()}`,
        createdAt: new Date(),
    };
    donations.unshift(newDonation);
    return newDonation;
  },

  addRequest: async (requestData: Omit<Request, 'id' | 'createdAt'>): Promise<Request> => {
      await delay(1000);
      const newRequest: Request = {
          ...requestData,
          id: `r${Date.now()}`,
          createdAt: new Date(),
      };
      requests.unshift(newRequest);
      return newRequest;
  },
};
