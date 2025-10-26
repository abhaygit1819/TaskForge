export enum VlogVibe {
  ENERGETIC = 'Energetic & High-Paced',
  MOTIVATIONAL = 'Motivational & Inspiring',
  CHILL = 'Chill & Laid-back',
  FUNNY = 'Funny & Comedic',
  INFORMATIVE = 'Informative & Educational',
}

export enum VlogDuration {
  SHORT = 'Under 1 minute (Shorts/Reels)',
  MEDIUM = '1-3 minutes',
  LONG = '3-5 minutes',
}

export interface ScriptSection {
  title: string;
  visuals: string[];
  dialogue: string[];
}

export interface VlogScript {
  title: string;
  intro: ScriptSection;
  montage: ScriptSection;
  outro: ScriptSection;
}
