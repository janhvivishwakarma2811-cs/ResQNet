import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading emergency operations...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-red-600 mb-3" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
