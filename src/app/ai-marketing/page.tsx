"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Megaphone, TrendingUp, Target, PenTool, BarChart3, Mail,
  MessageSquare, Globe, Sparkles, Copy, Plus,
  Users, DollarSign, Eye, Calendar, ArrowRight,
  CheckCircle2, RefreshCw, Share2
} from "lucide-react";
import DemoBadge from "@/components/DemoBadge";

/* ───────── DATA ───────── */
const campaigns = [
  { id: 1, name: "Lancio Prodotto Spring 2026", status: "attiva", channels: ["Email", "Social", "Google Ads"], budget: 5200, spent: 3180, conversions: 342, ctr: "4.2%", roi: "+182%", impressions: "245K", clicks: "10.3K", startDate: "01/02/2026", audience: "Professionisti 25-45" },
  { id: 2, name: "Retargeting Carrelli Abbandonati", status: "attiva", channels: ["Email", "Meta Ads"], budget: 1800, spent: 1420, conversions: 156, ctr: "6.8%", roi: "+245%", impressions: "89K", clicks: "6.1K", startDate: "28/01/2026", audience: "Visitatori sito 7gg" },
  { id: 3, name: "Newsletter Febbraio", status: "completata", channels: ["Email"], budget: 200, spent: 200, conversions: 89, ctr: "3.1%", roi: "+120%", impressions: "12K", clicks: "372", startDate: "01/02/2026", audience: "Iscritti newsletter" },
  { id: 4, name: "Brand Awareness Q1", status: "pianificata", channels: ["Social", "Display"], budget: 8000, spent: 0, conversions: 0, ctr: "-", roi: "-", impressions: "-", clicks: "-", startDate: "15/02/2026", audience: "Lookalike top clients" },
  { id: 5, name: "Promo San Valentino", status: "completata", channels: ["Email", "Social", "Google Ads"], budget: 3500, spent: 3500, conversions: 278, ctr: "5.4%", roi: "+198%", impressions: "180K", clicks: "9.7K", startDate: "05/02/2026", audience: "Coppie 20-40" },
];

const kpiData = [
  { label: "Lead Generati", value: "1.284", change: "+23%", color: "#f59e0b", icon: Users },
  { label: "Conversion Rate", value: "4.7%", change: "+0.8%", color: "#22c55e", icon: Target },
  { label: "ROI Medio", value: "+182%", change: "+34%", color: "#3b82f6", icon: TrendingUp },
  { label: "Costo per Lead", value: "€8.40", change: "-12%", color: "#ec4899", icon: DollarSign },
];

const generatedCopy = [
  { type: "Subject Email", text: "Non perdere il lancio esclusivo - Solo per te!", score: 92, variant: "A" },
  { type: "Subject Email", text: "Ultima occasione: accesso anticipato al nuovo prodotto", score: 87, variant: "B" },
  { type: "Ad Copy", text: "Scopri la rivoluzione del gestionale per PMI. Prova gratuita 14 giorni. Nessuna carta richiesta. Unisciti a 5000+ aziende.", score: 88, variant: "A" },
  { type: "Social Post", text: "Il futuro della gestione aziendale è adesso. Scopri come stiamo cambiando le regole del gioco per le PMI italiane. Link in bio! #innovation #tech #PMI", score: 85, variant: "A" },
  { type: "CTA", text: "Inizia Gratis Ora", score: 95, variant: "A" },
  { type: "CTA", text: "Prova 14 Giorni Gratis", score: 91, variant: "B" },
];

const conversionData = [32, 45, 28, 52, 41, 67, 55, 72, 63, 48, 58, 75, 82, 69, 88, 71, 93, 85, 78, 95, 82, 68, 91, 87, 76, 98, 84, 92, 89, 96];

const audienceSegments = [
  { name: "Professionisti 25-34", size: "42K", ctr: "5.8%", conv: "6.2%", color: "#f59e0b" },
  { name: "Manager 35-44", size: "38K", ctr: "4.9%", conv: "5.1%", color: "#3b82f6" },
  { name: "Imprenditori 45-54", size: "28K", ctr: "3.7%", conv: "4.8%", color: "#22c55e" },
  { name: "Startup Founder", size: "15K", ctr: "7.2%", conv: "8.4%", color: "#8b5cf6" },
];

const channelPerf = [
  { ch: "Email Marketing", pct: 42, leads: 540, cost: "€3.20", color: "#f59e0b" },
  { ch: "Google Ads", pct: 28, leads: 360, cost: "€12.80", color: "#3b82f6" },
  { ch: "Meta Ads", pct: 18, leads: 231, cost: "€9.40", color: "#8b5cf6" },
  { ch: "Organic Social", pct: 12, leads: 153, cost: "€0", color: "#22c55e" },
];

const statusColors: Record<string, { label: string; color: string }> = {
  attiva: { label: "Attiva", color: "#22c55e" },
  completata: { label: "Completata", color: "#3b82f6" },
  pianificata: { label: "Pianificata", color: "#f59e0b" },
};

const wizardSteps = ["Obiettivo", "Audience", "Canali", "Budget", "Contenuti", "Revisione"];

/* ───────── COMPONENT ───────── */
type Page = "dashboard" | "campaigns" | "analytics" | "copywriter" | "audiences" | "create";

export default function AIMarketingPage() {
  const [page, setPage] = useState<Page>("dashboard");
  const [selectedCampaign, setSelectedCampaign] = useState<typeof campaigns[0] | null>(null);
  const [wizardStep, setWizardStep] = useState(0);

  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const activeCampaigns = campaigns.filter(c => c.status === "attiva").length;

  return (
    <div className="min-h-screen bg-background flex">
      <DemoBadge />

      {/* ─── SIDEBAR ─── */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">AI Marketing</h1>
              <p className="text-[10px] text-muted-foreground">Engine Predittivo</p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="p-3 border-b border-border">
          <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-3">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-sm font-bold text-pink-400">{activeCampaigns}</p>
                <p className="text-[10px] text-muted-foreground">Campagne Attive</p>
              </div>
              <div>
                <p className="text-sm font-bold text-green-400">{totalConversions}</p>
                <p className="text-[10px] text-muted-foreground">Conversioni</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "dashboard" as Page, label: "Dashboard", icon: BarChart3 },
            { key: "campaigns" as Page, label: "Campagne", icon: Megaphone, badge: activeCampaigns },
            { key: "analytics" as Page, label: "Analytics", icon: TrendingUp },
            { key: "copywriter" as Page, label: "AI Copywriter", icon: PenTool },
            { key: "audiences" as Page, label: "Audience", icon: Users },
            { key: "create" as Page, label: "Crea Campagna", icon: Plus },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                page === key ? "bg-pink-500/10 text-pink-400" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge !== undefined && <span className="text-[10px] bg-pink-500/20 text-pink-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}

          <div className="pt-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Campagne Attive</p>
            {campaigns.filter(c => c.status === "attiva").map(c => (
              <button key={c.id} onClick={() => { setSelectedCampaign(c); setPage("campaigns"); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="flex-1 text-left truncate">{c.name}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between px-2 text-[10px] text-muted-foreground">
            <span>Budget: <strong className="text-foreground">{"\u20AC"}{totalSpent.toLocaleString()}</strong> / {"\u20AC"}{totalBudget.toLocaleString()}</span>
            <div className="w-16 bg-muted rounded-full h-1.5">
              <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${(totalSpent / totalBudget) * 100}%` }} />
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="flex-1 min-h-screen overflow-y-auto">

        {/* ═══ DASHBOARD ═══ */}
        {page === "dashboard" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Dashboard Marketing</h2>
            <p className="text-xs text-muted-foreground mb-6">Panoramica performance e campagne attive</p>

            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {kpiData.map(k => {
                const Icon = k.icon;
                return (
                  <div key={k.label} className="bg-card border border-border rounded-xl p-5 hover:border-pink-500/30 transition-colors cursor-pointer" onClick={() => setPage("analytics")}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: k.color + "15" }}>
                        <Icon className="w-5 h-5" style={{ color: k.color }} />
                      </div>
                      <span className="text-xs font-medium text-green-400">{k.change}</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Campaigns + Channel perf */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="col-span-2 bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Campagne Attive</h3>
                  <button onClick={() => setPage("campaigns")} className="text-xs text-pink-400 hover:underline">Vedi tutte</button>
                </div>
                <div className="space-y-3">
                  {campaigns.filter(c => c.status === "attiva").map(c => (
                    <div key={c.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => { setSelectedCampaign(c); setPage("campaigns"); }}>
                      <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{c.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          {c.channels.map(ch => <span key={ch} className="text-[9px] bg-muted rounded px-1 py-0.5 text-muted-foreground">{ch}</span>)}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-green-400">{c.roi}</p>
                        <p className="text-[10px] text-muted-foreground">{c.conversions} conv.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Canali Performance</h3>
                <div className="space-y-3">
                  {channelPerf.map(ch => (
                    <div key={ch.ch}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{ch.ch}</span>
                        <span className="text-[10px] text-muted-foreground">{ch.pct}%</span>
                      </div>
                      <div className="bg-muted rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${ch.pct * 2}%`, backgroundColor: ch.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversion chart */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Trend Conversioni — 30 Giorni</h3>
                <button onClick={() => setPage("analytics")} className="text-xs text-pink-400 hover:underline">Analytics</button>
              </div>
              <div className="flex items-end gap-1 h-28">
                {conversionData.map((v, i) => (
                  <div key={i} className="flex-1 group cursor-pointer relative">
                    <div className="w-full rounded-t-sm opacity-70 group-hover:opacity-100 transition-all" style={{ height: `${v}%`, backgroundColor: `hsl(${330 + v * 0.3}, 80%, 55%)` }} />
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-pink-400">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ CAMPAIGNS ═══ */}
        {page === "campaigns" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Campagne</h2>
                <p className="text-xs text-muted-foreground">{campaigns.length} campagne • {activeCampaigns} attive</p>
              </div>
              <button onClick={() => { setWizardStep(0); setPage("create"); }} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />Nuova Campagna
              </button>
            </div>

            <div className="space-y-4">
              {campaigns.map(c => {
                const st = statusColors[c.status];
                const isSelected = selectedCampaign?.id === c.id;
                const budgetPct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;
                return (
                  <div key={c.id} className={`bg-card border rounded-2xl p-5 transition-all cursor-pointer ${isSelected ? "border-pink-500/50 shadow-lg shadow-pink-500/5" : "border-border hover:border-pink-500/30"}`}
                    onClick={() => setSelectedCampaign(isSelected ? null : c)}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{c.name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: st.color, backgroundColor: st.color + "15" }}>{st.label}</span>
                        </div>
                        <div className="flex gap-1.5">
                          {c.channels.map(ch => (
                            <span key={ch} className="text-[10px] bg-muted rounded-md px-2 py-0.5 text-muted-foreground flex items-center gap-1">
                              {ch === "Email" ? <Mail className="w-2.5 h-2.5" /> : ch === "Social" ? <Share2 className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                              {ch}
                            </span>
                          ))}
                          <span className="text-[10px] text-muted-foreground ml-2 flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" />{c.startDate}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">{c.roi}</p>
                        <p className="text-[10px] text-muted-foreground">ROI</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-3 text-center">
                      {[
                        { l: "Budget", v: `\u20AC${c.budget.toLocaleString()}` },
                        { l: "Speso", v: `\u20AC${c.spent.toLocaleString()}` },
                        { l: "Impressions", v: c.impressions },
                        { l: "Click", v: c.clicks },
                        { l: "CTR", v: c.ctr },
                        { l: "Conversioni", v: c.conversions.toString() },
                      ].map(d => (
                        <div key={d.l} className="bg-muted/30 rounded-lg p-2">
                          <p className="text-xs font-bold">{d.v}</p>
                          <p className="text-[9px] text-muted-foreground">{d.l}</p>
                        </div>
                      ))}
                    </div>

                    {budgetPct > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-pink-500" style={{ width: `${budgetPct}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{budgetPct}% budget</span>
                      </div>
                    )}

                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-2">Audience: <strong className="text-foreground">{c.audience}</strong></p>
                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-pink-500 text-white rounded-lg text-xs font-semibold">Modifica</button>
                          <button onClick={e => { e.stopPropagation(); setPage("analytics"); }} className="px-4 py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground">Analytics</button>
                          <button className="px-4 py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground">Duplica</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ ANALYTICS ═══ */}
        {page === "analytics" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Analytics</h2>
            <p className="text-xs text-muted-foreground mb-6">Analisi dettagliata delle performance marketing</p>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {kpiData.map(k => {
                const Icon = k.icon;
                return (
                  <div key={k.label} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4" style={{ color: k.color }} />
                      <span className="text-xs text-muted-foreground">{k.label}</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
                    <p className="text-xs text-green-400">{k.change} vs mese scorso</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-card border border-border rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-sm mb-4">Trend Conversioni — 30 Giorni</h3>
              <div className="flex items-end gap-1.5 h-44">
                {conversionData.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="relative w-full">
                      <div className="w-full rounded-t-md opacity-60 group-hover:opacity-100 transition-all" style={{ height: `${v * 1.6}px`, backgroundColor: `hsl(${330 + v * 0.3}, 80%, 55%)` }} />
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-pink-400 bg-card border border-border rounded px-1 py-0.5">{v}</div>
                    </div>
                    {i % 5 === 0 && <span className="text-[9px] text-muted-foreground">{i + 1}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Performance per Canale</h3>
                <div className="space-y-3">
                  {channelPerf.map(ch => (
                    <div key={ch.ch} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: ch.color }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{ch.ch}</span>
                          <span className="text-[10px] text-muted-foreground">{ch.leads} lead • CPL {ch.cost}</span>
                        </div>
                        <div className="bg-muted rounded-full h-2">
                          <div className="h-2 rounded-full" style={{ width: `${ch.pct * 2.2}%`, backgroundColor: ch.color }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-pink-400" />Previsioni AI</h3>
                <div className="space-y-3">
                  {[
                    { insight: "+18% conversioni se budget Meta Ads +€500", confidence: 94, type: "Budget" },
                    { insight: "Martedì 10:00 miglior orario invio email", confidence: 91, type: "Timing" },
                    { insight: "Segmento 25-34 ha CTR +2.3% vs media", confidence: 88, type: "Audience" },
                    { insight: "Video ads generano 3x engagement vs immagini", confidence: 86, type: "Formato" },
                  ].map((p, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-pink-500/5 border border-pink-500/10">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs">{p.insight}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] bg-muted rounded px-1 py-0.5 text-muted-foreground">{p.type}</span>
                          <span className="text-[9px] text-pink-400">Confidenza: {p.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ COPYWRITER ═══ */}
        {page === "copywriter" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">AI Copywriter</h2>
            <p className="text-xs text-muted-foreground mb-6">Genera copy ottimizzati con intelligenza artificiale</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-pink-400" />Genera Copy</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Prodotto / Servizio</label>
                    <input defaultValue="Software gestionale per PMI" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Target Audience</label>
                    <input defaultValue="Imprenditori PMI italiane" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Tono</label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
                      <option>Professionale</option><option>Casual</option><option>Urgente</option><option>Emozionale</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Tipo di Copy</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {["Email Subject", "Ad Copy", "Social Post", "CTA"].map(t => (
                        <button key={t} className="text-[10px] px-2 py-1.5 bg-muted rounded-lg text-muted-foreground hover:text-foreground hover:bg-pink-500/10 transition-colors">{t}</button>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-medium hover:opacity-90 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />Genera Copy
                  </button>
                </div>
              </div>

              <div className="col-span-2 space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">Copy Generati</h3>
                {generatedCopy.map((c, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-pink-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-full">{c.type}</span>
                        <span className="text-[10px] bg-muted rounded px-1.5 py-0.5 text-muted-foreground">Variante {c.variant}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-16 bg-muted rounded-full h-1.5">
                            <div className="h-1.5 rounded-full" style={{ width: `${c.score}%`, backgroundColor: c.score > 90 ? "#22c55e" : c.score > 85 ? "#f59e0b" : "#3b82f6" }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: c.score > 90 ? "#22c55e" : c.score > 85 ? "#f59e0b" : "#3b82f6" }}>{c.score}</span>
                        </div>
                        <button className="p-1 rounded hover:bg-muted"><Copy className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      </div>
                    </div>
                    <p className="text-sm">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ AUDIENCES ═══ */}
        {page === "audiences" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Audience & Segmenti</h2>
            <p className="text-xs text-muted-foreground mb-6">Analisi segmenti e performance per audience</p>

            <div className="grid grid-cols-2 gap-4">
              {audienceSegments.map((seg, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-pink-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: seg.color + "15" }}>
                      <Users className="w-5 h-5" style={{ color: seg.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{seg.name}</h3>
                      <p className="text-xs text-muted-foreground">{seg.size} contatti</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold" style={{ color: seg.color }}>{seg.ctr}</p>
                      <p className="text-[10px] text-muted-foreground">CTR</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-green-400">{seg.conv}</p>
                      <p className="text-[10px] text-muted-foreground">Conv. Rate</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ CREATE CAMPAIGN ═══ */}
        {page === "create" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Crea Campagna</h2>
            <p className="text-xs text-muted-foreground mb-6">Wizard guidato per creare una nuova campagna</p>

            {/* Steps */}
            <div className="flex items-center gap-2 mb-8">
              {wizardSteps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <button onClick={() => setWizardStep(i)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= wizardStep ? "bg-pink-500 text-white" : "bg-muted text-muted-foreground"}`}>
                    {i < wizardStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </button>
                  <span className={`text-xs ${i === wizardStep ? "text-pink-400 font-medium" : "text-muted-foreground"}`}>{s}</span>
                  {i < wizardSteps.length - 1 && <div className={`w-8 h-0.5 ${i < wizardStep ? "bg-pink-500" : "bg-muted"}`} />}
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl">
              {wizardStep === 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Obiettivo della Campagna</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Lead Generation", desc: "Genera nuovi contatti qualificati", icon: Users },
                      { label: "Brand Awareness", desc: "Aumenta la visibilità del brand", icon: Eye },
                      { label: "Conversioni", desc: "Massimizza vendite e iscrizioni", icon: Target },
                      { label: "Retargeting", desc: "Riconverti visitatori interessati", icon: RefreshCw },
                    ].map(o => (
                      <button key={o.label} className="p-4 border border-border rounded-xl text-left hover:border-pink-500/40 hover:bg-pink-500/5 transition-colors">
                        <o.icon className="w-5 h-5 text-pink-400 mb-2" />
                        <p className="text-sm font-semibold">{o.label}</p>
                        <p className="text-xs text-muted-foreground">{o.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Definisci Audience</h3>
                  <div className="space-y-3">
                    <input placeholder="Nome segmento" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs text-muted-foreground">Età</label><input defaultValue="25-45" className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm" /></div>
                      <div><label className="text-xs text-muted-foreground">Località</label><input defaultValue="Italia" className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm" /></div>
                    </div>
                    <div><label className="text-xs text-muted-foreground">Interessi</label><input defaultValue="Business, Tecnologia, Startup" className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm" /></div>
                  </div>
                </div>
              )}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Seleziona Canali</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { ch: "Email Marketing", icon: Mail, desc: "Newsletter e automazioni" },
                      { ch: "Google Ads", icon: Globe, desc: "Search e display ads" },
                      { ch: "Meta Ads", icon: Share2, desc: "Facebook e Instagram" },
                      { ch: "Social Organic", icon: MessageSquare, desc: "Post organici" },
                    ].map(c => (
                      <button key={c.ch} className="p-4 border border-border rounded-xl text-left hover:border-pink-500/40 hover:bg-pink-500/5 transition-colors flex items-start gap-3">
                        <c.icon className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                        <div><p className="text-sm font-medium">{c.ch}</p><p className="text-xs text-muted-foreground">{c.desc}</p></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {wizardStep >= 3 && wizardStep <= 4 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">{wizardSteps[wizardStep]}</h3>
                  <p className="text-sm text-muted-foreground">Configura {wizardSteps[wizardStep].toLowerCase()} per la tua campagna.</p>
                  <div className="h-32 bg-muted/30 rounded-xl flex items-center justify-center text-muted-foreground text-xs">Placeholder step {wizardStep + 1}</div>
                </div>
              )}
              {wizardStep === 5 && (
                <div className="space-y-4 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
                  <h3 className="font-semibold text-lg">Campagna Pronta!</h3>
                  <p className="text-sm text-muted-foreground">Rivedi i dettagli e lancia la campagna.</p>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold">Lancia Campagna</button>
                </div>
              )}

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <button onClick={() => setWizardStep(Math.max(0, wizardStep - 1))} disabled={wizardStep === 0}
                  className="px-4 py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">Indietro</button>
                <button onClick={() => setWizardStep(Math.min(wizardSteps.length - 1, wizardStep + 1))} disabled={wizardStep === wizardSteps.length - 1}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg text-xs font-semibold hover:bg-pink-600 disabled:opacity-30 flex items-center gap-1">Avanti <ArrowRight className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
