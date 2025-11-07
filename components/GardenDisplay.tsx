
import React, { useEffect, useRef } from 'react';
import { Loader } from './Loader';
import { ImageEditor } from './ImageEditor';
import { PlantIcon } from './icons';

interface GardenDisplayProps {
    image: string | null;
    description: string | null;
    isLoading: boolean;
    error: string | null;
    onEdit: (prompt: string) => Promise<void>;
}

declare global {
    interface Window {
        marked: any;
        DOMPurify: any;
    }
}

export const GardenDisplay: React.FC<GardenDisplayProps> = ({ image, description, isLoading, error, onEdit }) => {
    const descriptionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (description && descriptionRef.current && window.marked) {
            const dirtyHtml = window.marked.parse(description);
            descriptionRef.current.innerHTML = window.DOMPurify.sanitize(dirtyHtml);
        }
    }, [description]);
    
    if (isLoading && !image) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-stone-600">
                <Loader />
                <p className="mt-4 text-lg font-semibold animate-pulse">Designing your dream garden...</p>
                <p className="text-sm text-stone-500">The AI is planting the seeds of creativity.</p>
            </div>
        );
    }

    if (error) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center text-red-600 bg-red-50 p-6 rounded-lg">
                <p className="font-bold">Oops! Something went wrong.</p>
                <p>{error}</p>
            </div>
        );
    }

    if (!image && !description) {
         return (
             <div className="flex flex-col items-center justify-center h-full text-center text-stone-500 bg-stone-100/80 rounded-lg p-6">
                <PlantIcon className="w-16 h-16 text-stone-400 mb-4" />
                <h3 className="text-xl font-semibold text-stone-700">Your Garden Awaits</h3>
                <p>Describe your garden and upload an image to start designing.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg border-4 border-white">
                {image && <img src={image} alt="Generated Garden" className="w-full h-full object-cover" />}
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader />
                    </div>
                )}
            </div>
            
            {image && <ImageEditor onEdit={onEdit} isEditing={isLoading} />}
            
            {description && (
                <div className="flex-grow bg-stone-100/80 p-4 rounded-lg overflow-y-auto max-h-80">
                    <div ref={descriptionRef} className="prose prose-stone max-w-none prose-h2:text-xl prose-h2:font-bold prose-p:text-base prose-ul:list-disc prose-ul:ml-5"></div>
                </div>
            )}
        </div>
    );
};
