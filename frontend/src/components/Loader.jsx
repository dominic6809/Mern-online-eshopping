/* eslint-disable no-unused-vars */
import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Outer spinning circle */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100">
          <div className="absolute inset-0 rounded-full border-t-4 border-blue-600"></div>
        </div>
        
        {/* Inner spinning icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      </div>
      
      <span className="mt-2 text-sm font-medium text-gray-600">Loading...</span>
    </div>
  );
};

export default Loader;