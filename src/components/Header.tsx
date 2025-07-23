import React from 'react';
import { Heart, Activity } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Heart className="w-8 h-8 text-red-400" />
              <Activity className="w-4 h-4 text-white absolute -bottom-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CardioPredict AI</h1>
              <p className="text-blue-200 text-sm">Heart Failure Risk Assessment</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">Dr. Medical Dashboard</p>
              <p className="text-xs text-blue-200">Advanced Cardiac Analysis</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;