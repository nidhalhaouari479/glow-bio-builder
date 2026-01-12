import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, User, Trash2 } from 'lucide-react';
import { CardData } from '@/types/cardBuilder';

interface ProfileEditorProps {
  data: Pick<CardData, 'name' | 'title' | 'bio' | 'profileImage'>;
  onUpdate: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
  onImageUpload: (image: string | null) => void;
}

export function ProfileEditor({ data, onUpdate, onImageUpload }: ProfileEditorProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onImageUpload(null);
  };

  return (
    <div className="space-y-5">
      {/* Profile Image */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={data.profileImage || undefined} alt={data.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <label 
            htmlFor="profile-upload" 
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="h-6 w-6 text-white" />
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium">Profile Photo</p>
          <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
          {data.profileImage && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive"
              onClick={removeImage}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          placeholder="Your name"
          className="bg-background"
        />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title / Profession</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          placeholder="e.g., Digital Creator, Designer"
          className="bg-background"
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => onUpdate('bio', e.target.value)}
          placeholder="Tell people about yourself..."
          className="bg-background resize-none min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground">
          {data.bio.length}/300 characters
        </p>
      </div>
    </div>
  );
}
