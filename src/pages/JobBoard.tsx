// src/pages/JobBoard.tsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    supabase
      .from("jobs")
      .select("*, posts(*)")
      .then(({ data }) => setJobs(data || []));
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      {jobs.map((j) => (
        <div key={j.post_id} className="border p-3">
          {j.position} – {j.location_text}
        </div>
      ))}
    </div>
  );
}
