"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Bot, Users, DollarSign, BarChart3, Play, Pause, Settings,
  CheckCircle2, Clock, Zap, Send, MessageSquare,
  Plus, RefreshCw, ArrowRight,
  Target, Workflow,
  FileText
} from "lucide-react";
import MobileAppLayout from "@/components/MobileAppLayout";

/* ───────── DATA ───────── */
const agents = [
  { id: 1, name: "HR Agent", desc: "Screening CV, scheduling colloqui, onboarding automatico", status: "attivo", tasks: 24, completed: 18, icon: Users, color: "#ec4899", uptime: "99.2%", avgTime: "2.3 min", saved: "18h", accuracy: 96 },
  { id: 2, name: "Finance Agent", desc: "Riconciliazione fatture, report spese, forecast finanziario", status: "attivo", tasks: 31, completed: 28, icon: DollarSign, color: "#22c55e", uptime: "99.8%", avgTime: "1.8 min", saved: "24h", accuracy: 98 },
  { id: 3, name: "Ops Agent", desc: "Monitoraggio SLA, gestione ticket support, escalation automatica", status: "pausa", tasks: 15, completed: 12, icon: Settings, color: "#3b82f6", uptime: "97.5%", avgTime: "3.1 min", saved: "12h", accuracy: 91 },
  { id: 4, name: "Sales Agent", desc: "Lead scoring, follow-up automatici, aggiornamento CRM", status: "attivo", tasks: 42, completed: 35, icon: BarChart3, color: "#f59e0b", uptime: "99.5%", avgTime: "1.5 min", saved: "28h", accuracy: 94 },
  { id: 5, name: "Marketing Agent", desc: "Analisi campagne, segmentazione audience, A/B testing", status: "attivo", tasks: 19, completed: 14, icon: Target, color: "#8b5cf6", uptime: "98.9%", avgTime: "4.2 min", saved: "15h", accuracy: 92 },
];

const recentTasks = [
  { agent: "HR Agent", task: "Screening 12 CV per posizione Frontend Dev Senior", status: "completato", time: "5 min fa", agentColor: "#ec4899" },
  { agent: "Finance Agent", task: "Riconciliazione 48 fatture Q1 2026 — scostamento 0.02%", status: "completato", time: "12 min fa", agentColor: "#22c55e" },
  { agent: "Sales Agent", task: "Invio follow-up personalizzati a 8 lead qualificati", status: "in_corso", time: "in corso", agentColor: "#f59e0b" },
  { agent: "HR Agent", task: "Scheduling colloquio Mario Rossi - 12/02 h14:00", status: "completato", time: "25 min fa", agentColor: "#ec4899" },
  { agent: "Marketing Agent", task: "Analisi performance campagna Q1 Social Media", status: "in_corso", time: "in corso", agentColor: "#8b5cf6" },
  { agent: "Finance Agent", task: "Report spese mensile Febbraio — budget review", status: "in_corso", time: "in corso", agentColor: "#22c55e" },
  { agent: "Ops Agent", task: "Escalation ticket #4521 — SLA critico cliente Enterprise", status: "in_attesa", time: "in pausa", agentColor: "#3b82f6" },
  { agent: "Sales Agent", task: "Aggiornamento pipeline CRM — 12 deal in chiusura", status: "completato", time: "45 min fa", agentColor: "#f59e0b" },
];

const chatMessages = [
  { role: "user", text: "Mostrami lo stato dei candidati per la posizione Frontend Dev" },
  { role: "agent", text: "Ho analizzato 12 CV ricevuti per la posizione Frontend Dev Senior. Ecco il riepilogo:\n\n• 3 candidati shortlisted (match >90%)\n• 5 candidati in valutazione (match 70-90%)\n• 4 candidati non idonei (match <70%)\n\nI 3 candidati shortlisted sono:\n1. Marco Bianchi — 5 anni React, portfolio eccellente\n2. Laura Rossi — 4 anni Next.js, esperienza enterprise\n3. Andrea Verdi — 6 anni full-stack, team lead\n\nVuoi che scheduli i colloqui automaticamente?" },
  { role: "user", text: "Sì, schedula i colloqui per la prossima settimana" },
  { role: "agent", text: "Colloqui schedulati con successo:\n\n📅 Lun 17/02 h10:00 — Marco Bianchi\n📅 Mar 18/02 h14:00 — Laura Rossi\n📅 Mer 19/02 h11:00 — Andrea Verdi\n\nHo inviato le email di conferma a tutti i candidati e notificato il team di recruiting. Vuoi che prepari un brief per ogni colloquio?" },
];

const workflows = [
  { name: "Onboarding Nuovo Dipendente", steps: 8, completed: 5, agents: ["HR Agent", "Ops Agent"], status: "attivo", trigger: "Manuale" },
  { name: "Report Finanziario Mensile", steps: 5, completed: 5, agents: ["Finance Agent"], status: "completato", trigger: "Automatico — 1° del mese" },
  { name: "Lead Nurturing Pipeline", steps: 6, completed: 3, agents: ["Sales Agent", "Marketing Agent"], status: "attivo", trigger: "Nuovo lead CRM" },
  { name: "Incident Response SLA", steps: 4, completed: 0, agents: ["Ops Agent"], status: "pronto", trigger: "SLA violation" },
];

const reports = [
  { title: "Report Efficienza Settimanale", date: "10/02/2026", summary: "112 task completati, efficienza 89%, risparmio 34h di lavoro manuale", type: "Settimanale", impact: "€8.500 risparmiati" },
  { title: "Analisi Lead Conversion Q1", date: "09/02/2026", summary: "Conversion rate +12%, 8 nuovi clienti acquisiti, pipeline +€240K", type: "Sales", impact: "€240K pipeline" },
  { title: "Dashboard HR Recruiting", date: "08/02/2026", summary: "45 CV analizzati, 12 shortlisted, 3 colloqui pianificati, tempo medio -75%", type: "HR", impact: "18h risparmiate" },
  { title: "Forecast Finanziario Q2", date: "07/02/2026", summary: "Proiezione revenue +8%, margine stabile, 3 aree di ottimizzazione costi", type: "Finance", impact: "€12K ottimizzazione" },
];

/* ───────── COMPONENT ───────── */
type Page = "dashboard" | "agents" | "chat" | "workflows" | "tasks" | "reports";

export default function SkyWorkPage() {
  const [page, setPage] = useState<Page>("dashboard");
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(chatMessages);

  const totalTasks = agents.reduce((s, a) => s + a.tasks, 0);
  const totalCompleted = agents.reduce((s, a) => s + a.completed, 0);
  const totalSaved = agents.reduce((s, a) => s + parseInt(a.saved), 0);
  const activeAgents = agents.filter(a => a.status === "attivo").length;

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages([...messages, { role: "user", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "agent", text: "Sto elaborando la tua richiesta. Ho trovato le informazioni rilevanti e sto preparando un report dettagliato. Un momento..." }]);
    }, 1000);
  };

  const mobileNav = [
    { id: "dashboard", label: "Home", icon: BarChart3 },
    { id: "agents", label: "Agenti", icon: Bot },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "workflows", label: "Workflow", icon: Workflow },
    { id: "tasks", label: "Task", icon: Zap },
  ];

  return (
    <MobileAppLayout appName="SkyWork" accentColor="#f59e0b" navItems={mobileNav} activePage={page} onPageChange={(p) => setPage(p as Page)} sidebar={<>
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">SkyWork</h1>
              <p className="text-[10px] text-muted-foreground">Agenti AI Aziendali</p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="p-3 border-b border-border">
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-sm font-bold text-amber-400">{activeAgents}/{agents.length}</p>
                <p className="text-[10px] text-muted-foreground">Agenti Attivi</p>
              </div>
              <div>
                <p className="text-sm font-bold text-green-400">{totalSaved}h</p>
                <p className="text-[10px] text-muted-foreground">Ore Risparmiate</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "dashboard" as Page, label: "Dashboard", icon: BarChart3 },
            { key: "agents" as Page, label: "Agenti AI", icon: Bot, badge: agents.length },
            { key: "chat" as Page, label: "Chat Agenti", icon: MessageSquare },
            { key: "workflows" as Page, label: "Workflow", icon: Workflow, badge: workflows.filter(w => w.status === "attivo").length },
            { key: "tasks" as Page, label: "Task Log", icon: Zap, badge: recentTasks.filter(t => t.status === "in_corso").length },
            { key: "reports" as Page, label: "Report", icon: FileText },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                page === key ? "bg-amber-500/10 text-amber-400" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge !== undefined && <span className="text-[10px] bg-amber-500/20 text-amber-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}

          {/* Agent list */}
          <div className="pt-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Agenti</p>
            {agents.map(a => (
              <button key={a.id} onClick={() => { setSelectedAgent(a); setPage("agents"); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.status === "attivo" ? "#22c55e" : "#f59e0b" }} />
                <span className="flex-1 text-left">{a.name}</span>
                <span className="text-[10px]" style={{ color: a.color }}>{a.completed}/{a.tasks}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white">AI</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">SkyWork AI</p>
              <p className="text-[10px] text-green-400">Sistema operativo</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><Settings className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </>}>

        {/* ═══ DASHBOARD ═══ */}
        {page === "dashboard" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Dashboard</h2>
            <p className="text-xs text-muted-foreground mb-6">Panoramica agenti e automazione aziendale</p>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Agenti Attivi", value: `${activeAgents}/${agents.length}`, icon: Bot, color: "#f59e0b", sub: "1 in pausa" },
                { label: "Task Completati", value: `${totalCompleted}/${totalTasks}`, icon: CheckCircle2, color: "#22c55e", sub: `${Math.round((totalCompleted / totalTasks) * 100)}% completamento` },
                { label: "Ore Risparmiate", value: `${totalSaved}h`, icon: Clock, color: "#3b82f6", sub: "Questa settimana" },
                { label: "Accuratezza Media", value: `${Math.round(agents.reduce((s, a) => s + a.accuracy, 0) / agents.length)}%`, icon: Target, color: "#8b5cf6", sub: "Tutti gli agenti" },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + "15" }}>
                      <s.icon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{s.sub}</span>
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Agent cards + Recent tasks */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Stato Agenti</h3>
                  <button onClick={() => setPage("agents")} className="text-xs text-amber-400 hover:underline">Gestisci</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {agents.slice(0, 4).map(a => {
                    const Icon = a.icon;
                    return (
                      <div key={a.id} className="bg-card border border-border rounded-xl p-4 hover:border-amber-500/30 transition-colors cursor-pointer"
                        onClick={() => { setSelectedAgent(a); setPage("agents"); }}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: a.color + "15" }}>
                            <Icon className="w-4 h-4" style={{ color: a.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{a.name}</p>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.status === "attivo" ? "#22c55e" : "#f59e0b" }} />
                              <span className="text-[10px] text-muted-foreground">{a.status === "attivo" ? "Attivo" : "Pausa"}</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold" style={{ color: a.color }}>{Math.round((a.completed / a.tasks) * 100)}%</span>
                        </div>
                        <div className="bg-muted rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${(a.completed / a.tasks) * 100}%`, backgroundColor: a.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Task Recenti</h3>
                  <button onClick={() => setPage("tasks")} className="text-xs text-amber-400 hover:underline">Vedi tutti</button>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                  {recentTasks.slice(0, 5).map((t, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {t.status === "completato" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> :
                         t.status === "in_corso" ? <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} /> :
                         <Pause className="w-3.5 h-3.5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium truncate">{t.task}</p>
                        <p className="text-[10px] text-muted-foreground">{t.agent} • {t.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Efficiency chart */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-4">Efficienza Settimanale per Agente</h3>
              <div className="space-y-3">
                {agents.map(a => {
                  const pct = Math.round((a.completed / a.tasks) * 100);
                  return (
                    <div key={a.id} className="flex items-center gap-3">
                      <span className="text-xs w-28 font-medium">{a.name}</span>
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div className="h-3 rounded-full transition-all flex items-center justify-end pr-1.5" style={{ width: `${pct}%`, backgroundColor: a.color }}>
                          <span className="text-[9px] text-white font-bold">{pct}%</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground w-12 text-right">{a.saved}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ AGENTS ═══ */}
        {page === "agents" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Agenti AI</h2>
            <p className="text-xs text-muted-foreground mb-6">{agents.length} agenti configurati • {activeAgents} attivi</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {agents.map(a => {
                const Icon = a.icon;
                const pct = Math.round((a.completed / a.tasks) * 100);
                const isSelected = selectedAgent?.id === a.id;
                return (
                  <div key={a.id} className={`bg-card border rounded-2xl p-5 transition-all cursor-pointer ${isSelected ? "border-amber-500/50 shadow-lg shadow-amber-500/5" : "border-border hover:border-amber-500/30"}`}
                    onClick={() => setSelectedAgent(isSelected ? null : a)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: a.color + "15" }}>
                          <Icon className="w-6 h-6" style={{ color: a.color }} />
                        </div>
                        <div>
                          <h3 className="font-bold">{a.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === "attivo" ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"}`}>
                            {a.status === "attivo" ? "Attivo" : "In Pausa"}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-muted border border-border">
                        {a.status === "attivo" ? <Pause className="w-4 h-4 text-muted-foreground" /> : <Play className="w-4 h-4 text-green-400" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">{a.desc}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                      {[
                        { l: "Task", v: `${a.completed}/${a.tasks}` },
                        { l: "Uptime", v: a.uptime },
                        { l: "T. Medio", v: a.avgTime },
                        { l: "Accuratezza", v: `${a.accuracy}%` },
                      ].map(d => (
                        <div key={d.l} className="bg-muted/50 rounded-lg p-2 text-center">
                          <p className="text-xs font-bold">{d.v}</p>
                          <p className="text-[9px] text-muted-foreground">{d.l}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: a.color }} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: a.color }}>{pct}%</span>
                    </div>

                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-border flex gap-2">
                        <button onClick={e => { e.stopPropagation(); setPage("chat"); }} className="flex-1 py-2 bg-amber-500 text-black rounded-lg text-xs font-semibold flex items-center justify-center gap-1"><MessageSquare className="w-3 h-3" />Chat</button>
                        <button className="px-4 py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground">Configura</button>
                        <button className="px-4 py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground">Log</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ CHAT ═══ */}
        {page === "chat" && (
          <div className="flex-1 flex flex-col h-screen">
            <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-card/50">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center">
                <Bot className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Chat con Agenti AI</p>
                <p className="text-[10px] text-green-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400" />Online — {activeAgents} agenti disponibili</p>
              </div>
              <select className="text-xs bg-card border border-border rounded-lg px-2 py-1 text-muted-foreground">
                <option>Tutti gli agenti</option>
                {agents.map(a => <option key={a.id}>{a.name}</option>)}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "agent" && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-3 shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-amber-500 text-black" : "bg-card border border-border"}`}>
                    <p className={`text-sm whitespace-pre-wrap ${m.role === "user" ? "text-black" : ""}`}>{m.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-border bg-card/50">
              <div className="flex items-center gap-2">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Chiedi qualcosa agli agenti AI..."
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
                <button onClick={sendMessage} className="w-10 h-10 bg-amber-500 text-black rounded-xl flex items-center justify-center hover:bg-amber-400">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                {["Stato agenti", "Report settimanale", "Task in corso", "Pipeline vendite"].map(s => (
                  <button key={s} onClick={() => setChatInput(s)} className="text-[10px] px-2 py-1 bg-muted rounded-lg text-muted-foreground hover:text-foreground">{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ WORKFLOWS ═══ */}
        {page === "workflows" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Workflow</h2>
                <p className="text-xs text-muted-foreground">{workflows.length} workflow configurati</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />Nuovo Workflow
              </button>
            </div>

            <div className="space-y-4">
              {workflows.map((w, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-sm">{w.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${w.status === "completato" ? "bg-green-500/10 text-green-400" : w.status === "attivo" ? "bg-amber-500/10 text-amber-400" : "bg-muted text-muted-foreground"}`}>
                          {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Trigger: {w.trigger}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {w.agents.map((ag, ai) => (
                        <span key={ai} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{ag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: w.steps }).map((_, si) => (
                      <div key={si} className="flex items-center gap-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${si < w.completed ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>
                          {si + 1}
                        </div>
                        {si < w.steps - 1 && <ArrowRight className={`w-3 h-3 ${si < w.completed - 1 ? "text-green-400" : "text-muted-foreground/30"}`} />}
                      </div>
                    ))}
                    <span className="text-xs text-muted-foreground ml-auto">{w.completed}/{w.steps} step</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TASKS ═══ */}
        {page === "tasks" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Task Log</h2>
            <p className="text-xs text-muted-foreground mb-6">{recentTasks.length} task registrati</p>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {recentTasks.map((t, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <div>
                    {t.status === "completato" ? <CheckCircle2 className="w-5 h-5 text-green-400" /> :
                     t.status === "in_corso" ? <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} /> :
                     <Pause className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.agentColor }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t.task}</p>
                    <p className="text-xs text-muted-foreground">{t.agent}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === "completato" ? "bg-green-500/10 text-green-400" : t.status === "in_corso" ? "bg-amber-500/10 text-amber-400" : "bg-muted text-muted-foreground"}`}>
                    {t.status === "completato" ? "Completato" : t.status === "in_corso" ? "In corso" : "In attesa"}
                  </span>
                  <span className="text-xs text-muted-foreground w-20 text-right">{t.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ REPORTS ═══ */}
        {page === "reports" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Report</h2>
            <p className="text-xs text-muted-foreground mb-6">Report generati automaticamente dagli agenti</p>

            <div className="space-y-4">
              {reports.map((r, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-amber-500/30 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">{r.type}</span>
                        <span className="text-[10px] text-muted-foreground">{r.date}</span>
                      </div>
                      <h3 className="font-semibold">{r.title}</h3>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5 text-right">
                      <p className="text-xs font-bold text-green-400">{r.impact}</p>
                      <p className="text-[10px] text-muted-foreground">Impatto</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
    </MobileAppLayout>
  );
}
