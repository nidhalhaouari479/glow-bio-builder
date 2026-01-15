import React from 'react';
import { motion } from 'framer-motion';
import { CardData, Story, Achievement, Badge, SocialLink, ContactButton } from '@/types/cardBuilder';
import { cn } from '@/lib/utils';
import { User, ArrowRight, ExternalLink, Play } from 'lucide-react';
import { socialPlatforms } from '@/config/socialPlatforms';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BentoGridProps {
    data: CardData;
    onStoryClick: (story: Story) => void;
}

export function BentoGrid({ data, onStoryClick }: BentoGridProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    const getIconClass = () => {
        switch (data.iconAnimation) {
            case 'pulse': return 'icon-pulse';
            case 'glow': return 'icon-glow';
            case 'lift': return 'icon-lift';
            case 'shake': return 'icon-shake';
            default: return '';
        }
    };

    const getIconShape = () => {
        switch (data.iconStyle) {
            case 'rounded': return 'rounded-full';
            case 'square': return 'rounded-xl';
            case 'pill': return 'rounded-full'; // Bento grid tiles are square/rectangular by grid, so just round corners fully
            default: return 'rounded-full';
        }
    };

    const getGlassClass = (opacity = 20) => {
        // Helper to generate glassmorphism style compatible with current theme
        return "glass-card backdrop-blur-md border border-white/10 shadow-xl overflow-hidden relative group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl";
    };

    const enabledSocialLinks = data.socialLinks.filter(l => l.enabled);
    const enabledContactButtons = data.contactButtons.filter(b => b.enabled);
    const enabledStories = data.stories; // Assuming all are enabled for now as there's no enabled flag on stories
    const enabledAchievements = data.achievements;

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 max-w-4xl mx-auto"
        >
            {/* Profile Tile - Large - Spans 2x2 or full width on mobile if needed */}
            <motion.div variants={item} className={cn(getGlassClass(), "col-span-2 row-span-2 p-0 flex flex-col justify-between aspect-square md:aspect-auto")}> {/* Converted p-6 to p-0 for global relative positioning, inner content will need padding */}

                {/* Cover Photo Background */}
                {data.coverImage && (
                    <div className="absolute top-0 inset-x-0 h-32 z-0">
                        <img src={data.coverImage} alt="Cover" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                    </div>
                )}

                <div className={cn("flex flex-col justify-between flex-1 relative z-10", data.coverImage ? "pt-20 p-6 items-center text-center" : "p-6")}>
                    <div className="space-y-4">
                        <div className="relative inline-block">
                            <Avatar className={cn("h-20 w-20 border-2", data.coverImage ? "border-white" : "border-white/30")}>
                                <AvatarImage src={data.profileImage || undefined} />
                                <AvatarFallback className="bg-white/10"><User /></AvatarFallback>
                            </Avatar>
                            {data.iconAnimation === 'pulse' && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{data.name}</h2>
                            <p className="opacity-70 font-medium">{data.title}</p>
                        </div>
                        <p className="text-sm opacity-80 leading-relaxed line-clamp-3">{data.bio}</p>
                    </div>
                </div>

                {/* Decorative gradient blob - only if no cover to avoid clash */}
                {!data.coverImage && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-10 -mt-10" style={{ backgroundColor: data.accentColor }} />
                )}
            </motion.div>

            {/* Social Links - Small Tiles */}
            {enabledSocialLinks.slice(0, 4).map((link) => {
                const platform = socialPlatforms[link.platform];
                const Icon = platform.icon;
                return (
                    <motion.a
                        key={link.id}
                        variants={item}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            getGlassClass(),
                            "col-span-1 aspect-square flex flex-col items-center justify-center gap-2 hover:bg-white/5",
                            getIconShape(),
                            getIconClass()
                        )}
                        style={{ '--hover-color': platform.color } as any}
                    >
                        <Icon className="h-8 w-8 transition-colors duration-300" style={{ color: platform.color }} />
                    </motion.a>
                );
            })}

            {/* Contact Buttons - Wide Tiles */}
            {enabledContactButtons.map((btn) => (
                <motion.a
                    key={btn.id}
                    variants={item}
                    href={btn.type === 'email' ? `mailto:${btn.value}` : btn.type === 'phone' ? `tel:${btn.value}` : btn.value}
                    target={btn.type === 'website' ? '_blank' : undefined}
                    className={cn(getGlassClass(), "col-span-2 flex items-center justify-between p-4")}
                >
                    <span className="font-medium">{btn.label}</span>
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </motion.a>
            ))}

            {/* Stories - Tall Tiles */}
            {enabledStories.length > 0 && (
                <motion.div variants={item} className="col-span-2 row-span-2 grid grid-cols-2 gap-2">
                    {enabledStories.slice(0, 4).map((story) => (
                        <div
                            key={story.id}
                            onClick={() => onStoryClick(story)}
                            className="relative rounded-xl overflow-hidden aspect-[3/4] cursor-pointer group"
                        >
                            {story.mediaType === 'video' ? (
                                <video src={story.video} className="w-full h-full object-cover" muted />
                            ) : (
                                <img src={story.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            )}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100" />
                            </div>
                            <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-xs font-medium truncate">{story.title}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Achievements - Small Info Tiles */}
            {enabledAchievements.map((ach) => (
                <motion.div variants={item} key={ach.id} className={cn(getGlassClass(), "col-span-1 p-3 flex flex-col items-center justify-center text-center")}>
                    <span className="text-2xl mb-1">{ach.icon}</span>
                    <span className="text-lg font-bold" style={{ color: data.accentColor }}>{ach.value}{ach.suffix}</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-60">{ach.label}</span>
                </motion.div>
            ))}

        </motion.div>
    );
}
