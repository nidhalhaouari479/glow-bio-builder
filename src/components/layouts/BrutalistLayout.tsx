import React from 'react';
import { motion } from 'framer-motion';
import { CardData } from '@/types/cardBuilder';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BrutalistLayoutProps {
    data: CardData;
    renderSection: (type: string) => React.ReactNode;
}

export function BrutalistLayout({ data, renderSection }: BrutalistLayoutProps) {
    const sortedSections = [...data.sections]
        .filter(s => s.enabled)
        .sort((a, b) => a.order - b.order);

    const shadowColor = data.themeMode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,1)';

    return (
        <div className="min-h-full p-6 space-y-8 pb-20">
            {/* Brutalist Header */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="relative group pt-4"
            >
                <div
                    className="absolute inset-0 translate-x-2 translate-y-2 z-0 border-[3px] border-black"
                    style={{ backgroundColor: data.accentColor }}
                />
                <div className="relative z-10 bg-white border-[3px] border-black p-6 flex flex-col items-start gap-4 text-black">
                    <div className="relative">
                        <div className="absolute inset-0 translate-x-1 translate-y-1 bg-black rounded-none" />
                        <Avatar className="h-24 w-24 border-[3px] border-black rounded-none relative z-10">
                            <AvatarImage src={data.profileImage || ''} className="object-cover" />
                            <AvatarFallback className="bg-white rounded-none text-2xl font-black">
                                {data.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                            {data.name}
                        </h1>
                        <div className="inline-block bg-black text-white px-2 py-1 text-xs font-bold uppercase">
                            {data.title}
                        </div>
                    </div>

                    <p className="text-sm font-bold leading-tight border-l-4 border-black pl-3 py-1 italic">
                        {data.bio}
                    </p>
                </div>
            </motion.div>

            {/* Brutalist Sections */}
            <div className="space-y-6">
                {sortedSections
                    .filter(s => s.type !== 'bio')
                    .map((section, i) => (
                        <motion.div
                            key={section.id}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative"
                        >
                            <div
                                className="absolute inset-0 translate-x-1.5 translate-y-1.5 z-0 border-[2px] border-black opacity-50 bg-white"
                            />
                            <div className="relative z-10 brutalist-card">
                                {renderSection(section.type)}
                            </div>
                        </motion.div>
                    ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .brutalist-card {
          background: white !important;
          border: 3px solid black !important;
          border-radius: 0 !important;
          color: black !important;
          box-shadow: 6px 6px 0px 0px rgba(0,0,0,1) !important;
          transition: transform 0.1s !important;
        }
        .brutalist-card:hover {
          transform: translate(-2px, -2px) !important;
          box-shadow: 8px 8px 0px 0px rgba(0,0,0,1) !important;
        }
        .brutalist-card * {
          color: black !important;
          border-radius: 0 !important;
        }
        .brutalist-card button, .brutalist-card a {
          border: 2px solid black !important;
          background: ${data.accentColor}20 !important;
        }
      `}} />
        </div>
    );
}
