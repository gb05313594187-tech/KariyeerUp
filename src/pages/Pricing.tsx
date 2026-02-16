// src/pages/Pricing.tsx
import { Button } from "@/components/ui/button";
import {
  Crown,
  Building2,
  User,
  CheckCircle2,
  Sparkles,
  BadgeCheck,
  Headphones,
  TicketPercent,
  Newspaper,
  Users2,
  Video,
  Briefcase,
  ShieldCheck,
  Star,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation, type Language } from "@/lib/i18n";

function countTrue(...vals: boolean[]) {
  return vals.filter(Boolean).length;
}

export default function Pricing() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { language } = useLanguage();

  const t = (key: string): string =>
    getTranslation((language || "en") as Language, key);

  const authLoading = auth.loading;
  const role = auth?.role || null;
  const isLoggedIn = !!auth?.isAuthenticated;

  const individualFeatures = [
    t("pricing_individual_feat1"),
    t("pricing_individual_feat2"),
    t("pricing_individual_feat3"),
    t("pricing_individual_feat4"),
    t("pricing_individual_feat5"),
    t("pricing_individual_feat6"),
  ];

  const corporateFeatures = [
    t("pricing_corporate_feat1"),
    t("pricing_corporate_feat2"),
    t("pricing_corporate_feat3"),
    t("pricing_corporate_feat4"),
    t("pricing_corporate_feat5"),
    t("pricing_corporate_feat6"),
    t("pricing_corporate_feat7"),
    t("pricing_corporate_feat8"),
  ];

  const coachFeatures = [
    t("pricing_coach_feat1"),
    t("pricing_coach_feat2"),
    t("pricing_coach_feat3"),
    t("pricing_coach_feat4"),
    t("pricing_coach_feat5"),
    t("pricing_coach_feat6"),
    t("pricing_coach_feat7"),
  ];

  const canSeeIndividual =
    authLoading || !isLoggedIn || role === "user" || role === "admin";
  const canSeeCorporate =
    authLoading || !isLoggedIn || role === "corporate" || role === "admin";
  const canSeeCoach =
    authLoading || !isLoggedIn || role === "coach" || role === "admin";

  const primaryCta = () => {
    if (!isLoggedIn) return navigate("/register");
    if (role === "corporate") return navigate("/checkout?plan=corporate");
    if (role === "coach") return navigate("/checkout?plan=coach");
    return navigate("/checkout?plan=individual");
  };

  const scrollToPlans = () => {
    const el = document.getElementById("plans");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="border-b bg-gradient-to-b from-red-50 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-red-200 text-red-700 font-semibold">
              <Sparkles className="w-4 h-4 text-red-600" />
              {t("pricing_hero_pill")}
            </span>
          </div>

          <h1 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            {t("pricing_hero_title_prefix")}{" "}
            <span className="text-red-600">
              {t("pricing_hero_title_highlight")}
            </span>
          </h1>

          <p className="mt-4 text-center text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            {t("pricing_hero_subtitle")}
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Button
              variant="outline"
              className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
              onClick={scrollToPlans}
            >
              {t("pricing_hero_cta_plans")}
            </Button>
            <Button
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
              onClick={primaryCta}
            >
              {t("pricing_hero_cta_start")}
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <TicketPercent className="w-5 h-5 text-red-600" />
                {t("pricing_trust1_title")}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {t("pricing_trust1_desc")}
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Video className="w-5 h-5 text-red-600" />
                {t("pricing_trust2_title")}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {t("pricing_trust2_desc")}
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Headphones className="w-5 h-5 text-red-600" />
                {t("pricing_trust3_title")}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {t("pricing_trust3_desc")}
              </p>
            </div>
          </div>

          {!authLoading && isLoggedIn && role !== "admin" && (
            <div className="mt-8 rounded-2xl border bg-white p-4 text-sm text-gray-700">
              {t("pricing_role_note_prefix")} <b>{role}</b>.{" "}
              {t("pricing_role_note_suffix")}
            </div>
          )}
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {authLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
              <p className="text-gray-500 text-sm">{t("processing")}</p>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-6 ${
                  countTrue(canSeeIndividual, canSeeCorporate, canSeeCoach) === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 lg:grid-cols-2"
                }`}
              >
                {/* ── Individual ── */}
                {canSeeIndividual && (
                  <div className="rounded-3xl border bg-white p-7 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-semibold text-sm">
                          <User className="w-4 h-4" />
                          {t("pricing_individual_badge")}
                        </div>
                        <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                          {t("pricing_individual_title")}
                        </h2>
                        <p className="mt-2 text-gray-600">
                          {t("pricing_individual_desc")}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center">
                        <Crown className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {individualFeatures.map((feat, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-red-600 mt-0.5" />
                          <div className="text-gray-800">{feat}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 flex gap-3 flex-wrap">
                      <Button
                        className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                        onClick={() =>
                          navigate(
                            isLoggedIn
                              ? "/checkout?plan=individual"
                              : "/register"
                          )
                        }
                      >
                        {t("pricing_individual_cta_primary")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => navigate("/coaches")}
                      >
                        {t("pricing_individual_cta_secondary")}
                      </Button>
                    </div>

                    <div className="mt-6 rounded-2xl bg-red-50 border border-red-100 p-4">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <BadgeCheck className="w-5 h-5 text-red-600" />
                        {t("pricing_note_label")}
                      </div>
                      <p className="mt-1 text-sm text-gray-700">
                        {t("pricing_individual_note")}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Corporate ── */}
                {canSeeCorporate && (
                  <div className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-red-50" />
                    <div className="absolute -bottom-24 -left-24 w-56 h-56 rounded-full bg-red-50" />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white font-semibold text-sm">
                            <Building2 className="w-4 h-4" />
                            {t("pricing_corporate_badge")}
                          </div>
                          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                            {t("pricing_corporate_title")}
                          </h2>
                          <p className="mt-2 text-gray-600">
                            {t("pricing_corporate_desc")}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center">
                          <Users2 className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        {corporateFeatures.map((feat, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-red-600 mt-0.5" />
                            <div className="text-gray-800">{feat}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-7 flex gap-3 flex-wrap">
                        <Button
                          className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                          onClick={() =>
                            navigate(
                              isLoggedIn
                                ? "/checkout?plan=corporate"
                                : "/register"
                            )
                          }
                        >
                          {t("pricing_corporate_cta_primary")}
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => navigate("/pricing")}
                        >
                          {t("pricing_corporate_cta_secondary")}
                        </Button>
                      </div>

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-2xl border bg-white p-4">
                          <div className="flex items-center gap-2 font-bold text-gray-900">
                            <Newspaper className="w-5 h-5 text-red-600" />
                            {t("pricing_corporate_card1_title")}
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {t("pricing_corporate_card1_desc")}
                          </p>
                        </div>
                        <div className="rounded-2xl border bg-white p-4">
                          <div className="flex items-center gap-2 font-bold text-gray-900">
                            <Headphones className="w-5 h-5 text-red-600" />
                            {t("pricing_corporate_card2_title")}
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {t("pricing_corporate_card2_desc")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 rounded-2xl bg-red-50 border border-red-100 p-4">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                          <BadgeCheck className="w-5 h-5 text-red-600" />
                          {t("pricing_corporate_badge_card_title")}
                        </div>
                        <p className="mt-1 text-sm text-gray-700">
                          {t("pricing_corporate_badge_card_desc")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Coach ── */}
                {canSeeCoach && (
                  <div className="rounded-3xl border bg-white p-7 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 text-white font-semibold text-sm">
                          <Briefcase className="w-4 h-4" />
                          {t("pricing_coach_badge")}
                        </div>
                        <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                          {t("pricing_coach_title")}
                        </h2>
                        <p className="mt-2 text-gray-600">
                          {t("pricing_coach_desc")}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                        <Star className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {coachFeatures.map((feat, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-gray-900 mt-0.5" />
                          <div className="text-gray-800">{feat}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 flex gap-3 flex-wrap">
                      <Button
                        className="rounded-xl bg-gray-900 hover:bg-black text-white"
                        onClick={() =>
                          navigate(
                            isLoggedIn ? "/checkout?plan=coach" : "/register"
                          )
                        }
                      >
                        {t("pricing_coach_cta_primary")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => navigate("/pricing")}
                      >
                        {t("pricing_coach_cta_secondary")}
                      </Button>
                    </div>

                    <div className="mt-6 rounded-2xl bg-gray-50 border p-4">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <ShieldCheck className="w-5 h-5" />
                        {t("pricing_note_label")}
                      </div>
                      <p className="mt-1 text-sm text-gray-700">
                        {t("pricing_coach_note")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* FAQ */}
              <div className="mt-10 rounded-3xl border bg-white p-6">
                <h3 className="text-xl font-extrabold text-gray-900">
                  {t("pricing_faq_title")}
                </h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="font-bold text-gray-900">
                      {t("pricing_faq1_q")}
                    </div>
                    <div className="mt-1">{t("pricing_faq1_a")}</div>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="font-bold text-gray-900">
                      {t("pricing_faq2_q")}
                    </div>
                    <div className="mt-1">{t("pricing_faq2_a")}</div>
                  </div>
                </div>
              </div>

              {isLoggedIn &&
                role !== "admin" &&
                !canSeeIndividual &&
                !canSeeCorporate &&
                !canSeeCoach && (
                  <div className="mt-10 rounded-2xl border bg-amber-50 border-amber-200 p-4 text-amber-900">
                    {t("pricing_no_plan_warning")} (role: {String(role)})
                  </div>
                )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
