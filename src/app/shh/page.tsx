"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Lock, Send, Clock, Shield, Flame, Eye, EyeOff, Plus,
  Trash2, Settings, Link2, Key, AlertTriangle, CheckCircle2,
  Users
} from "lucide-react";
import MobileAppLayout from "@/components/MobileAppLayout";

/* ───────── DATA ───────── */
const conversations = [
  { id: 1, name: "Anonimo #7291", lastMsg: "Questo messaggio si autodistruggerà...", time: "2 min", unread: 1, timer: "5 min", emoji: "🔒", encryption: "AES-256" },
  { id: 2, name: "Anonimo #4520", lastMsg: "Hai visto il documento?", time: "15 min", unread: 0, timer: "1 ora", emoji: "🤫", encryption: "AES-256" },
  { id: 3, name: "Anonimo #8834", lastMsg: "Top secret — solo per te", time: "1h", unread: 3, timer: "24 ore", emoji: "👻", encryption: "AES-256" },
  { id: 4, name: "Anonimo #1156", lastMsg: "Ci vediamo all'evento?", time: "3h", unread: 0, timer: "30 sec", emoji: "⏳", encryption: "AES-256" },
  { id: 5, name: "Anonimo #9903", lastMsg: "Link condiviso, apri in fretta", time: "5h", unread: 0, timer: "5 min", emoji: "🔗", encryption: "AES-256" },
];

const chatMessages = [
  { id: 1, text: "Hey, devo dirti una cosa importante...", mine: false, time: "14:30", expiresIn: 280 },
  { id: 2, text: "Dimmi tutto, qui è sicuro", mine: true, time: "14:31", expiresIn: 275 },
  { id: 3, text: "Il progetto viene lanciato venerdì!", mine: false, time: "14:32", expiresIn: 268 },
  { id: 4, text: "Fantastico! Non dico niente a nessuno", mine: true, time: "14:33", expiresIn: 260 },
  { id: 5, text: "Questo messaggio si autodistruggerà tra 5 minuti", mine: false, time: "14:34", expiresIn: 245 },
];

const timerOptions = [
  { label: "30 sec", value: 30, desc: "Ultra-rapido" },
  { label: "5 min", value: 300, desc: "Rapido" },
  { label: "1 ora", value: 3600, desc: "Standard" },
  { label: "24 ore", value: 86400, desc: "Lungo" },
];

/* ───────── COMPONENT ───────── */
type Page = "chats" | "active_chat" | "create" | "security" | "settings";

export default function ShhPage() {
  const [page, setPage] = useState<Page>("chats");
  const [selectedChat, setSelectedChat] = useState<typeof conversations[0] | null>(null);
  const [message, setMessage] = useState("");
  const [selectedTimer, setSelectedTimer] = useState(300);
  const [showContent, setShowContent] = useState<Record<number, boolean>>({});
  const [messages, setMessages] = useState(chatMessages);

  const toggleReveal = (id: number) => {
    setShowContent(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), text: message, mine: true, time: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }), expiresIn: selectedTimer }]);
    setMessage("");
  };

  const formatTimer = (seconds: number) => {
    if (seconds >= 3600) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    if (seconds >= 60) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  const mobileNav = [
    { id: "chats", label: "Chat", icon: Lock },
    { id: "create", label: "Nuova", icon: Plus },
    { id: "security", label: "Sicurezza", icon: Shield },
    { id: "settings", label: "Opzioni", icon: Settings },
  ];

  return (
    <MobileAppLayout appName="Shh..." accentColor="#10b981" navItems={mobileNav} activePage={page} onPageChange={(p) => setPage(p as Page)} sidebar={<>
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border border-slate-600">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-sm">Shh...</h1>
              <p className="text-[10px] text-muted-foreground">Messaggi Temporanei Cifrati</p>
            </div>
          </div>
        </div>

        <div className="p-3 border-b border-border">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-medium">E2E Crittografia Attiva</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-sm font-bold text-emerald-400">{conversations.length}</p>
                <p className="text-[10px] text-muted-foreground">Chat Attive</p>
              </div>
              <div>
                <p className="text-sm font-bold text-amber-400">{totalUnread}</p>
                <p className="text-[10px] text-muted-foreground">Non Letti</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "chats" as Page, label: "Conversazioni", icon: Lock, badge: totalUnread },
            { key: "create" as Page, label: "Nuova Chat", icon: Plus },
            { key: "security" as Page, label: "Sicurezza", icon: Shield },
            { key: "settings" as Page, label: "Impostazioni", icon: Settings },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button key={key} onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                page === key || (page === "active_chat" && key === "chats") ? "bg-emerald-500/10 text-emerald-400" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge !== undefined && badge > 0 && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}

          <div className="pt-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Chat Recenti</p>
            {conversations.slice(0, 4).map(c => (
              <button key={c.id} onClick={() => { setSelectedChat(c); setPage("active_chat"); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <span className="text-sm">{c.emoji}</span>
                <span className="flex-1 text-left truncate">{c.name}</span>
                {c.unread > 0 && <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center">{c.unread}</span>}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2 text-[10px] text-muted-foreground">
            <Key className="w-3 h-3 text-emerald-400" />
            <span>AES-256 • Zero-Knowledge • GDPR</span>
          </div>
        </div>
      </>}>

        {/* ═══ CHATS LIST ═══ */}
        {page === "chats" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Conversazioni</h2>
                <p className="text-xs text-muted-foreground">{conversations.length} chat cifrate attive</p>
              </div>
              <button onClick={() => setPage("create")} className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />Nuova Chat
              </button>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 mb-6 flex items-center gap-3">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-xs text-muted-foreground"><span className="text-emerald-400 font-medium">Crittografia E2E:</span> Tutti i messaggi sono cifrati e si autodistruggono. Nessun dato conservato sui server.</p>
            </div>

            <div className="space-y-3">
              {conversations.map(c => (
                <div key={c.id} onClick={() => { setSelectedChat(c); setPage("active_chat"); }}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-emerald-500/30 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xl border border-slate-600">
                    {c.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm">{c.name}</p>
                      <span className="text-[9px] bg-muted rounded px-1 py-0.5 text-muted-foreground flex items-center gap-0.5"><Key className="w-2 h-2" />{c.encryption}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.lastMsg}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <p className="text-[10px] text-muted-foreground">{c.time}</p>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-[10px] text-amber-400 flex items-center gap-0.5"><Flame className="w-2.5 h-2.5" />{c.timer}</span>
                      {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">{c.unread}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ ACTIVE CHAT ═══ */}
        {page === "active_chat" && selectedChat && (
          <div className="flex flex-col h-screen">
            <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-card/50">
              <button onClick={() => setPage("chats")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /></button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-lg border border-slate-600">{selectedChat.emoji}</div>
              <div className="flex-1">
                <p className="text-sm font-bold">{selectedChat.name}</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1"><Shield className="w-2.5 h-2.5" />E2E cifrata • {selectedChat.encryption}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full font-medium flex items-center gap-0.5"><Flame className="w-3 h-3" />{selectedChat.timer}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-full px-3 py-1">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400">Messaggi cifrati end-to-end</span>
                </div>
              </div>
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl ${m.mine ? "bg-emerald-600 text-white" : "bg-card border border-border"}`}>
                    <div className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {showContent[m.id] !== false ? (
                          <p className="text-sm">{m.text}</p>
                        ) : (
                          <p className="text-sm italic text-muted-foreground">Messaggio nascosto</p>
                        )}
                        <button onClick={() => toggleReveal(m.id)} className="shrink-0 opacity-40 hover:opacity-100 transition-opacity">
                          {showContent[m.id] !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className={`px-4 pb-2 flex items-center justify-between text-[10px] ${m.mine ? "text-emerald-200" : "text-muted-foreground"}`}>
                      <span>{m.time}</span>
                      <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{formatTimer(m.expiresIn)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-border bg-card/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1">
                  {timerOptions.map(t => (
                    <button key={t.value} onClick={() => setSelectedTimer(t.value)}
                      className={`px-2 py-0.5 rounded text-[9px] font-medium ${selectedTimer === t.value ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>{t.label}</button>
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground ml-auto">Autodistruzione: {timerOptions.find(t => t.value === selectedTimer)?.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder="Messaggio cifrato..." className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
                <button onClick={handleSend} className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ CREATE ═══ */}
        {page === "create" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Nuova Chat Segreta</h2>
            <p className="text-xs text-muted-foreground mb-6">Genera un link anonimo da condividere</p>

            <div className="max-w-lg mx-auto">
              <div className="bg-card border border-border rounded-3xl p-8 text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-5">
                  <Lock className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Chat Segreta</h3>
                <p className="text-sm text-muted-foreground mb-6">Nessuna registrazione richiesta. Link anonimo monouso.</p>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">Timer autodistruzione</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {timerOptions.map(t => (
                        <button key={t.value} onClick={() => setSelectedTimer(t.value)}
                          className={`p-3 rounded-xl border text-center transition-colors ${selectedTimer === t.value ? "border-emerald-500/40 bg-emerald-500/5" : "border-border hover:border-emerald-500/20"}`}>
                          <p className="text-sm font-bold">{t.label}</p>
                          <p className="text-[9px] text-muted-foreground">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">Opzioni avanzate</label>
                    <div className="space-y-2">
                      {[
                        { l: "Screenshot disabilitati", v: true },
                        { l: "Notifica se letto", v: true },
                        { l: "Link monouso", v: false },
                      ].map(o => (
                        <div key={o.l} className="flex items-center justify-between p-2 rounded-lg border border-border">
                          <span className="text-xs">{o.l}</span>
                          <div className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${o.v ? "bg-emerald-500" : "bg-muted"}`}>
                            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${o.v ? "translate-x-4" : "translate-x-0.5"}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90">
                  <Link2 className="w-4 h-4" />Genera Link Segreto
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SECURITY ═══ */}
        {page === "security" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Sicurezza</h2>
            <p className="text-xs text-muted-foreground mb-6">Dettagli sulla protezione dei tuoi messaggi</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { title: "Crittografia E2E", desc: "AES-256 bit end-to-end encryption", icon: Key, color: "#22c55e" },
                { title: "Zero Knowledge", desc: "I server non possono leggere i messaggi", icon: Shield, color: "#06b6d4" },
                { title: "Autodistruzione", desc: "Timer configurabile per ogni messaggio", icon: Flame, color: "#f59e0b" },
                { title: "Anonimato", desc: "Nessuna registrazione o dati personali", icon: Users, color: "#8b5cf6" },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="bg-card border border-border rounded-2xl p-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: f.color + "15" }}>
                      <Icon className="w-5 h-5" style={{ color: f.color }} />
                    </div>
                    <h3 className="font-bold text-sm mb-0.5">{f.title}</h3>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold text-sm mb-4">Stato Sicurezza</h3>
              <div className="space-y-2">
                {[
                  { check: "Crittografia end-to-end attiva", ok: true },
                  { check: "Nessun dato sui server", ok: true },
                  { check: "Autodistruzione configurata", ok: true },
                  { check: "Screenshot bloccati", ok: true },
                  { check: "GDPR compliant", ok: true },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-xs">{s.check}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ SETTINGS ═══ */}
        {page === "settings" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Impostazioni</h2>
            <p className="text-xs text-muted-foreground mb-6">Configura timer e preferenze</p>

            <div className="max-w-lg space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" />Timer Predefinito</h3>
                <div className="space-y-2">
                  {timerOptions.map(t => (
                    <label key={t.value} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${selectedTimer === t.value ? "border-emerald-500/40 bg-emerald-500/5" : "border-border hover:border-emerald-500/20"}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="timer" checked={selectedTimer === t.value} onChange={() => setSelectedTimer(t.value)} className="accent-emerald-500" />
                        <div>
                          <span className="text-sm font-medium">{t.label}</span>
                          <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                        </div>
                      </div>
                      <Flame className="w-4 h-4 text-amber-400" />
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-sm mb-4">Preferenze</h3>
                <div className="space-y-3">
                  {[
                    { l: "Blocca screenshot", v: true },
                    { l: "Conferma di lettura", v: true },
                    { l: "Notifiche push", v: false },
                    { l: "Suono messaggi", v: true },
                  ].map(s => (
                    <div key={s.l} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <span className="text-sm">{s.l}</span>
                      <div className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${s.v ? "bg-emerald-500" : "bg-muted"}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${s.v ? "translate-x-5" : "translate-x-0.5"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-red-500/20 rounded-2xl p-5">
                <h3 className="font-semibold text-sm mb-3 text-red-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Zona Pericolosa</h3>
                <button className="w-full py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-4 h-4" />Elimina Tutte le Conversazioni
                </button>
              </div>
            </div>
          </div>
        )}
    </MobileAppLayout>
  );
}
