export type BackgroundType = 'solid' | 'gradient' | 'video' | 'particles';

export type ParticlePreset = 'default' | 'snow' | 'bubbles' | 'stars' | 'confetti';

export type IconAnimation = 'none' | 'pulse' | 'glow' | 'lift' | 'shake';

export type IconStyle = 'rounded' | 'square' | 'pill';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  enabled: boolean;
}

export type SocialPlatform = 
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'twitter'
  | 'snapchat'
  | 'tiktok'
  | 'youtube'
  | 'maps'
  | 'whatsapp'
  | 'telegram'
  | 'pinterest'
  | 'medium'
  | 'github'
  | 'dribbble'
  | 'discord'
  | 'spotify';

export interface ContactButton {
  id: string;
  type: 'email' | 'phone' | 'website';
  value: string;
  label: string;
  enabled: boolean;
}

export interface Story {
  id: string;
  title: string;
  image: string;
  video?: string;
  mediaType: 'image' | 'video';
  content?: string;
}

export interface Achievement {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon?: string;
}

export interface Badge {
  id: string;
  text: string;
  color: string;
}

export type SectionType = 'bio' | 'social' | 'contact' | 'achievements' | 'stories' | 'badges';

export interface Section {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
}

export interface GradientConfig {
  direction: number;
  colors: string[];
}

export interface BackgroundConfig {
  type: BackgroundType;
  solidColor: string;
  gradient: GradientConfig;
  videoUrl: string;
  particlePreset: ParticlePreset;
}

export interface CardData {
  name: string;
  title: string;
  bio: string;
  profileImage: string | null;
  background: BackgroundConfig;
  themeMode: ThemeMode;
  accentColor: string;
  fontFamily: string;
  socialLinks: SocialLink[];
  contactButtons: ContactButton[];
  stories: Story[];
  achievements: Achievement[];
  badges: Badge[];
  sections: Section[];
  iconAnimation: IconAnimation;
  iconStyle: IconStyle;
}

export const defaultSocialLinks: SocialLink[] = [
  { id: '1', platform: 'facebook', url: '', enabled: false },
  { id: '2', platform: 'instagram', url: '', enabled: true },
  { id: '3', platform: 'linkedin', url: '', enabled: true },
  { id: '4', platform: 'twitter', url: '', enabled: true },
  { id: '5', platform: 'snapchat', url: '', enabled: false },
  { id: '6', platform: 'tiktok', url: '', enabled: false },
  { id: '7', platform: 'youtube', url: '', enabled: false },
  { id: '8', platform: 'maps', url: '', enabled: false },
  { id: '9', platform: 'whatsapp', url: '', enabled: false },
  { id: '10', platform: 'telegram', url: '', enabled: false },
  { id: '11', platform: 'pinterest', url: '', enabled: false },
  { id: '12', platform: 'medium', url: '', enabled: false },
  { id: '13', platform: 'github', url: '', enabled: true },
  { id: '14', platform: 'dribbble', url: '', enabled: false },
  { id: '15', platform: 'discord', url: '', enabled: false },
  { id: '16', platform: 'spotify', url: '', enabled: false },
];

export const defaultContactButtons: ContactButton[] = [
  { id: '1', type: 'email', value: '', label: 'Email Me', enabled: true },
  { id: '2', type: 'phone', value: '', label: 'Call Me', enabled: false },
  { id: '3', type: 'website', value: '', label: 'Visit Website', enabled: true },
];

export const defaultSections: Section[] = [
  { id: '1', type: 'bio', enabled: true, order: 0 },
  { id: '2', type: 'social', enabled: true, order: 1 },
  { id: '3', type: 'contact', enabled: true, order: 2 },
  { id: '4', type: 'achievements', enabled: true, order: 3 },
  { id: '5', type: 'stories', enabled: true, order: 4 },
  { id: '6', type: 'badges', enabled: true, order: 5 },
];

export const defaultCardData: CardData = {
  name: 'Alex Johnson',
  title: 'Digital Creator & Designer',
  bio: 'Passionate about creating beautiful digital experiences. Let\'s connect and build something amazing together! ✨',
  profileImage: null,
  background: {
    type: 'gradient',
    solidColor: '#6366f1',
    gradient: {
      direction: 135,
      colors: ['#6366f1', '#a855f7', '#ec4899'],
    },
    videoUrl: '',
    particlePreset: 'default',
  },
  themeMode: 'dark',
  accentColor: '#a855f7',
  fontFamily: 'Inter',
  socialLinks: defaultSocialLinks,
  contactButtons: defaultContactButtons,
  stories: [
    { id: '1', title: 'Latest Work', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop', mediaType: 'image', content: 'Check out my latest design project!' },
    { id: '2', title: 'Behind Scenes', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop', mediaType: 'image', content: 'A peek into my creative process' },
    { id: '3', title: 'New Project', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop', mediaType: 'image', content: 'Coming soon!' },
  ],
  achievements: [
    { id: '1', label: 'Followers', value: 12500, suffix: '+', icon: '👥' },
    { id: '2', label: 'Projects', value: 248, icon: '💼' },
    { id: '3', label: 'Awards', value: 15, icon: '🏆' },
  ],
  badges: [
    { id: '1', text: 'Pro', color: '#6366f1' },
    { id: '2', text: 'Designer', color: '#a855f7' },
    { id: '3', text: 'Verified', color: '#10b981' },
  ],
  sections: defaultSections,
  iconAnimation: 'lift',
  iconStyle: 'rounded',
};
