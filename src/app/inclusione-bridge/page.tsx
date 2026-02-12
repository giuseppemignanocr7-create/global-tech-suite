"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Accessibility, Users, Shield, Eye, Settings, UserPlus, CheckCircle2,
  AlertTriangle, Heart, Volume2, Type, Sun, Moon, Contrast, Hand, Ear,
  BookOpen, FileText, Clock, Calendar, ChevronRight, Plus, BarChart3,
  MessageSquare, Phone, Video, Globe, Sparkles, Mic, MousePointer,
  ZoomIn, Keyboard, Monitor, ArrowRight, ToggleLeft, ToggleRight
} from "lucide-react";
import MobileAppLayout from "@/components/MobileAppLayout";

/* ───────── DATA ───────── */
const delegates = [
  { id: 1, name: "Maria Bianchi", avatar: "MB", role: "Figlia", delegatedTo: "Giuseppe Bianchi", relationship: "Padre (82 anni)", permissions: ["Documenti sanitari", "Pagamenti", "Comunicazioni PA", "Prenotazioni mediche"], status: "attiva", expires: "31/12/2026", created: "01/01/2026", lastUsed: "Oggi", usageCount: 47 },
  { id: 2, name: "Roberto Verdi", avatar: "RV", role: "Caregiver professionale", delegatedTo: "Anna Verdi", relationship: "Assistita (76 anni)", permissions: ["Prenotazioni mediche", "Ritiro farmaci", "Accompagnamento visite"], status: "attiva", expires: "30/06/2026", created: "15/01/2026", lastUsed: "Ieri", usageCount: 23 },
  { id: 3, name: "Laura Neri", avatar: "LN", role: "Tutore legale", delegatedTo: "Paolo Neri", relationship: "Fratello (45 anni - disabilità)", permissions: ["Tutti i servizi"], status: "in_revisione", expires: "31/03/2026", created: "10/12/2025", lastUsed: "3 giorni fa", usageCount: 89 },
  { id: 4, name: "Francesca Stella", avatar: "FS", role: "Amministratore di sostegno", delegatedTo: "Marco Stella", relationship: "Zio (71 anni)", permissions: ["Pagamenti", "Documenti sanitari", "Gestione utenze"], status: "attiva", expires: "31/12/2026", created: "20/01/2026", lastUsed: "Oggi", usageCount: 15 },
];

const accessibilityChecks = [
  { feature: "Contrasto colori WCAG AAA", status: "pass", detail: "Rapporto minimo 7:1 su tutti gli elementi", score: 100, category: "Visivo" },
  { feature: "Navigazione da tastiera", status: "pass", detail: "Tutti gli elementi interattivi raggiungibili con Tab/Enter", score: 100, category: "Motorio" },
  { feature: "Compatibilità screen reader", status: "pass", detail: "ARIA labels, landmarks e live regions presenti", score: 100, category: "Visivo" },
  { feature: "Testo ridimensionabile", status: "pass", detail: "Supporto fino al 400% senza perdita di contenuto", score: 100, category: "Visivo" },
  { feature: "Sottotitoli e trascrizioni", status: "warning", detail: "85% dei contenuti multimediali coperti", score: 85, category: "Uditivo" },
  { feature: "Linguaggio semplificato", status: "pass", detail: "Livello B1 CEFR — Easy-to-Read certificato", score: 95, category: "Cognitivo" },
  { feature: "Tempi di interazione estesi", status: "pass", detail: "Nessun timeout automatico, pausa disponibile", score: 100, category: "Motorio" },
  { feature: "Animazioni riducibili", status: "pass", detail: "Rispetto prefers-reduced-motion", score: 100, category: "Cognitivo" },
];

const assistiveTools = [
  { name: "Lettore Vocale", desc: "Legge ad alta voce qualsiasi testo sullo schermo", icon: Volume2, color: "#8b5cf6", enabled: false },
  { name: "Ingrandimento", desc: "Lente di ingrandimento per contenuti piccoli", icon: ZoomIn, color: "#3b82f6", enabled: true },
  { name: "Navigazione Vocale", desc: "Controlla l'interfaccia con comandi vocali", icon: Mic, color: "#22c55e", enabled: false },
  { name: "Puntatore Grande", desc: "Cursore ingrandito e più visibile", icon: MousePointer, color: "#f59e0b", enabled: false },
  { name: "Tastiera Virtuale", desc: "Tastiera su schermo con tasti grandi", icon: Keyboard, color: "#ec4899", enabled: false },
  { name: "Modalità Focus", desc: "Evidenzia l'elemento attivo con bordo visibile", icon: Monitor, color: "#14b8a6", enabled: true },
];

const services = [
  { name: "Prenotazione Visite Mediche", desc: "Prenota visite e esami per la persona assistita", icon: Calendar, color: "#3b82f6", delegable: true },
  { name: "Ritiro Farmaci", desc: "Autorizza il ritiro farmaci in farmacia", icon: Heart, color: "#ef4444", delegable: true },
  { name: "Documenti Sanitari", desc: "Accesso a referti, cartella clinica, vaccinazioni", icon: FileText, color: "#22c55e", delegable: true },
  { name: "Pagamenti e Bollettini", desc: "Pagamento ticket, utenze, tributi", icon: BarChart3, color: "#f59e0b", delegable: true },
  { name: "Comunicazioni PA", desc: "Invio e ricezione comunicazioni ufficiali", icon: MessageSquare, color: "#8b5cf6", delegable: true },
  { name: "Assistenza Telefonica", desc: "Supporto dedicato con operatore formato", icon: Phone, color: "#14b8a6", delegable: false },
  { name: "Videochiamata Assistita", desc: "Collegamento video con supporto in LIS", icon: Video, color: "#ec4899", delegable: false },
  { name: "Traduzione Multilingue", desc: "Interfaccia e documenti in 12 lingue", icon: Globe, color: "#f97316", delegable: false },
];

const activityLog = [
  { action: "Prenotazione visita oculistica", delegate: "Maria Bianchi", for: "Giuseppe Bianchi", time: "Oggi, 10:30", type: "medical" },
  { action: "Ritiro farmaci - Farmacia Centrale", delegate: "Roberto Verdi", for: "Anna Verdi", time: "Ieri, 15:00", type: "pharmacy" },
  { action: "Pagamento ticket sanitario", delegate: "Francesca Stella", for: "Marco Stella", time: "Ieri, 11:20", type: "payment" },
  { action: "Download referti analisi sangue", delegate: "Laura Neri", for: "Paolo Neri", time: "3 giorni fa", type: "document" },
  { action: "Comunicazione INPS ricevuta", delegate: "Maria Bianchi", for: "Giuseppe Bianchi", time: "4 giorni fa", type: "communication" },
  { action: "Prenotazione fisioterapia", delegate: "Roberto Verdi", for: "Anna Verdi", time: "5 giorni fa", type: "medical" },
];

/* ───────── COMPONENT ───────── */
type Page = "dashboard" | "delegates" | "accessibility" | "services" | "tools" | "create" | "detail";

export default function InclusioneBridgePage() {
  const [page, setPage] = useState<Page>("dashboard");
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [selectedDelegate, setSelectedDelegate] = useState<typeof delegates[0] | null>(null);
  const [toolStates, setToolStates] = useState<Record<number, boolean>>({ 1: true, 5: true });

  const toggleTool = (i: number) => setToolStates(prev => ({ ...prev, [i]: !prev[i] }));

  const openDetail = (d: typeof delegates[0]) => { setSelectedDelegate(d); setPage("detail"); };

  const mobileNav = [
    { id: "dashboard", label: "Home", icon: BarChart3 },
    { id: "delegates", label: "Deleghe", icon: Shield },
    { id: "services", label: "Servizi", icon: Heart },
    { id: "tools", label: "Strumenti", icon: Hand },
    { id: "accessibility", label: "Report", icon: Eye },
  ];

  return (
    <div className={highContrast ? "contrast-more" : ""} style={{ fontSize: `${fontSize}px` }}>
    <MobileAppLayout appName="Inclusione Bridge" accentColor="#6366f1" navItems={mobileNav} activePage={page} onPageChange={(p) => setPage(p as Page)} sidebar={<>
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Accessibility className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">InclusioneBridge</h1>
              <p className="text-[10px] text-muted-foreground">Accessibilità & Deleghe</p>
            </div>
          </div>
        </div>

        {/* Accessibility toolbar in sidebar */}
        <div className="p-3 border-b border-border">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Accessibilità Rapida</p>
          <div className="space-y-2 px-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Type className="w-3 h-3" />Dimensione testo</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="w-6 h-6 rounded bg-muted text-xs font-bold hover:bg-indigo-500/20 hover:text-indigo-400 transition-colors">-</button>
                <span className="text-[10px] w-8 text-center text-muted-foreground">{fontSize}</span>
                <button onClick={() => setFontSize(Math.min(28, fontSize + 2))} className="w-6 h-6 rounded bg-muted text-xs font-bold hover:bg-indigo-500/20 hover:text-indigo-400 transition-colors">+</button>
              </div>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${highContrast ? "bg-yellow-500/20 text-yellow-400" : "text-muted-foreground hover:bg-muted"}`}
            >
              <span className="flex items-center gap-1.5"><Contrast className="w-3 h-3" />Alto contrasto</span>
              {highContrast ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "dashboard" as Page, label: "Panoramica", icon: BarChart3 },
            { key: "delegates" as Page, label: "Gestione Deleghe", icon: Shield, badge: delegates.length },
            { key: "services" as Page, label: "Servizi Accessibili", icon: Heart, badge: services.length },
            { key: "tools" as Page, label: "Strumenti Assistivi", icon: Hand },
            { key: "accessibility" as Page, label: "Report Accessibilità", icon: Eye },
            { key: "create" as Page, label: "Nuova Delega", icon: Plus },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                (page === key || (key === "delegates" && page === "detail"))
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 text-xs mb-1">
              <Phone className="w-3 h-3 text-indigo-400" />
              <span className="text-indigo-400 font-medium">Assistenza Dedicata</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Numero verde: <strong className="text-foreground">800 123 456</strong></p>
            <p className="text-[10px] text-muted-foreground">Supporto LIS disponibile</p>
          </div>
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">MB</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Maria Bianchi</p>
              <p className="text-[10px] text-muted-foreground">4 deleghe attive</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><Settings className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </>}>

        {/* ═══ DASHBOARD ═══ */}
        {page === "dashboard" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Panoramica</h2>
            <p className="text-sm text-muted-foreground mb-6">Gestisci deleghe e accessibilità per le persone che assisti</p>

            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Accessibility className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Benvenuta, Maria</h3>
                  <p className="text-sm text-muted-foreground mb-3">Stai gestendo deleghe per 2 persone. Tutte le deleghe sono attive e verificate.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage("services")} className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-xs font-semibold hover:bg-indigo-600">Accedi ai Servizi</button>
                    <button onClick={() => setPage("create")} className="px-4 py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground">Nuova Delega</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Deleghe Attive", value: delegates.filter(d => d.status === "attiva").length, color: "#6366f1", icon: Shield },
                { label: "In Revisione", value: delegates.filter(d => d.status === "in_revisione").length, color: "#f59e0b", icon: Clock },
                { label: "Servizi Usati", value: "6", color: "#22c55e", icon: Heart },
                { label: "Accessibilità", value: "95%", color: "#8b5cf6", icon: Eye },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: s.color + "15" }}>
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Activity + Delegates overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Attività Recente</h3>
                <div className="space-y-3">
                  {activityLog.slice(0, 5).map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.type === "medical" ? "bg-blue-500" : a.type === "pharmacy" ? "bg-red-500" : a.type === "payment" ? "bg-amber-500" : "bg-green-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{a.action}</p>
                        <p className="text-[10px] text-muted-foreground">{a.delegate} per {a.for} • {a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Persone Assistite</h3>
                  <button onClick={() => setPage("delegates")} className="text-xs text-indigo-400 hover:underline">Vedi tutte</button>
                </div>
                <div className="space-y-3">
                  {delegates.slice(0, 3).map((d, i) => (
                    <div key={i} onClick={() => openDetail(d)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">{d.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{d.delegatedTo}</p>
                        <p className="text-[10px] text-muted-foreground">{d.relationship} • {d.role}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${d.status === "attiva" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
                        {d.status === "attiva" ? "Attiva" : "Revisione"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ DELEGATES ═══ */}
        {page === "delegates" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Gestione Deleghe</h2>
                <p className="text-sm text-muted-foreground">{delegates.length} deleghe configurate</p>
              </div>
              <button onClick={() => setPage("create")} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/20">
                <Plus className="w-3.5 h-3.5" />Nuova Delega
              </button>
            </div>

            <div className="space-y-4">
              {delegates.map(d => (
                <div key={d.id} onClick={() => openDetail(d)} className="bg-card border border-border rounded-2xl p-5 hover:border-indigo-500/30 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg border border-indigo-500/20 shrink-0">{d.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{d.name}</h3>
                        <span className="text-xs bg-indigo-500/10 text-indigo-400 rounded-full px-2 py-0.5">{d.role}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.status === "attiva" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
                          {d.status === "attiva" ? "Attiva" : "In Revisione"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Delegato per: <strong className="text-foreground">{d.delegatedTo}</strong> — {d.relationship}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {d.permissions.map(p => <span key={p} className="text-[10px] bg-muted rounded-md px-2 py-0.5 text-muted-foreground">{p}</span>)}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                        <span>Scadenza: {d.expires}</span>
                        <span>Ultimo utilizzo: {d.lastUsed}</span>
                        <span>{d.usageCount} operazioni</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ DELEGATE DETAIL ═══ */}
        {page === "detail" && selectedDelegate && (
          <div className="p-6">
            <button onClick={() => setPage("delegates")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
              <ArrowLeft className="w-3 h-3" />Torna alle deleghe
            </button>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-4">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-indigo-400 font-bold text-xl border-2 border-indigo-500/20">{selectedDelegate.avatar}</div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedDelegate.name}</h2>
                      <p className="text-sm text-muted-foreground">{selectedDelegate.role} per {selectedDelegate.delegatedTo}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${selectedDelegate.status === "attiva" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
                        {selectedDelegate.status === "attiva" ? "Delega Attiva" : "In Revisione"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Persona assistita: <strong className="text-foreground">{selectedDelegate.delegatedTo}</strong> ({selectedDelegate.relationship})</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Permessi Concessi</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDelegate.permissions.map(p => (
                      <div key={p} className="flex items-center gap-2 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                        <span className="text-sm">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Attività Recente</h3>
                  <div className="space-y-3">
                    {activityLog.filter(a => a.delegate === selectedDelegate.name).slice(0, 4).map((a, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium">{a.action}</p>
                          <p className="text-[10px] text-muted-foreground">{a.time}</p>
                        </div>
                      </div>
                    ))}
                    {activityLog.filter(a => a.delegate === selectedDelegate.name).length === 0 && (
                      <p className="text-xs text-muted-foreground">Nessuna attività recente registrata</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Dettagli</h3>
                  <div className="space-y-3 text-xs">
                    {[
                      { l: "Creata il", v: selectedDelegate.created },
                      { l: "Scadenza", v: selectedDelegate.expires },
                      { l: "Ultimo utilizzo", v: selectedDelegate.lastUsed },
                      { l: "Operazioni totali", v: `${selectedDelegate.usageCount}` },
                      { l: "Stato", v: selectedDelegate.status === "attiva" ? "Attiva" : "In revisione" },
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
                    <button className="w-full py-2.5 bg-indigo-500 text-white rounded-lg text-xs font-medium hover:bg-indigo-600">Modifica Permessi</button>
                    <button className="w-full py-2.5 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground">Rinnova Delega</button>
                    <button className="w-full py-2.5 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground">Scarica Documento</button>
                    <button className="w-full py-2.5 bg-card border border-red-500/30 rounded-lg text-xs text-red-400 hover:text-red-300">Revoca Delega</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SERVICES ═══ */}
        {page === "services" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Servizi Accessibili</h2>
            <p className="text-sm text-muted-foreground mb-6">Servizi progettati per la massima accessibilità e inclusione</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:border-indigo-500/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.color + "15" }}>
                        <Icon className="w-6 h-6" style={{ color: s.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-semibold text-sm">{s.name}</h3>
                          {s.delegable && <span className="text-[10px] bg-indigo-500/10 text-indigo-400 rounded-full px-2 py-0.5">Delegabile</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{s.desc}</p>
                        <button className="px-4 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: s.color + "15", color: s.color }}>
                          Accedi al Servizio
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ ASSISTIVE TOOLS ═══ */}
        {page === "tools" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Strumenti Assistivi</h2>
            <p className="text-sm text-muted-foreground mb-6">Attiva gli strumenti per migliorare la tua esperienza</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {assistiveTools.map((t, i) => {
                const Icon = t.icon;
                const isOn = toolStates[i] || false;
                return (
                  <div key={i} className={`bg-card border rounded-2xl p-5 transition-all ${isOn ? "border-indigo-500/50 shadow-lg shadow-indigo-500/5" : "border-border"}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isOn ? "bg-indigo-500/20" : "bg-muted"}`}>
                        <Icon className={`w-6 h-6 ${isOn ? "text-indigo-400" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-0.5">{t.name}</h3>
                        <p className="text-xs text-muted-foreground">{t.desc}</p>
                      </div>
                      <button
                        onClick={() => toggleTool(i)}
                        className={`p-1 rounded-lg transition-colors ${isOn ? "text-indigo-400" : "text-muted-foreground"}`}
                      >
                        {isOn ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Profilo Assistivo Personalizzato</h3>
                  <p className="text-xs text-muted-foreground mb-3">L&apos;AI analizza le tue preferenze e suggerisce le impostazioni ottimali. Il tuo profilo attuale include ingrandimento e modalità focus.</p>
                  <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-xs font-semibold">Configura con AI</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ACCESSIBILITY REPORT ═══ */}
        {page === "accessibility" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Report Accessibilità</h2>
            <p className="text-sm text-muted-foreground mb-6">Conformità AgID / WCAG 2.1 Level AAA</p>

            {/* Score */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">95</p>
                    <p className="text-[10px] text-muted-foreground">/100</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Eccellente</h3>
                  <p className="text-sm text-muted-foreground mb-2">Livello AAA raggiunto • {accessibilityChecks.filter(c => c.status === "pass").length}/{accessibilityChecks.length} criteri pienamente conformi</p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-green-500/10 text-green-400 rounded-full px-3 py-1">WCAG 2.1 AAA</span>
                    <span className="text-xs bg-blue-500/10 text-blue-400 rounded-full px-3 py-1">AgID Conforme</span>
                    <span className="text-xs bg-purple-500/10 text-purple-400 rounded-full px-3 py-1">EN 301 549</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checks by category */}
            {["Visivo", "Motorio", "Uditivo", "Cognitivo"].map(cat => {
              const items = accessibilityChecks.filter(c => c.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} className="mb-4">
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    {cat === "Visivo" && <Eye className="w-4 h-4 text-blue-400" />}
                    {cat === "Motorio" && <Hand className="w-4 h-4 text-green-400" />}
                    {cat === "Uditivo" && <Ear className="w-4 h-4 text-purple-400" />}
                    {cat === "Cognitivo" && <BookOpen className="w-4 h-4 text-amber-400" />}
                    {cat}
                  </h3>
                  <div className="space-y-2">
                    {items.map((c, i) => (
                      <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {c.status === "pass" ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
                          <div>
                            <p className="text-sm font-medium">{c.feature}</p>
                            <p className="text-xs text-muted-foreground">{c.detail}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div className="h-2 rounded-full" style={{ width: `${c.score}%`, backgroundColor: c.score === 100 ? "#22c55e" : "#f59e0b" }} />
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium min-w-[70px] text-center ${c.status === "pass" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
                            {c.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ CREATE DELEGATE ═══ */}
        {page === "create" && (
          <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-lg font-bold mb-1">Crea Nuova Delega</h2>
            <p className="text-sm text-muted-foreground mb-6">Configura una nuova delega per assistere una persona</p>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Delega sicura e verificata</p>
                  <p className="text-xs text-muted-foreground">La delega richiede verifica dell&apos;identità di entrambe le parti tramite SPID o CIE. I dati sono protetti e cifrati.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Persona assistita *</label>
                  <input placeholder="Nome e cognome" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Codice Fiscale *</label>
                  <input placeholder="RSSMRA80A01H501Z" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Ruolo del delegato *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { role: "Figlio/a", desc: "Genitore anziano o con disabilità" },
                    { role: "Caregiver", desc: "Assistente professionale" },
                    { role: "Tutore legale", desc: "Nomina del tribunale" },
                    { role: "Amm. di sostegno", desc: "Amministrazione patrimoniale" },
                  ].map(r => (
                    <button key={r.role} className="text-left p-3 rounded-xl border border-border hover:border-indigo-500/30 transition-colors">
                      <p className="text-sm font-medium">{r.role}</p>
                      <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Permessi *</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Documenti sanitari", "Pagamenti", "Comunicazioni PA", "Prenotazioni mediche", "Ritiro farmaci", "Gestione utenze", "Accompagnamento visite", "Tutti i servizi"].map(p => (
                    <label key={p} className="flex items-center gap-2.5 p-3 rounded-xl border border-border hover:border-indigo-500/30 cursor-pointer transition-colors">
                      <input type="checkbox" className="accent-indigo-500 w-4 h-4" />
                      <span className="text-sm">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Data scadenza *</label>
                  <input type="date" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Documento allegato</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-3 text-center hover:border-indigo-500/30 cursor-pointer transition-colors h-[46px] flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Carica documento di delega</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-shadow text-base">
                Crea Delega con Verifica SPID
              </button>
            </div>
          </div>
        )}
    </MobileAppLayout>
    </div>
  );
}
