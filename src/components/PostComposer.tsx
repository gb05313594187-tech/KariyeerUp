// src/components/PostComposer.tsx
// @ts-nocheck
import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

import PollModal from "@/components/PollModal";
import EventForm from "@/components/EventForm";
import JobForm from "@/components/JobForm";
import ImageUpload from "@/components/ImageUpload";

import { Button } from "@/components/ui/button";
import {
  Image as ImageIcon,
  BarChart2,
  CalendarDays,
  Briefcase,
} from "lucide-react";

export default function PostComposer({ onPosted }) {
  const auth = useAuth();
  const me = auth?.user ?? null;
  const role = auth?.role ?? null;

  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [submitting, setSubmitting] = useState(false);

  // modal state
  const [openPoll, setOpenPoll] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);
  const [openJob, setOpenJob] = useState(false);

  const canJob = useMemo(() => role === "corporate", [role]);

  const createTextPost = async () => {
    if (!me?.id) return toast.error("Giriş gerekli");
    if (!content.trim()) return toast.error("Paylaşım boş olamaz");

    setSubmitting(true);

    const { error } = await supabase.from("posts").insert({
      author_id: me.id, // ✅ RLS için şart
      type: "text",
      content: content.trim(),
      visibility,
    });

    if (error) {
      console.error("POST INSERT ERROR:", error);
      toast.error(`Paylaşım başarısız: ${error.message}`);
    } else {
      toast.success("Paylaşıldı");
      setContent("");
      onPosted?.();
    }

    setSubmitting(false);
  };

  return (
    <div className="border rounded-xl bg-white p-4 space-y-3">
      {/* header */}
      <div className="flex items-start gap-3">
        {/* avatar placeholder (profil foto işini ayrıca aşağıda çözeceğiz) */}
        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1">
          <textarea
            className="w-full min-h-[84px] border rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-200"
            placeholder="Ne paylaşmak istiyorsun?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      {/* action row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* ✅ ikonlar artık tıklanabilir button */}
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-gray-50"
            onClick={() => setOpenImage(true)}
          >
            <ImageIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-gray-50"
            onClick={() => setOpenPoll(true)}
          >
            <BarChart2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-gray-50"
            onClick={() => setOpenEvent(true)}
          >
            <CalendarDays className="h-4 w-4" />
          </button>

          {canJob && (
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-gray-50"
              onClick={() => setOpenJob(true)}
            >
              <Briefcase className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            className="border rounded-xl px-3 py-2 text-sm"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Herkese Açık</option>
            <option value="followers">Takipçiler</option>
            <option value="private">Özel</option>
          </select>

          <Button
            className="rounded-xl"
            onClick={createTextPost}
            disabled={submitting}
          >
            Paylaş
          </Button>
        </div>
      </div>

      {/* ✅ Modals / Forms */}
      {openPoll && (
        <div className="border rounded-xl p-3 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Anket</div>
            <button
              type="button"
              className="text-sm underline"
              onClick={() => setOpenPoll(false)}
            >
              Kapat
            </button>
          </div>
          <PollModal
            onDone={() => {
              setOpenPoll(false);
              onPosted?.();
            }}
          />
        </div>
      )}

      {openImage && (
        <div className="border rounded-xl p-3 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Görsel Yükle</div>
            <button
              type="button"
              className="text-sm underline"
              onClick={() => setOpenImage(false)}
            >
              Kapat
            </button>
          </div>
          <ImageUpload
            onDone={() => {
              setOpenImage(false);
              onPosted?.();
            }}
          />
        </div>
      )}

      {openEvent && (
        <div className="border rounded-xl p-3 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Etkinlik</div>
            <button
              type="button"
              className="text-sm underline"
              onClick={() => setOpenEvent(false)}
            >
              Kapat
            </button>
          </div>
          <EventForm
            onDone={() => {
              setOpenEvent(false);
              onPosted?.();
            }}
          />
        </div>
      )}

      {openJob && (
        <div className="border rounded-xl p-3 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">İlan</div>
            <button
              type="button"
              className="text-sm underline"
              onClick={() => setOpenJob(false)}
            >
              Kapat
            </button>
          </div>
          <JobForm
            onDone={() => {
              setOpenJob(false);
              onPosted?.();
            }}
          />
        </div>
      )}
    </div>
  );
}
