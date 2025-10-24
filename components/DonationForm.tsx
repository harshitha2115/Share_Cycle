import React, { useState } from 'react';
import { ItemCategory, ItemCondition, Donation, View } from '../types';
import { CATEGORIES, CONDITIONS } from '../constants';
import Modal from './Modal';

interface DonationFormProps {
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>) => void;
  setCurrentView: (view: View) => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ addDonation, setCurrentView }) => {
  const [category, setCategory] = useState<ItemCategory>(ItemCategory.Other);
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<ItemCondition>(ItemCondition.Good);
  const [photo, setPhoto] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !photo) {
      setError('Please fill out the description and upload a photo.');
      return;
    }
    setError('');
    addDonation({ category, description, condition, photo });
    setIsModalOpen(true);
  };

  const closeModalAndReset = () => {
    setIsModalOpen(false);
    setCategory(ItemCategory.Other);
    setDescription('');
    setCondition(ItemCondition.Good);
    setPhoto('');
    setCurrentView('home');
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-neutral-50 p-8 rounded-xl border border-neutral-200">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-700">Category</label>
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
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Description</label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full shadow-sm sm:text-sm border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT"
            placeholder="e.g., Men's blue winter jacket, size Medium"
          />
        </div>

        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-neutral-700">Condition</label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value as ItemCondition)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT sm:text-sm rounded-md"
          >
            {CONDITIONS.map(con => <option key={con} value={con}>{con}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">Item Photo</label>
          <div className="mt-2 flex items-center space-x-4">
            {photo ? (
              <img src={photo} alt="Preview" className="w-24 h-24 object-cover rounded-md" />
            ) : (
              <div className="w-24 h-24 bg-neutral-200 rounded-md flex items-center justify-center text-neutral-400">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            )}
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-DEFAULT hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-DEFAULT px-4 py-2 border border-neutral-300">
              <span>{photo ? 'Change photo' : 'Upload photo'}</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handlePhotoUpload} accept="image/*" />
            </label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-DEFAULT hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-DEFAULT transition-transform transform hover:scale-105"
          >
            Submit Donation
          </button>
        </div>
      </form>
      <Modal isOpen={isModalOpen} onClose={closeModalAndReset} title="Thank You!">
        <p className="text-neutral-600">Your donation has been successfully submitted. We appreciate your generosity!</p>
        <div className="mt-6 text-right">
            <button onClick={closeModalAndReset} className="px-4 py-2 bg-primary-DEFAULT text-white rounded-md hover:bg-primary-dark">Close</button>
        </div>
      </Modal>
    </>
  );
};

export default DonationForm;