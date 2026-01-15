import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  MapPin,
  MessageCircle,
  Send,
  Github,
  Dribbble,
  Music,
  Hash,
  Disc,
  BookOpen,
  Camera,
  Ghost,
  Gamepad2,
  type LucideIcon,
} from 'lucide-react';
import type { SocialPlatform } from '@/types/cardBuilder';

interface PlatformConfig {
  icon: LucideIcon;
  label: string;
  color: string;
  placeholder: string;
}

export const socialPlatforms: Record<SocialPlatform, PlatformConfig> = {
  facebook: {
    icon: Facebook,
    label: 'Facebook',
    color: '#1877f2',
    placeholder: 'https://facebook.com/username',
  },
  instagram: {
    icon: Instagram,
    label: 'Instagram',
    color: '#e4405f',
    placeholder: 'https://instagram.com/username',
  },
  linkedin: {
    icon: Linkedin,
    label: 'LinkedIn',
    color: '#0a66c2',
    placeholder: 'https://linkedin.com/in/username',
  },
  twitter: {
    icon: Twitter,
    label: 'X / Twitter',
    color: '#1da1f2',
    placeholder: 'https://x.com/username',
  },
  snapchat: {
    icon: Ghost,
    label: 'Snapchat',
    color: '#fffc00',
    placeholder: 'https://snapchat.com/add/username',
  },
  tiktok: {
    icon: Music,
    label: 'TikTok',
    color: '#000000',
    placeholder: 'https://tiktok.com/@username',
  },
  youtube: {
    icon: Youtube,
    label: 'YouTube',
    color: '#ff0000',
    placeholder: 'https://youtube.com/@channel',
  },
  maps: {
    icon: MapPin,
    label: 'Google Maps',
    color: '#4285f4',
    placeholder: 'https://maps.google.com/?q=...',
  },
  whatsapp: {
    icon: MessageCircle,
    label: 'WhatsApp',
    color: '#25d366',
    placeholder: 'https://wa.me/1234567890',
  },
  telegram: {
    icon: Send,
    label: 'Telegram',
    color: '#0088cc',
    placeholder: 'https://t.me/username',
  },
  pinterest: {
    icon: Hash,
    label: 'Pinterest',
    color: '#e60023',
    placeholder: 'https://pinterest.com/username',
  },
  medium: {
    icon: BookOpen,
    label: 'Medium',
    color: '#000000',
    placeholder: 'https://medium.com/@username',
  },
  github: {
    icon: Github,
    label: 'GitHub',
    color: '#333333',
    placeholder: 'https://github.com/username',
  },
  dribbble: {
    icon: Dribbble,
    label: 'Dribbble',
    color: '#ea4c89',
    placeholder: 'https://dribbble.com/username',
  },
  discord: {
    icon: Gamepad2,
    label: 'Discord',
    color: '#5865f2',
    placeholder: 'https://discord.gg/invite',
  },
  spotify: {
    icon: Disc,
    label: 'Spotify',
    color: '#1db954',
    placeholder: 'https://open.spotify.com/user/...',
  },
};

export const gradientPresets = [
  { name: 'Purple Dream', colors: ['#6366f1', '#a855f7', '#ec4899'] },
  { name: 'Ocean', colors: ['#0ea5e9', '#6366f1'] },
  { name: 'Sunset', colors: ['#f97316', '#ec4899'] },
  { name: 'Forest', colors: ['#10b981', '#06b6d4'] },
  { name: 'Night', colors: ['#1e1b4b', '#312e81', '#4c1d95'] },
  { name: 'Fire', colors: ['#dc2626', '#f97316', '#facc15'] },
  { name: 'Aurora', colors: ['#06b6d4', '#8b5cf6', '#ec4899'] },
  { name: 'Midnight', colors: ['#0f172a', '#1e293b', '#334155'] },
];

export const solidColorPresets = [
  '#6366f1', '#a855f7', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#10b981',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#8b5cf6',
  '#1e1b4b', '#0f172a', '#18181b', '#171717',
];

export const fontFamilies = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Space Grotesk', value: 'Space Grotesk' },
  { name: 'DM Sans', value: 'DM Sans' },
  { name: 'Outfit', value: 'Outfit' },
  { name: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
  { name: 'Playfair Display', value: 'Playfair Display' },
];

export const videoPresets = [
  { name: 'Abstract Flow', url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-background-with-particles-31398-large.mp4' },
  { name: 'Gradient Waves', url: 'https://assets.mixkit.co/videos/preview/mixkit-flowing-abstract-gradient-13882-large.mp4' },
  { name: 'Dark Particles', url: 'https://assets.mixkit.co/videos/preview/mixkit-particles-in-dark-background-7461-large.mp4' },
];
