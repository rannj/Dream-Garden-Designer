
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GardenDisplay } from './components/GardenDisplay';
import { generateGardenDesign, editImage } from './services/geminiService';
import { SparklesIcon } from './components/icons';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
        resolve(base64Data);
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('A lush, vibrant cottage garden with a winding stone path, overflowing with colorful wildflowers like lavender, daisies, and poppies. Include a small, weathered wooden bench under a blossoming cherry tree.');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Please enter a description for your garden.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        setGeneratedDescription(null);

        try {
            const imagePart = imageFile ? await fileToGenerativePart(imageFile) : undefined;
            const result = await generateGardenDesign(prompt, imagePart);
            setGeneratedImage(result.imageUrl);
            setGeneratedDescription(result.description);
        } catch (e) {
            console.error(e);
            setError('An error occurred while designing your garden. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt, imageFile]);

    const handleEdit = async (editPrompt: string) => {
        if (!generatedImage) return;
        setIsLoading(true);
        setError(null);
        try {
            const newImage = await editImage(generatedImage, editPrompt);
            setGeneratedImage(newImage);
        } catch (e) {
            console.error(e);
            setError('An error occurred while editing the image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-stone-50">
            <Header />
            <main className="p-4 md:p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
                    {/* Control Panel */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-200/80 flex flex-col gap-6">
                        <div>
                            <label htmlFor="prompt" className="block text-lg font-semibold text-stone-700 mb-2">1. Describe Your Dream Garden</label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A modern Japanese zen garden with moss, stones, and a small water feature..."
                                className="w-full h-40 p-3 bg-stone-100 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow duration-200 text-stone-700"
                            />
                        </div>
                        <div>
                           <h2 className="text-lg font-semibold text-stone-700 mb-2">2. Add an Inspiration Image (Optional)</h2>
                           <ImageUploader onFileChange={setImageFile} />
                        </div>
                         <div className="mt-auto pt-4">
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !prompt.trim()}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-emerald-700 disabled:bg-stone-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                            >
                                <SparklesIcon className="w-6 h-6" />
                                {isLoading ? 'Designing...' : 'Design My Garden'}
                            </button>
                        </div>
                    </div>

                    {/* Display Area */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-200/80">
                         <GardenDisplay
                            image={generatedImage}
                            description={generatedDescription}
                            isLoading={isLoading}
                            error={error}
                            onEdit={handleEdit}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
