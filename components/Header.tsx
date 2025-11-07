
import React from 'react';
import { PlantIcon } from './icons';

export const Header: React.FC = () => {
    return (
        <header className="bg-white/80 backdrop-blur-lg border-b border-stone-200/80 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 flex items-center gap-4">
                 <div className="bg-emerald-100 p-2 rounded-lg">
                    <PlantIcon className="w-8 h-8 text-emerald-600" />
                 </div>
                 <div>
                    <h1 className="text-2xl font-bold text-stone-800">Dream Garden Designer</h1>
                    <p className="text-sm text-stone-500">Create and refine your perfect garden with the power of AI.</p>
                </div>
            </div>
        </header>
    );
};
