import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CardData, Story } from '@/types/cardBuilder';
import { socialPlatforms } from '@/config/socialPlatforms';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Globe, ExternalLink, Play, X, Loader2, AlertCircle, Image as ImageIcon, Puzzle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { ParticlesBackground } from './ParticlesBackground';
import { BentoGrid } from '@/components/layouts/BentoGrid';
import { TerminalLayout } from '@/components/layouts/TerminalLayout';
import { PortfolioLayout } from '@/components/layouts/PortfolioLayout';
import { HologramLayout } from '@/components/layouts/HologramLayout';
import { BrutalistLayout } from '@/components/layouts/BrutalistLayout';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useParams } from 'react-router-dom';

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


function StoryMediaViewer({ story }: { story: Story }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reset state when story changes
  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [story.id, story.mediaType, story.video, story.image]);

  const isVideo = story.mediaType === 'video' && !!story.video;
  const src = isVideo ? story.video : story.image;

  if (!src) {
    return (
      <div className="flex flex-col items-center justify-center text-white/50">
        <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">No media source</p>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <Loader2 className="h-8 w-8 animate-spin text-white/50" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 text-red-400">
          <AlertCircle className="h-10 w-10 mb-2" />
          <p className="text-sm">Failed to load media</p>
        </div>
      )}

      {/* Blurred Background */}
      {!error && (
        <div className="absolute inset-0 opacity-30 blur-3xl scale-110 pointer-events-none">
          {isVideo ? (
            <video src={src} className="w-full h-full object-cover" muted />
          ) : (
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
          )}
        </div>
      )}

      {/* Main Content */}
      {isVideo ? (
        <video
          src={src}
          className={cn("w-full h-full object-contain relative z-20 transition-opacity duration-300", loading ? 'opacity-0' : 'opacity-100')}
          autoPlay
          loop
          playsInline
          onLoadedData={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
          onClick={(e) => {
            const video = e.currentTarget;
            video.paused ? video.play() : video.pause();
          }}
        />
      ) : (
        <img
          src={src}
          alt={story.title}
          className={cn("w-full h-full object-contain relative z-20 transition-opacity duration-300", loading ? 'opacity-0' : 'opacity-100')}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
        />
      )}
    </>
  );
}

export function CardPreview({ data, isMobile = false }: CardPreviewProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const { id: profileId } = useParams<{ id: string }>();
  const { trackClick } = useAnalytics();

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
      case 'rounded': return 'rounded-full';
      case 'square': return 'rounded-lg';
      case 'pill': return 'rounded-full w-auto px-6';
      default: return 'rounded-full';
    }
  };

  const enabledSocialLinks = data.socialLinks.filter(l => l.enabled);
  const enabledContactButtons = data.contactButtons.filter(b => b.enabled);

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
                    onClick={() => {
                      if (profileId) {
                        trackClick(profileId, 'social_link', link.platform, { url: link.url });
                      }
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
                  onClick={() => {
                    if (profileId) {
                      trackClick(profileId, 'contact_button', btn.type, { label: btn.label });
                    }
                  }}
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

      case 'custom_widgets':
        return data.customWidgets.length > 0 ? (
          <div className="space-y-4">
            {data.customWidgets.filter(w => w.enabled).map((widget) => (
              <motion.div
                key={widget.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={widget.settings.animation === 'glow' ? { boxShadow: `0 0 20px ${data.accentColor}50` } : {}}
                className={cn(
                  "p-5 rounded-3xl transition-all duration-300",
                  widget.settings.animation === 'float' && "badge-float",
                  widget.settings.animation === 'shake' && "icon-shake"
                )}
                style={{
                  backgroundColor: widget.settings.backgroundColor || 'rgba(255,255,255,0.05)',
                  color: widget.settings.textColor || 'inherit',
                  borderRadius: widget.settings.borderRadius || '24px',
                  borderStyle: widget.settings.borderStyle || 'none',
                  borderColor: widget.settings.borderColor || 'transparent',
                  borderWidth: widget.settings.borderStyle !== 'none' ? '1px' : '0',
                  textAlign: widget.settings.textAlign || 'left',
                }}
              >
                {widget.title && (
                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">
                    {widget.title}
                  </h4>
                )}

                {widget.type === 'text' && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{widget.content}</p>
                )}

                {widget.type === 'links' && Array.isArray(widget.content) && (
                  <div className="space-y-2 mt-2">
                    {widget.content.map((link: any) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:underline opacity-90"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {link.title || link.url}
                      </a>
                    ))}
                  </div>
                )}

                {widget.type === 'counter' && (
                  <div className="text-4xl font-black tabular-nums">
                    <AnimatedCounter value={Number(widget.content) || 0} />
                  </div>
                )}

                {widget.type === 'gallery' && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Array.isArray(widget.content) && widget.content.map((item: any) => (
                      <button
                        key={item.id}
                        className="aspect-square rounded-xl overflow-hidden relative group"
                        onClick={() => setSelectedStory({
                          id: item.id,
                          title: 'Gallery Image',
                          image: item.url,
                          mediaType: 'image',
                          content: ''
                        })}
                      >
                        <img
                          src={item.url}
                          alt="Gallery"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </button>
                    ))}
                    {(!widget.content || (Array.isArray(widget.content) && widget.content.length === 0)) && (
                      <div className="col-span-2 text-center p-4 text-xs opacity-50">
                        No images
                      </div>
                    )}
                  </div>
                )}

                {widget.type === 'audio' && widget.content?.url && (
                  <div className="mt-3 bg-white/10 rounded-xl p-3 flex items-center gap-3 backdrop-blur-md">
                    <div className="relative h-12 w-12 shrink-0">
                      <img
                        src={widget.content.coverArt}
                        alt="Album Art"
                        className={cn(
                          "h-full w-full rounded-full object-cover shadow-lg",
                          "animate-spin-slow" // You might need to add this class or use style
                        )}
                        style={{ animationDuration: '4s' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                        <div className="h-2 w-2 bg-white rounded-full" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{widget.content.title}</p>
                      <p className="text-[10px] opacity-70 truncate">{widget.content.artist}</p>
                    </div>

                    <button
                      className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent widget click if any
                        const btn = e.currentTarget;
                        const audio = btn.querySelector('audio');
                        if (audio) {
                          if (audio.paused) {
                            // Pause other audios if needed (simple implementation for now)
                            document.querySelectorAll('audio').forEach(a => a !== audio && a.pause());
                            audio.play();
                            btn.setAttribute('data-playing', 'true');
                          } else {
                            audio.pause();
                            btn.setAttribute('data-playing', 'false');
                          }
                          // Force re-render not needed if we rely on native audio events or simple toggle
                          // But for icon swap, we might need state.
                          // For now, let's just toggle icon via class or simple inline logic if state were available.
                          // Since we are mapping, local state is tricky without a sub-component.
                          // Let's use a simple HTML audio element reference.
                        }
                      }}
                    >
                      <audio src={widget.content.url} onEnded={(e) => {
                        e.currentTarget.parentElement?.setAttribute('data-playing', 'false');
                      }} />
                      <Play className="h-3 w-3 fill-current ml-0.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
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
        style={{
          ...getBackgroundStyle(),
          fontFamily: data.fontFamily,
        }}
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
          {data.layout === 'bento' ? (
            <div className="h-full overflow-y-auto">
              <BentoGrid data={data} onStoryClick={setSelectedStory} />
            </div>
          ) : data.layout === 'terminal' ? (
            <TerminalLayout data={data} renderSection={renderSection} />
          ) : data.layout === 'portfolio' ? (
            <PortfolioLayout data={data} renderSection={renderSection} />
          ) : data.layout === 'hologram' ? (
            <HologramLayout data={data} renderSection={renderSection} />
          ) : data.layout === 'brutalist' ? (
            <BrutalistLayout data={data} renderSection={renderSection} />
          ) : (
            <>
              {/* Default Header */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 pt-4 relative"
              >
                {/* Cover Photo */}
                {data.coverImage && (
                  <div className="absolute top-0 left-0 right-0 aspect-[3/1] overflow-hidden -mx-6 -mt-6 z-0">
                    <img src={data.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                  </div>
                )}

                {/* Spacer for Cover Photo */}
                {data.coverImage && <div className="aspect-[3/1] h-0 -mx-6 -mt-6 mb-6" />}


                <div className="relative inline-block z-10">
                  <div
                    className="absolute inset-0 rounded-full blur-xl opacity-50"
                    style={{ backgroundColor: data.accentColor }}
                  />
                  <Avatar className={cn(
                    "h-24 w-24 border-4 relative",
                    data.coverImage ? "border-background" : "border-white/20"
                  )}>
                    <AvatarImage src={data.profileImage || undefined} className="object-cover" />
                    <AvatarFallback className="bg-white/10 text-2xl">
                      <User className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="relative z-10">
                  <h1 className="text-2xl font-bold">{data.name || 'Your Name'}</h1>
                  <p className="text-sm opacity-70 mt-1">{data.title || 'Your Title'}</p>
                </div>
              </motion.div>

              {/* Sections for List Layout */}
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
                    value={window.location.href}
                    size={80}
                    fgColor={data.accentColor}
                    level="M"
                  />
                </div>
                <p className="text-xs opacity-50">Scan to connect</p>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Story Modal */}
      {/* Immersive Story Modal */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="fixed z-[60] left-0 top-0 w-screen h-screen max-w-none m-0 p-0 border-none bg-black flex flex-col items-center justify-center translate-x-0 translate-y-0 data-[state=open]:slide-in-from-bottom-0 data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100 rounded-none">
          <DialogTitle className="sr-only">Story: {selectedStory?.title}</DialogTitle>
          <button
            onClick={() => setSelectedStory(null)}
            className="absolute top-6 right-6 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {selectedStory && (
            <div className="relative w-full h-full flex items-center justify-center bg-zinc-900">
              <StoryMediaViewer story={selectedStory} />

              {/* Story Overlay Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20 pointer-events-none z-20">
                <h3 className="text-white text-lg font-bold drop-shadow-md">{selectedStory.title}</h3>
                {selectedStory.content && (
                  <p className="text-white/90 text-sm mt-2 leading-relaxed drop-shadow-md">{selectedStory.content}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
