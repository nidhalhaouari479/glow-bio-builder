import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Image as ImageIcon, Video, Star, Award, Trophy } from 'lucide-react';
import { Story, Achievement, Badge } from '@/types/cardBuilder';
import { toast } from 'sonner';

interface ExtrasEditorProps {
    stories: Story[];
    achievements: Achievement[];
    badges: Badge[];
    onAddStory: (story: Story) => void;
    onRemoveStory: (id: string) => void;
    onUpdateStory: (id: string, updates: Partial<Story>) => void;
    onAddAchievement: (achievement: Achievement) => void;
    onRemoveAchievement: (id: string) => void;
    onUpdateAchievement: (id: string, updates: Partial<Achievement>) => void;
    onAddBadge: (badge: Badge) => void;
    onRemoveBadge: (id: string) => void;
    onUpdateBadge: (id: string, updates: Partial<Badge>) => void;
}

export function ExtrasEditor({
    stories = [],
    achievements = [],
    badges = [],
    onAddStory,
    onRemoveStory,
    onUpdateStory,
    onAddAchievement,
    onRemoveAchievement,
    onUpdateAchievement,
    onAddBadge,
    onRemoveBadge,
    onUpdateBadge,
}: ExtrasEditorProps) {
    const handleAddStory = () => {
        const newStory: Story = {
            id: Math.random().toString(36).substr(2, 9),
            title: 'New Story',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
            mediaType: 'image',
        };
        onAddStory(newStory);
    };

    const handleAddAchievement = () => {
        const newAchievement: Achievement = {
            id: Math.random().toString(36).substr(2, 9),
            label: 'New Stat',
            value: 0,
            icon: '📊',
        };
        onAddAchievement(newAchievement);
    };

    const handleAddBadge = () => {
        const newBadge: Badge = {
            id: Math.random().toString(36).substr(2, 9),
            text: 'New Badge',
            color: '#6366f1',
        };
        onAddBadge(newBadge);
    };

    return (
        <div className="space-y-8">
            {/* Stories Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-primary" />
                        <Label className="text-base font-semibold">Stories</Label>
                    </div>
                    <Button onClick={handleAddStory} size="sm" variant="outline" className="h-8 gap-1">
                        <Plus className="h-3 w-3" /> Add
                    </Button>
                </div>
                <div className="grid gap-3">
                    {stories.map((story) => (
                        <div key={story.id} className="p-4 rounded-xl border bg-card/50 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                    <img src={story.image} alt="" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Input
                                        value={story.title}
                                        onChange={(e) => onUpdateStory(story.id, { title: e.target.value })}
                                        className="h-8 text-sm font-medium"
                                        placeholder="Story Title"
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => onRemoveStory(story.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    value={story.image}
                                    onChange={(e) => onUpdateStory(story.id, { image: e.target.value })}
                                    className="h-8 text-xs"
                                    placeholder="Image URL"
                                />
                                <Input
                                    value={story.video || ''}
                                    onChange={(e) => onUpdateStory(story.id, { video: e.target.value })}
                                    className="h-8 text-xs"
                                    placeholder="Video URL (Optional)"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant={story.mediaType === 'image' ? 'default' : 'outline'}
                                    className="h-7 text-[10px] flex-1"
                                    onClick={() => onUpdateStory(story.id, { mediaType: 'image' })}
                                >
                                    Image
                                </Button>
                                <Button
                                    size="sm"
                                    variant={story.mediaType === 'video' ? 'default' : 'outline'}
                                    className="h-7 text-[10px] flex-1"
                                    onClick={() => onUpdateStory(story.id, { mediaType: 'video' })}
                                >
                                    Video
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achievements Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        <Label className="text-base font-semibold">Stats & Achievements</Label>
                    </div>
                    <Button onClick={handleAddAchievement} size="sm" variant="outline" className="h-8 gap-1">
                        <Plus className="h-3 w-3" /> Add
                    </Button>
                </div>
                <div className="grid gap-3">
                    {achievements.map((ach) => (
                        <div key={ach.id} className="p-4 rounded-xl border bg-card/50 grid grid-cols-[1fr,auto] gap-3">
                            <div className="space-y-3">
                                <div className="grid grid-cols-[3rem,1fr] gap-2">
                                    <Input
                                        value={ach.icon}
                                        onChange={(e) => onUpdateAchievement(ach.id, { icon: e.target.value })}
                                        className="h-8 text-center px-0"
                                        placeholder="Icon"
                                    />
                                    <Input
                                        value={ach.label}
                                        onChange={(e) => onUpdateAchievement(ach.id, { label: e.target.value })}
                                        className="h-8 font-medium"
                                        placeholder="Label (e.g. Followers)"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="number"
                                        value={ach.value}
                                        onChange={(e) => onUpdateAchievement(ach.id, { value: parseInt(e.target.value) || 0 })}
                                        className="h-8"
                                        placeholder="Value"
                                    />
                                    <Input
                                        value={ach.suffix || ''}
                                        onChange={(e) => onUpdateAchievement(ach.id, { suffix: e.target.value })}
                                        className="h-8"
                                        placeholder="Suffix (e.g. +)"
                                    />
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive mt-1"
                                onClick={() => onRemoveAchievement(ach.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Badges Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <Label className="text-base font-semibold">Badges & Tags</Label>
                    </div>
                    <Button onClick={handleAddBadge} size="sm" variant="outline" className="h-8 gap-1">
                        <Plus className="h-3 w-3" /> Add
                    </Button>
                </div>
                <div className="grid gap-3">
                    {badges.map((badge) => (
                        <div key={badge.id} className="p-4 rounded-xl border bg-card/50 flex gap-3 items-center text-center">
                            <Input
                                type="color"
                                value={badge.color}
                                onChange={(e) => onUpdateBadge(badge.id, { color: e.target.value })}
                                className="h-8 w-12 p-1"
                            />
                            <Input
                                value={badge.text}
                                onChange={(e) => onUpdateBadge(badge.id, { text: e.target.value })}
                                className="h-8 flex-1 font-medium"
                                placeholder="Badge text"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => onRemoveBadge(badge.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
