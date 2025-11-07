
import React, { useState, useCallback, ChangeEvent } from 'react';
import { UploadIcon, TrashIcon } from './icons';

interface ImageUploaderProps {
    onFileChange: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileChange }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setFileName(file.name);
                onFileChange(file);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
            setFileName(null);
            onFileChange(null);
        }
    }, [onFileChange]);
    
    const handleRemoveImage = useCallback(() => {
        setPreview(null);
        setFileName(null);
        onFileChange(null);
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    }, [onFileChange]);

    if (preview) {
        return (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-dashed border-stone-300 group">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
                    <p className="text-white text-sm font-medium truncate">{fileName}</p>
                    <button
                        onClick={handleRemoveImage}
                        className="mt-2 bg-red-500/80 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        aria-label="Remove image"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-stone-100 hover:bg-stone-200 transition-colors duration-200 rounded-lg flex flex-col justify-center items-center w-full h-40 border-2 border-dashed border-stone-300"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-10 h-10 mb-3 text-stone-400"/>
                    <p className="mb-2 text-sm text-stone-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-stone-500">PNG, JPG, or WEBP</p>
                </div>
                <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
            </label>
        </div>
    );
};
