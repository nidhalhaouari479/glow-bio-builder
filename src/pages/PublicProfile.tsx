
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { CardPreview } from '@/components/preview/CardPreview';
import { CardData, defaultCardData } from '@/types/cardBuilder';
import { Loader2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function PublicProfile({ customId }: { customId?: string }) {
    const { id: paramId } = useParams<{ id: string }>();
    const id = customId || paramId;
    const [data, setData] = useState<CardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { trackView } = useAnalytics();

    useEffect(() => {
        async function fetchProfile() {
            if (!id) return;

            try {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (profile) {
                    // Reconstruct CardData from stored profile
                    const cardData: CardData = {
                        ...defaultCardData,
                        name: profile.full_name || defaultCardData.name,
                        bio: profile.bio || defaultCardData.bio,
                        profileImage: profile.avatar_url || defaultCardData.profileImage,
                        ...(profile.theme_config as Partial<CardData>)
                    };
                    setData(cardData);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Profile not found');
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
        if (id) {
            trackView(id);
        }
    }, [id, trackView]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
                <p className="text-gray-600">The card you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <CardPreview data={data} isMobile={false} />
        </div>
    );
}
