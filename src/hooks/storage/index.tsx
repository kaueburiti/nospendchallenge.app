import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';

interface ImageData {
  uri: string;
  base64: string;
  fileExtension: string;
}

export type UploadImageBuckets = 'challenges' | 'profiles';
type uploadProps = {
  bucket: UploadImageBuckets;
  name: string;
  path: string;
  image: ImageData;
};

const useUploadImage = () => {
  const upload = async ({ bucket, name, path, image }: uploadProps) => {
    try {
      const filePath = `${path}/${name}.${image.fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, decode(image.base64), {
          contentType: `image/${image.fileExtension}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  return { upload };
};

export default useUploadImage;
