
import { GoogleGenAI, Modality } from "@google/genai";

interface GenerativePart {
    inlineData: {
        data: string;
        mimeType: string;
    };
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateGardenDesign = async (prompt: string, image?: GenerativePart) => {
    // Promise for generating the image
    const imageGenerationPromise = async () => {
        const imagePrompt = `Generate a photorealistic image of a garden based on this concept, and considering the provided image as inspiration if one is given: "${prompt}"`;
        
        const parts: (GenerativePart | { text: string })[] = [];
        if (image) {
            parts.push(image);
        }
        parts.push({ text: imagePrompt });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: { responseModalities: [Modality.IMAGE] },
        });

        const firstCandidate = response.candidates?.[0];
        if (!firstCandidate) throw new Error("No candidates returned from image generation.");

        for (const part of firstCandidate.content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image data generated.");
    };

    // Promise for generating the text description
    const descriptionGenerationPromise = async () => {
        const descriptionPrompt = `You are a helpful garden design assistant. Based on the following garden idea, provide a short, evocative description and a bulleted list of suggested plants that would thrive in such a garden. The idea is: "${prompt}". Format the output as clean markdown, with a main heading 'Garden Plan' and subheadings 'Description' and 'Plant Suggestions'.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: descriptionPrompt,
        });
        return response.text;
    };

    // Run both promises in parallel
    const [imageUrl, description] = await Promise.all([
        imageGenerationPromise(),
        descriptionGenerationPromise(),
    ]);

    return { imageUrl, description };
};

export const editImage = async (base64ImageDataUrl: string, prompt: string): Promise<string> => {
    // Extract base64 data and mimeType from data URL
    const match = base64ImageDataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
        throw new Error("Invalid base64 image data URL format");
    }
    const mimeType = match[1];
    const data = match[2];

    const imagePart: GenerativePart = { inlineData: { data, mimeType } };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [imagePart, textPart]
        },
        config: { responseModalities: [Modality.IMAGE] },
    });

    const firstCandidate = response.candidates?.[0];
    if (!firstCandidate) throw new Error("No candidates returned from image edit.");

    for (const part of firstCandidate.content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }

    throw new Error("Failed to edit image. No image data was returned.");
};
