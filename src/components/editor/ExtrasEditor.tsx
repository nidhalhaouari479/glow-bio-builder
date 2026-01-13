import React, { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Story, Achievement, Badge } from '@/types/cardBuilder';
import { Plus, Trash2, ImageIcon, Trophy, Award, X, Upload, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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

const badgeColors = [
  '#6366f1', '#a855f7', '#ec4899', '#f43f5e',
  '#f97316', '#22c55e', '#06b6d4', '#3b82f6',
];

const statIcons = [
  '👥', '❤️', '⭐', '🏆', '🎯', '📈', '💼', '🔥',
  '✨', '🎨', '💡', '🚀', '📱', '💻', '🎬', '📸',
];

export function ExtrasEditor({
  stories,
  achievements,
  badges,
  onAddStory,
  onRemoveStory,
  onUpdateStory,
  onAddAchievement,
  onRemoveAchievement,
  onUpdateAchievement,
  onAddBadge,
  onRemoveBadge,
}: ExtrasEditorProps) {
  const [newBadgeText, setNewBadgeText] = useState('');
  const [newBadgeColor, setNewBadgeColor] = useState(badgeColors[0]);
  const storyInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleAddStory = () => {
    onAddStory({
      id: Date.now().toString(),
      title: 'New Story',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
      content: '',
    });
  };

  const handleStoryImageUpload = (storyId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateStory(storyId, { image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAchievement = () => {
    onAddAchievement({
      id: Date.now().toString(),
      label: 'New Stat',
      value: 100,
      suffix: '+',
      icon: '⭐',
    });
  };

  const handleAddBadge = () => {
    if (newBadgeText.trim()) {
      onAddBadge({
        id: Date.now().toString(),
        text: newBadgeText,
        color: newBadgeColor,
      });
      setNewBadgeText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Stories
          </Label>
          <Button size="sm" variant="outline" onClick={handleAddStory}>
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="space-y-3">
          {stories.map((story) => (
            <div key={story.id} className="p-3 rounded-lg border bg-card space-y-3">
              <div className="flex items-start gap-3">
                {/* Story Image with Upload */}
                <div className="relative group">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="h-14 w-14 rounded-full object-cover border-2 border-border"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { storyInputRefs.current[story.id] = el; }}
                    onChange={(e) => handleStoryImageUpload(story.id, e)}
                    className="hidden"
                  />
                  <button
                    onClick={() => storyInputRefs.current[story.id]?.click()}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Upload className="h-4 w-4 text-white" />
                  </button>
                </div>
                
                <div className="flex-1 space-y-2">
                  <Input
                    value={story.title}
                    onChange={(e) => onUpdateStory(story.id, { title: e.target.value })}
                    className="h-8 text-sm"
                    placeholder="Story title"
                  />
                  <Textarea
                    value={story.content || ''}
                    onChange={(e) => onUpdateStory(story.id, { content: e.target.value })}
                    className="text-sm resize-none h-16"
                    placeholder="Story description (optional)"
                  />
                </div>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                  onClick={() => onRemoveStory(story.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Image URL input */}
              <div className="flex gap-2">
                <Input
                  value={story.image}
                  onChange={(e) => onUpdateStory(story.id, { image: e.target.value })}
                  className="h-8 text-xs"
                  placeholder="Or paste image URL..."
                />
              </div>
            </div>
          ))}
        </div>
        
        {stories.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            Add stories to showcase your highlights
          </p>
        )}
      </div>

      {/* Achievements */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Stats & Achievements
          </Label>
          <Button size="sm" variant="outline" onClick={handleAddAchievement}>
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="space-y-2">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-2 p-2 rounded-lg border bg-card">
              {/* Icon Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="h-9 w-9 rounded-lg border bg-background flex items-center justify-center text-lg hover:bg-muted transition-colors">
                    {achievement.icon || <Smile className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <div className="grid grid-cols-4 gap-1">
                    {statIcons.map((icon) => (
                      <button
                        key={icon}
                        className={cn(
                          "h-8 w-8 rounded flex items-center justify-center text-lg hover:bg-muted transition-colors",
                          achievement.icon === icon && "bg-primary/20"
                        )}
                        onClick={() => onUpdateAchievement(achievement.id, { icon })}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Input
                value={achievement.label}
                onChange={(e) => onUpdateAchievement(achievement.id, { label: e.target.value })}
                className="flex-1 h-8 text-sm"
                placeholder="Label"
              />
              <Input
                type="number"
                value={achievement.value}
                onChange={(e) => onUpdateAchievement(achievement.id, { value: parseInt(e.target.value) || 0 })}
                className="w-20 h-8 text-sm"
                placeholder="Value"
              />
              <Input
                value={achievement.suffix || ''}
                onChange={(e) => onUpdateAchievement(achievement.id, { suffix: e.target.value })}
                className="w-12 h-8 text-sm"
                placeholder="+"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onRemoveAchievement(achievement.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        {achievements.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            Add stats to show your achievements
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Award className="h-4 w-4" />
            Badges & Tags
          </Label>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm"
              style={{ backgroundColor: badge.color }}
            >
              {badge.text}
              <button 
                onClick={() => onRemoveBadge(badge.id)}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={newBadgeText}
            onChange={(e) => setNewBadgeText(e.target.value)}
            placeholder="Badge text..."
            className="flex-1 h-9"
            onKeyDown={(e) => e.key === 'Enter' && handleAddBadge()}
          />
          <div className="flex gap-1">
            {badgeColors.slice(0, 4).map((color) => (
              <button
                key={color}
                className={cn(
                  "h-9 w-6 rounded transition-all",
                  newBadgeColor === color && "ring-2 ring-offset-1"
                )}
                style={{ backgroundColor: color }}
                onClick={() => setNewBadgeColor(color)}
              />
            ))}
          </div>
          <Button size="sm" onClick={handleAddBadge} disabled={!newBadgeText.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
