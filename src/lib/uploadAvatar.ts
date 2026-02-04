import { supabase } from "@/lib/supabase";

export async function uploadAvatar(file: File, userId: string) {
  const filePath = `${userId}/avatar.jpg`;

  // upload (overwrite)
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  // public url
  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
