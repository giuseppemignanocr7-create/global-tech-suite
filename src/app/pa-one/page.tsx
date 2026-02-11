"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Building2, FileCheck, Clock, AlertCircle, CheckCircle2, XCircle,
  Eye, Plus, Filter, Search, ArrowUpDown, Settings, BarChart3, Users,
  FileText, Paperclip, MessageSquare, ChevronRight, Calendar, Download,
  Printer, Share2, MoreVertical, ArrowRight, Shield, Landmark, FolderOpen,
  Bell, User, Hash, Tag, CircleDot, Columns3
} from "lucide-react";
import DemoBadge from "@/components/DemoBadge";

/* ───────── DATA ───────── */
const practices = [
  { id: "PRT-2026-001", title: "Permesso di costruire - Via Roma 45", type: "Edilizia", status: "in_corso", assignee: "Arch. Bianchi", requester: "Mario Verdi", date: "08/02/2026", deadline: "08/03/2026", priority: "alta", progress: 65, docs: 4, notes: 3, desc: "Richiesta di permesso di costruire per ristrutturazione completa dell'immobile sito in Via Roma 45. L'intervento prevede il rifacimento della facciata, l'adeguamento sismico e la creazione di un nuovo piano mansardato." },
  { id: "PRT-2026-002", title: "SCIA commerciale - Bar Luna", type: "Commercio", status: "approvata", assignee: "Dott. Rossi", requester: "Elena Luna", date: "06/02/2026", deadline: "06/03/2026", priority: "media", progress: 100, docs: 6, notes: 2, desc: "Segnalazione certificata di inizio attività per apertura esercizio di somministrazione alimenti e bevande in Via Dante 12." },
  { id: "PRT-2026-003", title: "Autorizzazione paesaggistica - Lago", type: "Ambiente", status: "in_attesa", assignee: "Ing. Verdi", requester: "Carlo Lago", date: "05/02/2026", deadline: "05/04/2026", priority: "alta", progress: 35, docs: 8, notes: 5, desc: "Richiesta di autorizzazione paesaggistica per la realizzazione di una terrazza panoramica con vista lago, in area soggetta a vincolo paesaggistico." },
  { id: "PRT-2026-004", title: "Cambio destinazione d'uso - Via Manzoni", type: "Edilizia", status: "rifiutata", assignee: "Arch. Bianchi", requester: "Paolo Manzoni", date: "03/02/2026", deadline: "03/03/2026", priority: "bassa", progress: 100, docs: 3, notes: 1, desc: "Richiesta di cambio destinazione d'uso da residenziale a commerciale. Rifiutata per non conformità al PRG vigente." },
  { id: "PRT-2026-005", title: "Occupazione suolo pubblico - P.za Duomo", type: "Commercio", status: "in_corso", assignee: "Dott.ssa Neri", requester: "Rosa Bianchi", date: "01/02/2026", deadline: "01/03/2026", priority: "media", progress: 45, docs: 2, notes: 4, desc: "Richiesta di concessione per occupazione temporanea di suolo pubblico per installazione dehors estivo in Piazza Duomo." },
  { id: "PRT-2026-006", title: "Concessione edilizia ampliamento", type: "Edilizia", status: "approvata", assignee: "Arch. Bianchi", requester: "Franco Neri", date: "30/01/2026", deadline: "28/02/2026", priority: "alta", progress: 100, docs: 7, notes: 2, desc: "Concessione edilizia per ampliamento di immobile residenziale unifamiliare. Volume aggiuntivo previsto: 120 mq." },
  { id: "PRT-2026-007", title: "Autorizzazione insegna luminosa", type: "Commercio", status: "in_attesa", assignee: "Dott. Rossi", requester: "Anna Stella", date: "28/01/2026", deadline: "28/02/2026", priority: "bassa", progress: 20, docs: 2, notes: 1, desc: "Richiesta autorizzazione per installazione insegna luminosa a LED su facciata commerciale in zona centro storico." },
  { id: "PRT-2026-008", title: "VIA - Impianto fotovoltaico", type: "Ambiente", status: "in_corso", assignee: "Ing. Verdi", requester: "GreenEnergy Srl", date: "25/01/2026", deadline: "25/04/2026", priority: "alta", progress: 55, docs: 12, notes: 8, desc: "Valutazione di impatto ambientale per installazione impianto fotovoltaico da 2MW su area agricola. Procedura complessa con consultazioni pubbliche." },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  in_corso: { label: "In Corso", color: "#3b82f6", icon: Clock },
  approvata: { label: "Approvata", color: "#22c55e", icon: CheckCircle2 },
  in_attesa: { label: "In Attesa", color: "#f59e0b", icon: AlertCircle },
  rifiutata: { label: "Rifiutata", color: "#ef4444", icon: XCircle },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  alta: { label: "Alta", color: "#ef4444" },
  media: { label: "Media", color: "#f59e0b" },
  bassa: { label: "Bassa", color: "#6b7280" },
};

const auditLog = [
  { time: "10:45", action: "Documento caricato", practice: "PRT-2026-001", user: "Arch. Bianchi", detail: "Caricato documento integrativo 'Relazione strutturale rev.2.pdf'", type: "doc" },
  { time: "10:20", action: "Nota aggiunta", practice: "PRT-2026-003", user: "Ing. Verdi", detail: "Richiesto parere integrativo alla Soprintendenza Beni Culturali", type: "note" },
  { time: "09:30", action: "Stato aggiornato", practice: "PRT-2026-003", user: "Sistema", detail: "Stato cambiato da 'In Corso' a 'In Attesa' — Richiesta parere esterno", type: "status" },
  { time: "09:15", action: "Pratica assegnata", practice: "PRT-2026-005", user: "Admin", detail: "Assegnata a Dott.ssa Neri — Settore Commercio", type: "assign" },
  { time: "08:50", action: "Nuova pratica creata", practice: "PRT-2026-008", user: "Ing. Verdi", detail: "VIA - Impianto fotovoltaico GreenEnergy Srl", type: "new" },
  { time: "08:30", action: "Scadenza imminente", practice: "PRT-2026-007", user: "Sistema", detail: "Scadenza tra 17 giorni — Autorizzazione insegna luminosa", type: "alert" },
  { time: "Ieri 17:30", action: "Pratica approvata", practice: "PRT-2026-002", user: "Dott. Rossi", detail: "SCIA commerciale Bar Luna — Tutti i requisiti soddisfatti", type: "status" },
  { time: "Ieri 16:00", action: "Conferenza servizi", practice: "PRT-2026-001", user: "Arch. Bianchi", detail: "Verbale conferenza servizi allegato. Parere favorevole con prescrizioni.", type: "note" },
];

const documents = [
  { name: "Relazione strutturale rev.2.pdf", size: "2.4 MB", date: "10/02/2026", type: "PDF" },
  { name: "Planimetria catastale.dwg", size: "8.1 MB", date: "08/02/2026", type: "CAD" },
  { name: "Visura camerale.pdf", size: "340 KB", date: "07/02/2026", type: "PDF" },
  { name: "Foto stato attuale.zip", size: "15.2 MB", date: "06/02/2026", type: "ZIP" },
];

const kanbanStatuses = ["in_attesa", "in_corso", "approvata", "rifiutata"] as const;

/* ───────── COMPONENT ───────── */
type Page = "dashboard" | "list" | "kanban" | "detail" | "create" | "audit";

export default function PAOnePage() {
  const [page, setPage] = useState<Page>("dashboard");
  const [search, setSearch] = useState("");
  const [selectedPractice, setSelectedPractice] = useState<typeof practices[0] | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailTab, setDetailTab] = useState<"info" | "docs" | "timeline" | "notes">("info");

  const filtered = practices.filter((p) => {
    const matchSearch = search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openDetail = (p: typeof practices[0]) => { setSelectedPractice(p); setDetailTab("info"); setPage("detail"); };

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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">PA.ONE</h1>
              <p className="text-[10px] text-muted-foreground">Gestione Pratiche PA</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "dashboard" as Page, label: "Dashboard", icon: BarChart3 },
            { key: "list" as Page, label: "Pratiche", icon: FolderOpen, badge: practices.length },
            { key: "create" as Page, label: "Nuova Pratica", icon: Plus },
            { key: "audit" as Page, label: "Audit Trail", icon: Eye },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                (page === key || (key === "list" && (page === "detail" || page === "kanban")))
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge && <span className="text-[10px] bg-blue-500/20 text-blue-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}

          <div className="pt-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Filtro Stato</p>
            <button onClick={() => { setStatusFilter("all"); setPage("list"); }} className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${statusFilter === "all" ? "bg-blue-500/10 text-blue-400" : "text-muted-foreground hover:bg-muted"}`}>
              <CircleDot className="w-3 h-3" /><span className="flex-1 text-left">Tutte</span><span className="text-[10px]">{practices.length}</span>
            </button>
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const count = practices.filter(p => p.status === key).length;
              return (
                <button key={key} onClick={() => { setStatusFilter(key); setPage("list"); }} className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${statusFilter === key ? "bg-blue-500/10 text-blue-400" : "text-muted-foreground hover:bg-muted"}`}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="flex-1 text-left">{cfg.label}</span><span className="text-[10px]">{count}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center text-xs font-bold text-blue-400">AB</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Arch. Bianchi</p>
              <p className="text-[10px] text-muted-foreground">Settore Edilizia</p>
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Dashboard</h2>
                <p className="text-xs text-muted-foreground">Panoramica pratiche — Febbraio 2026</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-card border border-border rounded-lg text-xs text-muted-foreground flex items-center gap-1"><Download className="w-3 h-3" />Esporta</button>
                <button className="px-3 py-1.5 bg-card border border-border rounded-lg text-xs text-muted-foreground flex items-center gap-1"><Printer className="w-3 h-3" />Stampa</button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {Object.entries(statusConfig).map(([key, cfg]) => {
                const count = practices.filter(p => p.status === key).length;
                const Icon = cfg.icon;
                return (
                  <div key={key} onClick={() => { setStatusFilter(key); setPage("list"); }} className="bg-card border border-border rounded-xl p-5 hover:border-blue-500/30 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cfg.color + "15" }}>
                        <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-3xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{cfg.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Activity + Deadlines */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Attività Recenti</h3>
                <div className="space-y-3">
                  {auditLog.slice(0, 5).map((log, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${log.type === "status" ? "bg-blue-500" : log.type === "doc" ? "bg-green-500" : log.type === "alert" ? "bg-amber-500" : "bg-purple-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs"><strong>{log.action}</strong> — <span className="text-muted-foreground">{log.practice}</span></p>
                        <p className="text-[10px] text-muted-foreground">{log.user} • {log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Scadenze Prossime</h3>
                <div className="space-y-3">
                  {practices.filter(p => p.status !== "approvata" && p.status !== "rifiutata").sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 5).map((p, i) => {
                    const pCfg = priorityConfig[p.priority];
                    return (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => openDetail(p)}>
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pCfg.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{p.title}</p>
                          <p className="text-[10px] text-muted-foreground">{p.id}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">{p.deadline}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* By type breakdown */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-4">Distribuzione per Tipo</h3>
              <div className="grid grid-cols-3 gap-4">
                {["Edilizia", "Commercio", "Ambiente"].map(type => {
                  const count = practices.filter(p => p.type === type).length;
                  const pct = Math.round((count / practices.length) * 100);
                  const colors: Record<string, string> = { Edilizia: "#3b82f6", Commercio: "#8b5cf6", Ambiente: "#22c55e" };
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors[type] + "15" }}>
                        <span className="text-sm font-bold" style={{ color: colors[type] }}>{count}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">{type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-muted rounded-full h-1.5">
                            <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: colors[type] }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground">{pct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ LIST / KANBAN VIEW ═══ */}
        {page === "list" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">Pratiche</h2>
                <p className="text-xs text-muted-foreground">{filtered.length} risultati</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg border ${viewMode === "list" ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "border-border text-muted-foreground"}`}><FileCheck className="w-4 h-4" /></button>
                <button onClick={() => setViewMode("kanban")} className={`p-2 rounded-lg border ${viewMode === "kanban" ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "border-border text-muted-foreground"}`}><Columns3 className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Search */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca per ID, titolo, tipo..." className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
              </div>
            </div>

            {viewMode === "list" && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-left bg-muted/30">
                      <th className="px-4 py-3 font-medium text-xs">ID</th>
                      <th className="px-4 py-3 font-medium text-xs">Pratica</th>
                      <th className="px-4 py-3 font-medium text-xs">Tipo</th>
                      <th className="px-4 py-3 font-medium text-xs">Stato</th>
                      <th className="px-4 py-3 font-medium text-xs">Priorità</th>
                      <th className="px-4 py-3 font-medium text-xs">Avanzamento</th>
                      <th className="px-4 py-3 font-medium text-xs">Assegnatario</th>
                      <th className="px-4 py-3 font-medium text-xs">Scadenza</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => {
                      const st = statusConfig[p.status];
                      const pr = priorityConfig[p.priority];
                      const StIcon = st.icon;
                      return (
                        <tr key={p.id} onClick={() => openDetail(p)} className="border-b border-border/50 hover:bg-blue-500/5 cursor-pointer transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-blue-400">{p.id}</td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-sm">{p.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                              <span className="flex items-center gap-0.5"><Paperclip className="w-2.5 h-2.5" />{p.docs}</span>
                              <span className="flex items-center gap-0.5"><MessageSquare className="w-2.5 h-2.5" />{p.notes}</span>
                            </p>
                          </td>
                          <td className="px-4 py-3"><span className="text-xs bg-muted rounded-md px-2 py-0.5">{p.type}</span></td>
                          <td className="px-4 py-3"><span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: st.color }}><StIcon className="w-3.5 h-3.5" />{st.label}</span></td>
                          <td className="px-4 py-3"><span className="text-xs font-medium" style={{ color: pr.color }}>{pr.label}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{ width: `${p.progress}%`, backgroundColor: st.color }} /></div>
                              <span className="text-[10px] text-muted-foreground">{p.progress}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{p.assignee}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{p.deadline}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {viewMode === "kanban" && (
              <div className="grid grid-cols-4 gap-4">
                {kanbanStatuses.map(status => {
                  const cfg = statusConfig[status];
                  const items = filtered.filter(p => p.status === status);
                  return (
                    <div key={status}>
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                        <span className="text-xs font-semibold">{cfg.label}</span>
                        <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">{items.length}</span>
                      </div>
                      <div className="space-y-2">
                        {items.map(p => {
                          const pr = priorityConfig[p.priority];
                          return (
                            <div key={p.id} onClick={() => openDetail(p)} className="bg-card border border-border rounded-xl p-3 hover:border-blue-500/30 cursor-pointer transition-colors">
                              <p className="font-mono text-[10px] text-blue-400 mb-1">{p.id}</p>
                              <p className="text-xs font-medium mb-2 leading-relaxed">{p.title}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-medium" style={{ color: pr.color }}>{pr.label}</span>
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                  <span className="flex items-center gap-0.5"><Paperclip className="w-2.5 h-2.5" />{p.docs}</span>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 bg-muted rounded-full h-1"><div className="h-1 rounded-full" style={{ width: `${p.progress}%`, backgroundColor: cfg.color }} /></div>
                                <span className="text-[10px] text-muted-foreground">{p.progress}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ PRACTICE DETAIL ═══ */}
        {page === "detail" && selectedPractice && (
          <div className="p-6">
            <button onClick={() => setPage("list")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
              <ArrowLeft className="w-3 h-3" />Torna alle pratiche
            </button>

            {/* Header */}
            <div className="bg-card border border-border rounded-xl p-5 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs bg-blue-500/10 text-blue-400 rounded-md px-2 py-1">{selectedPractice.id}</span>
                    <span className="text-xs rounded-md px-2 py-0.5" style={{ backgroundColor: statusConfig[selectedPractice.status].color + "15", color: statusConfig[selectedPractice.status].color }}>
                      {statusConfig[selectedPractice.status].label}
                    </span>
                    <span className="text-xs rounded-md px-2 py-0.5" style={{ color: priorityConfig[selectedPractice.priority].color }}>
                      Priorità {priorityConfig[selectedPractice.priority].label}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-1">{selectedPractice.title}</h2>
                  <p className="text-xs text-muted-foreground">Tipo: {selectedPractice.type} • Creata il {selectedPractice.date} • Scadenza {selectedPractice.deadline}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground"><Share2 className="w-4 h-4" /></button>
                  <button className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground"><Printer className="w-4 h-4" /></button>
                  <button className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground"><MoreVertical className="w-4 h-4" /></button>
                </div>
              </div>
              {/* Progress */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Avanzamento pratica</span>
                  <span className="font-medium">{selectedPractice.progress}%</span>
                </div>
                <div className="bg-muted rounded-full h-2.5">
                  <div className="h-2.5 rounded-full transition-all" style={{ width: `${selectedPractice.progress}%`, backgroundColor: statusConfig[selectedPractice.status].color }} />
                </div>
              </div>
            </div>

            {/* Detail tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { key: "info" as const, label: "Informazioni", icon: FileText },
                { key: "docs" as const, label: `Documenti (${selectedPractice.docs})`, icon: Paperclip },
                { key: "timeline" as const, label: "Timeline", icon: Clock },
                { key: "notes" as const, label: `Note (${selectedPractice.notes})`, icon: MessageSquare },
              ].map(t => (
                <button key={t.key} onClick={() => setDetailTab(t.key)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${detailTab === t.key ? "bg-blue-500/10 text-blue-400 border border-blue-500/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
                  <t.icon className="w-3.5 h-3.5" />{t.label}
                </button>
              ))}
            </div>

            {detailTab === "info" && (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-4">
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-2">Descrizione</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedPractice.desc}</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-3">Fasi della Pratica</h3>
                    <div className="space-y-3">
                      {["Ricezione richiesta", "Verifica documentale", "Istruttoria tecnica", "Conferenza servizi", "Provvedimento finale"].map((phase, i) => {
                        const done = i < Math.ceil(selectedPractice.progress / 25);
                        const current = i === Math.ceil(selectedPractice.progress / 25) - 1;
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${done ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}>
                              {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                            </div>
                            <span className={`text-sm ${current ? "font-semibold text-blue-400" : done ? "text-foreground" : "text-muted-foreground"}`}>{phase}</span>
                            {current && <span className="text-[10px] bg-blue-500/10 text-blue-400 rounded-full px-2 py-0.5">In corso</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-3">Dettagli</h3>
                    <div className="space-y-3 text-xs">
                      {[
                        { label: "Richiedente", value: selectedPractice.requester },
                        { label: "Assegnatario", value: selectedPractice.assignee },
                        { label: "Tipo", value: selectedPractice.type },
                        { label: "Data creazione", value: selectedPractice.date },
                        { label: "Scadenza", value: selectedPractice.deadline },
                        { label: "Documenti", value: `${selectedPractice.docs} allegati` },
                      ].map(d => (
                        <div key={d.label} className="flex justify-between">
                          <span className="text-muted-foreground">{d.label}</span>
                          <span className="font-medium">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-3">Azioni</h3>
                    <div className="space-y-2">
                      <button className="w-full py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600">Aggiorna Stato</button>
                      <button className="w-full py-2 bg-card border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground">Carica Documento</button>
                      <button className="w-full py-2 bg-card border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground">Aggiungi Nota</button>
                      <button className="w-full py-2 bg-card border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground">Riassegna</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {detailTab === "docs" && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <span className="text-sm font-medium">Documenti allegati</span>
                  <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1"><Plus className="w-3 h-3" />Carica</button>
                </div>
                {documents.map((d, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border/50 hover:bg-blue-500/5 cursor-pointer transition-colors">
                    <FileText className="w-8 h-8 text-blue-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{d.name}</p>
                      <p className="text-[10px] text-muted-foreground">{d.size} • {d.date}</p>
                    </div>
                    <span className="text-[10px] bg-muted rounded-md px-2 py-0.5">{d.type}</span>
                    <button className="p-1.5 rounded hover:bg-muted"><Download className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  </div>
                ))}
              </div>
            )}

            {detailTab === "timeline" && (
              <div className="max-w-2xl">
                <div className="space-y-0">
                  {auditLog.filter(l => l.practice === selectedPractice.id || true).slice(0, 6).map((log, i) => (
                    <div key={i} className="flex gap-4 pb-4 relative">
                      {i < 5 && <div className="absolute left-[7px] top-6 bottom-0 w-px bg-border" />}
                      <div className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 border-2 ${log.type === "status" ? "border-blue-500 bg-blue-500/30" : log.type === "doc" ? "border-green-500 bg-green-500/30" : log.type === "alert" ? "border-amber-500 bg-amber-500/30" : "border-purple-500 bg-purple-500/30"}`} />
                      <div className="flex-1 bg-card border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{log.action}</span>
                          <span className="text-xs text-muted-foreground">{log.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{log.detail}</p>
                        <p className="text-xs text-blue-400 mt-1">{log.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detailTab === "notes" && (
              <div className="max-w-2xl space-y-3">
                {[
                  { user: "Arch. Bianchi", text: "Convocata conferenza servizi per il 15/02. Presenti: Comune, ASL, VVF.", date: "10/02/2026 10:20" },
                  { user: "Ing. Verdi", text: "Richiesta integrazione documentale al richiedente. Scadenza integrazioni: 20/02.", date: "08/02/2026 15:30" },
                  { user: "Sistema", text: "Pratica assegnata automaticamente in base alla competenza territoriale.", date: "06/02/2026 09:00" },
                ].map((n, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-blue-400">{n.user}</span>
                      <span className="text-[10px] text-muted-foreground">{n.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{n.text}</p>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input placeholder="Aggiungi una nota..." className="flex-1 px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                  <button className="px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600">Invia</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ CREATE ═══ */}
        {page === "create" && (
          <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-lg font-bold mb-1">Nuova Pratica</h2>
            <p className="text-xs text-muted-foreground mb-6">Compila i dati per avviare una nuova pratica</p>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Tipo pratica</label>
                  <select className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                    <option>Edilizia</option><option>Commercio</option><option>Ambiente</option><option>Urbanistica</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Priorità</label>
                  <select className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                    <option>Alta</option><option>Media</option><option>Bassa</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Oggetto della pratica</label>
                <input placeholder="Es. Permesso di costruire - Via Roma 45" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Descrizione dettagliata</label>
                <textarea rows={4} placeholder="Descrizione completa della pratica..." className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Richiedente</label>
                  <input placeholder="Nome e cognome" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Assegna a</label>
                  <select className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                    <option>Arch. Bianchi</option><option>Dott. Rossi</option><option>Ing. Verdi</option><option>Dott.ssa Neri</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Allegati</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-blue-500/30 cursor-pointer transition-colors">
                  <Paperclip className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Trascina i file qui o clicca per caricare</p>
                  <p className="text-[10px] text-muted-foreground mt-1">PDF, DWG, ZIP — max 50MB</p>
                </div>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow">
                Crea Pratica
              </button>
            </div>
          </div>
        )}

        {/* ═══ AUDIT TRAIL ═══ */}
        {page === "audit" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Audit Trail</h2>
                <p className="text-xs text-muted-foreground">Registro completo delle operazioni</p>
              </div>
              <div className="flex gap-2">
                <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 text-muted-foreground">
                  <option>Tutte le azioni</option><option>Stato</option><option>Documenti</option><option>Assegnazioni</option>
                </select>
                <button className="px-3 py-1.5 bg-card border border-border rounded-lg text-xs text-muted-foreground flex items-center gap-1"><Download className="w-3 h-3" />Esporta</button>
              </div>
            </div>

            <div className="max-w-3xl space-y-0">
              {auditLog.map((log, i) => (
                <div key={i} className="flex gap-4 pb-4 relative">
                  {i < auditLog.length - 1 && <div className="absolute left-[7px] top-6 bottom-0 w-px bg-border" />}
                  <div className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 border-2 ${
                    log.type === "status" ? "border-blue-500 bg-blue-500/30" :
                    log.type === "doc" ? "border-green-500 bg-green-500/30" :
                    log.type === "new" ? "border-purple-500 bg-purple-500/30" :
                    log.type === "assign" ? "border-indigo-500 bg-indigo-500/30" :
                    log.type === "alert" ? "border-amber-500 bg-amber-500/30" :
                    "border-gray-500 bg-gray-500/30"
                  }`} />
                  <div className="flex-1 bg-card border border-border rounded-xl p-4 hover:border-blue-500/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{log.action}</span>
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 rounded-md px-1.5 py-0.5">{log.practice}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{log.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{log.detail}</p>
                    <p className="text-xs text-blue-400 mt-1 flex items-center gap-1"><User className="w-3 h-3" />{log.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
