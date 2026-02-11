"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Camera, AlertTriangle, CheckCircle2, Clock, Plus,
  ThumbsUp, MessageCircle, Search, Settings, BarChart3, Image,
  ChevronRight, Users, Share2, Flag, Layers, Navigation,
  ArrowRight, Send, Star
} from "lucide-react";
import DemoBadge from "@/components/DemoBadge";

/* ───────── DATA ───────── */
const reports = [
  { id: 1, title: "Buca pericolosa in Via Garibaldi", desc: "Buca di circa 40cm di diametro nella carreggiata, pericolosa per auto e ciclisti. Già causato foratura a un ciclista.", category: "Strade", status: "in_corso", zone: "Centro", address: "Via Garibaldi 23", date: "10/02/2026", likes: 34, comments: 12, author: "Marco R.", priority: "alta", photos: 3 },
  { id: 2, title: "Lampione spento Piazza Duomo", desc: "Il lampione all'angolo nord-est della piazza non funziona da 3 giorni. Zona molto buia di sera.", category: "Illuminazione", status: "segnalato", zone: "Centro", address: "Piazza del Duomo", date: "09/02/2026", likes: 18, comments: 5, author: "Elena B.", priority: "media", photos: 1 },
  { id: 3, title: "Rifiuti abbandonati Via Padova", desc: "Cumulo di rifiuti ingombranti abbandonati sul marciapiede. Mobili, materassi e sacchi neri.", category: "Rifiuti", status: "risolto", zone: "Loreto", address: "Via Padova 112", date: "08/02/2026", likes: 45, comments: 22, author: "Sara N.", priority: "alta", photos: 4 },
  { id: 4, title: "Albero pericolante Parco Sempione", desc: "Grande ramo spezzato che pende pericolosamente sopra il vialetto principale. Rischio caduta.", category: "Verde", status: "in_corso", zone: "Sempione", address: "Parco Sempione, viale centrale", date: "07/02/2026", likes: 67, comments: 31, author: "Luca V.", priority: "urgente", photos: 2 },
  { id: 5, title: "Graffiti muro scuola elementare", desc: "Tag e scritte spray sul muro esterno della scuola. Contenuti non appropriati per bambini.", category: "Degrado", status: "segnalato", zone: "Navigli", address: "Via Naviglio Grande 45", date: "06/02/2026", likes: 8, comments: 3, author: "Anna F.", priority: "bassa", photos: 2 },
  { id: 6, title: "Semaforo guasto Via Torino", desc: "Semaforo lampeggiante in giallo da 48 ore. Incrocio pericoloso con molto traffico.", category: "Strade", status: "risolto", zone: "Centro", address: "Incrocio Via Torino/Via Mazzini", date: "05/02/2026", likes: 89, comments: 15, author: "Paolo M.", priority: "urgente", photos: 1 },
  { id: 7, title: "Panchina rotta Giardini Montanelli", desc: "Panchina con asse rotto e chiodi esposti. Pericolosa per chi si siede.", category: "Arredo", status: "segnalato", zone: "Porta Venezia", address: "Giardini Montanelli", date: "04/02/2026", likes: 12, comments: 4, author: "Giulia T.", priority: "media", photos: 1 },
  { id: 8, title: "Perdita acqua sottopassaggio", desc: "Infiltrazione d'acqua dal soffitto del sottopassaggio. Pavimento scivoloso.", category: "Strade", status: "in_corso", zone: "Stazione", address: "Sottopassaggio Stazione Centrale", date: "03/02/2026", likes: 23, comments: 8, author: "Roberto C.", priority: "alta", photos: 2 },
];

const statusMap: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  segnalato: { label: "Segnalato", color: "#f59e0b", icon: AlertTriangle },
  in_corso: { label: "In Corso", color: "#3b82f6", icon: Clock },
  risolto: { label: "Risolto", color: "#22c55e", icon: CheckCircle2 },
};

const priorityMap: Record<string, { label: string; color: string }> = {
  urgente: { label: "Urgente", color: "#ef4444" },
  alta: { label: "Alta", color: "#f97316" },
  media: { label: "Media", color: "#f59e0b" },
  bassa: { label: "Bassa", color: "#6b7280" },
};

const categories = ["Tutti", "Strade", "Illuminazione", "Rifiuti", "Verde", "Degrado", "Arredo"];

const zones = ["Tutti", "Centro", "Loreto", "Sempione", "Navigli", "Porta Venezia", "Stazione"];

const topContributors = [
  { name: "Paolo M.", reports: 24, resolved: 18, avatar: "PM" },
  { name: "Sara N.", reports: 19, resolved: 15, avatar: "SN" },
  { name: "Marco R.", reports: 16, resolved: 11, avatar: "MR" },
  { name: "Luca V.", reports: 14, resolved: 9, avatar: "LV" },
  { name: "Elena B.", reports: 11, resolved: 8, avatar: "EB" },
];

/* ───────── COMPONENT ───────── */
type Page = "dashboard" | "map" | "list" | "detail" | "create" | "gallery";

export default function CittaVivaPage() {
  const [page, setPage] = useState<Page>("dashboard");
  const [catFilter, setCatFilter] = useState("Tutti");
  const [zoneFilter, setZoneFilter] = useState("Tutti");
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(null);

  const filtered = reports.filter(r => {
    if (catFilter !== "Tutti" && r.category !== catFilter) return false;
    if (zoneFilter !== "Tutti" && r.zone !== zoneFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openDetail = (r: typeof reports[0]) => { setSelectedReport(r); setPage("detail"); };

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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">CittàViva</h1>
              <p className="text-[10px] text-muted-foreground">Segnalazioni Urbane</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "dashboard" as Page, label: "Dashboard", icon: BarChart3 },
            { key: "map" as Page, label: "Mappa", icon: Navigation },
            { key: "list" as Page, label: "Segnalazioni", icon: Flag, badge: reports.length },
            { key: "gallery" as Page, label: "Foto Gallery", icon: Image },
            { key: "create" as Page, label: "Nuova Segnalazione", icon: Plus },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                (page === key || (key === "list" && page === "detail"))
                  ? "bg-green-500/10 text-green-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge && <span className="text-[10px] bg-green-500/20 text-green-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}

          <div className="pt-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Stato</p>
            {Object.entries(statusMap).map(([key, cfg]) => {
              const count = reports.filter(r => r.status === key).length;
              return (
                <button key={key} onClick={() => { setCatFilter("Tutti"); setPage("list"); }} className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="flex-1 text-left">{cfg.label}</span><span className="text-[10px]">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Zone</p>
            {zones.slice(1).map(z => {
              const count = reports.filter(r => r.zone === z).length;
              return (
                <button key={z} onClick={() => { setZoneFilter(z); setPage("list"); }} className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors">
                  <MapPin className="w-2.5 h-2.5" />
                  <span className="flex-1 text-left">{z}</span><span className="text-[10px]">{count}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center text-xs font-bold text-green-400">MR</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Marco R.</p>
              <p className="text-[10px] text-muted-foreground">16 segnalazioni</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><Settings className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="flex-1 min-h-screen overflow-y-auto">

        {/* ═══ DASHBOARD ═══ */}
        {page === "dashboard" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Dashboard</h2>
            <p className="text-xs text-muted-foreground mb-6">Panoramica segnalazioni — Milano</p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Totale", value: reports.length, color: "#22c55e", icon: Flag },
                { label: "Segnalate", value: reports.filter(r => r.status === "segnalato").length, color: "#f59e0b", icon: AlertTriangle },
                { label: "In Corso", value: reports.filter(r => r.status === "in_corso").length, color: "#3b82f6", icon: Clock },
                { label: "Risolte", value: reports.filter(r => r.status === "risolto").length, color: "#22c55e", icon: CheckCircle2 },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-green-500/30 transition-colors cursor-pointer" onClick={() => setPage("list")}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + "15" }}>
                      <s.icon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </div>
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Map preview + Top contributors */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="col-span-2 bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Mappa Segnalazioni</h3>
                  <button onClick={() => setPage("map")} className="text-xs text-green-400 hover:underline flex items-center gap-1">Apri mappa <ArrowRight className="w-3 h-3" /></button>
                </div>
                <div className="relative h-72 bg-gradient-to-br from-green-900/10 to-blue-900/10">
                  <div className="absolute inset-0 opacity-10" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 30px, #27272a 30px, #27272a 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, #27272a 30px, #27272a 31px)" }} />
                  {reports.slice(0, 6).map((r, i) => {
                    const st = statusMap[r.status];
                    return (
                      <div key={r.id} className="absolute group cursor-pointer" style={{ top: `${12 + i * 13}%`, left: `${8 + (i * 15) % 82}%` }} onClick={() => openDetail(r)}>
                        <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-lg" style={{ backgroundColor: st.color + "30", borderColor: st.color }}>
                          <MapPin className="w-3.5 h-3.5" style={{ color: st.color }} />
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-lg p-2 text-xs w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10">
                          <p className="font-medium">{r.title}</p>
                          <p className="text-muted-foreground">{r.category} • {r.zone}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="absolute bottom-3 left-3 bg-card/90 border border-border rounded-lg p-2 text-[10px]">
                    <p className="font-medium text-green-400 mb-1">Milano — Vista Simulata</p>
                    <div className="flex gap-3">
                      {Object.entries(statusMap).map(([, cfg]) => (
                        <span key={cfg.label} className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />{cfg.label}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" />Top Cittadini</h3>
                <div className="space-y-3">
                  {topContributors.map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground w-4">{i + 1}</span>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-green-400">{c.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">{c.reports} segnalazioni • {c.resolved} risolte</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent + Categories */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Segnalazioni Recenti</h3>
                <div className="space-y-3">
                  {reports.slice(0, 4).map(r => {
                    const st = statusMap[r.status];
                    return (
                      <div key={r.id} onClick={() => openDetail(r)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{r.title}</p>
                          <p className="text-[10px] text-muted-foreground">{r.zone} • {r.date}</p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0">
                          <span className="flex items-center gap-0.5"><ThumbsUp className="w-2.5 h-2.5" />{r.likes}</span>
                          <span className="flex items-center gap-0.5"><MessageCircle className="w-2.5 h-2.5" />{r.comments}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Per Categoria</h3>
                <div className="space-y-3">
                  {categories.slice(1).map(cat => {
                    const count = reports.filter(r => r.category === cat).length;
                    const pct = Math.round((count / reports.length) * 100);
                    return (
                      <div key={cat} className="flex items-center gap-3">
                        <span className="text-xs w-24">{cat}</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div className="h-2 rounded-full bg-green-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ MAP ═══ */}
        {page === "map" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Mappa Segnalazioni</h2>
            <p className="text-xs text-muted-foreground mb-4">Clicca su un pin per vedere i dettagli</p>

            <div className="flex gap-2 mb-4">
              {categories.map(c => (
                <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${catFilter === c ? "bg-green-500 text-white" : "bg-card border border-border text-muted-foreground"}`}>{c}</button>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden relative" style={{ height: 520 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-blue-900/10">
                <div className="absolute inset-0 opacity-10" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 35px, #27272a 35px, #27272a 36px), repeating-linear-gradient(90deg, transparent, transparent 35px, #27272a 35px, #27272a 36px)" }} />
                {/* Simulated roads */}
                <div className="absolute top-[30%] left-0 right-0 h-px bg-zinc-700/50" />
                <div className="absolute top-[60%] left-0 right-0 h-px bg-zinc-700/50" />
                <div className="absolute left-[25%] top-0 bottom-0 w-px bg-zinc-700/50" />
                <div className="absolute left-[55%] top-0 bottom-0 w-px bg-zinc-700/50" />
                <div className="absolute left-[80%] top-0 bottom-0 w-px bg-zinc-700/50" />

                {filtered.map((r, i) => {
                  const st = statusMap[r.status];
                  return (
                    <div key={r.id} className="absolute group cursor-pointer" style={{ top: `${10 + i * 11}%`, left: `${6 + (i * 13) % 85}%` }} onClick={() => openDetail(r)}>
                      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-xl animate-pulse-slow" style={{ backgroundColor: st.color + "25", borderColor: st.color }}>
                        <MapPin className="w-4 h-4" style={{ color: st.color }} />
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-xl p-3 text-xs w-56 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-10">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: st.color + "15", color: st.color }}>{st.label}</span>
                          <span className="text-[10px] text-muted-foreground">{r.category}</span>
                        </div>
                        <p className="font-medium text-sm mb-0.5">{r.title}</p>
                        <p className="text-[10px] text-muted-foreground">{r.address}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5"><ThumbsUp className="w-2.5 h-2.5" />{r.likes}</span>
                          <span className="flex items-center gap-0.5"><MessageCircle className="w-2.5 h-2.5" />{r.comments}</span>
                          <span className="flex items-center gap-0.5"><Camera className="w-2.5 h-2.5" />{r.photos}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="absolute bottom-4 left-4 bg-card/95 border border-border rounded-xl p-3 text-xs">
                  <p className="font-semibold text-green-400 mb-1.5">Milano — {filtered.length} segnalazioni</p>
                  <div className="flex gap-3">
                    {Object.entries(statusMap).map(([, cfg]) => (
                      <span key={cfg.label} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />{cfg.label}</span>
                    ))}
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex flex-col gap-1">
                  <button className="w-8 h-8 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground text-sm font-bold">+</button>
                  <button className="w-8 h-8 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground text-sm font-bold">−</button>
                  <button className="w-8 h-8 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground"><Layers className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ LIST ═══ */}
        {page === "list" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">Segnalazioni</h2>
                <p className="text-xs text-muted-foreground">{filtered.length} risultati</p>
              </div>
              <button onClick={() => setPage("create")} className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-green-500/20">
                <Plus className="w-3.5 h-3.5" />Segnala
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca segnalazioni..." className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
              </div>
            </div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${catFilter === c ? "bg-green-500 text-white" : "bg-card border border-border text-muted-foreground"}`}>{c}</button>
              ))}
            </div>

            <div className="space-y-3">
              {filtered.map(r => {
                const st = statusMap[r.status];
                const pr = priorityMap[r.priority];
                const StIcon = st.icon;
                return (
                  <div key={r.id} onClick={() => openDetail(r)} className="bg-card border border-border rounded-xl p-4 hover:border-green-500/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: st.color + "15" }}>
                        <StIcon className="w-5 h-5" style={{ color: st.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: st.color + "15", color: st.color }}>{st.label}</span>
                          <span className="text-[10px] bg-muted rounded-md px-1.5 py-0.5 text-muted-foreground">{r.category}</span>
                          <span className="text-[10px] font-medium" style={{ color: pr.color }}>● {pr.label}</span>
                        </div>
                        <h3 className="font-semibold text-sm mb-0.5">{r.title}</h3>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-2">
                          <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{r.address}</span>
                          <span>•</span>
                          <span>{r.author}</span>
                          <span>•</span>
                          <span>{r.date}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground shrink-0">
                        <span className="flex items-center gap-0.5"><ThumbsUp className="w-3 h-3" />{r.likes}</span>
                        <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3" />{r.comments}</span>
                        <span className="flex items-center gap-0.5"><Camera className="w-3 h-3" />{r.photos}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ DETAIL ═══ */}
        {page === "detail" && selectedReport && (() => {
          const st = statusMap[selectedReport.status];
          const pr = priorityMap[selectedReport.priority];
          const StIcon = st.icon;
          return (
            <div className="p-6">
              <button onClick={() => setPage("list")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
                <ArrowLeft className="w-3 h-3" />Torna alle segnalazioni
              </button>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-4">
                  {/* Header */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: st.color + "15", color: st.color }}><StIcon className="w-3 h-3 inline mr-0.5" />{st.label}</span>
                      <span className="text-xs bg-muted rounded-md px-1.5 py-0.5 text-muted-foreground">{selectedReport.category}</span>
                      <span className="text-xs font-medium" style={{ color: pr.color }}>Priorità {pr.label}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-1">{selectedReport.title}</h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{selectedReport.address}</span>
                      <span>•</span>
                      <span>{selectedReport.zone}</span>
                      <span>•</span>
                      <span>{selectedReport.date}</span>
                    </p>
                  </div>

                  {/* Description */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-2">Descrizione</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedReport.desc}</p>
                  </div>

                  {/* Photos placeholder */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-3">Foto ({selectedReport.photos})</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: selectedReport.photos }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-green-400/50" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-3">Commenti ({selectedReport.comments})</h3>
                    <div className="space-y-3 mb-4">
                      {[
                        { user: "Comune di Milano", text: "Segnalazione presa in carico. Intervento programmato.", time: "1 giorno fa", official: true },
                        { user: selectedReport.author, text: "Aggiornamento: la situazione è peggiorata dopo la pioggia di ieri.", time: "2 giorni fa", official: false },
                      ].map((c, i) => (
                        <div key={i} className={`p-3 rounded-xl ${c.official ? "bg-green-500/5 border border-green-500/20" : "bg-muted/50"}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium ${c.official ? "text-green-400" : "text-foreground"}`}>{c.user}</span>
                            {c.official && <span className="text-[10px] bg-green-500/10 text-green-400 rounded-full px-1.5 py-0.5">Ufficiale</span>}
                            <span className="text-[10px] text-muted-foreground">{c.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{c.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input placeholder="Scrivi un commento..." className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
                      <button className="px-4 py-2.5 bg-green-500 text-white rounded-xl"><Send className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-3">Interazioni</h3>
                    <div className="grid grid-cols-3 gap-2 text-center mb-3">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <ThumbsUp className="w-4 h-4 mx-auto text-green-400 mb-0.5" />
                        <p className="text-sm font-bold">{selectedReport.likes}</p>
                        <p className="text-[10px] text-muted-foreground">Mi piace</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <MessageCircle className="w-4 h-4 mx-auto text-blue-400 mb-0.5" />
                        <p className="text-sm font-bold">{selectedReport.comments}</p>
                        <p className="text-[10px] text-muted-foreground">Commenti</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <Camera className="w-4 h-4 mx-auto text-purple-400 mb-0.5" />
                        <p className="text-sm font-bold">{selectedReport.photos}</p>
                        <p className="text-[10px] text-muted-foreground">Foto</p>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-green-500/10 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/20 flex items-center justify-center gap-1"><ThumbsUp className="w-3 h-3" />Supporta</button>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-3">Dettagli</h3>
                    <div className="space-y-3 text-xs">
                      {[
                        { l: "Segnalata da", v: selectedReport.author },
                        { l: "Data", v: selectedReport.date },
                        { l: "Zona", v: selectedReport.zone },
                        { l: "Categoria", v: selectedReport.category },
                        { l: "Priorità", v: pr.label },
                        { l: "Stato", v: st.label },
                      ].map(d => (
                        <div key={d.l} className="flex justify-between">
                          <span className="text-muted-foreground">{d.l}</span>
                          <span className="font-medium">{d.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-3">Azioni</h3>
                    <div className="space-y-2">
                      <button className="w-full py-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600">Aggiungi Foto</button>
                      <button className="w-full py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"><Share2 className="w-3 h-3" />Condividi</button>
                      <button className="w-full py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"><Flag className="w-3 h-3" />Segnala Abuso</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══ GALLERY ═══ */}
        {page === "gallery" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Foto Gallery</h2>
            <p className="text-xs text-muted-foreground mb-6">Tutte le foto delle segnalazioni</p>

            <div className="grid grid-cols-3 gap-4">
              {reports.flatMap(r => Array.from({ length: r.photos }).map((_, pi) => ({ ...r, photoIndex: pi }))).map((item, i) => (
                <div key={i} onClick={() => openDetail(item)} className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-border hover:border-green-500/30 cursor-pointer transition-all relative overflow-hidden group">
                  <Camera className="w-10 h-10 text-green-400/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-xs font-medium text-white">{item.title}</p>
                    <p className="text-[10px] text-white/70">{item.zone} • {item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ CREATE ═══ */}
        {page === "create" && (
          <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-lg font-bold mb-1">Nuova Segnalazione</h2>
            <p className="text-xs text-muted-foreground mb-6">Aiuta a migliorare la tua città</p>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Categoria *</label>
                  <select className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40">
                    {categories.slice(1).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Priorità</label>
                  <select className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40">
                    <option>Media</option><option>Bassa</option><option>Alta</option><option>Urgente</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Titolo *</label>
                <input placeholder="Breve descrizione del problema..." className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Descrizione dettagliata</label>
                <textarea rows={4} placeholder="Spiega il problema nel dettaglio..." className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/40" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Foto</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-green-500/30 cursor-pointer transition-colors">
                  <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Scatta o carica foto del problema</p>
                  <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG — max 10MB per foto</p>
                </div>
              </div>
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Posizione rilevata</p>
                  <p className="text-xs text-muted-foreground">Milano, Via Roma 12 — coordinate GPS rilevate automaticamente</p>
                </div>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-shadow">
                Invia Segnalazione
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
