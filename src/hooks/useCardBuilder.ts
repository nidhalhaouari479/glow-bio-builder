import { useState, useCallback } from 'react';
import { 
  CardData, 
  defaultCardData, 
  SocialLink, 
  ContactButton, 
  Story, 
  Achievement, 
  Badge, 
  Section,
  BackgroundConfig,
  ThemeMode,
  IconAnimation,
  IconStyle,
} from '@/types/cardBuilder';

export function useCardBuilder() {
  const [cardData, setCardData] = useState<CardData>(defaultCardData);

  const updateField = useCallback(<K extends keyof CardData>(
    field: K, 
    value: CardData[K]
  ) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateBackground = useCallback((updates: Partial<BackgroundConfig>) => {
    setCardData(prev => ({
      ...prev,
      background: { ...prev.background, ...updates },
    }));
  }, []);

  const updateSocialLink = useCallback((id: string, updates: Partial<SocialLink>) => {
    setCardData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link =>
        link.id === id ? { ...link, ...updates } : link
      ),
    }));
  }, []);

  const updateContactButton = useCallback((id: string, updates: Partial<ContactButton>) => {
    setCardData(prev => ({
      ...prev,
      contactButtons: prev.contactButtons.map(btn =>
        btn.id === id ? { ...btn, ...updates } : btn
      ),
    }));
  }, []);

  const addStory = useCallback((story: Story) => {
    setCardData(prev => ({
      ...prev,
      stories: [...prev.stories, story],
    }));
  }, []);

  const removeStory = useCallback((id: string) => {
    setCardData(prev => ({
      ...prev,
      stories: prev.stories.filter(s => s.id !== id),
    }));
  }, []);

  const updateStory = useCallback((id: string, updates: Partial<Story>) => {
    setCardData(prev => ({
      ...prev,
      stories: prev.stories.map(s =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  }, []);

  const addAchievement = useCallback((achievement: Achievement) => {
    setCardData(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievement],
    }));
  }, []);

  const removeAchievement = useCallback((id: string) => {
    setCardData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(a => a.id !== id),
    }));
  }, []);

  const updateAchievement = useCallback((id: string, updates: Partial<Achievement>) => {
    setCardData(prev => ({
      ...prev,
      achievements: prev.achievements.map(a =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }));
  }, []);

  const addBadge = useCallback((badge: Badge) => {
    setCardData(prev => ({
      ...prev,
      badges: [...prev.badges, badge],
    }));
  }, []);

  const removeBadge = useCallback((id: string) => {
    setCardData(prev => ({
      ...prev,
      badges: prev.badges.filter(b => b.id !== id),
    }));
  }, []);

  const updateBadge = useCallback((id: string, updates: Partial<Badge>) => {
    setCardData(prev => ({
      ...prev,
      badges: prev.badges.map(b =>
        b.id === id ? { ...b, ...updates } : b
      ),
    }));
  }, []);

  const reorderSections = useCallback((sections: Section[]) => {
    setCardData(prev => ({ ...prev, sections }));
  }, []);

  const toggleSection = useCallback((id: string) => {
    setCardData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    updateField('themeMode', mode);
  }, [updateField]);

  const setIconAnimation = useCallback((animation: IconAnimation) => {
    updateField('iconAnimation', animation);
  }, [updateField]);

  const setIconStyle = useCallback((style: IconStyle) => {
    updateField('iconStyle', style);
  }, [updateField]);

  const setProfileImage = useCallback((image: string | null) => {
    updateField('profileImage', image);
  }, [updateField]);

  return {
    cardData,
    updateField,
    updateBackground,
    updateSocialLink,
    updateContactButton,
    addStory,
    removeStory,
    updateStory,
    addAchievement,
    removeAchievement,
    updateAchievement,
    addBadge,
    removeBadge,
    updateBadge,
    reorderSections,
    toggleSection,
    setThemeMode,
    setIconAnimation,
    setIconStyle,
    setProfileImage,
  };
}
