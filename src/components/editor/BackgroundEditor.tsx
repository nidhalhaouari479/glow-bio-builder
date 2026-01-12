import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { BackgroundConfig, BackgroundType, ParticlePreset } from '@/types/cardBuilder';
import { gradientPresets, solidColorPresets, videoPresets } from '@/config/socialPlatforms';
import { Palette, Sparkles, Video, Circle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackgroundEditorProps {
  config: BackgroundConfig;
  onUpdate: (updates: Partial<BackgroundConfig>) => void;
}

const particlePresets: { value: ParticlePreset; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'snow', label: 'Snow' },
  { value: 'bubbles', label: 'Bubbles' },
  { value: 'stars', label: 'Stars' },
  { value: 'confetti', label: 'Confetti' },
];

export function BackgroundEditor({ config, onUpdate }: BackgroundEditorProps) {
  return (
    <div className="space-y-4">
      <Tabs 
        value={config.type} 
        onValueChange={(v) => onUpdate({ type: v as BackgroundType })}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          <TabsTrigger value="solid" className="flex flex-col gap-1 py-2 px-2">
            <Circle className="h-4 w-4" />
            <span className="text-xs">Solid</span>
          </TabsTrigger>
          <TabsTrigger value="gradient" className="flex flex-col gap-1 py-2 px-2">
            <Palette className="h-4 w-4" />
            <span className="text-xs">Gradient</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex flex-col gap-1 py-2 px-2">
            <Video className="h-4 w-4" />
            <span className="text-xs">Video</span>
          </TabsTrigger>
          <TabsTrigger value="particles" className="flex flex-col gap-1 py-2 px-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs">Particles</span>
          </TabsTrigger>
        </TabsList>

        {/* Solid Color */}
        <TabsContent value="solid" className="space-y-4 pt-4">
          <div className="space-y-3">
            <Label>Choose Color</Label>
            <div className="grid grid-cols-8 gap-2">
              {solidColorPresets.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "h-8 w-8 rounded-lg border-2 transition-all hover:scale-110",
                    config.solidColor === color 
                      ? "border-primary ring-2 ring-primary ring-offset-2" 
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => onUpdate({ solidColor: color })}
                />
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <Label htmlFor="custom-color" className="text-sm whitespace-nowrap">Custom:</Label>
              <Input
                id="custom-color"
                type="color"
                value={config.solidColor}
                onChange={(e) => onUpdate({ solidColor: e.target.value })}
                className="w-12 h-8 p-1 cursor-pointer"
              />
              <Input
                value={config.solidColor}
                onChange={(e) => onUpdate({ solidColor: e.target.value })}
                placeholder="#6366f1"
                className="flex-1"
              />
            </div>
          </div>
        </TabsContent>

        {/* Gradient */}
        <TabsContent value="gradient" className="space-y-4 pt-4">
          <div className="space-y-3">
            <Label>Preset Gradients</Label>
            <div className="grid grid-cols-4 gap-2">
              {gradientPresets.map((preset) => {
                const isSelected = JSON.stringify(config.gradient.colors) === JSON.stringify(preset.colors);
                return (
                  <button
                    key={preset.name}
                    className={cn(
                      "h-12 rounded-lg border-2 transition-all hover:scale-105 relative overflow-hidden",
                      isSelected 
                        ? "border-primary ring-2 ring-primary ring-offset-2" 
                        : "border-transparent"
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${preset.colors.join(', ')})`,
                    }}
                    onClick={() => onUpdate({ 
                      gradient: { ...config.gradient, colors: preset.colors } 
                    })}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Direction: {config.gradient.direction}°</Label>
            <Slider
              value={[config.gradient.direction]}
              onValueChange={([v]) => onUpdate({ 
                gradient: { ...config.gradient, direction: v } 
              })}
              min={0}
              max={360}
              step={15}
              className="w-full"
            />
          </div>
        </TabsContent>

        {/* Video */}
        <TabsContent value="video" className="space-y-4 pt-4">
          <div className="space-y-3">
            <Label>Video Presets</Label>
            <div className="space-y-2">
              {videoPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant={config.videoUrl === preset.url ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => onUpdate({ videoUrl: preset.url })}
                >
                  <Video className="h-4 w-4 mr-2" />
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-url">Or paste video URL</Label>
            <Input
              id="video-url"
              value={config.videoUrl}
              onChange={(e) => onUpdate({ videoUrl: e.target.value })}
              placeholder="https://example.com/video.mp4"
            />
          </div>
        </TabsContent>

        {/* Particles */}
        <TabsContent value="particles" className="space-y-4 pt-4">
          <div className="space-y-3">
            <Label>Particle Style</Label>
            <div className="grid grid-cols-2 gap-2">
              {particlePresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={config.particlePreset === preset.value ? "default" : "outline"}
                  className="w-full"
                  onClick={() => onUpdate({ particlePreset: preset.value })}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Base Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={config.solidColor}
                onChange={(e) => onUpdate({ solidColor: e.target.value })}
                className="w-12 h-8 p-1 cursor-pointer"
              />
              <Input
                value={config.solidColor}
                onChange={(e) => onUpdate({ solidColor: e.target.value })}
                placeholder="#6366f1"
                className="flex-1"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
