import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PublicProfile from '@/pages/PublicProfile';
import { Loader2 } from 'lucide-react';

export const DomainHandler = ({ children }: { children: React.ReactNode }) => {
    const [domainData, setDomainData] = useState<{ isCustom: boolean; profileId: string | null }>({
        isCustom: false,
        profileId: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const hostname = window.location.hostname;
        // Common development and production domain patterns
        const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('.local');
        const isAppDomain = hostname === 'glowlink.bio' || hostname.endsWith('.vercel.app') || hostname.endsWith('.lovableproject.com');

        if (!isLocal && !isAppDomain) {
            const checkDomain = async () => {
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('custom_domain', hostname)
                        .single();

                    if (data) {
                        setDomainData({ isCustom: true, profileId: data.id });
                    }
                } catch (err) {
                    console.error('Domain check failed:', err);
                } finally {
                    setLoading(false);
                }
            };
            checkDomain();
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (domainData.isCustom && domainData.profileId) {
        return <PublicProfile customId={domainData.profileId} />;
    }

    return <>{children}</>;
};
