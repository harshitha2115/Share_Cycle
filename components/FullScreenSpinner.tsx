
import React from 'react';
import Spinner from './Spinner';

const FullScreenSpinner: React.FC<{ message?: string }> = ({ message = "Loading ShareCycle..." }) => (
  <div className="fixed inset-0 bg-neutral-100 z-50 flex flex-col justify-center items-center">
    <Spinner />
    <p className="mt-4 text-neutral-600 font-semibold">{message}</p>
  </div>
);

export default FullScreenSpinner;
