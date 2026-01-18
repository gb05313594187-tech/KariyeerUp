// src/components/PostCard.tsx
// @ts-nocheck
import ReactionBar from "./ReactionBar";
import PollView from "./PollView";
import EventView from "./EventView";
import JobDetail from "./JobDetail";

export default function PostCard({ post }) {
  return (
    <div className="border rounded p-4 space-y-3">
      <div className="font-bold">{post.profiles?.full_name}</div>
      <div>{post.content}</div>

      {post.type === "poll" && <PollView postId={post.id} />}
      {post.type === "event" && <EventView postId={post.id} />}
      {post.type === "job" && <JobDetail postId={post.id} />}

      <ReactionBar postId={post.id} />
    </div>
  );
}
