import React from 'react';
import { templates, Template } from '@/config/templates';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Sparkles } from 'lucide-react';

interface TemplateEditorProps {
    onApply: (template: Template) => void;
    currentAccentColor: string;
}

export function TemplateEditor({ onApply, currentAccentColor }: TemplateEditorProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Ready-to-use Templates</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {templates.map((template) => (
                    <motion.button
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onApply(template)}
                        className="relative overflow-hidden rounded-2xl border bg-card p-4 transition-all hover:shadow-lg text-left group"
                    >
                        <div className="flex items-center gap-4">
                            {/* Preview Circle */}
                            <div
                                className="h-12 w-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white"
                                style={{ backgroundColor: template.previewColor }}
                            >
                                <div
                                    className="h-6 w-6 rounded-full border-2 border-white/50"
                                    style={{ backgroundColor: template.config.accentColor }}
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-base">{template.name}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                    {template.description}
                                </p>
                            </div>

                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Check className="h-4 w-4 text-primary" />
                            </div>
                        </div>

                        {/* Background Accent Gradient */}
                        <div
                            className="absolute -right-4 -bottom-4 h-16 w-16 opacity-5 blur-2xl rounded-full"
                            style={{ backgroundColor: template.config.accentColor }}
                        />
                    </motion.button>
                ))}
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-xs text-muted-foreground text-center italic">
                    Applying a template will update your theme settings but keep your profile info, social links, and content intact.
                </p>
            </div>
        </div>
    );
}
