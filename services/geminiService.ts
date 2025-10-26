import { GoogleGenAI, Type } from "@google/genai";
import type { VlogVibe, VlogDuration, VlogScript } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scriptSectionSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        visuals: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of visual cues or shots to film."
        },
        dialogue: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of lines to be spoken."
        },
    },
    required: ["title", "visuals", "dialogue"],
};

const vlogScriptSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A catchy and creative title for the vlog."
        },
        intro: scriptSectionSchema,
        montage: scriptSectionSchema,
        outro: scriptSectionSchema,
    },
    required: ["title", "intro", "montage", "outro"],
};


export const generateVlogScript = async (
    focus: string,
    exercises: string,
    vibe: VlogVibe,
    duration: VlogDuration
): Promise<VlogScript> => {
    const prompt = `
        You are a creative and energetic fitness vlogger and content creator. 
        Your goal is to write a script for a short, engaging gym vlog.

        Please generate a complete vlog script based on the following details:
        - Workout Focus: ${focus}
        - Key Exercises Mentioned: ${exercises}
        - Desired Vibe/Tone: ${vibe}
        - Target Video Duration: ${duration}

        The script should have a clear intro, a workout montage section, and an outro.
        For each section, provide specific ideas for visuals (what to film) and dialogue (what to say).
        The dialogue should be natural and engaging.
        The title should be catchy and relevant.

        The output MUST be a single JSON object that strictly adheres to the provided schema.
        Do not include any markdown formatting like \`\`\`json.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: vlogScriptSchema,
                temperature: 0.8,
            },
        });

        const jsonText = response.text.trim();
        const parsedScript: VlogScript = JSON.parse(jsonText);
        return parsedScript;

    } catch (error) {
        console.error("Error generating vlog script:", error);
        throw new Error("Failed to generate script. The model may be unable to provide a valid response for the given inputs.");
    }
};
