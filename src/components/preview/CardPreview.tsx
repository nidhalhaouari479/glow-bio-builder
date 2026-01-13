import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CardData, Story } from '@/types/cardBuilder';
import { socialPlatforms } from '@/config/socialPlatforms';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Globe, ExternalLink, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { ParticlesBackground } from './ParticlesBackground';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

interface CardPreviewProps {
  data: CardData;
  isMobile?: boolean;
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export function CardPreview({ data, isMobile = false }: CardPreviewProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  
  const sortedSections = [...data.sections]
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  const getBackgroundStyle = () => {
    switch (data.background.type) {
      case 'solid':
        return { backgroundColor: data.background.solidColor };
      case 'gradient':
        return {
          background: `linear-gradient(${data.background.gradient.direction}deg, ${data.background.gradient.colors.join(', ')})`,
        };
      case 'video':
      case 'particles':
        return { backgroundColor: data.background.solidColor || '#0f172a' };
      default:
        return {
          background: `linear-gradient(${data.background.gradient.direction}deg, ${data.background.gradient.colors.join(', ')})`,
        };
    }
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
      case 'square': return 'rounded-lg';
      case 'pill': return 'rounded-full px-4';
      default: return 'rounded-xl';
    }
  };

  const enabledSocialLinks = data.socialLinks.filter(l => l.enabled);
  const enabledContactButtons = data.contactButtons.filter(b => b.enabled);
  const demoUrl = 'https://mycard.link/demo123';

  const renderSection = (type: string) => {
    switch (type) {
      case 'bio':
        return data.bio ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 card-3d"
          >
            <p className="text-sm leading-relaxed opacity-90">{data.bio}</p>
          </motion.div>
        ) : null;

      case 'social':
        return enabledSocialLinks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <div className="flex flex-wrap justify-center gap-3">
              {enabledSocialLinks.map((link) => {
                const platform = socialPlatforms[link.platform];
                const Icon = platform.icon;
                return (
                  <a
                    key={link.id}
                    href={link.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "h-12 w-12 flex items-center justify-center transition-all duration-300",
                      getIconShape(),
                      getIconClass()
                    )}
                    style={{ 
                      backgroundColor: `${platform.color}20`,
                      color: platform.color,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        ) : null;

      case 'contact':
        return enabledContactButtons.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {enabledContactButtons.map((btn) => {
              const Icon = btn.type === 'email' ? Mail : btn.type === 'phone' ? Phone : Globe;
              return (
                <Button
                  key={btn.id}
                  className="w-full glass-card border-0 h-12 justify-start gap-3 hover:scale-[1.02] transition-transform"
                  variant="ghost"
                  style={{ backgroundColor: `${data.accentColor}20` }}
                >
                  <Icon className="h-4 w-4" style={{ color: data.accentColor }} />
                  <span>{btn.label}</span>
                  <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                </Button>
              );
            })}
          </motion.div>
        ) : null;

      case 'achievements':
        return data.achievements.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              {data.achievements.map((achievement) => (
                <div key={achievement.id} className="space-y-1">
                  {achievement.icon && (
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                  )}
                  <div className="text-2xl font-bold" style={{ color: data.accentColor }}>
                    <AnimatedCounter value={achievement.value} suffix={achievement.suffix} />
                  </div>
                  <div className="text-xs opacity-70">{achievement.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null;

      case 'stories':
        return data.stories.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto scrollbar-hide -mx-2 px-2"
          >
            <div className="flex gap-3">
              {data.stories.map((story) => (
                <button 
                  key={story.id} 
                  className="flex flex-col items-center gap-2 shrink-0 group"
                  onClick={() => setSelectedStory(story)}
                >
                  <div 
                    className="h-16 w-16 rounded-full p-0.5 transition-transform group-hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${data.accentColor}, #ec4899)` }}
                  >
                    <div className="h-full w-full rounded-full overflow-hidden border-2 border-background relative">
                      {story.mediaType === 'video' && story.video ? (
                        <video
                          src={story.video}
                          className="h-full w-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={story.image}
                          alt={story.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-4 w-4 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs opacity-70 max-w-[60px] truncate">{story.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : null;

      case 'badges':
        return data.badges.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {data.badges.map((badge, i) => (
              <span
                key={badge.id}
                className="px-3 py-1 rounded-full text-xs font-medium text-white badge-float"
                style={{ 
                  backgroundColor: badge.color,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                {badge.text}
              </span>
            ))}
          </motion.div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <>
      <div 
        className={cn(
          "relative min-h-full overflow-hidden",
          data.themeMode === 'dark' ? 'dark' : ''
        )}
        style={getBackgroundStyle()}
      >
        {/* Video Background */}
        {data.background.type === 'video' && data.background.videoUrl && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            key={data.background.videoUrl}
          >
            <source src={data.background.videoUrl} type="video/mp4" />
          </video>
        )}

        {/* Particles Background */}
        {data.background.type === 'particles' && (
          <ParticlesBackground 
            preset={data.background.particlePreset} 
            baseColor={data.accentColor}
          />
        )}

        {/* Content */}
        <div className={cn(
          "relative z-10 p-6 space-y-5 min-h-full",
          data.themeMode === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 pt-4"
          >
            <div className="relative inline-block">
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-50"
                style={{ backgroundColor: data.accentColor }}
              />
              <Avatar className="h-24 w-24 border-4 border-white/20 relative">
                <AvatarImage src={data.profileImage || undefined} />
                <AvatarFallback className="bg-white/10 text-2xl">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{data.name || 'Your Name'}</h1>
              <p className="text-sm opacity-70 mt-1">{data.title || 'Your Title'}</p>
            </div>
          </motion.div>

          {/* Sections */}
          {sortedSections.map((section, i) => (
            <div key={section.id} style={{ animationDelay: `${i * 0.1}s` }}>
              {renderSection(section.type)}
            </div>
          ))}

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 flex flex-col items-center gap-3"
          >
            <div className="p-2 bg-white rounded-xl">
              <QRCodeSVG 
                value={demoUrl} 
                size={80} 
                fgColor={data.accentColor}
                level="M"
              />
            </div>
            <p className="text-xs opacity-50">Scan to connect</p>
          </motion.div>
        </div>
      </div>

      {/* Story Modal */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-black border-0">
          <DialogTitle className="sr-only">Story: {selectedStory?.title}</DialogTitle>
          {selectedStory && (
            <div className="relative aspect-[9/16] max-h-[80vh]">
              {selectedStory.mediaType === 'video' && selectedStory.video ? (
                <video 
                  src={selectedStory.video}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  controls
                  playsInline
                />
              ) : (
                <img 
                  src={selectedStory.image} 
                  alt={selectedStory.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                <h3 className="text-white font-semibold">{selectedStory.title}</h3>
                {selectedStory.content && (
                  <p className="text-white/80 text-sm mt-1">{selectedStory.content}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
