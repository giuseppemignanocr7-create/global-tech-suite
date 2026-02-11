"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, FileText, FilePlus, PenTool, Search, Download, Eye, CheckCircle2,
  Clock, FileSignature, Settings, Plus, BarChart3, FolderOpen, Users, Send,
  Printer, Share2, MoreVertical, Copy, Trash2, Edit3, Sparkles, Shield,
  ChevronRight, Upload, Tag, Star, Zap, BookOpen
} from "lucide-react";
import DemoBadge from "@/components/DemoBadge";

/* ───────── DATA ───────── */
const templates = [
  { id: 1, name: "Contratto di Lavoro", category: "HR", uses: 1240, fields: 12, desc: "Contratto subordinato standard con clausole personalizzabili", icon: "📋", popular: true },
  { id: 2, name: "NDA - Riservatezza", category: "Legale", uses: 890, fields: 8, desc: "Accordo di non divulgazione bilaterale", icon: "🔒", popular: true },
  { id: 3, name: "Fattura Professionale", category: "Finanza", uses: 2100, fields: 15, desc: "Fattura con calcolo automatico IVA e ritenuta", icon: "💰", popular: true },
  { id: 4, name: "Lettera di Incarico", category: "Legale", uses: 560, fields: 6, desc: "Conferimento incarico professionale", icon: "✉️", popular: false },
  { id: 5, name: "Verbale di Riunione", category: "Aziendale", uses: 1800, fields: 5, desc: "Modello standard per verbali CDA e assemblee", icon: "📝", popular: true },
  { id: 6, name: "Preventivo Servizi", category: "Commerciale", uses: 980, fields: 10, desc: "Preventivo dettagliato con voci e totali", icon: "📊", popular: false },
  { id: 7, name: "Contratto di Locazione", category: "Immobiliare", uses: 670, fields: 18, desc: "Contratto 4+4, 3+2 o transitorio", icon: "🏠", popular: false },
  { id: 8, name: "Procura Speciale", category: "Legale", uses: 340, fields: 7, desc: "Delega per atti specifici", icon: "⚖️", popular: false },
];

const documents = [
  { id: 1, name: "Contratto Mario Rossi", template: "Contratto di Lavoro", status: "firmato", date: "10/02/2026", signers: ["Mario Rossi", "Elena Bianchi"], signedBy: 2, size: "245 KB", pages: 8 },
  { id: 2, name: "NDA Progetto Alpha", template: "NDA - Riservatezza", status: "in_attesa", date: "09/02/2026", signers: ["Marco Verdi", "Sara Neri", "Luca Blu"], signedBy: 1, size: "120 KB", pages: 4 },
  { id: 3, name: "Fattura #2026-045", template: "Fattura Professionale", status: "bozza", date: "08/02/2026", signers: ["Admin"], signedBy: 0, size: "89 KB", pages: 2 },
  { id: 4, name: "Verbale CDA Febbraio", template: "Verbale di Riunione", status: "firmato", date: "07/02/2026", signers: ["A. Colombo", "B. Ferrari", "C. Ricci", "D. Moretti", "E. Barbieri"], signedBy: 5, size: "310 KB", pages: 6 },
  { id: 5, name: "Preventivo Cliente XYZ", template: "Preventivo Servizi", status: "in_attesa", date: "06/02/2026", signers: ["Franco Stella", "Admin"], signedBy: 1, size: "156 KB", pages: 3 },
  { id: 6, name: "Locazione Via Dante 8", template: "Contratto di Locazione", status: "bozza", date: "05/02/2026", signers: ["Paolo Neri", "Anna Verdi"], signedBy: 0, size: "420 KB", pages: 12 },
  { id: 7, name: "Incarico Avv. Colombo", template: "Lettera di Incarico", status: "firmato", date: "04/02/2026", signers: ["Avv. Colombo"], signedBy: 1, size: "78 KB", pages: 2 },
];

const statusMap: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  firmato: { label: "Firmato", color: "#22c55e", icon: CheckCircle2 },
  in_attesa: { label: "In Attesa Firma", color: "#f59e0b", icon: Clock },
  bozza: { label: "Bozza", color: "#6b7280", icon: Edit3 },
};

const recentActivity = [
  { action: "Documento firmato", doc: "Contratto Mario Rossi", user: "Elena Bianchi", time: "10 min fa" },
  { action: "Firma richiesta", doc: "NDA Progetto Alpha", user: "Tu", time: "2 ore fa" },
  { action: "Bozza creata", doc: "Fattura #2026-045", user: "Tu", time: "Ieri" },
  { action: "Tutte le firme raccolte", doc: "Verbale CDA Febbraio", user: "Sistema", time: "Ieri" },
  { action: "Documento condiviso", doc: "Preventivo Cliente XYZ", user: "Tu", time: "2 giorni fa" },
];

/* ───────── COMPONENT ───────── */
type Page = "dashboard" | "documents" | "templates" | "create" | "preview";

export default function DocFacilePage() {
  const [page, setPage] = useState<Page>("dashboard");
  const [search, setSearch] = useState("");
  const [step, setStep] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<typeof documents[0] | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [docFilter, setDocFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");

  const filteredDocs = documents.filter(d => {
    if (docFilter !== "all" && d.status !== docFilter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const categories = Array.from(new Set(templates.map(t => t.category)));
  const filteredTemplates = templates.filter(t => templateFilter === "all" || t.category === templateFilter);

  const openPreview = (d: typeof documents[0]) => { setSelectedDoc(d); setPage("preview"); };

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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <FileSignature className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">DocFacile</h1>
              <p className="text-[10px] text-muted-foreground">Documenti Intelligenti</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Principale</p>
          {[
            { key: "dashboard" as Page, label: "Dashboard", icon: BarChart3 },
            { key: "documents" as Page, label: "Documenti", icon: FolderOpen, badge: documents.length },
            { key: "templates" as Page, label: "Template", icon: BookOpen, badge: templates.length },
            { key: "create" as Page, label: "Crea Documento", icon: Plus },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => { setPage(key); if (key === "create") setStep(0); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                (page === key || (key === "documents" && page === "preview"))
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}

          <div className="pt-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Stato Documenti</p>
            {Object.entries(statusMap).map(([key, cfg]) => {
              const count = documents.filter(d => d.status === key).length;
              return (
                <button key={key} onClick={() => { setDocFilter(key); setPage("documents"); }} className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${docFilter === key && page === "documents" ? "bg-emerald-500/10 text-emerald-400" : "text-muted-foreground hover:bg-muted"}`}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="flex-1 text-left">{cfg.label}</span><span className="text-[10px]">{count}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Spazio usato</span>
              <span className="text-emerald-400 font-medium">1.4 GB / 5 GB</span>
            </div>
            <div className="bg-muted rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: "28%" }} />
            </div>
          </div>
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">MR</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Mario Rossi</p>
              <p className="text-[10px] text-muted-foreground">Piano Pro</p>
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
            <p className="text-xs text-muted-foreground mb-6">Panoramica dei tuoi documenti</p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Totale", value: documents.length, color: "#10b981", icon: FileText },
                { label: "Firmati", value: documents.filter(d => d.status === "firmato").length, color: "#22c55e", icon: CheckCircle2 },
                { label: "In Attesa", value: documents.filter(d => d.status === "in_attesa").length, color: "#f59e0b", icon: Clock },
                { label: "Bozze", value: documents.filter(d => d.status === "bozza").length, color: "#6b7280", icon: Edit3 },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-emerald-500/30 transition-colors cursor-pointer" onClick={() => { setDocFilter(i === 0 ? "all" : Object.keys(statusMap)[i - 1]); setPage("documents"); }}>
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

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Quick actions */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Azioni Rapide</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Nuovo Documento", icon: Plus, color: "#10b981", action: () => { setPage("create"); setStep(0); } },
                    { label: "Da Template", icon: BookOpen, color: "#3b82f6", action: () => setPage("templates") },
                    { label: "Carica PDF", icon: Upload, color: "#8b5cf6", action: () => {} },
                    { label: "AI Genera", icon: Sparkles, color: "#f59e0b", action: () => {} },
                  ].map((a, i) => (
                    <button key={i} onClick={a.action} className="p-3 rounded-xl border border-border hover:border-emerald-500/30 transition-colors text-center">
                      <a.icon className="w-5 h-5 mx-auto mb-1" style={{ color: a.color }} />
                      <p className="text-[10px] font-medium">{a.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent activity */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Attività Recente</h3>
                <div className="space-y-3">
                  {recentActivity.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs"><strong>{a.action}</strong></p>
                        <p className="text-[10px] text-muted-foreground">{a.doc} • {a.user} • {a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular templates */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Template Popolari</h3>
                <button onClick={() => setPage("templates")} className="text-xs text-emerald-400 hover:underline">Vedi tutti</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {templates.filter(t => t.popular).map(t => (
                  <div key={t.id} onClick={() => { setSelectedTemplate(t); setStep(0); setPage("create"); }} className="p-4 rounded-xl border border-border hover:border-emerald-500/30 cursor-pointer transition-colors text-center">
                    <span className="text-2xl">{t.icon}</span>
                    <p className="text-xs font-medium mt-2">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.uses.toLocaleString()} utilizzi</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ DOCUMENTS ═══ */}
        {page === "documents" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">I Miei Documenti</h2>
                <p className="text-xs text-muted-foreground">{filteredDocs.length} documenti</p>
              </div>
              <button onClick={() => { setPage("create"); setStep(0); }} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                <Plus className="w-3.5 h-3.5" />Nuovo
              </button>
            </div>

            {/* Search & filters */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca documenti..." className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => setDocFilter("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${docFilter === "all" ? "bg-emerald-500 text-white" : "bg-card border border-border text-muted-foreground"}`}>Tutti</button>
                {Object.entries(statusMap).map(([k, v]) => (
                  <button key={k} onClick={() => setDocFilter(k)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${docFilter === k ? "bg-emerald-500 text-white" : "bg-card border border-border text-muted-foreground"}`}>{v.label}</button>
                ))}
              </div>
            </div>

            {/* Documents grid */}
            <div className="space-y-2">
              {filteredDocs.map(d => {
                const st = statusMap[d.status];
                const StIcon = st.icon;
                return (
                  <div key={d.id} onClick={() => openPreview(d)} className="bg-card border border-border rounded-xl p-4 hover:border-emerald-500/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-14 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-semibold text-sm truncate">{d.name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ color: st.color, backgroundColor: st.color + "15" }}>
                            <StIcon className="w-3 h-3 inline mr-0.5" />{st.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{d.template} • {d.pages} pagine • {d.size}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 mb-1">
                          {d.signers.map((s, i) => (
                            <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold -ml-1 first:ml-0 border-2 border-card ${i < d.signedBy ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                              {s.split(" ").map(n => n[0]).join("")}
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground">{d.signedBy}/{d.signers.length} firme • {d.date}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={e => { e.stopPropagation(); }} className="p-1.5 rounded hover:bg-muted"><Download className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={e => { e.stopPropagation(); }} className="p-1.5 rounded hover:bg-muted"><Share2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={e => { e.stopPropagation(); }} className="p-1.5 rounded hover:bg-muted"><MoreVertical className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ DOCUMENT PREVIEW ═══ */}
        {page === "preview" && selectedDoc && (
          <div className="p-6">
            <button onClick={() => setPage("documents")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
              <ArrowLeft className="w-3 h-3" />Torna ai documenti
            </button>

            <div className="grid grid-cols-3 gap-4">
              {/* PDF Preview */}
              <div className="col-span-2">
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium">{selectedDoc.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-muted"><Printer className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      <button className="p-1.5 rounded hover:bg-muted"><Download className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      <button className="p-1.5 rounded hover:bg-muted"><Share2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    </div>
                  </div>
                  {/* Simulated PDF preview */}
                  <div className="bg-white p-8 min-h-[600px]">
                    <div className="max-w-md mx-auto">
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <FileSignature className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{selectedDoc.template}</h3>
                        <p className="text-xs text-gray-500">Documento #{selectedDoc.id} — {selectedDoc.date}</p>
                      </div>
                      <div className="space-y-4 text-sm text-gray-700">
                        <div className="h-3 bg-gray-100 rounded w-full" />
                        <div className="h-3 bg-gray-100 rounded w-5/6" />
                        <div className="h-3 bg-gray-100 rounded w-full" />
                        <div className="h-3 bg-gray-100 rounded w-4/6" />
                        <div className="h-6" />
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                          <div className="h-3 bg-gray-100 rounded w-5/6" />
                        </div>
                        <div className="h-6" />
                        <div className="h-3 bg-gray-100 rounded w-full" />
                        <div className="h-3 bg-gray-100 rounded w-2/3" />
                        <div className="h-12" />
                        <div className="border-t border-gray-200 pt-4 flex justify-between">
                          {selectedDoc.signers.map((s, i) => (
                            <div key={i} className="text-center">
                              <div className={`w-20 h-8 rounded border-b-2 mb-1 ${i < selectedDoc.signedBy ? "border-green-400" : "border-dashed border-gray-300"}`}>
                                {i < selectedDoc.signedBy && <span className="text-[10px] text-green-600 italic">Firmato</span>}
                              </div>
                              <p className="text-[10px] text-gray-500">{s}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 border-t border-border text-center text-[10px] text-muted-foreground bg-muted/30">
                    Pagina 1 di {selectedDoc.pages}
                  </div>
                </div>
              </div>

              {/* Sidebar info */}
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Dettagli</h3>
                  <div className="space-y-3 text-xs">
                    {[
                      { l: "Nome", v: selectedDoc.name },
                      { l: "Template", v: selectedDoc.template },
                      { l: "Data", v: selectedDoc.date },
                      { l: "Pagine", v: `${selectedDoc.pages}` },
                      { l: "Dimensione", v: selectedDoc.size },
                      { l: "Stato", v: statusMap[selectedDoc.status].label },
                    ].map(d => (
                      <div key={d.l} className="flex justify-between">
                        <span className="text-muted-foreground">{d.l}</span>
                        <span className="font-medium">{d.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Firmatari ({selectedDoc.signedBy}/{selectedDoc.signers.length})</h3>
                  <div className="space-y-2">
                    {selectedDoc.signers.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${i < selectedDoc.signedBy ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                          {s.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium">{s}</p>
                          <p className="text-[10px]" style={{ color: i < selectedDoc.signedBy ? "#22c55e" : "#f59e0b" }}>
                            {i < selectedDoc.signedBy ? "Firmato" : "In attesa"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Azioni</h3>
                  <div className="space-y-2">
                    <button className="w-full py-2 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600">Invia Promemoria Firma</button>
                    <button className="w-full py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"><Download className="w-3 h-3" />Scarica PDF</button>
                    <button className="w-full py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"><Copy className="w-3 h-3" />Duplica</button>
                    <button className="w-full py-2 bg-card border border-border rounded-lg text-xs text-red-400 hover:text-red-300 flex items-center justify-center gap-1"><Trash2 className="w-3 h-3" />Elimina</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ TEMPLATES ═══ */}
        {page === "templates" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Libreria Template</h2>
            <p className="text-xs text-muted-foreground mb-6">{templates.length} template disponibili</p>

            <div className="flex gap-2 mb-6">
              <button onClick={() => setTemplateFilter("all")} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${templateFilter === "all" ? "bg-emerald-500 text-white" : "bg-card border border-border text-muted-foreground"}`}>Tutti</button>
              {categories.map(c => (
                <button key={c} onClick={() => setTemplateFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${templateFilter === c ? "bg-emerald-500 text-white" : "bg-card border border-border text-muted-foreground"}`}>{c}</button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(t => (
                <div key={t.id} className="bg-card border border-border rounded-2xl p-5 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{t.icon}</span>
                    <div className="flex items-center gap-1">
                      {t.popular && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                      <span className="text-[10px] bg-muted rounded-full px-2 py-0.5 text-muted-foreground">{t.category}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{t.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{t.desc}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
                    <span>{t.fields} campi</span>
                    <span>{t.uses.toLocaleString()} utilizzi</span>
                  </div>
                  <button onClick={() => { setSelectedTemplate(t); setStep(0); setPage("create"); }} className="w-full py-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs font-semibold hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3" />Usa Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ CREATE DOCUMENT ═══ */}
        {page === "create" && (
          <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-lg font-bold mb-1">Crea Documento</h2>
            <p className="text-xs text-muted-foreground mb-6">
              {selectedTemplate ? `Template: ${selectedTemplate.name}` : "Segui i passaggi per creare il tuo documento"}
            </p>

            {/* Steps */}
            <div className="flex items-center gap-0 mb-8">
              {["Scegli Template", "Compila Campi", "Anteprima", "Firma", "Completato"].map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-emerald-500 text-white ring-4 ring-emerald-500/20" : "bg-muted text-muted-foreground"}`}>
                      {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-[10px] mt-1 ${i <= step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                  </div>
                  {i < 4 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-emerald-500" : "bg-border"}`} />}
                </div>
              ))}
            </div>

            {step === 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Scegli un Template</h3>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map(t => (
                    <button key={t.id} onClick={() => { setSelectedTemplate(t); setStep(1); }} className={`text-left p-4 rounded-xl border transition-all ${selectedTemplate?.id === t.id ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:border-emerald-500/30"}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{t.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{t.name}</p>
                          <p className="text-[10px] text-muted-foreground">{t.fields} campi • {t.category}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{selectedTemplate?.icon}</span>
                  <h3 className="font-semibold">{selectedTemplate?.name} — Compila i Campi</h3>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">I campi contrassegnati con * sono obbligatori. L&apos;AI può autocompletare i campi basandosi sui tuoi dati precedenti.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium block mb-1">Nome *</label><input defaultValue="Mario" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40" /></div>
                  <div><label className="text-sm font-medium block mb-1">Cognome *</label><input defaultValue="Rossi" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40" /></div>
                  <div><label className="text-sm font-medium block mb-1">Ruolo *</label><input defaultValue="Sviluppatore Senior" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40" /></div>
                  <div><label className="text-sm font-medium block mb-1">Data Inizio *</label><input type="date" defaultValue="2026-03-01" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40" /></div>
                  <div><label className="text-sm font-medium block mb-1">RAL Annua</label><input defaultValue="45.000 €" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40" /></div>
                  <div><label className="text-sm font-medium block mb-1">Sede di Lavoro</label><input defaultValue="Milano" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40" /></div>
                </div>
                <div><label className="text-sm font-medium block mb-1">Note aggiuntive</label><textarea rows={3} placeholder="Clausole particolari, note..." className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40" /></div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="px-6 py-3 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground">Indietro</button>
                  <button onClick={() => setStep(2)} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20">Anteprima Documento</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-8 border min-h-[400px]">
                  <div className="max-w-md mx-auto text-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">{selectedTemplate?.name}</h3>
                    <p className="text-xs text-gray-500">Anteprima documento generato</p>
                  </div>
                  <div className="max-w-md mx-auto space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-3 bg-gray-100 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />)}
                    <div className="h-4" />
                    <div className="border border-gray-200 rounded-lg p-4 space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-3 bg-gray-100 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-6 py-3 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground">Modifica</button>
                  <button onClick={() => setStep(3)} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20">Procedi alla Firma</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
                  <FileSignature className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Firma Elettronica Avanzata</h3>
                  <p className="text-sm text-muted-foreground">Firma il documento con valore legale</p>
                </div>
                <div className="max-w-sm mx-auto">
                  <div className="border-2 border-dashed border-border rounded-xl h-28 flex items-center justify-center text-muted-foreground text-sm cursor-pointer hover:border-emerald-500/30 transition-colors mb-3">
                    <PenTool className="w-5 h-5 mr-2" />Disegna la tua firma qui
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-3">Oppure usa la firma digitale certificata</p>
                  <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Firma conforme eIDAS e CAD</span>
                  </div>
                </div>
                <div className="flex gap-3 max-w-sm mx-auto">
                  <button onClick={() => setStep(2)} className="px-6 py-3 bg-card border border-border rounded-xl text-sm text-muted-foreground">Indietro</button>
                  <button onClick={() => setStep(4)} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20">Conferma e Firma</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-xl font-bold">Documento Creato e Firmato!</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">Il documento &quot;{selectedTemplate?.name}&quot; è stato firmato con successo e salvato nel tuo archivio. I firmatari aggiuntivi riceveranno una notifica via email.</p>
                <div className="flex gap-3 justify-center">
                  <button className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 flex items-center gap-1"><Download className="w-4 h-4" />Scarica PDF</button>
                  <button className="px-5 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><Send className="w-4 h-4" />Invia via Email</button>
                  <button onClick={() => { setPage("documents"); setStep(0); }} className="px-5 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground">Vai ai Documenti</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
