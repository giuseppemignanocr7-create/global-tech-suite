"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Brain, Send, Frown, Meh, Smile, Heart, TrendingUp, BookOpen,
  Calendar, Wind, Moon, Sun, CloudRain, Sparkles, Volume2, Play, Pause,
  ChevronLeft, ChevronRight, Plus, Settings, User, BarChart3,
  Clock, Target, Award, MessageCircle, Flower2, Coffee, Music, Star
} from "lucide-react";
import DemoBadge from "@/components/DemoBadge";

/* ───────── DATA ───────── */
const moods = [
  { icon: Frown, label: "Triste", color: "#ef4444", value: 1, bg: "from-red-500/20 to-red-600/20" },
  { icon: Meh, label: "Così così", color: "#f59e0b", value: 2, bg: "from-amber-500/20 to-amber-600/20" },
  { icon: Smile, label: "Bene", color: "#22c55e", value: 3, bg: "from-green-500/20 to-green-600/20" },
  { icon: Heart, label: "Ottimo", color: "#ec4899", value: 4, bg: "from-pink-500/20 to-pink-600/20" },
];

const aiResponses = [
  "Grazie per aver condiviso questo con me. Riconoscere le proprie emozioni è il primo passo verso il benessere. Cosa pensi abbia scatenato questa sensazione?",
  "Capisco come ti senti. Ricorda che è normale avere giornate difficili. Vuoi provare insieme un esercizio di respirazione per calmare la mente?",
  "Quello che descrivi sembra legato allo stress accumulato. Ti suggerisco di provare la tecnica del grounding: nomina 5 cose che vedi, 4 che puoi toccare, 3 che senti, 2 che puoi annusare e 1 che puoi gustare.",
  "È importante che tu stia parlando di questo. La consapevolezza emotiva è una forma di forza, non di debolezza. Come vorresti sentirti alla fine di questa settimana?",
  "Ho notato che negli ultimi giorni il tuo umore è migliorato quando hai fatto attività fisica. Potrebbe essere utile integrare anche solo 15 minuti di camminata al giorno.",
];

const chatHistory: { role: "ai" | "user"; text: string }[] = [
  { role: "ai", text: "Benvenuto nel tuo spazio sicuro. Sono il tuo assistente empatico AI. Tutto quello che condividi qui resta privato e protetto. Come stai oggi?" },
];

const diaryData = [
  { date: "2026-02-10", mood: 3, note: "Giornata produttiva, un po' di ansia la sera. Ho fatto 20 min di yoga.", tags: ["lavoro", "yoga", "ansia"], energy: 7 },
  { date: "2026-02-09", mood: 2, note: "Stressato per le scadenze. La meditazione serale ha aiutato.", tags: ["stress", "meditazione"], energy: 4 },
  { date: "2026-02-08", mood: 4, note: "Weekend rilassante, passeggiata al parco con amici. Mi sento rigenerato.", tags: ["amici", "natura", "relax"], energy: 9 },
  { date: "2026-02-07", mood: 3, note: "Buona giornata lavorativa. Ho completato il progetto.", tags: ["lavoro", "produttività"], energy: 6 },
  { date: "2026-02-06", mood: 1, note: "Discussione difficile con un collega. Mi sento incompreso.", tags: ["conflitto", "lavoro", "tristezza"], energy: 2 },
  { date: "2026-02-05", mood: 3, note: "Routine normale, yoga la sera. Dormito bene.", tags: ["routine", "yoga", "sonno"], energy: 6 },
  { date: "2026-02-04", mood: 4, note: "Ottima notizia: promozione! Festeggiato con la famiglia.", tags: ["promozione", "famiglia", "gioia"], energy: 10 },
  { date: "2026-02-03", mood: 2, note: "Lunedì difficile. Tanta pioggia, poca motivazione.", tags: ["lunedì", "pioggia"], energy: 3 },
  { date: "2026-02-02", mood: 3, note: "Domenica tranquilla. Letto un buon libro.", tags: ["lettura", "relax"], energy: 7 },
  { date: "2026-02-01", mood: 3, note: "Inizio mese positivo. Nuovi obiettivi scritti.", tags: ["obiettivi", "motivazione"], energy: 7 },
];

const breathingExercises = [
  { name: "Respirazione 4-7-8", desc: "Calma e rilassamento profondo", inhale: 4, hold: 7, exhale: 8, color: "#8b5cf6", icon: Moon },
  { name: "Box Breathing", desc: "Concentrazione e equilibrio", inhale: 4, hold: 4, exhale: 4, color: "#3b82f6", icon: Target },
  { name: "Respirazione Energizzante", desc: "Risveglio e vitalità", inhale: 3, hold: 0, exhale: 3, color: "#f59e0b", icon: Sun },
  { name: "Rilassamento Progressivo", desc: "Rilascio tensione muscolare", inhale: 5, hold: 3, exhale: 7, color: "#22c55e", icon: Flower2 },
];

const soundscapes = [
  { name: "Pioggia leggera", icon: CloudRain, duration: "30 min", playing: false },
  { name: "Onde del mare", icon: Wind, duration: "45 min", playing: false },
  { name: "Foresta notturna", icon: Moon, duration: "60 min", playing: false },
  { name: "Musica lo-fi", icon: Music, duration: "∞", playing: true },
  { name: "Campane tibetane", icon: Volume2, duration: "20 min", playing: false },
];

const weeklyMoods = [
  { day: "Lun", mood: 2, energy: 3 }, { day: "Mar", mood: 3, energy: 6 },
  { day: "Mer", mood: 1, energy: 2 }, { day: "Gio", mood: 3, energy: 6 },
  { day: "Ven", mood: 3, energy: 7 }, { day: "Sab", mood: 4, energy: 9 },
  { day: "Dom", mood: 3, energy: 7 },
];

const monthMoods: Record<string, number> = {
  "01": 3, "02": 3, "03": 2, "04": 4, "05": 3, "06": 1, "07": 3, "08": 4, "09": 2, "10": 3,
};

const professionals = [
  { name: "Dott.ssa Maria Colombo", spec: "Psicologa clinica", rating: 4.9, available: true, price: "€60/sessione", photo: "MC" },
  { name: "Dott. Andrea Russo", spec: "Psicoterapeuta cognitivo", rating: 4.8, available: true, price: "€70/sessione", photo: "AR" },
  { name: "Dott.ssa Sara Ricci", spec: "Psicologa del lavoro", rating: 4.7, available: false, price: "€55/sessione", photo: "SR" },
];

/* ───────── BREATHING COMPONENT ───────── */
function BreathingCircle({ exercise, onClose }: { exercise: typeof breathingExercises[0]; onClose: () => void }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [seconds, setSeconds] = useState(exercise.inhale);
  const [cycles, setCycles] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (phase === "inhale") {
            if (exercise.hold > 0) { setPhase("hold"); return exercise.hold; }
            else { setPhase("exhale"); return exercise.exhale; }
          }
          if (phase === "hold") { setPhase("exhale"); return exercise.exhale; }
          if (phase === "exhale") { setPhase("inhale"); setCycles(c => c + 1); return exercise.inhale; }
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, isActive, exercise]);

  const phaseLabel = phase === "inhale" ? "Inspira" : phase === "hold" ? "Trattieni" : "Espira";
  const maxTime = phase === "inhale" ? exercise.inhale : phase === "hold" ? exercise.hold : exercise.exhale;
  const progress = ((maxTime - seconds) / maxTime) * 100;
  const circleScale = phase === "inhale" ? 1 + (progress / 100) * 0.4 : phase === "exhale" ? 1.4 - (progress / 100) * 0.4 : 1.4;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex items-center justify-center">
      <div className="text-center">
        <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground text-sm">Chiudi &times;</button>
        <p className="text-sm text-muted-foreground mb-2">{exercise.name}</p>
        <p className="text-xs text-muted-foreground mb-8">Ciclo {cycles + 1}</p>

        <div className="relative w-64 h-64 mx-auto mb-8">
          <div
            className="absolute inset-0 rounded-full transition-transform duration-1000 ease-in-out flex items-center justify-center"
            style={{
              transform: `scale(${circleScale})`,
              background: `radial-gradient(circle, ${exercise.color}30, ${exercise.color}10)`,
              border: `2px solid ${exercise.color}50`,
            }}
          >
            <div className="text-center">
              <p className="text-4xl font-bold" style={{ color: exercise.color }}>{seconds}</p>
              <p className="text-lg font-medium mt-1" style={{ color: exercise.color }}>{phaseLabel}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setIsActive(!isActive)} className="px-6 py-2 rounded-xl border border-border text-sm font-medium flex items-center gap-2">
            {isActive ? <><Pause className="w-4 h-4" />Pausa</> : <><Play className="w-4 h-4" />Riprendi</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────── MAIN COMPONENT ───────── */
type Page = "chat" | "diary" | "breathing" | "analytics" | "sounds" | "professionals";

export default function MenteSerenaPage() {
  const [page, setPage] = useState<Page>("chat");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(chatHistory);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [diaryNote, setDiaryNote] = useState("");
  const [activeBreathing, setActiveBreathing] = useState<typeof breathingExercises[0] | null>(null);
  const [playingSounds, setPlayingSounds] = useState<Record<number, boolean>>({ 3: true });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    const userMsg = { role: "user" as const, text: message };
    setMessage("");
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => {
      const aiText = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages(prev => [...prev, { role: "ai", text: aiText }]);
    }, 1200);
  };

  const saveDiary = () => {
    if (selectedMood === null) return;
    setSelectedMood(null);
    setDiaryNote("");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DemoBadge />
      {activeBreathing && <BreathingCircle exercise={activeBreathing} onClose={() => setActiveBreathing(null)} />}

      {/* ─── SIDEBAR ─── */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">Mente Serena</h1>
              <p className="text-[10px] text-muted-foreground">Benessere Digitale AI</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Strumenti</p>
          {[
            { key: "chat" as Page, label: "Chat Empatica", icon: MessageCircle },
            { key: "diary" as Page, label: "Diario Emotivo", icon: BookOpen },
            { key: "breathing" as Page, label: "Respirazione", icon: Wind },
            { key: "sounds" as Page, label: "Suoni & Relax", icon: Volume2 },
            { key: "analytics" as Page, label: "Analisi & Insight", icon: BarChart3 },
            { key: "professionals" as Page, label: "Professionisti", icon: User },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                page === key ? "bg-purple-500/10 text-purple-400" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
            </button>
          ))}
        </nav>

        {/* Mood quick check */}
        <div className="p-3 border-t border-border">
          <p className="text-[10px] text-muted-foreground mb-2 px-2">Come stai adesso?</p>
          <div className="flex justify-between px-2">
            {moods.map((m) => {
              const Icon = m.icon;
              return (
                <button key={m.value} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title={m.label}>
                  <Icon className="w-5 h-5" style={{ color: m.color }} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-xs font-bold">👤</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Area Personale</p>
              <p className="text-[10px] text-green-400">7 giorni consecutivi</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><Settings className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 min-h-screen overflow-y-auto">

        {/* ═══ CHAT ═══ */}
        {page === "chat" && (
          <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-card/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Assistente Empatico AI</p>
                  <p className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400" />Sempre disponibile • Conversazione privata</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-400" />Streak: 7 giorni</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Sessione: 12 min</span>
              </div>
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="p-6 pb-0">
                <p className="text-sm text-muted-foreground mb-3">Suggerimenti rapidi:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Mi sento ansioso oggi, puoi aiutarmi?",
                    "Vorrei fare un esercizio di mindfulness",
                    "Ho bisogno di parlare dello stress lavorativo",
                    "Come posso migliorare il mio sonno?",
                  ].map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setMessage(s); }}
                      className="text-left p-3 rounded-xl border border-border bg-card hover:border-purple-500/30 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                  {m.role === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-3 shrink-0 mt-1">
                      <Brain className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[65%] px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl rounded-br-md shadow-lg shadow-purple-500/10"
                      : "bg-card border border-border rounded-2xl rounded-bl-md"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card/30">
              <div className="max-w-3xl mx-auto flex items-center gap-3">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Scrivi come ti senti..."
                  className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
                <button onClick={handleSend} className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-shadow">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-[10px] text-muted-foreground/50 mt-2">Le risposte AI non sostituiscono un professionista della salute mentale</p>
            </div>
          </div>
        )}

        {/* ═══ DIARY ═══ */}
        {page === "diary" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Diario Emotivo</h2>
            <p className="text-xs text-muted-foreground mb-6">Traccia le tue emozioni giorno per giorno</p>

            {/* New entry */}
            <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-sm mb-4">Come ti senti adesso?</h3>
              <div className="flex gap-3 mb-4">
                {moods.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.value}
                      onClick={() => setSelectedMood(m.value)}
                      className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                        selectedMood === m.value
                          ? `border-2 bg-gradient-to-br ${m.bg} scale-105`
                          : "border-border bg-card hover:border-purple-500/30"
                      }`}
                      style={selectedMood === m.value ? { borderColor: m.color } : {}}
                    >
                      <Icon className="w-8 h-8" style={{ color: m.color }} />
                      <span className="text-xs font-medium">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedMood !== null && (
                <div className="space-y-3 animate-fade-in">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Cosa è successo?</label>
                    <textarea
                      value={diaryNote}
                      onChange={(e) => setDiaryNote(e.target.value)}
                      rows={3}
                      placeholder="Scrivi i tuoi pensieri..."
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Livello di energia (1-10)</label>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <button key={i} className={`flex-1 h-8 rounded-md text-[10px] font-bold transition-colors ${
                          i < 6 ? "bg-purple-500/20 text-purple-400" : "bg-muted text-muted-foreground hover:bg-purple-500/10"
                        }`}>{i + 1}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={saveDiary} className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20">
                    Salva nel Diario
                  </button>
                </div>
              )}
            </div>

            {/* Calendar mini */}
            <div className="bg-card border border-border rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Febbraio 2026</h3>
                <div className="flex gap-1">
                  <button className="p-1 rounded hover:bg-muted"><ChevronLeft className="w-4 h-4 text-muted-foreground" /></button>
                  <button className="p-1 rounded hover:bg-muted"><ChevronRight className="w-4 h-4 text-muted-foreground" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["Lu","Ma","Me","Gi","Ve","Sa","Do"].map(d => <div key={d} className="text-[10px] text-muted-foreground py-1">{d}</div>)}
                {/* Empty days for Feb starting on Sunday */}
                <div />
                {Array.from({ length: 10 }).map((_, i) => {
                  const day = String(i + 1).padStart(2, "0");
                  const m = monthMoods[day];
                  return (
                    <div key={i} className="relative">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs cursor-pointer transition-colors ${
                        i === 9 ? "bg-purple-500 text-white" : m ? "hover:bg-muted" : "text-muted-foreground/40"
                      }`}>
                        {i + 1}
                      </div>
                      {m && <div className="w-1.5 h-1.5 rounded-full mx-auto mt-0.5" style={{ backgroundColor: moods[m - 1].color }} />}
                    </div>
                  );
                })}
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i + 10} className="w-8 h-8 mx-auto flex items-center justify-center text-xs text-muted-foreground/30">{i + 11}</div>
                ))}
              </div>
            </div>

            {/* Recent entries */}
            <h3 className="font-semibold text-sm mb-3">Ultimi Registri</h3>
            <div className="space-y-3">
              {diaryData.slice(0, 7).map((e, i) => {
                const m = moods[e.mood - 1];
                const Icon = m.icon;
                return (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-purple-500/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.bg} flex items-center justify-center shrink-0`}>
                        <Icon className="w-6 h-6" style={{ color: m.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{m.label}</span>
                          <span className="text-[10px] text-muted-foreground">{e.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{e.note}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {e.tags.map(t => <span key={t} className="text-[10px] bg-purple-500/10 text-purple-400 rounded-md px-1.5 py-0.5">{t}</span>)}
                          </div>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">⚡ {e.energy}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ BREATHING ═══ */}
        {page === "breathing" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Esercizi di Respirazione</h2>
            <p className="text-xs text-muted-foreground mb-6">Scegli un esercizio guidato per ritrovare la calma</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {breathingExercises.map((ex) => {
                const Icon = ex.icon;
                return (
                  <div
                    key={ex.name}
                    onClick={() => setActiveBreathing(ex)}
                    className="bg-card border border-border rounded-2xl p-6 cursor-pointer hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: ex.color + "15" }}>
                      <Icon className="w-7 h-7" style={{ color: ex.color }} />
                    </div>
                    <h3 className="font-semibold mb-1">{ex.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{ex.desc}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Inspira: {ex.inhale}s</span>
                      {ex.hold > 0 && <span>Trattieni: {ex.hold}s</span>}
                      <span>Espira: {ex.exhale}s</span>
                    </div>
                    <button className="mt-4 w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2" style={{ backgroundColor: ex.color + "15", color: ex.color }}>
                      <Play className="w-4 h-4" />Inizia
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" />Suggerimento AI</h3>
              <p className="text-sm text-muted-foreground">Basandomi sul tuo umore recente, ti consiglio la <strong className="text-foreground">Respirazione 4-7-8</strong> prima di dormire. Negli ultimi giorni hai riportato difficoltà con il sonno — questo esercizio attiva il sistema nervoso parasimpatico e favorisce il rilassamento.</p>
            </div>
          </div>
        )}

        {/* ═══ SOUNDS ═══ */}
        {page === "sounds" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Suoni & Relax</h2>
            <p className="text-xs text-muted-foreground mb-6">Ambienti sonori per concentrazione e rilassamento</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {soundscapes.map((s, i) => {
                const Icon = s.icon;
                const isPlaying = playingSounds[i] || false;
                return (
                  <div key={s.name} className={`bg-card border rounded-2xl p-5 transition-all cursor-pointer ${
                    isPlaying ? "border-purple-500/50 shadow-lg shadow-purple-500/10" : "border-border hover:border-purple-500/30"
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPlaying ? "bg-purple-500/20" : "bg-muted"}`}>
                        <Icon className={`w-6 h-6 ${isPlaying ? "text-purple-400" : "text-muted-foreground"}`} />
                      </div>
                      <button
                        onClick={() => setPlayingSounds(prev => ({ ...prev, [i]: !prev[i] }))}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isPlaying ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>
                    <h3 className="font-semibold text-sm">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.duration}</p>
                    {isPlaying && (
                      <div className="flex gap-0.5 mt-3 h-4 items-end">
                        {Array.from({ length: 20 }).map((_, j) => (
                          <div key={j} className="flex-1 bg-purple-500/40 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${j * 0.1}s` }} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Timer */}
            <div className="mt-6 bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-3">Timer di Meditazione</h3>
              <div className="flex gap-2">
                {["5 min", "10 min", "15 min", "20 min", "30 min"].map((t, i) => (
                  <button key={t} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${i === 1 ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground hover:bg-purple-500/10 hover:text-purple-400"}`}>{t}</button>
                ))}
              </div>
              <button className="w-full mt-3 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20">Avvia Meditazione</button>
            </div>
          </div>
        )}

        {/* ═══ ANALYTICS ═══ */}
        {page === "analytics" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Analisi & Insight</h2>
            <p className="text-xs text-muted-foreground mb-6">Comprendi i tuoi pattern emotivi</p>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: "Media Umore", value: "3.0", sub: "questa settimana", color: "#8b5cf6" },
                { label: "Trend", value: "+15%", sub: "vs settimana scorsa", color: "#22c55e" },
                { label: "Streak", value: "7 giorni", sub: "consecutivi", color: "#f59e0b" },
                { label: "Energia Media", value: "6.1", sub: "/10", color: "#3b82f6" },
              ].map((k, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4">
                  <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                  <p className="text-[10px] text-muted-foreground/60">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Weekly mood + energy chart */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Umore Settimanale</h3>
                <div className="flex items-end gap-2 h-36">
                  {weeklyMoods.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-lg transition-all" style={{ height: `${(d.mood / 4) * 100}%`, backgroundColor: moods[d.mood - 1].color + "80" }} />
                      <span className="text-[10px] text-muted-foreground">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Energia Settimanale</h3>
                <div className="flex items-end gap-2 h-36">
                  {weeklyMoods.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-lg bg-blue-500/60 transition-all" style={{ height: `${d.energy * 10}%` }} />
                      <span className="text-[10px] text-muted-foreground">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Correlations */}
            <div className="bg-card border border-border rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" />Insight AI Personalizzati</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: "🏃", title: "Attività Fisica → Umore +", text: "Nei giorni in cui fai attività fisica, il tuo umore è in media del 35% più alto. Consiglio: integra almeno 20 minuti di movimento quotidiano." },
                  { icon: "😴", title: "Sonno → Energia", text: "C'è una forte correlazione tra qualità del sonno e livello energetico. Le notti dopo meditazione mostrano +2 punti energia il giorno dopo." },
                  { icon: "👥", title: "Socialità → Benessere", text: "I weekend con interazioni sociali producono i picchi di umore più alti. Considera di pianificare almeno un'attività sociale a settimana." },
                  { icon: "📅", title: "Pattern Settimanale", text: "Il lunedì è costantemente il tuo giorno più difficile. Prova a iniziare la settimana con un rituale piacevole: colazione speciale, musica preferita, 10 min di meditazione." },
                ].map((ins, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                    <span className="text-2xl shrink-0">{ins.icon}</span>
                    <div>
                      <p className="text-sm font-medium mb-0.5">{ins.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{ins.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags frequency */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-3">Tag più frequenti</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { tag: "lavoro", count: 5, mood: 2.6 }, { tag: "yoga", count: 3, mood: 3.3 }, { tag: "meditazione", count: 2, mood: 3.0 },
                  { tag: "amici", count: 2, mood: 4.0 }, { tag: "stress", count: 2, mood: 1.5 }, { tag: "natura", count: 2, mood: 4.0 },
                  { tag: "sonno", count: 2, mood: 3.0 }, { tag: "famiglia", count: 1, mood: 4.0 },
                ].map(t => (
                  <div key={t.tag} className="bg-muted rounded-lg px-3 py-2 text-xs">
                    <span className="font-medium">{t.tag}</span>
                    <span className="text-muted-foreground ml-1">({t.count}x)</span>
                    <span className="ml-1" style={{ color: moods[Math.round(t.mood) - 1]?.color }}>● {t.mood.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ PROFESSIONALS ═══ */}
        {page === "professionals" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Professionisti</h2>
            <p className="text-xs text-muted-foreground mb-6">Connettiti con psicologi e psicoterapeuti certificati</p>

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Brain className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">L&apos;AI non sostituisce un professionista</p>
                <p className="text-xs text-muted-foreground">Per supporto approfondito, ti consigliamo di parlare con un professionista qualificato. Tutti i professionisti sono verificati e iscritti all&apos;Albo.</p>
              </div>
            </div>

            <div className="space-y-4">
              {professionals.map((p, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400 font-bold text-lg border border-purple-500/20">
                      {p.photo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold">{p.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.available ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"}`}>
                          {p.available ? "Disponibile" : "Non disponibile"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{p.spec}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{p.rating}</span>
                        <span>{p.price}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="px-4 py-2 bg-purple-500 text-white rounded-lg text-xs font-medium hover:bg-purple-600 transition-colors" disabled={!p.available}>
                        Prenota
                      </button>
                      <button className="px-4 py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground">
                        Profilo
                      </button>
                    </div>
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
