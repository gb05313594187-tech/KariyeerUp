// src/components/PostComposer.tsx
// @ts-nocheck
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import PollModal from "./PollModal";
import EventForm from "./EventForm";
import JobForm from "./JobForm";
import ImageUpload from "./ImageUpload";

export default function PostComposer({ onPosted }) {
  const [text, setText] = useState("");
  const [type, setType] = useState("text");

  const submit = async () => {
    const { error } = await supabase.from("posts").insert({
      type,
      content: text,
      visibility: "public",
    });
    if (!error) {
      setText("");
      onPosted();
    }
  };

  return (
    <div className="border rounded p-4 space-y-3">
      <textarea
        className="w-full border p-2"
        placeholder="Ne paylaşmak istiyorsun?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex gap-2">
        <button onClick={() => setType("poll")}>Anket</button>
        <button onClick={() => setType("image")}>Görsel</button>
        <button onClick={() => setType("event")}>Etkinlik</button>
        <button onClick={() => setType("job")}>İlan</button>
        <button onClick={submit}>Paylaş</button>
      </div>

      {type === "poll" && <PollModal />}
      {type === "image" && <ImageUpload />}
      {type === "event" && <EventForm />}
      {type === "job" && <JobForm />}
    </div>
  );
}
