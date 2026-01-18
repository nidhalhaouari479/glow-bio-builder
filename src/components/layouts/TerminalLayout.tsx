import React from 'react';
import { motion } from 'framer-motion';
import { CardData } from '@/types/cardBuilder';
import { cn } from '@/lib/utils';
import { socialPlatforms } from '@/config/socialPlatforms';

interface TerminalLayoutProps {
    data: CardData;
    renderSection: (type: string) => React.ReactNode;
}

export function TerminalLayout({ data, renderSection }: TerminalLayoutProps) {
    const sortedSections = [...data.sections]
        .filter(s => s.enabled)
        .sort((a, b) => a.order - b.order);

    return (
        <div className="min-h-full p-4 font-mono text-sm">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Window Header */}
                <div className="bg-white/5 border-b border-white/10 p-3 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                        <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                        <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                        {data.name.toLowerCase().replace(/\s+/g, '-')}.ts — editor
                    </div>
                    <div className="w-12" /> {/* Spacer */}
                </div>

                {/* Code Content */}
                <div className="p-6 space-y-6 max-h-[700px] overflow-y-auto custom-scrollbar">
                    {/* Const Declaration */}
                    <div className="space-y-1">
                        <div className="flex gap-3">
                            <span className="text-white/20 select-none w-4">1</span>
                            <div>
                                <span className="text-purple-400">const</span> <span className="text-blue-400">Profile</span> = {'{'}
                            </div>
                        </div>

                        <div className="flex gap-3 pl-4">
                            <span className="text-white/20 select-none w-4">2</span>
                            <div>
                                <span className="text-cyan-400">name</span>: <span className="text-yellow-200">"{data.name}"</span>,
                            </div>
                        </div>

                        <div className="flex gap-3 pl-4">
                            <span className="text-white/20 select-none w-4">3</span>
                            <div>
                                <span className="text-cyan-400">role</span>: <span className="text-yellow-200">"{data.title}"</span>,
                            </div>
                        </div>

                        <div className="flex gap-3 pl-4">
                            <span className="text-white/20 select-none w-4">4</span>
                            <div>
                                <span className="text-cyan-400">bio</span>: <span className="text-yellow-200">"{data.bio}"</span>,
                            </div>
                        </div>

                        <div className="flex gap-3 pl-4">
                            <span className="text-white/20 select-none w-4">5</span>
                            <div>
                                <span className="text-cyan-400">socials</span>: [
                            </div>
                        </div>

                        {data.socialLinks.filter(l => l.enabled).map((link, i) => (
                            <div key={link.id} className="flex gap-3 pl-8">
                                <span className="text-white/20 select-none w-4">{6 + i}</span>
                                <div>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-pink-400 hover:underline"
                                    >
                                        "{link.platform}"
                                    </a>,
                                </div>
                            </div>
                        ))}

                        <div className="flex gap-3 pl-4">
                            <span className="text-white/20 select-none w-4">{6 + data.socialLinks.filter(l => l.enabled).length}</span>
                            <div>]</div>
                        </div>

                        <div className="flex gap-3">
                            <span className="text-white/20 select-none w-4">{7 + data.socialLinks.filter(l => l.enabled).length}</span>
                            <div>{'}'};</div>
                        </div>
                    </div>

                    {/* Sections Rendered as Code Blocks */}
                    <div className="space-y-8">
                        {sortedSections.filter(s => s.type !== 'bio' && s.type !== 'social').map((section, i) => (
                            <div key={section.id} className="space-y-2">
                                <div className="flex gap-3">
                                    <span className="text-white/20 select-none w-4">#</span>
                                    <div className="text-purple-400 font-bold">
                    // section: {section.type.toUpperCase()}
                                    </div>
                                </div>
                                <div className="pl-7">
                                    {renderSection(section.type)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Blinking Cursor */}
                    <div className="flex gap-3">
                        <span className="text-white/20 select-none w-4">_</span>
                        <motion.div
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-2 h-4 bg-primary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
