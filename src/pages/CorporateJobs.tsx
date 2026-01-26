// src/pages/CorporateJobs.tsx
// @ts-nocheck

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Briefcase,
  Users,
  Sparkles,
  Brain,
  Calendar,
  Video,
  Send,
} from "lucide-react";

/* ================= TYPES ================= */
type Job = {
  post_id: string;
  position: string;
  level: string;
  work_type: string;
  location_text: string;
  description: string;
};

type Match = {
  candidate_id: string;
  score: number;
  full_name: string;
  email: string;
};

/* ================= PAGE ================= */
export default function CorporateJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD JOBS ================= */
  useEffect(() => {
    supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast.error("İlanlar yüklenemedi");
          return;
        }
        setJobs(data || []);
      });
  }, []);

  /* ================= RUN AI MATCH ================= */
  const runMatch = async (job: Job) => {
    setSelectedJob(job);
    setLoading(true);
    setMatches([]);

    try {
      const { data, error } = await supabase.rpc("run_ai_job_match", {
        p_job_id: job.post_id,
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.info("Uygun aday bulunamadı");
        return;
      }

      // enrich user info
      const userIds = data.map((d: any) => d.candidate_id);

      const { data: users } = await supabase
        .from("users")
        .select("id, full_name, email")
        .in("id", userIds);

      const enriched = data.map((m: any) => {
        const u = users?.find((x: any) => x.id === m.candidate_id);
        return {
          candidate_id: m.candidate_id,
          score: m.score,
          full_name: u?.full_name || "Aday",
          email: u?.email || "",
        };
      });

      setMatches(enriched);
    } catch (e) {
      toast.error("AI eşleşme başarısız");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEND INVITE ================= */
  const sendInvite = async (m: Match) => {
    if (!selectedJob) return;

    try {
      await fetch("/api/interview/invite", {
        method: "POST",
        body: JSON.stringify({
          candidateId: m.candidate_id,
          email: m.email,
          jobTitle: selectedJob.position,
          language: "tr", // backend otomatik dil seçebilir
        }),
      });

      toast.success("Davet gönderildi ✔");
    } catch {
      toast.error("Davet gönderilemedi");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-10 space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Sparkles className="text-red-600 h-8 w-8" />
            Unicorn Hiring Suite
          </h1>
          <p className="text-gray-600 mt-2">
            AI destekli işe alım • Kişilik envanteri • Online görüşme
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* JOB LIST */}
        <Card className="col-span-4 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              İş İlanları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.post_id}
                onClick={() => runMatch(job)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  selectedJob?.post_id === job.post_id
                    ? "bg-red-50 border-red-600"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <div className="font-semibold">{job.position}</div>
                <div className="text-xs text-gray-500">
                  {job.level} • {job.work_type} • {job.location_text}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* MATCHES */}
        <Card className="col-span-8 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              AI ile Eşleşen Adaylar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-gray-500">
                AI analiz yapıyor…
              </div>
            ) : matches.length === 0 ? (
              <div className="text-gray-500">
                Henüz eşleşme yok
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((m) => (
                  <div
                    key={m.candidate_id}
                    className="p-5 rounded-xl border bg-white flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-lg">
                        {m.full_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {m.email}
                      </div>
                      <div className="mt-2 text-green-600 text-sm">
                        AI Match: %{Math.round(m.score * 100)}
                      </div>

                      <div className="flex gap-3 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Brain className="h-4 w-4" />
                          Kişilik Envanteri
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Takvim
                        </span>
                        <span className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          Jitsi
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => sendInvite(m)}
                      className="rounded-xl"
                    >
                      Davet Gönder
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
