import { useState, useCallback, useEffect } from 'react';
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
import { Template } from '@/config/templates';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useCardBuilder() {
  const { user } = useAuth();
  const [cardData, setCardData] = useState<CardData>(defaultCardData);
  const [loading, setLoading] = useState(false);

  // Fetch data on load
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          // Merge fetched data with default structure to ensure all fields exist
          setCardData(prev => ({
            ...prev,
            name: data.full_name || prev.name,
            bio: data.bio || prev.bio,
            profileImage: data.avatar_url || prev.profileImage,
            // Parse JSON fields safely
            ...data.theme_config, // Assuming theme_config helper stores the rest of the json structure
          }));

          // For now, let's assume if we saved it as a big JSON blob it would be easier,
          // but the schema has specific columns. Let's adjust to just save everything 
          // in `theme_config` or dedicated columns for simplicity given the complex object.
          // Re-reading schema: `theme_config` is jsonb.
          // Let's store the entire CardData (minus id/user_id) in `theme_config` for MVP speed?
          // Or map fields. The schema had: username, full_name, avatar_url, bio, theme_config.
          // We can map:
          // name -> full_name
          // bio -> bio
          // profileImage -> avatar_url
          // EVERYTHING ELSE -> theme_config

          if (data.theme_config) {
            setCardData(prev => ({
              ...prev,
              name: data.full_name || prev.name,
              bio: data.bio || prev.bio,
              profileImage: data.avatar_url || prev.profileImage,
              ...(data.theme_config as Partial<CardData>) // Spread the rest
            }));
          } else {
            setCardData(prev => ({
              ...prev,
              name: data.full_name || prev.name,
              bio: data.bio || prev.bio,
              profileImage: data.avatar_url || prev.profileImage,
            }));
          }
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const saveProfile = async () => {
    if (!user) {
      toast.error('You must be logged in to save');
      return;
    }

    setLoading(true);
    try {
      const { name, bio, profileImage, ...rest } = cardData;

      const updates = {
        id: user.id,
        full_name: name,
        bio: bio,
        avatar_url: profileImage,
        theme_config: rest,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;
      toast.success('Profile saved successfully!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

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

  const applyTemplate = useCallback((template: Template) => {
    setCardData(prev => ({
      ...prev,
      ...template.config,
    }));
    toast.success(`${template.name} theme applied!`);
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

  const setCustomWidgets = useCallback((widgets: any[]) => {
    updateField('customWidgets', widgets);
  }, [updateField]);

  return {
    cardData,
    loading,
    saveProfile,
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
    applyTemplate,
    reorderSections,
    toggleSection,
    setThemeMode,
    setIconAnimation,
    setIconStyle,
    setProfileImage,
    setCustomWidgets,
    setCoverImage: useCallback((image: string | null) => {
      updateField('coverImage', image);
    }, [updateField]),
  };
}
