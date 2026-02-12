"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, MousePointerClick, Heart, MessageCircle, Flame, Trophy, Star,
  Zap, Users, Settings, Target, Crown, Share2,
  Clock, ChevronRight
} from "lucide-react";
import MobileAppLayout from "@/components/MobileAppLayout";

/* ───────── DATA ───────── */
const feed = [
  { id: 1, user: "Ale_92", emoji: "🔥", challenge: "Tap più veloce in 10 secondi", taps: 847, likes: 234, comments: 18, time: "3 min fa", badge: "Speed King", badgeColor: "#ef4444" },
  { id: 2, user: "MartaX", emoji: "⚡", challenge: "Reazione più veloce del server", taps: 0, likes: 189, comments: 12, time: "12 min fa", badge: "Flash", badgeColor: "#f59e0b", reaction: "0.18s" },
  { id: 3, user: "Gio_Dev", emoji: "🎯", challenge: "Precisione al centro — 50/50", taps: 50, likes: 156, comments: 8, time: "30 min fa", badge: "Sniper", badgeColor: "#22c55e", accuracy: "98%" },
  { id: 4, user: "Sara_Fun", emoji: "💥", challenge: "Combo chain x100 senza errori!", taps: 100, likes: 312, comments: 24, time: "1h fa", badge: "Combo Master", badgeColor: "#8b5cf6" },
  { id: 5, user: "LucaP", emoji: "🏆", challenge: "Sfida settimanale completata — Top 3!", taps: 5200, likes: 445, comments: 35, time: "2h fa", badge: "Champion", badgeColor: "#06b6d4" },
  { id: 6, user: "FedericaM", emoji: "✨", challenge: "Primo posto nella classifica giornaliera", taps: 920, likes: 567, comments: 42, time: "3h fa", badge: "Queen", badgeColor: "#ec4899" },
];

const leaderboard = [
  { pos: 1, user: "FedericaM", score: 48200, streak: 15, emoji: "👑" },
  { pos: 2, user: "Ale_92", score: 45800, streak: 12, emoji: "🥈" },
  { pos: 3, user: "LucaP", score: 42100, streak: 9, emoji: "🥉" },
  { pos: 4, user: "Sara_Fun", score: 38400, streak: 7, emoji: "💪" },
  { pos: 5, user: "MartaX", score: 35200, streak: 5, emoji: "⚡" },
  { pos: 6, user: "Gio_Dev", score: 32800, streak: 4, emoji: "🎯" },
  { pos: 7, user: "Tu", score: 28500, streak: 3, emoji: "🔥" },
];

const dailyChallenges = [
  { title: "Tap Sprint", desc: "Fai 500 tap in 30 secondi", reward: 100, icon: Zap, progress: 340, target: 500, color: "#06b6d4" },
  { title: "Social Butterfly", desc: "Interagisci con 10 utenti", reward: 75, icon: Users, progress: 7, target: 10, color: "#8b5cf6" },
  { title: "Hot Streak", desc: "3 vittorie consecutive", reward: 150, icon: Flame, progress: 2, target: 3, color: "#ef4444" },
  { title: "Precisione", desc: "95%+ accuratezza in 5 partite", reward: 200, icon: Target, progress: 3, target: 5, color: "#22c55e" },
  { title: "Speed Demon", desc: "Supera 80 tap in 10 secondi", reward: 250, icon: Trophy, progress: 0, target: 1, color: "#f59e0b" },
];

const achievements = [
  { name: "Primo Tap", desc: "Gioca la tua prima partita", unlocked: true, icon: "🎮" },
  { name: "Speed King", desc: "100+ tap in 10 secondi", unlocked: true, icon: "👑" },
  { name: "Social Star", desc: "50 interazioni totali", unlocked: true, icon: "⭐" },
  { name: "Combo Legend", desc: "Chain x200 senza errori", unlocked: false, icon: "🔗" },
  { name: "Weekly Champion", desc: "Top 3 classifica settimanale", unlocked: false, icon: "🏆" },
  { name: "Perfect Score", desc: "100% accuratezza", unlocked: false, icon: "💎" },
];

/* ───────── COMPONENT ───────── */
type Page = "feed" | "play" | "challenges" | "leaderboard" | "profile";

export default function TapMePage() {
  const [page, setPage] = useState<Page>("feed");
  const [tapCount, setTapCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [bestScore] = useState(72);

  const startGame = () => {
    setTapCount(0);
    setTimeLeft(10);
    setIsPlaying(true);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const mobileNav = [
    { id: "feed", label: "Feed", icon: Flame },
    { id: "play", label: "Gioca!", icon: MousePointerClick },
    { id: "challenges", label: "Sfide", icon: Trophy },
    { id: "leaderboard", label: "Classifica", icon: Crown },
    { id: "profile", label: "Profilo", icon: Star },
  ];

  return (
    <MobileAppLayout appName="TapMe!" accentColor="#06b6d4" navItems={mobileNav} activePage={page} onPageChange={(p) => setPage(p as Page)} sidebar={<>
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">TapMe!</h1>
              <p className="text-[10px] text-muted-foreground">Micro-Social Gamificato</p>
            </div>
          </div>
        </div>

        <div className="p-3 border-b border-border">
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm font-bold text-cyan-400">28.5K</p>
                <p className="text-[10px] text-muted-foreground">Punti</p>
              </div>
              <div>
                <p className="text-sm font-bold text-amber-400">Lv.12</p>
                <p className="text-[10px] text-muted-foreground">Livello</p>
              </div>
              <div>
                <p className="text-sm font-bold text-pink-400">3🔥</p>
                <p className="text-[10px] text-muted-foreground">Streak</p>
              </div>
            </div>
            <div className="mt-2 bg-muted rounded-full h-1.5">
              <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: "65%" }} />
            </div>
            <p className="text-[9px] text-muted-foreground text-center mt-0.5">6.500 / 10.000 XP al Livello 13</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "feed" as Page, label: "Feed", icon: Flame },
            { key: "play" as Page, label: "Gioca!", icon: MousePointerClick },
            { key: "challenges" as Page, label: "Sfide", icon: Trophy, badge: dailyChallenges.filter(c => c.progress < c.target).length },
            { key: "leaderboard" as Page, label: "Classifica", icon: Crown },
            { key: "profile" as Page, label: "Profilo", icon: Star },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button key={key} onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                page === key ? "bg-cyan-500/10 text-cyan-400" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge !== undefined && <span className="text-[10px] bg-cyan-500/20 text-cyan-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">🔥</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">@TuoUsername</p>
              <p className="text-[10px] text-cyan-400">Rank #7 globale</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><Settings className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </>}>

        {/* ═══ FEED ═══ */}
        {page === "feed" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Feed</h2>
            <p className="text-xs text-muted-foreground mb-6">Cosa succede nella community</p>

            <div className="space-y-4 max-w-2xl">
              {feed.map(f => (
                <div key={f.id} className="bg-card border border-border rounded-2xl p-5 hover:border-cyan-500/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-lg">{f.emoji}</div>
                      <div>
                        <p className="font-bold text-sm">{f.user}</p>
                        <p className="text-[10px] text-muted-foreground">{f.time}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-bold" style={{ color: f.badgeColor, backgroundColor: f.badgeColor + "15" }}>{f.badge}</span>
                  </div>
                  <p className="text-sm mb-3">{f.challenge}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {f.taps > 0 && <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3 text-cyan-400" />{f.taps.toLocaleString()} tap</span>}
                    {f.reaction && <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" />{f.reaction}</span>}
                    {f.accuracy && <span className="flex items-center gap-1"><Target className="w-3 h-3 text-green-400" />{f.accuracy}</span>}
                    <span className="flex-1" />
                    <button className="flex items-center gap-1 hover:text-pink-400 transition-colors"><Heart className="w-3.5 h-3.5" />{f.likes}</button>
                    <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors"><MessageCircle className="w-3.5 h-3.5" />{f.comments}</button>
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors"><Share2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PLAY ═══ */}
        {page === "play" && (
          <div className="p-6 flex flex-col items-center">
            <h2 className="text-lg font-bold mb-1 self-start">Gioca!</h2>
            <p className="text-xs text-muted-foreground mb-6 self-start">Sfida te stesso e la community</p>

            <div className="w-full max-w-md">
              <div className="bg-card border border-border rounded-3xl p-8 text-center">
                {!isPlaying && timeLeft === 10 ? (
                  <>
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                      <MousePointerClick className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Tap Speed Challenge</h3>
                    <p className="text-sm text-muted-foreground mb-2">Quanti tap riesci a fare in 10 secondi?</p>
                    <p className="text-xs text-cyan-400 mb-6">Il tuo record: <strong>{bestScore} tap</strong></p>
                    <button onClick={startGame} className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-xl hover:opacity-90 transition-all shadow-lg shadow-cyan-500/30">START!</button>
                  </>
                ) : isPlaying ? (
                  <>
                    <div className="mb-2">
                      <p className="text-7xl font-black text-cyan-400">{tapCount}</p>
                      <p className="text-xs text-muted-foreground">tap</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <p className="text-2xl font-bold text-amber-400">{timeLeft}s</p>
                    </div>
                    <button
                      onMouseDown={() => setTapCount(prev => prev + 1)}
                      className="w-44 h-44 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-3xl font-black shadow-2xl shadow-cyan-500/30 active:scale-90 transition-transform select-none hover:shadow-cyan-500/50"
                    >
                      TAP!
                    </button>
                    <p className="text-xs text-muted-foreground mt-3">Tappa più veloce che puoi!</p>
                  </>
                ) : (
                  <>
                    <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-3" />
                    <h3 className="text-xl font-bold mb-1">Risultato!</h3>
                    <p className="text-6xl font-black text-cyan-400 mb-1">{tapCount}</p>
                    <p className="text-sm text-muted-foreground mb-2">tap in 10 secondi</p>
                    <p className="text-lg mb-4">
                      {tapCount > 80 ? "🏆 Incredibile! Record mondiale!" : tapCount > 60 ? "🔥 Ottimo lavoro!" : tapCount > 40 ? "👍 Bene, migliora!" : "💪 Continua a provare!"}
                    </p>
                    {tapCount > bestScore && <p className="text-sm text-green-400 font-bold mb-3">🎉 Nuovo record personale!</p>}
                    <div className="flex gap-3 justify-center">
                      <button onClick={startGame} className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:opacity-90">Rigioca</button>
                      <button className="px-6 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><Share2 className="w-3.5 h-3.5" />Condividi</button>
                    </div>
                  </>
                )}
              </div>

              {/* Game modes */}
              {!isPlaying && timeLeft === 10 && (
                <div className="mt-6 space-y-2">
                  <p className="text-xs text-muted-foreground font-semibold">Altre modalità</p>
                  {[
                    { name: "Reazione Rapida", desc: "Tappa appena vedi il segnale", icon: Zap, color: "#f59e0b" },
                    { name: "Precisione", desc: "Centra il bersaglio mobile", icon: Target, color: "#22c55e" },
                    { name: "Combo Chain", desc: "Mantieni il ritmo senza errori", icon: Flame, color: "#ef4444" },
                  ].map(m => (
                    <div key={m.name} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 hover:border-cyan-500/30 cursor-pointer transition-colors">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: m.color + "15" }}>
                        <m.icon className="w-4 h-4" style={{ color: m.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold">{m.name}</p>
                        <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ CHALLENGES ═══ */}
        {page === "challenges" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Sfide</h2>
            <p className="text-xs text-muted-foreground mb-6">Completa sfide per guadagnare XP e badge</p>

            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-semibold">Sfide Giornaliere</h3>
              {dailyChallenges.map((c, i) => {
                const Icon = c.icon;
                const pct = Math.round((c.progress / c.target) * 100);
                const done = c.progress >= c.target;
                return (
                  <div key={i} className={`bg-card border rounded-2xl p-5 ${done ? "border-green-500/30 bg-green-500/5" : "border-border"}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: c.color + "15" }}>
                        <Icon className="w-6 h-6" style={{ color: c.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="font-bold text-sm">{c.title}</h4>
                          <span className="text-xs font-bold text-amber-400">+{c.reward} XP</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{c.desc}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2.5">
                            <div className="h-2.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: done ? "#22c55e" : c.color }} />
                          </div>
                          <span className="text-xs font-bold" style={{ color: done ? "#22c55e" : c.color }}>{c.progress}/{c.target}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <h3 className="text-sm font-semibold mt-6">Traguardi</h3>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((a, i) => (
                  <div key={i} className={`bg-card border rounded-2xl p-4 text-center ${a.unlocked ? "border-cyan-500/30" : "border-border opacity-50"}`}>
                    <span className="text-3xl block mb-2">{a.icon}</span>
                    <p className="text-xs font-bold">{a.name}</p>
                    <p className="text-[10px] text-muted-foreground">{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ LEADERBOARD ═══ */}
        {page === "leaderboard" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Classifica</h2>
            <p className="text-xs text-muted-foreground mb-6">Top giocatori della settimana</p>

            <div className="max-w-2xl">
              {/* Podium */}
              <div className="flex items-end justify-center gap-4 mb-8">
                {[leaderboard[1], leaderboard[0], leaderboard[2]].map((p, i) => {
                  const heights = ["h-28", "h-36", "h-24"];
                  const colors = ["#c0c0c0", "#f59e0b", "#cd7f32"];
                  return (
                    <div key={p.pos} className="text-center flex-1 max-w-[140px]">
                      <span className="text-3xl block mb-1">{p.emoji}</span>
                      <p className="text-xs font-bold mb-2">{p.user}</p>
                      <div className={`${heights[i]} rounded-t-2xl flex flex-col items-center justify-center`} style={{ backgroundColor: colors[i] + "20", borderTop: `3px solid ${colors[i]}` }}>
                        <p className="text-lg font-black" style={{ color: colors[i] }}>#{p.pos}</p>
                        <p className="text-xs font-bold">{p.score.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">{p.streak}🔥 streak</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Full list */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {leaderboard.map((p) => (
                  <div key={p.pos} className={`flex items-center gap-4 px-5 py-3.5 border-b border-border/50 last:border-0 ${p.user === "Tu" ? "bg-cyan-500/5" : "hover:bg-muted/30"} transition-colors`}>
                    <span className="w-8 text-center text-sm font-bold" style={{ color: p.pos <= 3 ? ["#f59e0b", "#c0c0c0", "#cd7f32"][p.pos - 1] : undefined }}>#{p.pos}</span>
                    <span className="text-lg">{p.emoji}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${p.user === "Tu" ? "text-cyan-400" : ""}`}>{p.user}</p>
                      <p className="text-[10px] text-muted-foreground">{p.streak} giorni di streak</p>
                    </div>
                    <p className="text-sm font-bold">{p.score.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ PROFILE ═══ */}
        {page === "profile" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Il Tuo Profilo</h2>
            <p className="text-xs text-muted-foreground mb-6">Statistiche e progressi</p>

            <div className="grid grid-cols-3 gap-4 max-w-3xl">
              <div className="col-span-2 space-y-4">
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl">🔥</div>
                    <div>
                      <h3 className="text-lg font-bold">@TuoUsername</h3>
                      <p className="text-xs text-muted-foreground">Membro da Gennaio 2026 • Livello 12</p>
                      <p className="text-sm text-cyan-400 font-bold">28.500 punti totali</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { l: "Partite", v: "342", icon: MousePointerClick, color: "#06b6d4" },
                    { l: "Vittorie", v: "89", icon: Trophy, color: "#f59e0b" },
                    { l: "Record", v: `${bestScore}`, icon: Star, color: "#ef4444" },
                    { l: "Streak", v: "3🔥", icon: Flame, color: "#8b5cf6" },
                  ].map(s => (
                    <div key={s.l} className="bg-card border border-border rounded-xl p-4 text-center">
                      <s.icon className="w-5 h-5 mx-auto mb-1" style={{ color: s.color }} />
                      <p className="text-lg font-bold">{s.v}</p>
                      <p className="text-[10px] text-muted-foreground">{s.l}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Attività Recente</h3>
                  <div className="flex items-end gap-1.5 h-24">
                    {[45, 62, 38, 72, 55, 80, 67, 90, 48, 75, 85, 60, 70, 58].map((v, i) => (
                      <div key={i} className="flex-1 group cursor-pointer">
                        <div className="w-full rounded-t-md opacity-60 group-hover:opacity-100 transition-all" style={{ height: `${v}%`, backgroundColor: `hsl(${185 + v * 0.5}, 80%, 50%)` }} />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-1">Tap per sessione — Ultimi 14 giorni</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Badge</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {achievements.filter(a => a.unlocked).map((a, i) => (
                      <div key={i} className="text-center p-2 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                        <span className="text-xl block">{a.icon}</span>
                        <p className="text-[9px] mt-0.5">{a.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Rank</h3>
                  <div className="text-center">
                    <p className="text-4xl font-black text-cyan-400">#7</p>
                    <p className="text-xs text-muted-foreground">Classifica globale</p>
                    <p className="text-[10px] text-green-400 mt-1">+2 posizioni questa settimana</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </MobileAppLayout>
  );
}
