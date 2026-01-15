
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export async function uploadMedia(file: File, bucket: string = 'avatars'): Promise<string | null> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading media:', error);
        return null;
    }
}

export const uploadImage = uploadMedia; // Alias for backward compatibility
