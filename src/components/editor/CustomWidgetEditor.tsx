import React, { useState } from 'react';
import { CardData, CustomWidget } from '@/types/cardBuilder';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Settings2, Code, Type, Link, Image as ImageIcon, Hash, List, Upload, X, Music, Play, Pause, Search } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/lib/storage'; // Import upload utility

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible';

// iTunes Search API types
interface ItunesTrack {
    trackId: number;
    trackName: string;
    artistName: string;
    previewUrl: string;
    artworkUrl100: string;
}

interface CustomWidgetEditorProps {
    widgets: CustomWidget[];
    onUpdate: (widgets: CustomWidget[]) => void;
    accentColor: string;
}

export function CustomWidgetEditor({ widgets, onUpdate, accentColor }: CustomWidgetEditorProps) {
    const [openWidgetId, setOpenWidgetId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ItunesTrack[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    const searchTracks = async (query: string) => {
        if (!query.trim()) return;
        setIsSearching(true);
        try {
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=5`);
            const data = await response.json();
            setSearchResults(data.results);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setIsSearching(false);
        }
    };

    const togglePreview = (url: string) => {
        if (playingPreview === url) {
            audioRef.current?.pause();
            setPlayingPreview(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(url);
            audioRef.current.play();
            setPlayingPreview(url);
            audioRef.current.onended = () => setPlayingPreview(null);
        }
    };

    const addWidget = (type: CustomWidget['type']) => {
        const newWidget: CustomWidget = {
            id: uuidv4(),
            type,
            title: type === 'text' ? 'Quick Note' : type === 'links' ? 'Resources' : type === 'gallery' ? 'Photo Gallery' : type === 'audio' ? 'My Anthem' : 'My Widget',
            content: type === 'text' ? '' : type === 'links' || type === 'gallery' ? [] : {},
            settings: {
                borderRadius: '16px',
                borderStyle: 'none',
                padding: '20px',
                textAlign: 'left',
                animation: 'none'
            },
            enabled: true,
            order: widgets.length
        };
        onUpdate([...widgets, newWidget]);
        setOpenWidgetId(newWidget.id);
    };

    const updateWidget = (id: string, updates: Partial<CustomWidget>) => {
        onUpdate(widgets.map(w => w.id === id ? { ...w, ...updates } : w));
    };

    const updateWidgetSettings = (id: string, settingsUpdate: Partial<CustomWidget['settings']>) => {
        onUpdate(widgets.map(w => w.id === id ? { ...w, settings: { ...w.settings, ...settingsUpdate } } : w));
    };

    const removeWidget = (id: string) => {
        onUpdate(widgets.filter(w => w.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => addWidget('text')} className="gap-2">
                    <Type className="h-3.5 w-3.5" /> Text
                </Button>
                <Button size="sm" variant="outline" onClick={() => addWidget('links')} className="gap-2">
                    <Link className="h-3.5 w-3.5" /> Link List
                </Button>
                <Button size="sm" variant="outline" onClick={() => addWidget('counter')} className="gap-2">
                    <Hash className="h-3.5 w-3.5" /> Counter
                </Button>
                <Button size="sm" variant="outline" onClick={() => addWidget('gallery')} className="gap-2">
                    <ImageIcon className="h-3.5 w-3.5" /> Gallery
                </Button>
                <Button size="sm" variant="outline" onClick={() => addWidget('audio')} className="gap-2">
                    <Music className="h-3.5 w-3.5" /> Audio
                </Button>
            </div>

            <div className="space-y-3">
                {widgets.length === 0 && (
                    <div className="p-8 border-2 border-dashed rounded-xl text-center opacity-50">
                        <p className="text-sm">No custom widgets yet.</p>
                        <p className="text-xs mt-1">Add one above to make your profile unique!</p>
                    </div>
                )}

                {widgets.map((widget) => (
                    <Collapsible
                        key={widget.id}
                        open={openWidgetId === widget.id}
                        onOpenChange={() => setOpenWidgetId(openWidgetId === widget.id ? null : widget.id)}
                        className="border rounded-xl overflow-hidden bg-white/5"
                    >
                        <div className="flex items-center gap-3 p-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                {widget.type === 'text' && <Type className="h-4 w-4" />}
                                {widget.type === 'links' && <Link className="h-4 w-4" />}
                                {widget.type === 'counter' && <Hash className="h-4 w-4" />}
                                {widget.type === 'gallery' && <ImageIcon className="h-4 w-4" />}
                                {widget.type === 'audio' && <Music className="h-4 w-4" />}
                                {widget.type === 'poll' && <List className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="font-medium text-sm block truncate">{widget.title || widget.type}</span>
                                <span className="text-[10px] opacity-50 uppercase tracking-wider">{widget.type} widget</span>
                            </div>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Settings2 className="h-4 w-4" />
                                </Button>
                            </CollapsibleTrigger>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeWidget(widget.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <CollapsibleContent className="p-4 pt-0 space-y-4 border-t border-white/5 mt-2">
                            <div className="space-y-4 pt-4">
                                {/* Common Title */}
                                <div className="space-y-2">
                                    <Label className="text-xs">Widget Title</Label>
                                    <Input
                                        value={widget.title}
                                        onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
                                        placeholder="E.g. My Favorite Quote"
                                        className="h-8 text-sm"
                                    />
                                </div>

                                {/* Type Specific Content */}
                                {widget.type === 'text' && (
                                    <div className="space-y-2">
                                        <Label className="text-xs">Content</Label>
                                        <Textarea
                                            value={widget.content}
                                            onChange={(e) => updateWidget(widget.id, { content: e.target.value })}
                                            placeholder="Write anything..."
                                            className="min-h-[100px] text-sm"
                                        />
                                    </div>
                                )}

                                {widget.type === 'links' && (
                                    <div className="space-y-2">
                                        <Label className="text-xs">Custom Links (Comma separated URLs)</Label>
                                        <Textarea
                                            value={Array.isArray(widget.content) ? widget.content.map((l: any) => l.url || l).join('\n') : ''}
                                            onChange={(e) => {
                                                const urls = e.target.value.split('\n').filter(u => u.trim());
                                                updateWidget(widget.id, { content: urls.map(u => ({ id: uuidv4(), url: u, title: u })) });
                                            }}
                                            placeholder="https://example.com"
                                            className="min-h-[100px] text-sm"
                                        />
                                    </div>
                                )}

                                {widget.type === 'gallery' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs">Gallery Images</Label>
                                            <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3">
                                                <Upload className="mr-2 h-3 w-3" />
                                                Add Photos
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const files = Array.from(e.target.files || []);
                                                        if (files.length === 0) return;

                                                        // Handle uploads
                                                        for (const file of files) {
                                                            try {
                                                                const publicUrl = await uploadImage(file);
                                                                if (publicUrl) {
                                                                    const currentContent = Array.isArray(widget.content) ? widget.content : [];
                                                                    updateWidget(widget.id, {
                                                                        content: [...currentContent, { id: uuidv4(), url: publicUrl }]
                                                                    });
                                                                }
                                                            } catch (error) {
                                                                console.error("Failed to upload image", error);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>

                                        {(!widget.content || (Array.isArray(widget.content) && widget.content.length === 0)) ? (
                                            <div className="text-center p-8 border-2 border-dashed border-white/10 rounded-lg">
                                                <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                                                <p className="text-xs text-muted-foreground">No photos added yet</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2">
                                                {Array.isArray(widget.content) && widget.content.map((item: any) => (
                                                    <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden bg-black/20">
                                                        <img src={item.url} alt="Gallery item" className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => {
                                                                const newContent = widget.content.filter((i: any) => i.id !== item.id);
                                                                updateWidget(widget.id, { content: newContent });
                                                            }}
                                                            className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {widget.type === 'audio' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Search Song</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && searchTracks(searchQuery)}
                                                    placeholder="Search for a song..."
                                                    className="h-8 text-sm"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={() => searchTracks(searchQuery)}
                                                    disabled={isSearching}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Search className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {searchResults.length > 0 && (
                                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                                <Label className="text-[10px] uppercase font-bold opacity-50">Results</Label>
                                                {searchResults.map((track) => (
                                                    <div
                                                        key={track.trackId}
                                                        className="flex items-center gap-3 p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
                                                    >
                                                        <img src={track.artworkUrl100} alt={track.trackName} className="w-8 h-8 rounded" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium truncate">{track.trackName}</p>
                                                            <p className="text-[10px] opacity-70 truncate">{track.artistName}</p>
                                                        </div>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-6 w-6 rounded-full"
                                                            onClick={() => togglePreview(track.previewUrl)}
                                                        >
                                                            {playingPreview === track.previewUrl ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            className="h-6 text-[10px] px-2"
                                                            onClick={() => {
                                                                updateWidget(widget.id, {
                                                                    content: {
                                                                        url: track.previewUrl,
                                                                        title: track.trackName,
                                                                        artist: track.artistName,
                                                                        coverArt: track.artworkUrl100
                                                                    },
                                                                    title: track.trackName // Auto-update title
                                                                });
                                                                setSearchResults([]);
                                                                setSearchQuery('');
                                                            }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {widget.content?.url && (
                                            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-3">
                                                <img src={widget.content.coverArt} alt="Cover" className="h-10 w-10 rounded-md shadow-lg" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold truncate">{widget.content.title}</p>
                                                    <p className="text-[10px] opacity-70 truncate">{widget.content.artist}</p>
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/30 text-primary"
                                                    onClick={() => togglePreview(widget.content.url)}
                                                >
                                                    {playingPreview === widget.content.url ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Styling Section */}
                                <div className="pt-4 border-t border-white/5 space-y-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Style & Layout</p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Background</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={widget.settings.backgroundColor || '#000000'}
                                                    onChange={(e) => updateWidgetSettings(widget.id, { backgroundColor: e.target.value })}
                                                    className="w-8 h-8 p-0 border-none rounded-full overflow-hidden"
                                                />
                                                <Input
                                                    value={widget.settings.backgroundColor || ''}
                                                    onChange={(e) => updateWidgetSettings(widget.id, { backgroundColor: e.target.value })}
                                                    placeholder="#000000"
                                                    className="h-8 text-[10px] flex-1"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Text Color</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={widget.settings.textColor || '#ffffff'}
                                                    onChange={(e) => updateWidgetSettings(widget.id, { textColor: e.target.value })}
                                                    className="w-8 h-8 p-0 border-none rounded-full overflow-hidden"
                                                />
                                                <Input
                                                    value={widget.settings.textColor || ''}
                                                    onChange={(e) => updateWidgetSettings(widget.id, { textColor: e.target.value })}
                                                    placeholder="#ffffff"
                                                    className="h-8 text-[10px] flex-1"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Alignment</Label>
                                            <Select
                                                value={widget.settings.textAlign}
                                                onValueChange={(v: any) => updateWidgetSettings(widget.id, { textAlign: v })}
                                            >
                                                <SelectTrigger className="h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="left">Left</SelectItem>
                                                    <SelectItem value="center">Center</SelectItem>
                                                    <SelectItem value="right">Right</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Animation</Label>
                                            <Select
                                                value={widget.settings.animation}
                                                onValueChange={(v: any) => updateWidgetSettings(widget.id, { animation: v })}
                                            >
                                                <SelectTrigger className="h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    <SelectItem value="float">Float</SelectItem>
                                                    <SelectItem value="shake">Shake</SelectItem>
                                                    <SelectItem value="glow">Glow</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    );
}
