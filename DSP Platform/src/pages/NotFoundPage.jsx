import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Radio, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
        <Radio className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-slate-700 mt-2">Signal Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
        The route or frequency you are tuned into does not exist on the DSP Learning Platform.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button variant="primary" icon={ArrowLeft}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
