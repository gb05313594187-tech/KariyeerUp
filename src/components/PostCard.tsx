// src/components/PostCard.tsx
// @ts-nocheck
import ReactionBar from "@/components/ReactionBar";
import PollView from "@/components/PollView";
import EventView from "@/components/EventView";
import JobDetail from "@/components/JobDetail";

export default function PostCard({ post }) {
  const name =
    post?.profiles?.full_name ||
    post?.profiles?.fullName ||
    post?.profiles?.email?.split("@")?.[0] ||
    "Kullanıcı";

  const avatar =
    post?.profiles?.avatar_url ||
    post?.profiles?.avatarUrl ||
    null;

  return (
    <div className="border rounded-xl bg-white p-4 space-y-3">
      <div className="flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              // fallback
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
        )}

        <div className="min-w-0">
          <div className="font-semibold truncate">{name}</div>
          <div className="text-xs text-gray-500">
            {post?.created_at ? new Date(post.created_at).toLocaleString() : ""}
          </div>
        </div>
      </div>

      {post?.content && <div className="whitespace-pre-wrap">{post.content}</div>}

      {post?.type === "poll" && <PollView postId={post.id} />}
      {post?.type === "event" && <EventView postId={post.id} />}
      {post?.type === "job" && <JobDetail postId={post.id} />}

      <ReactionBar postId={post.id} />
    </div>
  );
}
