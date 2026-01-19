import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, User, Trash2 } from 'lucide-react';
import { CardData } from '@/types/cardBuilder';

import { ImageCropper } from './ImageCropper';
import { toast } from 'sonner';

interface ProfileEditorProps {
  data: Pick<CardData, 'name' | 'title' | 'bio' | 'profileImage' | 'coverImage'>;
  onUpdate: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
  onImageUpload: (image: string | null) => void;
}

export function ProfileEditor({ data, onUpdate, onImageUpload }: ProfileEditorProps) {
  const [uploading, setUploading] = React.useState(false);
  const [cropperState, setCropperState] = React.useState<{
    image: string;
    aspect: number;
    type: 'profile' | 'cover';
  } | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCropperState({
          image: event.target?.result as string,
          aspect: type === 'cover' ? 3 / 1 : 1 / 1,
          type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    const type = cropperState?.type;
    setCropperState(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (type === 'profile') {
        onImageUpload(url);
      } else {
        onUpdate('coverImage', url);
      }
    };
    reader.readAsDataURL(croppedBlob);

    // Upload to Supabase
    setUploading(true);
    try {
      const file = new File([croppedBlob], `${type}-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const { uploadImage } = await import('@/lib/storage');
      const publicUrl = await uploadImage(file);

      if (publicUrl) {
        if (type === 'profile') {
          onImageUpload(publicUrl);
        } else {
          onUpdate('coverImage', publicUrl);
        }
        toast.success(`${type === 'cover' ? 'Cover' : 'Profile'} photo updated!`);
      }
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onImageUpload(null);
  };

  return (
    <div className="space-y-6">
      {cropperState && (
        <ImageCropper
          open={!!cropperState}
          image={cropperState.image}
          aspect={cropperState.aspect}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropperState(null)}
        />
      )}

      {/* Cover Photo */}
      <div className="space-y-3">
        <Label>Cover Photo (3:1 Recommended)</Label>
        <div className="relative group rounded-xl overflow-hidden aspect-[3/1] bg-muted border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors">
          {data.coverImage ? (
            <img src={data.coverImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <Camera className="h-8 w-8 mb-2 opacity-50" />
              <span className="text-xs">Upload Cover Photo</span>
            </div>
          )}

          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium text-sm">
            {uploading && cropperState?.type === 'cover' ? 'Uploading...' : 'Change Cover'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageSelect(e, 'cover')}
              disabled={uploading}
            />
          </label>

          {data.coverImage && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                onUpdate('coverImage', null);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

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
            onChange={(e) => handleImageSelect(e, 'profile')}
            className="hidden"
            disabled={uploading}
          />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium">Profile Photo</p>
          <p className="text-xs text-muted-foreground">
            {uploading && cropperState?.type === 'profile' ? 'Uploading...' : 'Click to upload or drag and drop'}
          </p>
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
