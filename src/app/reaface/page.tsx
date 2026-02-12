"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ScanFace, Upload, Camera, BarChart3, Shield, Smile, Frown,
  Meh, Eye, Heart, Settings, TrendingUp, Clock, Sparkles, Activity,
  CheckCircle2, RefreshCw, Download, Zap
} from "lucide-react";
import MobileAppLayout from "@/components/MobileAppLayout";

/* ───────── DATA ───────── */
const emotions = [
  { name: "Felicità", value: 72, color: "#22c55e", icon: Smile },
  { name: "Sorpresa", value: 15, color: "#f59e0b", icon: Eye },
  { name: "Neutrale", value: 8, color: "#6b7280", icon: Meh },
  { name: "Tristezza", value: 3, color: "#3b82f6", icon: Frown },
  { name: "Altro", value: 2, color: "#8b5cf6", icon: Heart },
];

const features = [
  { key: "Età stimata", val: "25-30 anni", icon: Activity },
  { key: "Sorriso", val: "Sì (92%)", icon: Smile },
  { key: "Occhi aperti", val: "Sì (98%)", icon: Eye },
  { key: "Forma viso", val: "Ovale", icon: ScanFace },
  { key: "Occhiali", val: "No", icon: Eye },
  { key: "Espressione", val: "Positiva", icon: Heart },
];

const history = [
  { id: 1, date: "10/02/2026", emotion: "Felicità", confidence: 96, time: "14:32", emoji: "😊", color: "#22c55e" },
  { id: 2, date: "09/02/2026", emotion: "Neutrale", confidence: 89, time: "10:15", emoji: "😐", color: "#6b7280" },
  { id: 3, date: "08/02/2026", emotion: "Sorpresa", confidence: 82, time: "18:45", emoji: "😮", color: "#f59e0b" },
  { id: 4, date: "07/02/2026", emotion: "Felicità", confidence: 91, time: "09:20", emoji: "😊", color: "#22c55e" },
  { id: 5, date: "06/02/2026", emotion: "Tristezza", confidence: 78, time: "20:10", emoji: "😢", color: "#3b82f6" },
  { id: 6, date: "05/02/2026", emotion: "Felicità", confidence: 94, time: "12:00", emoji: "😊", color: "#22c55e" },
  { id: 7, date: "04/02/2026", emotion: "Neutrale", confidence: 87, time: "16:30", emoji: "😐", color: "#6b7280" },
];

const moodTrend = [65, 72, 58, 80, 75, 68, 82, 90, 72, 85, 78, 88, 92, 72];

/* ───────── COMPONENT ───────── */
type Page = "scan" | "results" | "history" | "trends" | "settings";

export default function ReaFacePage() {
  const [page, setPage] = useState<Page>("scan");
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setShowResults(true);
      setPage("results");
    }, 2500);
  };

  const mobileNav = [
    { id: "scan", label: "Analisi", icon: Camera },
    { id: "history", label: "Storico", icon: Clock },
    { id: "trends", label: "Trend", icon: TrendingUp },
    { id: "settings", label: "Opzioni", icon: Settings },
  ];

  return (
    <MobileAppLayout appName="ReaFace" accentColor="#6366f1" navItems={mobileNav} activePage={page} onPageChange={(p) => setPage(p as Page)} sidebar={<>
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <ScanFace className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">ReaFace</h1>
              <p className="text-[10px] text-muted-foreground">Analisi Facciale AI</p>
            </div>
          </div>
        </div>

        <div className="p-3 border-b border-border">
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Shield className="w-3 h-3 text-green-400" />
              <span className="text-[10px] text-green-400 font-medium">Privacy First • GDPR</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-sm font-bold text-indigo-400">{history.length}</p>
                <p className="text-[10px] text-muted-foreground">Analisi</p>
              </div>
              <div>
                <p className="text-sm font-bold text-green-400">96%</p>
                <p className="text-[10px] text-muted-foreground">Precisione</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "scan" as Page, label: "Nuova Analisi", icon: Camera },
            { key: "results" as Page, label: "Risultati", icon: BarChart3 },
            { key: "history" as Page, label: "Storico", icon: Clock },
            { key: "trends" as Page, label: "Trend Emotivo", icon: TrendingUp },
            { key: "settings" as Page, label: "Impostazioni", icon: Settings },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                page === key ? "bg-indigo-500/10 text-indigo-400" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
            </button>
          ))}

          <div className="pt-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Ultime Emozioni</p>
            {history.slice(0, 4).map(h => (
              <div key={h.id} className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
                <span>{h.emoji}</span>
                <span className="flex-1">{h.emotion}</span>
                <span className="text-[10px]">{h.date}</span>
              </div>
            ))}
          </div>
        </nav>
      </>}>

        {/* ═══ SCAN ═══ */}
        {page === "scan" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Nuova Analisi</h2>
            <p className="text-xs text-muted-foreground mb-6">Carica o scatta una foto per l&apos;analisi AI</p>

            <div className="max-w-xl mx-auto">
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-3 mb-6 flex items-center gap-3">
                <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                <p className="text-xs text-muted-foreground"><span className="text-indigo-400 font-medium">Privacy First:</span> Analisi locale con consenso esplicito. Nessun dato conservato. GDPR compliant.</p>
              </div>

              <div className="bg-card border border-border rounded-3xl p-8 text-center">
                {!uploaded ? (
                  <>
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-5">
                      <ScanFace className="w-12 h-12 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Carica una Foto</h3>
                    <p className="text-sm text-muted-foreground mb-6">Carica un selfie o usa la webcam per un&apos;analisi facciale completa.</p>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => setUploaded(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90">
                        <Upload className="w-4 h-4" />Carica Foto
                      </button>
                      <button onClick={() => setUploaded(true)} className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-xl font-medium text-muted-foreground hover:text-foreground">
                        <Camera className="w-4 h-4" />Webcam
                      </button>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      {[
                        { l: "Emozioni", d: "7 emozioni base", icon: Smile },
                        { l: "Feature", d: "Età, sorriso, etc.", icon: Activity },
                        { l: "Confidenza", d: "Score AI (%)", icon: Zap },
                      ].map(f => (
                        <div key={f.l} className="bg-muted/30 rounded-xl p-3 text-center">
                          <f.icon className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                          <p className="text-[10px] font-bold">{f.l}</p>
                          <p className="text-[9px] text-muted-foreground">{f.d}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : analyzing ? (
                  <>
                    <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mx-auto mb-5" />
                    <h3 className="text-xl font-bold mb-2">Analisi in corso...</h3>
                    <p className="text-sm text-muted-foreground mb-4">L&apos;AI sta elaborando l&apos;immagine</p>
                    <div className="space-y-2 text-xs max-w-xs mx-auto">
                      {[
                        { step: "Rilevamento volto", done: true },
                        { step: "Estrazione landmark facciali", done: true },
                        { step: "Analisi emozioni", done: false },
                        { step: "Calcolo feature", done: false },
                      ].map((s, i) => (
                        <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${s.done ? "bg-green-500/5 text-green-400" : "bg-muted/30 text-muted-foreground"}`}>
                          {s.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                          <span>{s.step}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-44 h-44 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 mx-auto mb-5 flex items-center justify-center border-2 border-indigo-500/30">
                      <span className="text-7xl">😊</span>
                    </div>
                    <p className="text-sm text-green-400 font-medium mb-4 flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4" />Foto caricata con successo</p>
                    <div className="flex items-center gap-2 justify-center mb-5">
                      <input type="checkbox" id="consent" defaultChecked className="rounded" />
                      <label htmlFor="consent" className="text-xs text-muted-foreground">Acconsento all&apos;analisi della mia immagine</label>
                    </div>
                    <button onClick={handleAnalyze} className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 flex items-center gap-2 mx-auto">
                      <ScanFace className="w-4 h-4" />Avvia Analisi
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ RESULTS ═══ */}
        {page === "results" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Risultati Analisi</h2>
            <p className="text-xs text-muted-foreground mb-6">{showResults ? "Analisi completata con successo" : "Esegui un'analisi per visualizzare i risultati"}</p>

            {showResults ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-4">
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-bold flex items-center gap-2"><ScanFace className="w-5 h-5 text-indigo-400" />Analisi Emozioni</h3>
                      <span className="text-xs bg-green-500/15 text-green-400 px-3 py-1 rounded-full font-bold">Confidenza: 96%</span>
                    </div>
                    <div className="space-y-3">
                      {emotions.map(e => {
                        const Icon = e.icon;
                        return (
                          <div key={e.name} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: e.color + "15" }}>
                              <Icon className="w-4 h-4" style={{ color: e.color }} />
                            </div>
                            <span className="text-sm w-20 font-medium">{e.name}</span>
                            <div className="flex-1 bg-muted rounded-full h-3">
                              <div className="h-3 rounded-full flex items-center justify-end pr-1.5" style={{ width: `${Math.max(e.value, 8)}%`, backgroundColor: e.color }}>
                                {e.value > 10 && <span className="text-[8px] text-white font-bold">{e.value}%</span>}
                              </div>
                            </div>
                            <span className="text-sm font-bold w-10 text-right" style={{ color: e.color }}>{e.value}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="font-bold mb-4">Caratteristiche Rilevate</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {features.map(f => {
                        const Icon = f.icon;
                        return (
                          <div key={f.key} className="bg-muted/30 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="text-[10px] text-muted-foreground">{f.key}</span>
                            </div>
                            <p className="text-sm font-bold">{f.val}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-5 text-center">
                    <span className="text-6xl block mb-2">😊</span>
                    <p className="text-lg font-bold text-green-400">Felicità</p>
                    <p className="text-xs text-muted-foreground">Emozione dominante</p>
                    <p className="text-3xl font-black text-indigo-400 mt-2">72%</p>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-400" />AI Insights</h3>
                    <div className="space-y-2 text-xs">
                      {[
                        "L'espressione è genuina (Duchenne smile)",
                        "Microespressioni coerenti con la felicità",
                        "Nessun segnale di stress rilevato",
                        "Livello energetico: alto",
                      ].map((t, i) => (
                        <p key={i} className="flex items-start gap-1.5 text-muted-foreground">
                          <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />{t}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => { setUploaded(false); setShowResults(false); setPage("scan"); }} className="flex-1 py-2 bg-indigo-500 text-white rounded-xl text-xs font-semibold">Nuova Analisi</button>
                    <button className="px-3 py-2 bg-card border border-border rounded-xl text-xs text-muted-foreground"><Download className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-md mx-auto">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Nessun risultato disponibile</p>
                <button onClick={() => setPage("scan")} className="px-6 py-2 bg-indigo-500 text-white rounded-xl text-xs font-semibold">Esegui Analisi</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ HISTORY ═══ */}
        {page === "history" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Storico Analisi</h2>
            <p className="text-xs text-muted-foreground mb-6">{history.length} analisi effettuate</p>

            <div className="space-y-3 max-w-2xl">
              {history.map(h => (
                <div key={h.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-indigo-500/30 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: h.color + "15" }}>
                    {h.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">{h.emotion}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ color: h.color, backgroundColor: h.color + "15" }}>{h.confidence}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{h.date} alle {h.time}</p>
                  </div>
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${h.confidence}%`, backgroundColor: h.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TRENDS ═══ */}
        {page === "trends" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Trend Emotivo</h2>
            <p className="text-xs text-muted-foreground mb-6">Andamento del tuo stato emotivo nel tempo</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { l: "Emozione Media", v: "Felicità", sub: "Ultime 14 analisi", color: "#22c55e" },
                { l: "Score Medio", v: "78%", sub: "+5% vs settimana scorsa", color: "#8b5cf6" },
                { l: "Trend", v: "Positivo", sub: "In miglioramento", color: "#22c55e" },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground mb-1">{s.l}</p>
                  <p className="text-xl font-bold" style={{ color: s.color }}>{s.v}</p>
                  <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-sm mb-4">Punteggio Emotivo — 14 Giorni</h3>
              <div className="flex items-end gap-2 h-40">
                {moodTrend.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="relative w-full">
                      <div className="w-full rounded-t-lg opacity-60 group-hover:opacity-100 transition-all" style={{ height: `${v * 1.5}px`, backgroundColor: v > 80 ? "#22c55e" : v > 60 ? "#f59e0b" : "#ef4444" }} />
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border rounded px-1 py-0.5" style={{ color: v > 80 ? "#22c55e" : v > 60 ? "#f59e0b" : "#ef4444" }}>{v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-sm mb-4">Distribuzione Emozioni</h3>
              <div className="grid grid-cols-5 gap-3">
                {emotions.map(e => {
                  const Icon = e.icon;
                  return (
                    <div key={e.name} className="text-center p-3 rounded-xl" style={{ backgroundColor: e.color + "10" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-1" style={{ backgroundColor: e.color + "20" }}>
                        <Icon className="w-5 h-5" style={{ color: e.color }} />
                      </div>
                      <p className="text-xs font-bold" style={{ color: e.color }}>{e.value}%</p>
                      <p className="text-[9px] text-muted-foreground">{e.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ SETTINGS ═══ */}
        {page === "settings" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Impostazioni</h2>
            <p className="text-xs text-muted-foreground mb-6">Privacy e configurazione analisi</p>

            <div className="max-w-lg space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" />Privacy & Consenso</h3>
                <div className="space-y-3">
                  {[
                    { l: "Richiedi consenso ogni analisi", v: true },
                    { l: "Salva risultati in locale", v: true },
                    { l: "Condividi dati anonimi per ricerca", v: false },
                    { l: "Notifiche trend emotivo", v: true },
                  ].map(s => (
                    <div key={s.l} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <span className="text-sm">{s.l}</span>
                      <div className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${s.v ? "bg-indigo-500" : "bg-muted"}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${s.v ? "translate-x-5" : "translate-x-0.5"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-sm mb-3">Modello AI</h3>
                <p className="text-xs text-muted-foreground mb-3">Seleziona il modello di analisi facciale</p>
                <div className="space-y-2">
                  {["ReaFace v3.2 (Raccomandato)", "ReaFace Lite (Più veloce)", "ReaFace Pro (Più preciso)"].map((m, i) => (
                    <div key={m} className={`p-3 rounded-xl border cursor-pointer transition-colors ${i === 0 ? "border-indigo-500/40 bg-indigo-500/5" : "border-border hover:border-indigo-500/20"}`}>
                      <p className="text-xs font-medium">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
    </MobileAppLayout>
  );
}
