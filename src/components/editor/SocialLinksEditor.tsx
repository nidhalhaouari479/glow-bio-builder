import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { SocialLink } from '@/types/cardBuilder';
import { socialPlatforms } from '@/config/socialPlatforms';
import { cn } from '@/lib/utils';

interface SocialLinksEditorProps {
  links: SocialLink[];
  onUpdate: (id: string, updates: Partial<SocialLink>) => void;
}

export function SocialLinksEditor({ links, onUpdate }: SocialLinksEditorProps) {
  const enabledLinks = links.filter(l => l.enabled);
  const disabledLinks = links.filter(l => !l.enabled);

  return (
    <div className="space-y-6">
      {/* Enabled Links */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Active Links ({enabledLinks.length})</Label>
        </div>
        
        {enabledLinks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No links enabled. Toggle some below!
          </p>
        ) : (
          <div className="space-y-3">
            {enabledLinks.map((link) => {
              const platform = socialPlatforms[link.platform];
              const Icon = platform.icon;
              return (
                <div 
                  key={link.id} 
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                >
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${platform.color}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: platform.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Input
                      value={link.url}
                      onChange={(e) => onUpdate(link.id, { url: e.target.value })}
                      placeholder={platform.placeholder}
                      className="h-9 text-sm"
                    />
                  </div>
                  <Switch
                    checked={link.enabled}
                    onCheckedChange={(enabled) => onUpdate(link.id, { enabled })}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Disabled Links */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Available Platforms</Label>
        <div className="grid grid-cols-4 gap-2">
          {disabledLinks.map((link) => {
            const platform = socialPlatforms[link.platform];
            const Icon = platform.icon;
            return (
              <button
                key={link.id}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-lg border transition-all",
                  "hover:border-primary hover:bg-primary/5",
                  "opacity-60 hover:opacity-100"
                )}
                onClick={() => onUpdate(link.id, { enabled: true })}
              >
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${platform.color}20` }}
                >
                  <Icon className="h-4 w-4" style={{ color: platform.color }} />
                </div>
                <span className="text-xs text-muted-foreground truncate w-full text-center">
                  {platform.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
