// src/components/JobDetail.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JobDetail({ postId }) {
  const [job, setJob] = useState(null);

  useEffect(() => {
    supabase.from("jobs").select("*").eq("post_id", postId).single().then(({ data }) => {
      setJob(data);
    });
  }, []);

  if (!job) return null;
  return <div>💼 {job.position} – {job.location_text}</div>;
}
