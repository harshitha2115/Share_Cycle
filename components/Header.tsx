import React, { useState } from 'react';
import { View, User } from '../types';
import { MenuIcon, CloseIcon } from './Icons';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, currentUser, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: { view: View; label: string; protected: boolean; adminOnly: boolean }[] = [
    { view: 'home', label: 'Home', protected: false, adminOnly: false },
    { view: 'donate', label: 'Donate Item', protected: true, adminOnly: false },
    { view: 'request', label: 'Request Item', protected: true, adminOnly: false },
    { view: 'admin', label: 'Admin', protected: true, adminOnly: true },
    { view: 'contact', label: 'Contact Us', protected: false, adminOnly: false },
  ];
  
  const getVisibleNavItems = () => {
      if (!currentUser) {
          return navItems.filter(item => !item.protected);
      }
      return navItems.filter(item => !item.adminOnly || currentUser.role === 'admin');
  }

  const NavLink: React.FC<{ view: View; label: string }> = ({ view, label }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMenuOpen(false);
      }}
      className={`w-full text-left md:w-auto md:text-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        currentView === view
          ? 'bg-primary-light/50 text-primary-dark font-semibold'
          : 'text-neutral-600 hover:bg-primary-light/50 hover:text-primary-dark'
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-neutral-50 border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary-dark cursor-pointer" onClick={() => setCurrentView('home')}>
              Share<span className="text-neutral-700">Cycle</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
              {getVisibleNavItems().map(item => <NavLink key={item.view} {...item} />)}
              {currentUser && (
                  <div className="flex items-center space-x-4 ml-4">
                        <span className="text-sm text-neutral-600">Hi, {currentUser.name}</span>
                        <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-primary-DEFAULT rounded-md hover:bg-primary-dark transition-colors">
                            Logout
                        </button>
                  </div>
              )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-neutral-50 border-b border-neutral-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {getVisibleNavItems().map(item => <NavLink key={item.view} {...item} />)}
            {currentUser && (
                 <div className="border-t border-neutral-200 mt-2 pt-2 px-2">
                    <span className="block text-sm text-neutral-600 mb-2">Hi, {currentUser.name}</span>
                    <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-medium text-white bg-primary-DEFAULT rounded-md hover:bg-primary-dark transition-colors">
                        Logout
                    </button>
                </div>
              )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;