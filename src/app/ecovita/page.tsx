"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Leaf, Trophy, Target, Flame, Droplets, Recycle, Bike, Zap,
  TreePine, Users, Settings, BarChart3, Award, Star, ChevronRight,
  TrendingUp, Calendar, MapPin, Heart, Sparkles, Gift, Shield,
  CheckCircle2, Clock, ArrowRight, Footprints, Sun, Wind
} from "lucide-react";
import MobileAppLayout from "@/components/MobileAppLayout";

/* ───────── DATA ───────── */
const missions = [
  { id: 1, title: "Zero Plastica per 7 giorni", desc: "Evita prodotti in plastica monouso per una settimana intera", points: 200, progress: 71, icon: Recycle, completed: false, category: "Rifiuti", difficulty: "Media", deadline: "15/02/2026", xp: 50 },
  { id: 2, title: "Settimana in Bicicletta", desc: "Vai al lavoro in bici per 5 giorni consecutivi", points: 300, progress: 60, icon: Bike, completed: false, category: "Mobilità", difficulty: "Difficile", deadline: "14/02/2026", xp: 75 },
  { id: 3, title: "Risparmio Energetico -15%", desc: "Riduci i tuoi consumi energetici del 15% rispetto al mese scorso", points: 250, progress: 100, icon: Zap, completed: true, category: "Energia", difficulty: "Media", deadline: "28/02/2026", xp: 60 },
  { id: 4, title: "Pianta un Albero", desc: "Partecipa alla piantumazione comunale al Parco Nord", points: 500, progress: 0, icon: TreePine, completed: false, category: "Verde", difficulty: "Facile", deadline: "22/02/2026", xp: 100 },
  { id: 5, title: "Doccia Breve Challenge", desc: "Massimo 5 minuti di doccia per 14 giorni consecutivi", points: 150, progress: 45, icon: Droplets, completed: false, category: "Acqua", difficulty: "Facile", deadline: "20/02/2026", xp: 35 },
  { id: 6, title: "Spesa a Km Zero", desc: "Acquista solo prodotti locali per 10 giorni", points: 350, progress: 30, icon: MapPin, completed: false, category: "Alimentazione", difficulty: "Media", deadline: "25/02/2026", xp: 80 },
  { id: 7, title: "Camminata Verde 50km", desc: "Accumula 50km a piedi in un mese", points: 400, progress: 82, icon: Footprints, completed: false, category: "Mobilità", difficulty: "Media", deadline: "28/02/2026", xp: 90 },
  { id: 8, title: "Energia Solare", desc: "Usa solo energia rinnovabile per la tua casa", points: 600, progress: 100, icon: Sun, completed: true, category: "Energia", difficulty: "Difficile", deadline: "01/02/2026", xp: 120 },
];

const leaderboard = [
  { name: "Giulia V.", points: 4280, level: "Eco Hero", badge: "🌟", avatar: "GV", streak: 45, missions: 28 },
  { name: "Marco T.", points: 3950, level: "Eco Hero", badge: "🌟", avatar: "MT", streak: 38, missions: 24 },
  { name: "Tu", points: 3200, level: "Eco Warrior", badge: "💚", isUser: true, avatar: "TU", streak: 21, missions: 18 },
  { name: "Sara L.", points: 2800, level: "Eco Warrior", badge: "💚", avatar: "SL", streak: 15, missions: 14 },
  { name: "Andrea B.", points: 2150, level: "Eco Starter", badge: "🌱", avatar: "AB", streak: 8, missions: 9 },
  { name: "Lucia R.", points: 1900, level: "Eco Starter", badge: "🌱", avatar: "LR", streak: 12, missions: 11 },
  { name: "Paolo F.", points: 1650, level: "Eco Starter", badge: "🌱", avatar: "PF", streak: 5, missions: 7 },
  { name: "Chiara M.", points: 1200, level: "Eco Novice", badge: "🍃", avatar: "CM", streak: 3, missions: 4 },
];

const esgMetrics = [
  { label: "CO₂ Risparmiata", value: "127 kg", change: "+18%", color: "#22c55e", icon: Wind },
  { label: "Acqua Risparmiata", value: "2.400 L", change: "+12%", color: "#3b82f6", icon: Droplets },
  { label: "Rifiuti Riciclati", value: "89%", change: "+5%", color: "#f59e0b", icon: Recycle },
  { label: "Energia Verde", value: "72%", change: "+22%", color: "#8b5cf6", icon: Zap },
];

const badges = [
  { name: "Primo Passo", desc: "Completa la tua prima missione", icon: "🌱", earned: true },
  { name: "Eco Warrior", desc: "Raggiungi 3000 punti", icon: "💚", earned: true },
  { name: "Streak Master", desc: "21 giorni consecutivi attivo", icon: "🔥", earned: true },
  { name: "Ricicla Pro", desc: "Completa 5 missioni Rifiuti", icon: "♻️", earned: true },
  { name: "Ciclista Verde", desc: "Completa 3 missioni Mobilità", icon: "🚴", earned: false },
  { name: "Eco Hero", desc: "Raggiungi 4000 punti", icon: "🌟", earned: false },
  { name: "Campione H₂O", desc: "Risparmia 5000L d'acqua", icon: "💧", earned: false },
  { name: "Leggenda Verde", desc: "Raggiungi livello Leggenda", icon: "👑", earned: false },
];

const weeklyData = [
  { day: "Lu", eco: 65, co2: 2.1 },
  { day: "Ma", eco: 42, co2: 1.4 },
  { day: "Me", eco: 78, co2: 2.8 },
  { day: "Gi", eco: 55, co2: 1.9 },
  { day: "Ve", eco: 90, co2: 3.2 },
  { day: "Sa", eco: 70, co2: 2.5 },
  { day: "Do", eco: 85, co2: 3.0 },
];

const missionCategories = ["Tutte", "Rifiuti", "Mobilità", "Energia", "Verde", "Acqua", "Alimentazione"];
const difficultyColors: Record<string, string> = { Facile: "#22c55e", Media: "#f59e0b", Difficile: "#ef4444" };

/* ───────── COMPONENT ───────── */
type Page = "dashboard" | "missions" | "leaderboard" | "badges" | "impact";

export default function EcoVitaPage() {
  const [page, setPage] = useState<Page>("dashboard");
  const [missionFilter, setMissionFilter] = useState("Tutte");
  const [selectedMission, setSelectedMission] = useState<typeof missions[0] | null>(null);

  const filteredMissions = missions.filter(m => missionFilter === "Tutte" || m.category === missionFilter);
  const totalPoints = 3200;
  const level = "Eco Warrior";
  const nextLevel = 4000;
  const streak = 21;
  const completedMissions = missions.filter(m => m.completed).length;
  const levelProgress = Math.round((totalPoints / nextLevel) * 100);

  const mobileNav = [
    { id: "dashboard", label: "Home", icon: BarChart3 },
    { id: "missions", label: "Missioni", icon: Target },
    { id: "leaderboard", label: "Classifica", icon: Trophy },
    { id: "badges", label: "Badge", icon: Award },
    { id: "impact", label: "Impatto", icon: TrendingUp },
  ];

  return (
    <MobileAppLayout appName="EcoVita" accentColor="#22c55e" navItems={mobileNav} activePage={page} onPageChange={(p) => setPage(p as Page)} sidebar={<>
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-lime-500 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">EcoVita</h1>
              <p className="text-[10px] text-muted-foreground">Sostenibilità Gamificata</p>
            </div>
          </div>
        </div>

        {/* Level card */}
        <div className="p-3 border-b border-border">
          <div className="bg-gradient-to-br from-green-500/10 to-lime-500/10 border border-green-500/20 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-green-400">{level} 💚</span>
              <span className="text-[10px] text-muted-foreground">{totalPoints}/{nextLevel}</span>
            </div>
            <div className="bg-muted rounded-full h-2 mb-1.5">
              <div className="bg-gradient-to-r from-green-500 to-lime-400 h-2 rounded-full" style={{ width: `${levelProgress}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-0.5"><Flame className="w-2.5 h-2.5 text-orange-400" />{streak} giorni streak</span>
              <span>{nextLevel - totalPoints} pt al prossimo</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "dashboard" as Page, label: "Dashboard", icon: BarChart3 },
            { key: "missions" as Page, label: "Missioni", icon: Target, badge: missions.filter(m => !m.completed).length },
            { key: "leaderboard" as Page, label: "Classifica", icon: Trophy },
            { key: "badges" as Page, label: "Badge", icon: Award, badge: badges.filter(b => b.earned).length },
            { key: "impact" as Page, label: "Impatto", icon: TrendingUp },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                page === key ? "bg-green-500/10 text-green-400" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge && <span className="text-[10px] bg-green-500/20 text-green-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-lime-500 flex items-center justify-center text-xs font-bold text-white">TU</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Il Tuo Profilo</p>
              <p className="text-[10px] text-muted-foreground">{totalPoints.toLocaleString()} punti</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><Settings className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </>}>

        {/* ═══ DASHBOARD ═══ */}
        {page === "dashboard" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Dashboard</h2>
            <p className="text-xs text-muted-foreground mb-6">Il tuo percorso verso la sostenibilità</p>

            {/* Hero score card */}
            <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-lime-500/10 border border-green-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-lime-500 flex items-center justify-center shadow-xl shadow-green-500/20">
                  <div className="text-center">
                    <Leaf className="w-8 h-8 text-white mx-auto mb-0.5" />
                    <span className="text-[10px] text-white/80 font-medium">SCORE</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-4xl font-bold text-green-400 mb-0.5">{totalPoints.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mb-3">Livello: <strong className="text-green-400">{level}</strong> • Posizione #3 in classifica</p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span><strong>{streak}</strong> giorni streak</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span><strong>{completedMissions}</strong> missioni completate</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span><strong>{badges.filter(b => b.earned).length}</strong> badge ottenuti</span>
                    </div>
                  </div>
                </div>
                <div className="text-center shrink-0">
                  <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center mb-1">
                    <span className="text-lg font-bold text-green-400">{levelProgress}%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Prossimo livello</p>
                </div>
              </div>
            </div>

            {/* ESG Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {esgMetrics.map(m => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="bg-card border border-border rounded-xl p-5 hover:border-green-500/30 transition-colors cursor-pointer" onClick={() => setPage("impact")}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.color + "15" }}>
                        <Icon className="w-5 h-5" style={{ color: m.color }} />
                      </div>
                      <span className="text-xs font-medium text-green-400">{m.change}</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Active missions + Weekly */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Missioni Attive</h3>
                  <button onClick={() => setPage("missions")} className="text-xs text-green-400 hover:underline">Vedi tutte</button>
                </div>
                <div className="space-y-3">
                  {missions.filter(m => !m.completed && m.progress > 0).slice(0, 4).map(m => {
                    const Icon = m.icon;
                    return (
                      <div key={m.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-green-500/10">
                          <Icon className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{m.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex-1 bg-muted rounded-full h-1.5">
                              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${m.progress}%` }} />
                            </div>
                            <span className="text-[10px] text-muted-foreground">{m.progress}%</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-green-400 font-medium shrink-0">+{m.points}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Impatto Settimanale</h3>
                <div className="flex items-end gap-2 h-36">
                  {weeklyData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                      <div className="relative w-full">
                        <div className="w-full bg-gradient-to-t from-green-500 to-lime-400 rounded-t-lg transition-all opacity-70 group-hover:opacity-100" style={{ height: `${d.eco * 1.3}px` }} />
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-green-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">{d.eco}</div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent badges */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Badge Recenti</h3>
                <button onClick={() => setPage("badges")} className="text-xs text-green-400 hover:underline">Vedi tutti</button>
              </div>
              <div className="flex gap-4">
                {badges.filter(b => b.earned).map((b, i) => (
                  <div key={i} className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-2xl mb-1">{b.icon}</div>
                    <p className="text-[10px] font-medium">{b.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ MISSIONS ═══ */}
        {page === "missions" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Missioni</h2>
            <p className="text-xs text-muted-foreground mb-6">{missions.filter(m => !m.completed).length} missioni attive • {completedMissions} completate</p>

            <div className="flex gap-2 mb-6 flex-wrap">
              {missionCategories.map(c => (
                <button key={c} onClick={() => setMissionFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${missionFilter === c ? "bg-green-500 text-white" : "bg-card border border-border text-muted-foreground"}`}>{c}</button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMissions.map(m => {
                const Icon = m.icon;
                return (
                  <div key={m.id} className={`bg-card border rounded-2xl p-5 transition-all hover:shadow-lg cursor-pointer ${m.completed ? "border-green-500/30 bg-green-500/5 hover:shadow-green-500/5" : "border-border hover:border-green-500/30 hover:shadow-green-500/5"}`}
                    onClick={() => setSelectedMission(selectedMission?.id === m.id ? null : m)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${m.completed ? "bg-green-500" : "bg-green-500/10"}`}>
                        <Icon className={`w-6 h-6 ${m.completed ? "text-white" : "text-green-400"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{m.title}</h3>
                          {m.completed && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{m.desc}</p>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] bg-muted rounded-md px-1.5 py-0.5 text-muted-foreground">{m.category}</span>
                          <span className="text-[10px] font-medium" style={{ color: difficultyColors[m.difficulty] }}>{m.difficulty}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{m.deadline}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div className={`h-2 rounded-full ${m.completed ? "bg-green-500" : "bg-gradient-to-r from-green-500 to-lime-400"}`} style={{ width: `${m.progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{m.progress}%</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-green-400">+{m.points}</p>
                        <p className="text-[10px] text-muted-foreground">+{m.xp} XP</p>
                      </div>
                    </div>

                    {selectedMission?.id === m.id && !m.completed && (
                      <div className="mt-4 pt-4 border-t border-border flex gap-2">
                        <button className="flex-1 py-2 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600">Registra Progresso</button>
                        <button className="px-4 py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground">Dettagli</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ LEADERBOARD ═══ */}
        {page === "leaderboard" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Classifica</h2>
            <p className="text-xs text-muted-foreground mb-6">Classifica mensile — Febbraio 2026</p>

            {/* Podium */}
            <div className="flex items-end justify-center gap-4 mb-8 pt-8">
              {[leaderboard[1], leaderboard[0], leaderboard[2]].map((u, i) => {
                const pos = [2, 1, 3][i];
                const heights = ["h-28", "h-36", "h-24"];
                const sizes = ["w-14 h-14", "w-18 h-18", "w-14 h-14"];
                return (
                  <div key={pos} className="flex flex-col items-center">
                    <span className="text-3xl mb-2">{u.badge}</span>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${pos === 1 ? "from-yellow-400 to-amber-500" : pos === 2 ? "from-gray-300 to-gray-400" : "from-orange-400 to-orange-500"} flex items-center justify-center text-white font-bold text-lg mb-2 shadow-lg`}>
                      {u.avatar}
                    </div>
                    <p className="text-sm font-bold mb-0.5">{u.name} {u.isUser && <span className="text-green-400">(Tu)</span>}</p>
                    <p className="text-xs text-green-400 font-semibold mb-2">{u.points.toLocaleString()} pt</p>
                    <div className={`${heights[i]} w-24 rounded-t-xl flex items-start justify-center pt-3 ${pos === 1 ? "bg-gradient-to-t from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30" : pos === 2 ? "bg-gradient-to-t from-gray-500/20 to-gray-500/5 border border-gray-500/30" : "bg-gradient-to-t from-orange-500/20 to-orange-500/5 border border-orange-500/30"}`}>
                      <span className="text-2xl font-bold text-muted-foreground">#{pos}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full list */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {leaderboard.map((u, i) => (
                <div key={i} className={`flex items-center gap-4 px-5 py-4 border-b border-border/50 last:border-0 ${u.isUser ? "bg-green-500/5" : "hover:bg-muted/50"} transition-colors`}>
                  <span className={`text-lg font-bold w-6 text-center ${i < 3 ? "text-green-400" : "text-muted-foreground"}`}>{i + 1}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${u.isUser ? "bg-gradient-to-br from-green-500 to-lime-500 text-white" : "bg-green-500/10 text-green-400"}`}>{u.avatar}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{u.name} {u.isUser && <span className="text-xs text-green-400">(Tu)</span>}</p>
                    <p className="text-xs text-muted-foreground">{u.level} • {u.missions} missioni</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground"><Flame className="w-3 h-3 text-orange-400" />{u.streak}d</span>
                    <span className="text-2xl">{u.badge}</span>
                    <span className="font-bold text-green-400 text-sm w-16 text-right">{u.points.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ BADGES ═══ */}
        {page === "badges" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Badge & Riconoscimenti</h2>
            <p className="text-xs text-muted-foreground mb-6">{badges.filter(b => b.earned).length}/{badges.length} badge ottenuti</p>

            <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((b, i) => (
                <div key={i} className={`rounded-2xl p-5 text-center transition-all ${b.earned ? "bg-card border border-green-500/30 shadow-lg shadow-green-500/5" : "bg-card/50 border border-border opacity-50"}`}>
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl ${b.earned ? "bg-green-500/10 border border-green-500/20" : "bg-muted"}`}>
                    {b.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-0.5">{b.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{b.desc}</p>
                  {b.earned && <p className="text-[10px] text-green-400 mt-2 font-medium">Ottenuto ✓</p>}
                  {!b.earned && <p className="text-[10px] text-muted-foreground mt-2">Bloccato</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ IMPACT ═══ */}
        {page === "impact" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Il Tuo Impatto</h2>
            <p className="text-xs text-muted-foreground mb-6">Analisi dettagliata del tuo contributo ambientale</p>

            {/* Big metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {esgMetrics.map(m => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.color + "15" }}>
                        <Icon className="w-6 h-6" style={{ color: m.color }} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                        <p className="text-3xl font-bold" style={{ color: m.color }}>{m.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">{m.change} rispetto al mese scorso</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weekly trend */}
            <div className="bg-card border border-border rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-sm mb-4">Trend Settimanale Eco-Score</h3>
              <div className="flex items-end gap-3 h-40">
                {weeklyData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="relative w-full">
                      <div className="w-full bg-gradient-to-t from-green-500 to-lime-400 rounded-lg transition-all opacity-60 group-hover:opacity-100" style={{ height: `${d.eco * 1.5}px` }} />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-green-400 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border rounded px-1.5 py-0.5">{d.eco}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">{d.day}</span>
                    <span className="text-[10px] text-muted-foreground">{d.co2} kg</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equivalences */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-4">Equivalenze del Tuo Impatto</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { equiv: "6 alberi piantati", desc: "equivalenti in CO₂ assorbita", icon: "🌳" },
                  { equiv: "48 docce", desc: "equivalenti in acqua risparmiata", icon: "🚿" },
                  { equiv: "320 km in auto", desc: "equivalenti in emissioni evitate", icon: "🚗" },
                ].map((e, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                    <span className="text-3xl">{e.icon}</span>
                    <p className="text-sm font-bold mt-2 text-green-400">{e.equiv}</p>
                    <p className="text-[10px] text-muted-foreground">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
    </MobileAppLayout>
  );
}
