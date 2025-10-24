import React, { useState } from 'react';
import { ItemCategory, Request, View } from '../types';
import { CATEGORIES } from '../constants';
import Modal from './Modal';

interface RequestFormProps {
  addRequest: (request: Omit<Request, 'id' | 'createdAt'>) => void;
  setCurrentView: (view: View) => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ addRequest, setCurrentView }) => {
  const [category, setCategory] = useState<ItemCategory>(ItemCategory.Other);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please describe your need.');
      return;
    }
    setError('');
    addRequest({ category, description });
    setIsModalOpen(true);
  };

  const closeModalAndReset = () => {
    setIsModalOpen(false);
    setCategory(ItemCategory.Other);
    setDescription('');
    setCurrentView('home');
  }


  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-neutral-50 p-8 rounded-xl border border-neutral-200">
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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-DEFAULT hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-DEFAULT transition-transform transform hover:scale-105"
          >
            Submit Request
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