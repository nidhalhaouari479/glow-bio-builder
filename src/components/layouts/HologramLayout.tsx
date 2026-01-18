import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { CardData } from '@/types/cardBuilder';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HologramLayoutProps {
    data: CardData;
    renderSection: (type: string) => React.ReactNode;
}

export function HologramLayout({ data, renderSection }: HologramLayoutProps) {
    const sortedSections = [...data.sections]
        .filter(s => s.enabled)
        .sort((a, b) => a.order - b.order);

    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), { damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="min-h-full p-6 perspective-[1200px] overflow-hidden flex flex-col items-center justify-center py-20"
        >
            <motion.div
                style={{ rotateX, rotateY }}
                className="w-full max-w-md space-y-8 relative transform-style-3d"
            >
                {/* Holographic Header */}
                <motion.div
                    className="relative group "
                    whileHover={{ translateZ: 50 }}
                >
                    <div
                        className="absolute inset-x-0 -inset-y-4 blur-2xl opacity-20 transition-opacity group-hover:opacity-40"
                        style={{ backgroundColor: data.accentColor }}
                    />
                    <div className="glass-card p-8 flex flex-col items-center text-center space-y-4 border-white/20 backdrop-blur-3xl relative z-10 overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                        {/* Scanline effect */}
                        <div className="absolute inset-0 scanline-effect opacity-10 pointer-events-none" />

                        <div className="relative">
                            <div
                                className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse"
                                style={{ backgroundColor: data.accentColor }}
                            />
                            <Avatar className="h-28 w-28 border-2 border-white/50 relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                <AvatarImage src={data.profileImage || ''} className="object-cover" />
                                <AvatarFallback className="text-3xl bg-primary/20">{data.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-widest uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                                {data.name}
                            </h1>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-60" style={{ color: data.accentColor }}>
                                {data.title}
                            </p>
                        </div>

                        <p className="text-sm opacity-60 italic leading-relaxed">
                            {data.bio}
                        </p>
                    </div>
                </motion.div>

                {/* Floating Sections */}
                <div className="space-y-6">
                    {sortedSections
                        .filter(s => s.type !== 'bio')
                        .map((section, i) => (
                            <motion.div
                                key={section.id}
                                whileHover={{ translateZ: 30, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="relative"
                            >
                                <div
                                    className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-10 transition-opacity"
                                    style={{ backgroundColor: data.accentColor }}
                                />
                                <div className="glass-card p-6 border-white/10 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                                    {renderSection(section.type)}
                                </div>
                            </motion.div>
                        ))}
                </div>
            </motion.div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .scanline-effect {
          background: linear-gradient(
            transparent 50%,
            rgba(255, 255, 255, 0.05) 50%
          );
          background-size: 100% 4px;
        }
      `}} />
        </div>
    );
}
