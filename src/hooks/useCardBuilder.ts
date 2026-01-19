import { useState, useCallback, useEffect, useRef } from 'react';
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

  // Load draft from localStorage
  const loadDraft = useCallback((userId: string | undefined, currentData: CardData) => {
    try {
      const key = `glow_bio_draft_${userId || 'guest'}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge or just overwrite? Overwriting is safer for now to ensure consistency
        // ensuring we keep defaults for any missing new fields
        return { ...currentData, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load draft', e);
    }
    return null;
  }, []);

  const hasFetched = useRef(false);

  // Fetch data on load
  useEffect(() => {
    // Determine the key based on user ID
    const userId = user?.id;
    const key = `glow_bio_draft_${userId || 'guest'}`;

    // Always load draft first for immediate UI update
    const savedDraft = loadDraft(userId, defaultCardData);

    // Only perform the database fetch once per mount/user-change
    if (hasFetched.current && userId === user?.id) return;

    if (!userId) {
      if (savedDraft) {
        setCardData(savedDraft);
      }
      hasFetched.current = true;
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        let dbData: CardData = defaultCardData;

        if (data) {
          dbData = {
            ...defaultCardData,
            name: data.full_name || defaultCardData.name,
            bio: data.bio || defaultCardData.bio,
            profileImage: data.avatar_url || defaultCardData.profileImage,
            ...(data.theme_config as Partial<CardData>)
          };
        }

        // If we have a local draft, we prioritize it as "unsaved work"
        if (savedDraft) {
          setCardData(savedDraft);
          console.log('Restored draft from localStorage for user:', userId);
        } else {
          setCardData(dbData);
        }

        hasFetched.current = true;
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        if (savedDraft) setCardData(savedDraft);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, loadDraft]); // Dependency on ID, not the object reference

  // Save to localStorage whenever cardData changes
  useEffect(() => {
    const userId = user?.id;
    const key = `glow_bio_draft_${userId || 'guest'}`;

    const timer = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(cardData));
    }, 500);

    return () => clearTimeout(timer);
  }, [cardData, user?.id]);

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

      // OPTIONAL: Clear draft on save?
      // localStorage.removeItem(`glow_bio_draft_${user.id}`);
      // Actually, keep it. It's the "current state". 
      // If we clear it, the next render (debounced) will put it back anyway.

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
