
import React, { useState } from 'react';
import { ItemCategory, Request, View, User } from '../types';
import { CATEGORIES } from '../constants';
import Modal from './Modal';

interface RequestFormProps {
  addRequest: (request: Omit<Request, 'id' | 'createdAt'>) => Promise<void>;
  setCurrentView: (view: View) => void;
  currentUser: User;
}

const RequestForm: React.FC<RequestFormProps> = ({ addRequest, setCurrentView, currentUser }) => {
  const [category, setCategory] = useState<ItemCategory>(ItemCategory.Other);
  const [description, setDescription] = useState('');

  const [requesterName, setRequesterName] = useState(currentUser.name || '');
  const [requesterEmail, setRequesterEmail] = useState(currentUser.email || '');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [requesterLocation, setRequesterLocation] = useState('');
  
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !requesterName.trim() || !requesterEmail.trim() || !requesterPhone.trim() || !requesterLocation.trim()) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
        await addRequest({ category, description, requesterName, requesterEmail, requesterPhone, requesterLocation });
        setIsModalOpen(true);
    } catch (err) {
        setError('There was an error submitting your request. Please try again.');
        console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };

  const closeModalAndReset = () => {
    setIsModalOpen(false);
    setCategory(ItemCategory.Other);
    setDescription('');
    setRequesterName(currentUser.name || '');
    setRequesterEmail(currentUser.email || '');
    setRequesterPhone('');
    setRequesterLocation('');
    setCurrentView('home');
  }


  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-neutral-50 p-8 rounded-xl border border-neutral-200">
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-6 text-neutral-900 border-b border-neutral-200 pb-2">Item Needed</h3>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-neutral-700">Category of Item Needed</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ItemCategory)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT sm:text-sm rounded-md"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Describe Your Need</label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full shadow-sm sm:text-sm border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT"
              placeholder="e.g., I need a sturdy desk for my child to do their schoolwork."
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium leading-6 text-neutral-900 border-b border-neutral-200 pb-2">Your Contact Information</h3>
            <p className="text-sm text-neutral-500">This information will only be shared with an administrator to coordinate the donation.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="requesterName" className="block text-sm font-medium text-neutral-700">Full Name</label>
                  <input type="text" id="requesterName" value={requesterName} onChange={e => setRequesterName(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT" />
                </div>
                 <div>
                  <label htmlFor="requesterEmail" className="block text-sm font-medium text-neutral-700">Email Address</label>
                  <input type="email" id="requesterEmail" value={requesterEmail} onChange={e => setRequesterEmail(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT" />
                </div>
                 <div>
                  <label htmlFor="requesterPhone" className="block text-sm font-medium text-neutral-700">Phone Number</label>
                  <input type="tel" id="requesterPhone" value={requesterPhone} onChange={e => setRequesterPhone(e.target.value)} required placeholder="e.g., 555-123-4567" className="mt-1 block w-full shadow-sm sm:text-sm border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT" />
                </div>
                 <div>
                  <label htmlFor="requesterLocation" className="block text-sm font-medium text-neutral-700">Local Area / Neighborhood</label>
                  <input type="text" id="requesterLocation" value={requesterLocation} onChange={e => setRequesterLocation(e.target.value)} required placeholder="e.g., City Center" className="mt-1 block w-full shadow-sm sm:text-sm border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT" />
                </div>
            </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-DEFAULT hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-DEFAULT transition-transform transform hover:scale-105 disabled:bg-neutral-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
      <Modal isOpen={isModalOpen} onClose={closeModalAndReset} title="Request Submitted">
        <p className="text-neutral-600">Your request has been received. Our team will review it and get in touch if a suitable item becomes available.</p>
        <div className="mt-6 text-right">
            <button onClick={closeModalAndReset} className="px-4 py-2 bg-primary-DEFAULT text-white rounded-md hover:bg-primary-dark">Close</button>
        </div>
      </Modal>
    </>
  );
};

export default RequestForm;
