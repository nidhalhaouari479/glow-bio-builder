import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardData, ThemeMode, IconAnimation, IconStyle } from '@/types/cardBuilder';
import { fontFamilies } from '@/config/socialPlatforms';
import { Sun, Moon, Monitor, Sparkles, Zap, MousePointer, Hand, Circle, Square, RectangleHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeEditorProps {
  themeMode: ThemeMode;
  iconAnimation: IconAnimation;
  iconStyle: IconStyle;
  fontFamily: string;
  accentColor: string;
  onUpdate: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
}

const themeModes: { value: ThemeMode; label: string; icon: React.ElementType }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'auto', label: 'Auto', icon: Monitor },
];

const iconAnimations: { value: IconAnimation; label: string; icon: React.ElementType }[] = [
  { value: 'none', label: 'None', icon: MousePointer },
  { value: 'pulse', label: 'Pulse', icon: Sparkles },
  { value: 'glow', label: 'Glow', icon: Zap },
  { value: 'lift', label: 'Lift', icon: Hand },
];

const iconStyles: { value: IconStyle; label: string; icon: React.ElementType }[] = [
  { value: 'rounded', label: 'Rounded', icon: Circle },
  { value: 'square', label: 'Square', icon: Square },
  { value: 'pill', label: 'Pill', icon: RectangleHorizontal },
];

const accentColors = [
  '#6366f1', '#a855f7', '#ec4899', '#f43f5e',
  '#f97316', '#22c55e', '#06b6d4', '#3b82f6',
];

export function ThemeEditor({ 
  themeMode, 
  iconAnimation, 
  iconStyle, 
  fontFamily,
  accentColor,
  onUpdate 
}: ThemeEditorProps) {
  return (
    <div className="space-y-6">
      {/* Theme Mode */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Theme Mode</Label>
        <div className="grid grid-cols-3 gap-2">
          {themeModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Button
                key={mode.value}
                variant={themeMode === mode.value ? "default" : "outline"}
                className="flex flex-col gap-1 h-auto py-3"
                onClick={() => onUpdate('themeMode', mode.value)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{mode.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Accent Color</Label>
        <div className="flex flex-wrap gap-2">
          {accentColors.map((color) => (
            <button
              key={color}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-all hover:scale-110",
                accentColor === color 
                  ? "border-foreground ring-2 ring-offset-2 ring-offset-background" 
                  : "border-transparent"
              )}
              style={{ backgroundColor: color, boxShadow: accentColor === color ? `0 0 12px ${color}` : 'none' }}
              onClick={() => onUpdate('accentColor', color)}
            />
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Font Family</Label>
        <Select value={fontFamily} onValueChange={(v) => onUpdate('fontFamily', v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                <span style={{ fontFamily: font.value }}>{font.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Icon Animation */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Icon Hover Effect</Label>
        <div className="grid grid-cols-4 gap-2">
          {iconAnimations.map((anim) => {
            const Icon = anim.icon;
            return (
              <Button
                key={anim.value}
                variant={iconAnimation === anim.value ? "default" : "outline"}
                size="sm"
                className="flex flex-col gap-1 h-auto py-2"
                onClick={() => onUpdate('iconAnimation', anim.value)}
              >
                <Icon className="h-3 w-3" />
                <span className="text-xs">{anim.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Icon Style */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Icon Shape</Label>
        <div className="grid grid-cols-3 gap-2">
          {iconStyles.map((style) => {
            const Icon = style.icon;
            return (
              <Button
                key={style.value}
                variant={iconStyle === style.value ? "default" : "outline"}
                size="sm"
                className="flex flex-col gap-1 h-auto py-2"
                onClick={() => onUpdate('iconStyle', style.value)}
              >
                <Icon className="h-3 w-3" />
                <span className="text-xs">{style.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
