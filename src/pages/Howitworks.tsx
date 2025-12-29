// src/pages/Howitworks.tsx
// @ts-nocheck

import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ShieldCheck,
  Users,
  Building2,
  UserCircle2,
  CalendarCheck2,
  LineChart,
  Sparkles,
  MessageSquare,
  BadgeCheck,
  Lock,
  CreditCard,
  ArrowRight,
} from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/lib/i18n";

export default function HowItWorks() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation((language || "en") as any, key);

  const steps = [
    {
      no: "01",
      title: t("howItWorks_step1_title"),
      desc: t("howItWorks_step1_desc"),
      icon: UserCircle2,
    },
    {
      no: "02",
      title: t("howItWorks_step2_title"),
      desc: t("howItWorks_step2_desc"),
      icon: CalendarCheck2,
    },
    {
      no: "03",
      title: t("howItWorks_step3_title"),
      desc: t("howItWorks_step3_desc"),
      icon: LineChart,
    },
  ];

  const personas = [
    {
      title: t("howItWorks_persona_individual_title"),
      subtitle: t("howItWorks_persona_individual_subtitle"),
      icon: Users,
      bullets: [
        t("howItWorks_persona_individual_bullet1"),
        t("howItWorks_persona_individual_bullet2"),
        t("howItWorks_persona_individual_bullet3"),
        t("howItWorks_persona_individual_bullet4"),
      ],
      ctaText: t("howItWorks_persona_individual_cta"),
      ctaHref: "/coaches",
    },
    {
      title: t("howItWorks_persona_coach_title"),
      subtitle: t("howItWorks_persona_coach_subtitle"),
      icon: BadgeCheck,
      bullets: [
        t("howItWorks_persona_coach_bullet1"),
        t("howItWorks_persona_coach_bullet2"),
        t("howItWorks_persona_coach_bullet3"),
        t("howItWorks_persona_coach_bullet4"),
      ],
      ctaText: t("howItWorks_persona_coach_cta"),
      ctaHref: "/for-coaches",
    },
    {
      title: t("howItWorks_persona_company_title"),
      subtitle: t("howItWorks_persona_company_subtitle"),
      icon: Building2,
      bullets: [
        t("howItWorks_persona_company_bullet1"),
        t("howItWorks_persona_company_bullet2"),
        t("howItWorks_persona_company_bullet3"),
        t("howItWorks_persona_company_bullet4"),
      ],
      ctaText: t("howItWorks_persona_company_cta"),
      ctaHref: "/for-companies",
    },
  ];

  const trust = [
    {
      title: t("howItWorks_trust1_title"),
      desc: t("howItWorks_trust1_desc"),
      icon: BadgeCheck,
    },
    {
      title: t("howItWorks_trust2_title"),
      desc: t("howItWorks_trust2_desc"),
      icon: Lock,
    },
    {
      title: t("howItWorks_trust3_title"),
      desc: t("howItWorks_trust3_desc"),
      icon: CreditCard,
    },
    {
      title: t("howItWorks_trust4_title"),
      desc: t("howItWorks_trust4_desc"),
      icon: MessageSquare,
    },
  ];

  const faqs = [
    {
      q: t("howItWorks_faq1_q"),
      a: t("howItWorks_faq1_a"),
    },
    {
      q: t("howItWorks_faq2_q"),
      a: t("howItWorks_faq2_a"),
    },
    {
      q: t("howItWorks_faq3_q"),
      a: t("howItWorks_faq3_a"),
    },
    {
      q: t("howItWorks_faq4_q"),
      a: t("howItWorks_faq4_a"),
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="bg-white text-slate-900">
        {/* HERO */}
        <section className="border-b bg-gradient-to-b from-red-600 via-orange-500 to-orange-400">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 sm:pt-24 sm:pb-16">
            <div className="text-center">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                {t("howItWorks_hero_title_line1")}
                <br />
                <span className="text-yellow-300">{t("howItWorks_hero_title_highlight")}</span>
              </h1>

              <p className="mt-4 text-white/90 text-base sm:text-lg">
                {t("howItWorks_hero_subtitle")}
              </p>

              <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
                >
                  {t("howItWorks_hero_cta_start")}
                </Link>
                <Link
                  to="/coaches"
                  className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  {t("howItWorks_hero_cta_browse")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Top value strip */}
        <section className="border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid gap-6 lg:grid-cols-12 items-start">
              <div className="lg:col-span-7">
                <p className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-700">
                  <Sparkles className="h-4 w-4 text-red-600" />
                  {t("howItWorks_value_pill")}
                </p>

                <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-gray-900">
                  {t("howItWorks_value_title_line1")}
                  <br className="hidden sm:block" />
                  <span className="text-gray-900">{t("howItWorks_value_title_line2")}</span>
                </h2>

                <p className="mt-3 text-gray-600 leading-relaxed">
                  {t("howItWorks_value_desc")}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/coaches"
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition"
                  >
                    {t("howItWorks_value_cta_browse")} <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                  >
                    {t("howItWorks_value_cta_start")}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border bg-gray-50 p-6">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white border flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t("howItWorks_value_card_title")}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {t("howItWorks_value_card_desc")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      { label: t("howItWorks_metric1_label"), value: t("howItWorks_metric1_value") },
                      { label: t("howItWorks_metric2_label"), value: t("howItWorks_metric2_value") },
                      { label: t("howItWorks_metric3_label"), value: t("howItWorks_metric3_value") },
                      { label: t("howItWorks_metric4_label"), value: t("howItWorks_metric4_value") },
                    ].map((m, i) => (
                      <div key={i} className="rounded-xl bg-white border p-4">
                        <p className="text-xs text-gray-500">{m.label}</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{m.value}</p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-xs text-gray-500">{t("howItWorks_metrics_note")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Steps */}
        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  {t("howItWorks_steps_title")}
                </h2>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {t("howItWorks_steps_subtitle")}
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Link
                  to="/coaches"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                >
                  {t("howItWorks_steps_cta_browse")}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black transition"
                >
                  {t("howItWorks_steps_cta_register")}
                </Link>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={idx} className="rounded-2xl border bg-white p-6 hover:shadow-sm transition">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                        {s.no}
                      </span>
                      {Icon ? <Icon className="h-6 w-6 text-gray-700" /> : null}
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900">{s.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{s.desc}</p>

                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-red-600" />
                      {t("howItWorks_steps_footer")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Personas */}
        <section className="border-t bg-gray-50 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {t("howItWorks_personas_title")}
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed">
                {t("howItWorks_personas_subtitle")}
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {personas.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="rounded-2xl border bg-white p-6">
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gray-900 flex items-center justify-center">
                        {Icon ? <Icon className="h-5 w-5 text-white" /> : null}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
                        <p className="text-sm text-gray-600">{p.subtitle}</p>
                      </div>
                    </div>

                    <ul className="mt-5 space-y-3">
                      {p.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-red-600 mt-0.5" />
                          <span className="text-sm text-gray-700">{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      <Link
                        to={p.ctaHref}
                        className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition w-full"
                      >
                        {p.ctaText} <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {t("howItWorks_trust_title")}
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed">
                {t("howItWorks_trust_subtitle")}
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {trust.map((tItem, idx) => {
                const Icon = tItem.icon;
                return (
                  <div key={idx} className="rounded-2xl border bg-white p-6">
                    {Icon ? <Icon className="h-6 w-6 text-gray-900" /> : null}
                    <h3 className="mt-4 font-semibold text-gray-900">{tItem.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{tItem.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 rounded-2xl border bg-gray-50 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t("howItWorks_trust_cta_title")}</p>
                  <p className="mt-1 text-sm text-gray-600">{t("howItWorks_trust_cta_desc")}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/coaches"
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition"
                  >
                    {t("howItWorks_trust_cta_browse")}
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                  >
                    {t("howItWorks_trust_cta_register")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t bg-white py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {t("howItWorks_faq_title")}
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed">{t("howItWorks_faq_subtitle")}</p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {faqs.map((f, idx) => (
                <div key={idx} className="rounded-2xl border bg-white p-6">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-red-600" />
                    {f.q}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl bg-gray-900 p-8 text-white">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <p className="text-sm text-white/80">{t("howItWorks_final_pill")}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{t("howItWorks_final_title")}</h3>
                  <p className="mt-2 text-sm text-white/80">{t("howItWorks_final_desc")}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 transition"
                  >
                    {t("howItWorks_final_cta_register")} <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                  <Link
                    to="/coaches"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition"
                  >
                    {t("howItWorks_final_cta_browse")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
