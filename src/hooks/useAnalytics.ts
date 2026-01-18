import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';

export function useAnalytics() {
    const trackEvent = useCallback(async (
        profileId: string,
        eventType: 'view' | 'click',
        targetType?: 'social_link' | 'contact_button' | 'profile',
        targetId?: string,
        metadata: any = {}
    ) => {
        try {
            const { error } = await supabase
                .from('analytics_events')
                .insert({
                    profile_id: profileId,
                    event_type: eventType,
                    target_type: targetType,
                    target_id: targetId,
                    metadata
                });

            if (error) {
                console.warn('Analytics tracking error:', error.message);
            }
        } catch (err) {
            console.error('Failed to track event:', err);
        }
    }, []);

    const trackView = useCallback((profileId: string) => {
        return trackEvent(profileId, 'view', 'profile');
    }, [trackEvent]);

    const trackClick = useCallback((
        profileId: string,
        targetType: 'social_link' | 'contact_button',
        targetId: string,
        metadata?: any
    ) => {
        return trackEvent(profileId, 'click', targetType, targetId, metadata);
    }, [trackEvent]);

    return { trackView, trackClick };
}
