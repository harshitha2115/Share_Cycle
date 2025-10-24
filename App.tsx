import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import DonationCard, { CategoryIcon } from './components/DonationCard';
import { Donation, Request, View, ItemCategory, ItemCondition, User } from './types';
import { CATEGORIES } from './constants';
import DonationForm from './components/DonationForm';
import RequestForm from './components/RequestForm';
import ContactForm from './components/ContactForm';
import AdminMatcher from './components/AdminMatcher';
import { SearchIcon } from './components/Icons';
import Modal from './components/Modal';
import Login from './components/Login';

// Mock Data
const initialDonations: Donation[] = [
    { id: 'd1', category: ItemCategory.Electronics, description: '24-inch Dell Monitor, works perfectly', condition: ItemCondition.Good, photo: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1', createdAt: new Date('2023-10-01') },
    { id: 'd2', category: ItemCategory.Furniture, description: 'Sturdy wooden desk with three drawers', condition: ItemCondition.LikeNew, photo: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1', createdAt: new Date('2023-10-02') },
    { id: 'd3', category: ItemCategory.Clothing, description: "Men's winter jacket, size Large", condition: ItemCondition.Good, photo: 'https://images.pexels.com/photos/52573/winter-jacket-winter-clothes-jacket-52573.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1', createdAt: new Date('2023-10-03') },
    { id: 'd4', category: ItemCategory.Books, description: 'Collection of 5 classic novels, paperback', condition: ItemCondition.Fair, photo: 'https://images.pexels.com/photos/220326/pexels-photo-220326.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1', createdAt: new Date('2023-10-04') },
    { id: 'd5', category: ItemCategory.Kitchenware, description: 'Complete set of pots and pans', condition: ItemCondition.LikeNew, photo: 'https://images.pexels.com/photos/6605207/pexels-photo-6605207.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1', createdAt: new Date('2023-10-05') },
    { id: 'd6', category: ItemCategory.Electronics, description: 'Old but functional laser printer', condition: ItemCondition.Fair, photo: 'https://images.pexels.com/photos/265076/pexels-photo-265076.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1', createdAt: new Date('2023-10-06') },
];

const initialRequests: Request[] = [
    { id: 'r1', category: ItemCategory.Electronics, description: 'Need a computer monitor for remote work.', createdAt: new Date() },
    { id: 'r2', category: ItemCategory.Furniture, description: 'Looking for a small desk for my child to do homework.', createdAt: new Date() },
    { id: 'r3', category: ItemCategory.Clothing, description: 'I need a warm coat for the upcoming winter season.', createdAt: new Date() },
    { id: 'r4', category: ItemCategory.Books, description: 'Any fiction books would be appreciated to start a small library.', createdAt: new Date() },
];


const PageWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-neutral-800 mb-6">{title}</h2>
        {children}
    </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const handleSetView = (view: View) => {
    // Role-based access control
    if (view === 'admin' && currentUser?.role !== 'admin') {
      setCurrentView('home');
      return;
    }
     if ((view === 'donate' || view === 'request') && !currentUser) {
      // In a real app you might show a login modal
      alert("Please log in to access this feature.");
      return;
    }
    setCurrentView(view);
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('home');
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  }

  const addDonation = (donation: Omit<Donation, 'id' | 'createdAt'>) => {
    const newDonation: Donation = {
        ...donation,
        id: `d${Date.now()}`,
        createdAt: new Date(),
    };
    setDonations(prev => [newDonation, ...prev]);
  };

  const addRequest = (request: Omit<Request, 'id' | 'createdAt'>) => {
      const newRequest: Request = {
          ...request,
          id: `r${Date.now()}`,
          createdAt: new Date(),
      };
      setRequests(prev => [newRequest, ...prev]);
  };

  const filteredDonations = useMemo(() => {
    return donations
      .filter(d => filterCategory === 'all' || d.category === filterCategory)
      .filter(d => d.description.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [donations, searchTerm, filterCategory]);

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'donate':
        return <PageWrapper title="Submit a Donation"><DonationForm addDonation={addDonation} setCurrentView={handleSetView} /></PageWrapper>;
      case 'request':
        return <PageWrapper title="Submit a Request"><RequestForm addRequest={addRequest} setCurrentView={handleSetView} /></PageWrapper>;
      case 'contact':
        return <PageWrapper title="Contact Us"><ContactForm /></PageWrapper>;
      case 'admin':
        return <PageWrapper title="Admin - AI Donation Matcher"><AdminMatcher donations={donations} requests={requests} /></PageWrapper>;
      case 'home':
      default:
        return (
          <PageWrapper title="Recent Donations">
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 mb-6 sticky top-16 z-40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-2">
                        <input 
                            type="text"
                            placeholder="Search by keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    </div>
                    <div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value as ItemCategory | 'all')}
                            className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT"
                        >
                            <option value="all">All Categories</option>
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            
            {filteredDonations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDonations.map(donation => (
                    <DonationCard key={donation.id} donation={donation} onClick={setSelectedDonation} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-neutral-500">
                    <h3 className="text-xl font-semibold">No Donations Found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            )}

            {selectedDonation && (
                <Modal isOpen={!!selectedDonation} onClose={() => setSelectedDonation(null)} title="Donation Details" size="lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <img src={selectedDonation.photo} alt={selectedDonation.description} className="w-full h-auto max-h-[500px] object-contain rounded-lg" />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-2xl font-bold text-neutral-800">{selectedDonation.description}</h3>
                            
                            <div className="flex flex-wrap items-center gap-4 text-neutral-700">
                                <div className="flex items-center text-lg">
                                    <CategoryIcon category={selectedDonation.category} className="w-6 h-6 mr-2 text-primary-DEFAULT" />
                                    <span className="font-medium">{selectedDonation.category}</span>
                                </div>
                            </div>
                             <div>
                                <span className="text-sm font-semibold uppercase px-3 py-1 bg-secondary-light text-secondary-dark rounded-full">{selectedDonation.condition}</span>
                            </div>
                            
                            <div className="pt-4 border-t border-neutral-200">
                                {/* Fix: Corrected typo from toLocaleDateString() to toLocaleDateString() */}
                                <p className="text-sm text-neutral-500 mt-2">Donated on: {selectedDonation.createdAt.toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
          </PageWrapper>
        );
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      <Header currentView={currentView} setCurrentView={handleSetView} currentUser={currentUser} onLogout={handleLogout} />
      <main>
        {renderView()}
      </main>
      <footer className="bg-neutral-50 mt-12 py-6 border-t border-neutral-200">
        <div className="container mx-auto text-center text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} ShareCycle. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;