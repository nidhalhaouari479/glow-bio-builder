import React from 'react';
import { motion } from 'framer-motion';
import { CardData } from '@/types/cardBuilder';
import { cn } from '@/lib/utils';
import { socialPlatforms } from '@/config/socialPlatforms';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Globe, ExternalLink } from 'lucide-react';

interface PortfolioLayoutProps {
    data: CardData;
    renderSection: (type: string) => React.ReactNode;
}

export function PortfolioLayout({ data, renderSection }: PortfolioLayoutProps) {
    const sortedSections = [...data.sections]
        .filter(s => s.enabled)
        .sort((a, b) => a.order - b.order);

    const enabledSocialLinks = data.socialLinks.filter(l => l.enabled);
    const enabledContactButtons = data.contactButtons.filter(b => b.enabled);

    return (
        <div className="flex flex-col lg:flex-row min-h-full bg-transparent gap-6 p-4 lg:p-6 h-full overflow-hidden">
            {/* Sidebar / Left Column */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-[320px] lg:h-full lg:sticky top-0 shrink-0 space-y-6"
            >
                <div className="glass-card p-6 flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-32 w-32 border-4 border-white/20 shadow-2xl">
                        <AvatarImage src={data.profileImage || ''} className="object-cover" />
                        <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                            {data.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">{data.name}</h1>
                        <p className="text-sm font-medium opacity-70" style={{ color: data.accentColor }}>
                            {data.title}
                        </p>
                    </div>

                    <p className="text-sm leading-relaxed opacity-80 line-clamp-4">
                        {data.bio}
                    </p>

                    <div className="w-full pt-4 border-t border-white/10">
                        <div className="flex flex-wrap justify-center gap-2">
                            {enabledSocialLinks.map((link) => {
                                const platform = socialPlatforms[link.platform];
                                const Icon = platform.icon;
                                return (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                        style={{ color: platform.color }}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Contact Quick Links */}
                {enabledContactButtons.length > 0 && (
                    <div className="glass-card p-4 space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider opacity-50 px-2">Contact Me</h3>
                        <div className="grid gap-2">
                            {enabledContactButtons.map((btn) => (
                                <a
                                    key={btn.id}
                                    href={btn.type === 'email' ? `mailto:${btn.value}` : btn.type === 'phone' ? `tel:${btn.value}` : btn.value}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                                >
                                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {btn.type === 'email' && <Mail className="h-4 w-4 text-primary" />}
                                        {btn.type === 'phone' && <Phone className="h-4 w-4 text-primary" />}
                                        {btn.type === 'website' && <Globe className="h-4 w-4 text-primary" />}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold truncate">{btn.label}</span>
                                        <span className="text-[10px] opacity-50 truncate">{btn.value}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Main Content / Right Column */}
            <div className="flex-1 overflow-y-auto custom-scrollbar lg:pr-2">
                <div className="grid gap-6">
                    {sortedSections
                        .filter(s => s.type !== 'bio' && s.type !== 'social' && s.type !== 'contact')
                        .map((section, i) => (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                {renderSection(section.type)}
                            </motion.div>
                        ))}
                </div>
            </div>
        </div>
    );
}
