import { CardData } from '../types/cardBuilder';

export interface Template {
    id: string;
    name: string;
    description: string;
    previewColor: string;
    config: Partial<CardData>;
}

export const templates: Template[] = [
    {
        id: 'hologram-nexus',
        name: 'Holographic Nexus',
        description: 'Ultra-futuristic 3D floating layout with glowing effects.',
        previewColor: '#a855f7',
        config: {
            accentColor: '#c084fc',
            fontFamily: 'Outfit',
            themeMode: 'dark',
            layout: 'hologram',
            iconStyle: 'rounded',
            iconAnimation: 'glow',
            background: {
                type: 'particles',
                solidColor: '#000000',
                gradient: {
                    direction: 180,
                    colors: ['#000000', '#2e1065'],
                },
                videoUrl: '',
                particlePreset: 'stars',
            }
        }
    },
    {
        id: 'brutalist-raw',
        name: 'Raw Brutalist',
        description: 'Bold, high-contrast design inspired by modern art.',
        previewColor: '#facc15',
        config: {
            accentColor: '#facc15',
            fontFamily: 'Inter',
            themeMode: 'light',
            layout: 'brutalist',
            iconStyle: 'square',
            iconAnimation: 'none',
            background: {
                type: 'solid',
                solidColor: '#ffffff',
                gradient: {
                    direction: 180,
                    colors: ['#ffffff', '#f1f5f9'],
                },
                videoUrl: '',
                particlePreset: 'none',
            }
        }
    },
    {
        id: 'portfolio-pro',
        name: 'Executive Portfolio',
        description: 'Professional sidebar layout for executives and creators.',
        previewColor: '#1e293b',
        config: {
            accentColor: '#3b82f6',
            fontFamily: 'Inter',
            themeMode: 'dark',
            layout: 'portfolio',
            iconStyle: 'rounded',
            iconAnimation: 'lift',
            background: {
                type: 'gradient',
                solidColor: '#0f172a',
                gradient: {
                    direction: 135,
                    colors: ['#0f172a', '#1e293b', '#334155'],
                },
                videoUrl: '',
                particlePreset: 'none',
            }
        }
    },
    {
        id: 'terminal-dev',
        name: 'Developer Mode',
        description: 'Interactive code editor style for developers.',
        previewColor: '#000000',
        config: {
            accentColor: '#22d3ee',
            fontFamily: 'JetBrains Mono',
            themeMode: 'dark',
            layout: 'terminal',
            iconStyle: 'square',
            iconAnimation: 'glow',
            background: {
                type: 'particles',
                solidColor: '#000000',
                gradient: {
                    direction: 180,
                    colors: ['#000000', '#0f172a'],
                },
                videoUrl: '',
                particlePreset: 'stars',
            }
        }
    },
    {
        id: 'vibrant-influence',
        name: 'Sunset Influence',
        description: 'Vibrant and energetic, perfect for creators.',
        previewColor: '#ec4899',
        config: {
            accentColor: '#f43f5e',
            fontFamily: 'Outfit',
            themeMode: 'dark',
            layout: 'bento',
            iconStyle: 'pill',
            iconAnimation: 'pulse',
            background: {
                type: 'gradient',
                solidColor: '#831843',
                gradient: {
                    direction: 45,
                    colors: ['#f43f5e', '#ec4899', '#d946ef'],
                },
                videoUrl: '',
                particlePreset: 'default',
            }
        }
    },
    {
        id: 'minimal-studio',
        name: 'Minimalist Studio',
        description: 'Clean, light, and focused on content.',
        previewColor: '#f8fafc',
        config: {
            accentColor: '#1e293b',
            fontFamily: 'Instrument Sans',
            themeMode: 'light',
            layout: 'list',
            iconStyle: 'square',
            iconAnimation: 'none',
            background: {
                type: 'solid',
                solidColor: '#f8fafc',
                gradient: {
                    direction: 180,
                    colors: ['#f8fafc', '#f1f5f9'],
                },
                videoUrl: '',
                particlePreset: 'none',
            }
        }
    }
];
