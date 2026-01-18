// src/components/ImageUpload.tsx
// @ts-nocheck
import { supabase } from "@/lib/supabase";

export default function ImageUpload() {
  const upload = async (e) => {
    const file = e.target.files[0];
    const path = `${Date.now()}-${file.name}`;
    await supabase.storage.from("post-images").upload(path, file);
  };

  return <input type="file" onChange={upload} />;
}
