
import React, { useState } from 'react';
import { EditIcon } from './icons';

interface ImageEditorProps {
    onEdit: (prompt: string) => Promise<void>;
    isEditing: boolean;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ onEdit, isEditing }) => {
    const [editPrompt, setEditPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editPrompt.trim() || isEditing) return;
        onEdit(editPrompt);
        setEditPrompt('');
    };
    
    const quickEdits = ["Add a retro filter", "Make it look like a watercolor painting", "Add a friendly garden gnome", "Change the season to autumn"];

    return (
        <div className="space-y-3">
             <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Describe your edit, e.g., 'add a stone birdbath'"
                    className="flex-grow p-3 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow duration-200 text-stone-700"
                    disabled={isEditing}
                />
                <button
                    type="submit"
                    disabled={isEditing || !editPrompt.trim()}
                    className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold p-3 rounded-lg shadow-md hover:bg-emerald-700 disabled:bg-stone-400 disabled:cursor-not-allowed transition-all duration-300"
                    aria-label="Apply Edit"
                >
                    <EditIcon className="w-5 h-5" />
                </button>
            </form>
            <div className="flex flex-wrap gap-2">
                {quickEdits.map(prompt => (
                    <button 
                        key={prompt}
                        onClick={() => !isEditing && onEdit(prompt)}
                        disabled={isEditing}
                        className="text-xs bg-stone-200 text-stone-700 px-3 py-1 rounded-full hover:bg-emerald-200 hover:text-emerald-800 disabled:opacity-50 transition-colors"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    );
};
