// src/lib/meeting-api.ts
import { supabase } from "./supabase";

// Cloudflare Pages Functions — fonksiyonlar functions/ kök dizininde
// functions/approve-session.ts → /approve-session
// functions/schedule-interview.ts → /schedule-interview
// functions/send-email.ts → /send-email
const API_BASE = "";

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token || ""}`,
  };
}

// ─── COACH SEANS ONAYLA / REDDET ───
export async function approveSession(
  sessionRequestId: string,
  action: "approve" | "reject" = "approve"
) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/approve-session`, {
    method: "POST",
    headers,
    body: JSON.stringify({ sessionRequestId, action }),
  });
  return res.json();
}

// ─── MÜLAKAT PLANLA ───
export async function scheduleInterview(data: {
  jobApplicationId: string;
  scheduledAt: string;
  durationMinutes?: number;
  interviewerName?: string;
  interviewerEmail?: string;
  notes?: string;
  language?: string;
}) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/schedule-interview`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

// ─── İŞE ALIM KARARI ───
export async function makeHireDecision(data: {
  interviewId: string;
  decision: "hired" | "rejected" | "on_hold";
  salaryOffered?: number;
  startDate?: string;
  notes?: string;
  adminNotes?: string;
  notifyCandidate?: boolean;
}) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/hire-decision`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

// ─── GENEL EMAIL GÖNDER ───
export async function sendEmail(data: {
  to: string;
  toName?: string;
  subject: string;
  templateType: string;
  data: Record<string, any>;
}) {
  const res = await fetch(`${API_BASE}/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ─── TOPLANTI BİLGİSİ AL ───
export async function getMeetingRoom(roomName: string) {
  const { data, error } = await supabase
    .from("meeting_rooms")
    .select("*")
    .eq("room_name", roomName)
    .single();
  return { data, error };
}

// ─── YAKLAŞAN TOPLANTILAR ───
export async function getUpcomingMeetings(userId: string) {
  const { data, error } = await supabase
    .from("meeting_rooms")
    .select("*")
    .or(`host_user_id.eq.${userId},participant_user_id.eq.${userId}`)
    .in("status", ["created", "active"])
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true });
  return { data, error };
}

// ─── ŞİRKET MÜLAKATLARİ ───
export async function getCompanyInterviews(companyUserId: string) {
  const { data, error } = await supabase
    .from("interviews")
    .select(`
      *,
      candidate:profiles!candidate_id(full_name, email, avatar_url),
      job:jobs!job_id(position, location_text)
    `)
    .eq("company_user_id", companyUserId)
    .order("scheduled_at", { ascending: false });
  return { data, error };
}

// ─── İŞE ALIM KARARLARI ───
export async function getHireDecisions() {
  const { data, error } = await supabase
    .from("admin_hire_dashboard")
    .select("*")
    .order("decision_date", { ascending: false });
  return { data, error };
}

// ─── EMAIL LOGLARI ───
export async function getEmailLogs(limit = 50) {
  const { data, error } = await supabase
    .from("email_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return { data, error };
}

// ─── TÜM TOPLANTILAR (Admin) ───
export async function getAllMeetings() {
  const { data, error } = await supabase
    .from("admin_all_meetings")
    .select("*");
  return { data, error };
}
