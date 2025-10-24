
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import DonationCard, { CategoryIcon } from './components/DonationCard';
import { Donation, Request, View, ItemCategory, User } from './types';
import { CATEGORIES } from './constants';
import DonationForm from './components/DonationForm';
import RequestForm from './components/RequestForm';
import ContactForm from './components/ContactForm';
import AdminMatcher from './components/AdminMatcher';
import { SearchIcon } from './components/Icons';
import Modal from './components/Modal';
import Login from './components/Login';
import { api } from './services/api';
import FullScreenSpinner from './components/FullScreenSpinner';

const PageWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-neutral-800 mb-6">{title}</h2>
        {children}
    </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const [donationsData, requestsData] = await Promise.all([
            api.getDonations(),
            api.getRequests()
          ]);
          setDonations(donationsData);
          setRequests(requestsData);
        } catch (err) {
          setError("Failed to load application data. Please try refreshing the page.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [currentUser]);


  const handleSetView = (view: View) => {
    if (view === 'admin' && currentUser?.role !== 'admin') {
      setCurrentView('home');
      return;
    }
     if ((view === 'donate' || view === 'request') && !currentUser) {
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
    setDonations([]);
    setRequests([]);
    setIsLoading(true);
  }

  const addDonation = async (donation: Omit<Donation, 'id' | 'createdAt'>) => {
    const newDonation = await api.addDonation(donation);
    setDonations(prev => [newDonation, ...prev]);
  };

  const addRequest = async (request: Omit<Request, 'id' | 'createdAt'>) => {
      const newRequest = await api.addRequest(request);
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
  
  if (isLoading) {
    return <FullScreenSpinner />;
  }

  if (error) {
    return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md max-w-md text-center">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
         </div>
       </div>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case 'donate':
        return <PageWrapper title="Submit a Donation"><DonationForm addDonation={addDonation} setCurrentView={handleSetView} currentUser={currentUser} /></PageWrapper>;
      case 'request':
        return <PageWrapper title="Submit a Request"><RequestForm addRequest={addRequest} setCurrentView={handleSetView} currentUser={currentUser} /></PageWrapper>;
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
                            
                            <div className="pt-4 border-t border-neutral-200 space-y-2">
                                <p className="text-sm text-neutral-600">
                                    <span className="font-semibold">Location:</span> {selectedDonation.donorLocation}
                                </p>
                                <p className="text-sm text-neutral-500">
                                    Donated on: {selectedDonation.createdAt.toLocaleDateString()}
                                </p>
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
