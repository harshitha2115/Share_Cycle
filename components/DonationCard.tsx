import React from 'react';
import { Donation, ItemCategory } from '../types';
import { ElectronicsIcon, FurnitureIcon, ClothingIcon, BooksIcon, KitchenwareIcon, OtherIcon } from './Icons';

export const CategoryIcon: React.FC<{ category: ItemCategory; className?: string }> = ({ category, className }) => {
    const icons: Record<ItemCategory, React.ReactElement> = {
        [ItemCategory.Electronics]: <ElectronicsIcon className={className} />,
        [ItemCategory.Furniture]: <FurnitureIcon className={className} />,
        [ItemCategory.Clothing]: <ClothingIcon className={className} />,
        [ItemCategory.Books]: <BooksIcon className={className} />,
        [ItemCategory.Kitchenware]: <KitchenwareIcon className={className} />,
        [ItemCategory.Other]: <OtherIcon className={className} />,
    };
    return icons[category] || <OtherIcon className={className} />;
};

interface DonationCardProps {
  donation: Donation;
  onClick: (donation: Donation) => void;
}

const DonationCard: React.FC<DonationCardProps> = ({ donation, onClick }) => {
  return (
    <div 
      onClick={() => onClick(donation)}
      className="bg-neutral-50 rounded-xl shadow-md hover:shadow-lg border border-neutral-200/80 overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      <img src={donation.photo} alt={donation.description} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-neutral-600 mb-2">
          <CategoryIcon category={donation.category} className="w-4 h-4 mr-2 text-primary-DEFAULT" />
          <span>{donation.category}</span>
        </div>
        <p className="text-neutral-800 font-semibold text-lg mb-2 flex-grow">{donation.description}</p>
        <div className="flex justify-between items-center mt-4">
            <span className="text-xs font-semibold uppercase px-2 py-1 bg-secondary-light text-secondary-dark rounded-full">{donation.condition}</span>
            <span className="text-xs text-neutral-500">{donation.createdAt.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default DonationCard;