import React, { useState, useCallback } from 'react';
import { VlogVibe, VlogDuration } from './types';
import type { VlogScript, ScriptSection } from './types';
import { generateVlogScript } from './services/geminiService';
import Spinner from './components/Spinner';
import { DumbbellIcon, CameraIcon, SpeechBubbleIcon, CopyIcon, CheckIcon } from './components/icons';

const ScriptSectionDisplay: React.FC<{ section: ScriptSection }> = ({ section }) => (
    <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
        <h3 className="text-xl font-bold text-sky-400 mb-4">{section.title}</h3>
        <div className="space-y-4">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <CameraIcon className="w-5 h-5 text-gray-400" />
                    <h4 className="font-semibold text-gray-200">Visuals</h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-300 pl-2">
                    {section.visuals.map((v, i) => <li key={i}>{v}</li>)}
                </ul>
            </div>
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <SpeechBubbleIcon className="w-5 h-5 text-gray-400" />
                    <h4 className="font-semibold text-gray-200">Dialogue</h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-300 pl-2">
                    {section.dialogue.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
            </div>
        </div>
    </div>
);

export default function App() {
    const [workoutFocus, setWorkoutFocus] = useState('Leg Day');
    const [keyExercises, setKeyExercises] = useState('Squats, Lunges, Deadlifts');
    const [vibe, setVibe] = useState<VlogVibe>(VlogVibe.ENERGETIC);
    const [duration, setDuration] = useState<VlogDuration>(VlogDuration.SHORT);

    const [script, setScript] = useState<VlogScript | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setScript(null);
        setCopied(false);

        try {
            const result = await generateVlogScript(workoutFocus, keyExercises, vibe, duration);
            setScript(result);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [workoutFocus, keyExercises, vibe, duration]);
    
    const formatScriptForCopy = (scriptToFormat: VlogScript | null): string => {
        if (!scriptToFormat) return "";
        let text = `Title: ${scriptToFormat.title}\n\n`;
        
        const formatSection = (title: string, section: ScriptSection) => {
            text += `--- ${title.toUpperCase()} ---\n`;
            text += "Visuals:\n";
            section.visuals.forEach(v => text += `- ${v}\n`);
            text += "\nDialogue:\n";
            section.dialogue.forEach(d => text += `- ${d}\n`);
            text += "\n";
        };

        formatSection('Intro', scriptToFormat.intro);
        formatSection('Workout Montage', scriptToFormat.montage);
        formatSection('Outro', scriptToFormat.outro);
        
        return text;
    };

    const handleCopy = () => {
        const scriptText = formatScriptForCopy(script);
        navigator.clipboard.writeText(scriptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen text-gray-200 bg-gray-900 font-sans p-4 sm:p-6 lg:p-8">
            <main className="max-w-4xl mx-auto">
                <header className="text-center my-8">
                    <div className="inline-flex items-center gap-3">
                        <DumbbellIcon className="w-10 h-10 text-sky-400" />
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                            Gym Vlog Script <span className="text-sky-400">Genie</span>
                        </h1>
                    </div>
                    <p className="mt-4 text-lg text-gray-400">
                        Turn your workout into viral content. Instantly.
                    </p>
                </header>

                <div className="bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="workout-focus" className="mb-2 font-semibold text-gray-300">Workout Focus</label>
                            <input
                                id="workout-focus"
                                type="text"
                                value={workoutFocus}
                                onChange={(e) => setWorkoutFocus(e.target.value)}
                                placeholder="e.g., Full Body HIIT, Chest & Triceps"
                                className="bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                            />
                        </div>
                        <div className="flex flex-col">
                           <label htmlFor="vibe" className="mb-2 font-semibold text-gray-300">Vlog Vibe</label>
                           <select
                                id="vibe"
                                value={vibe}
                                onChange={(e) => setVibe(e.target.value as VlogVibe)}
                                className="bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition appearance-none bg-no-repeat bg-right-4"
                                style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}
                            >
                                {Object.values(VlogVibe).map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2 flex flex-col">
                            <label htmlFor="key-exercises" className="mb-2 font-semibold text-gray-300">Key Exercises</label>
                            <textarea
                                id="key-exercises"
                                value={keyExercises}
                                onChange={(e) => setKeyExercises(e.target.value)}
                                placeholder="List a few exercises you want to highlight"
                                rows={3}
                                className="bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition resize-none"
                            />
                        </div>
                        <div className="md:col-span-2 flex flex-col">
                             <label htmlFor="duration" className="mb-2 font-semibold text-gray-300">Target Duration</label>
                           <select
                                id="duration"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value as VlogDuration)}
                                className="bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition appearance-none"
                                style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}
                           >
                                {Object.values(VlogDuration).map(d => <option key={d} value={d}>{d}</option>)}
                           </select>
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="mt-8 w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 disabled:bg-sky-800 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-sky-500/30"
                    >
                        {isLoading ? <Spinner /> : 'Conjure Script'}
                    </button>
                </div>

                <div className="mt-12">
                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                            <strong>Oops!</strong> {error}
                        </div>
                    )}

                    {script && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-white tracking-tight">Your Script: <span className="text-sky-400">{script.title}</span></h2>
                                <button
                                    onClick={handleCopy}
                                    className="bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 border border-gray-600"
                                >
                                    {copied ? <CheckIcon className="w-5 h-5 text-green-400"/> : <CopyIcon className="w-5 h-5"/>}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <ScriptSectionDisplay section={script.intro} />
                            <ScriptSectionDisplay section={script.montage} />
                            <ScriptSectionDisplay section={script.outro} />
                        </div>
                    )}
                </div>
            </main>
            <footer className="text-center py-8 mt-8">
              <p className="text-gray-600">Powered by Gemini</p>
            </footer>
        </div>
    );
}
