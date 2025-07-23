import React from 'react';
import { Heart, Activity } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-6">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
        <Heart className="w-6 h-6 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Analyzing Patient Data</h3>
        <p className="text-gray-600 mb-4">Our AI is processing the clinical parameters...</p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Running predictive algorithms</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;