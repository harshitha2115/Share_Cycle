import React, { useState } from 'react';
import Modal from './Modal';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a server
    console.log({ name, email, message });
    setIsModalOpen(true);
  };
  
  const closeModalAndReset = () => {
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setMessage('');
  }


  return (
    <>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-neutral-50 p-8 rounded-xl border border-neutral-200">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Full Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full shadow-sm sm:text-sm border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email Address</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full shadow-sm sm:text-sm border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT"
                />
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700">Message</label>
                <textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="mt-1 block w-full shadow-sm sm:text-sm border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT"
                />
            </div>
            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-DEFAULT hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-DEFAULT transition-transform transform hover:scale-105"
                >
                    Send Message
                </button>
            </div>
        </form>
        <Modal isOpen={isModalOpen} onClose={closeModalAndReset} title="Message Sent!">
            <p className="text-neutral-600">Thank you for contacting us. We will get back to you as soon as possible.</p>
             <div className="mt-6 text-right">
                <button onClick={closeModalAndReset} className="px-4 py-2 bg-primary-DEFAULT text-white rounded-md hover:bg-primary-dark">Close</button>
            </div>
        </Modal>
    </>
  );
};

export default ContactForm;