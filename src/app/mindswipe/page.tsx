"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Sparkles, Heart, X, Star, MessageCircle, Music, BookOpen,
  Coffee, Send, Settings, MapPin, Briefcase, GraduationCap, Camera,
  Shield, Eye, ChevronRight, ThumbsUp, Flame, Zap, Award
} from "lucide-react";
import MobileAppLayout from "@/components/MobileAppLayout";

/* ───────── DATA ───────── */
const profiles = [
  { id: 1, name: "Elena", age: 28, city: "Milano", job: "Art Director", bio: "Amante dell'arte e dei viaggi. Cerco connessioni autentiche e profonde. Mi trovi spesso nei musei o a fotografare tramonti.", interests: ["Arte", "Viaggi", "Fotografia", "Cucina", "Yoga"], compatibility: 92, emoji: "🎨", values: ["Creatività", "Empatia", "Avventura"], photos: 6, verified: true },
  { id: 2, name: "Marco", age: 31, city: "Roma", job: "Software Engineer", bio: "Sviluppatore di giorno, musicista di notte. Amo le conversazioni profonde e i concerti dal vivo.", interests: ["Musica", "Tech", "Filosofia", "Chitarra", "Cinema"], compatibility: 87, emoji: "🎸", values: ["Intelletto", "Passione", "Umorismo"], photos: 4, verified: true },
  { id: 3, name: "Sofia", age: 26, city: "Firenze", job: "Scrittrice", bio: "Scrittrice e sognatrice. Il caffè è il mio linguaggio d'amore. Sto scrivendo il mio secondo romanzo.", interests: ["Scrittura", "Caffè", "Cinema", "Poesia", "Gatti"], compatibility: 95, emoji: "📝", values: ["Creatività", "Sensibilità", "Cultura"], photos: 8, verified: false },
  { id: 4, name: "Luca", age: 33, city: "Napoli", job: "Chef", bio: "Chef amatoriale, runner e appassionato di storia. La cucina è il mio modo di dire ti voglio bene.", interests: ["Cucina", "Running", "Storia", "Vino", "Mare"], compatibility: 78, emoji: "🍳", values: ["Generosità", "Dedizione", "Semplicità"], photos: 5, verified: true },
  { id: 5, name: "Giulia", age: 29, city: "Bologna", job: "Psicologa", bio: "Psicologa. Credo nell'empatia come superpotere. Amo ascoltare le storie delle persone.", interests: ["Psicologia", "Yoga", "Natura", "Meditazione", "Libri"], compatibility: 91, emoji: "🧘", values: ["Empatia", "Crescita", "Equilibrio"], photos: 7, verified: true },
  { id: 6, name: "Alessandro", age: 30, city: "Torino", job: "Architetto", bio: "Architetto con passione per il design sostenibile. Cerco qualcuno che ami esplorare.", interests: ["Architettura", "Design", "Montagna", "Sci", "Fotografia"], compatibility: 84, emoji: "🏗️", values: ["Creatività", "Sostenibilità", "Avventura"], photos: 5, verified: true },
];

const matches = [
  { name: "Anna L.", lastMsg: "Mi piacerebbe approfondire quella conversazione!", time: "2h", unread: 2, compat: 94, emoji: "💃", online: true },
  { name: "Roberto M.", lastMsg: "Hai visto la mostra al Palazzo Reale?", time: "5h", unread: 0, compat: 88, emoji: "🎭", online: false },
  { name: "Chiara B.", lastMsg: "Certo, ci vediamo sabato!", time: "1g", unread: 0, compat: 91, emoji: "🌸", online: true },
  { name: "Matteo D.", lastMsg: "Quella playlist era fantastica!", time: "2g", unread: 1, compat: 86, emoji: "🎵", online: false },
  { name: "Valentina R.", lastMsg: "Ti mando la ricetta stasera", time: "3g", unread: 0, compat: 82, emoji: "🍕", online: false },
];

const chatMessages = [
  { role: "them", text: "Ciao! Ho visto che anche tu ami la fotografia. Che tipo di foto scatti di solito?", time: "14:20" },
  { role: "me", text: "Ciao Anna! Soprattutto street photography e paesaggi. Tu?", time: "14:25" },
  { role: "them", text: "Io adoro i ritratti! C'è qualcosa di magico nel catturare le emozioni delle persone. Hai un fotografo preferito?", time: "14:28" },
  { role: "me", text: "Vivian Maier, senza dubbio. La sua storia è incredibile. E tu?", time: "14:32" },
  { role: "them", text: "Mi piacerebbe approfondire quella conversazione! Magari davanti a un caffè? ☕", time: "14:35" },
];

const myInterests = [
  { name: "Musica", icon: Music }, { name: "Lettura", icon: BookOpen },
  { name: "Caffè", icon: Coffee }, { name: "Tech", icon: Sparkles },
  { name: "Fotografia", icon: Camera }, { name: "Viaggi", icon: MapPin },
];

/* ───────── COMPONENT ───────── */
type Page = "swipe" | "matches" | "chat" | "profile" | "insights";

export default function MindSwipePage() {
  const [page, setPage] = useState<Page>("swipe");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [animation, setAnimation] = useState<"left" | "right" | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<typeof matches[0] | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [msgs, setMsgs] = useState(chatMessages);

  const handleSwipe = (direction: "left" | "right") => {
    setAnimation(direction);
    if (direction === "right") setLiked([...liked, profiles[currentIndex].id]);
    setTimeout(() => {
      setAnimation(null);
      setCurrentIndex((prev) => (prev + 1) % profiles.length);
    }, 300);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setMsgs([...msgs, { role: "me", text: chatInput, time: "Ora" }]);
    setChatInput("");
  };

  const current = profiles[currentIndex];

  const mobileNav = [
    { id: "swipe", label: "Scopri", icon: Sparkles },
    { id: "matches", label: "Match", icon: Heart },
    { id: "profile", label: "Profilo", icon: Star },
    { id: "insights", label: "Insights", icon: Zap },
  ];

  return (
    <MobileAppLayout appName="MindSwipe" accentColor="#06b6d4" navItems={mobileNav} activePage={page} onPageChange={(p) => setPage(p as Page)} sidebar={<>
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">MindSwipe</h1>
              <p className="text-[10px] text-muted-foreground">Connessioni Empatiche</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-border">
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm font-bold text-cyan-400">{liked.length}</p>
                <p className="text-[10px] text-muted-foreground">Like</p>
              </div>
              <div>
                <p className="text-sm font-bold text-pink-400">{matches.length}</p>
                <p className="text-[10px] text-muted-foreground">Match</p>
              </div>
              <div>
                <p className="text-sm font-bold text-amber-400">87</p>
                <p className="text-[10px] text-muted-foreground">Empatia</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "swipe" as Page, label: "Scopri", icon: Sparkles },
            { key: "matches" as Page, label: "Match", icon: Heart, badge: matches.filter(m => m.unread > 0).length },
            { key: "profile" as Page, label: "Il Mio Profilo", icon: Star },
            { key: "insights" as Page, label: "AI Insights", icon: Zap },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                page === key || (page === "chat" && key === "matches") ? "bg-cyan-500/10 text-cyan-400" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge !== undefined && badge > 0 && <span className="text-[10px] bg-pink-500/20 text-pink-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}

          <div className="pt-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Match Recenti</p>
            {matches.slice(0, 4).map((m, i) => (
              <button key={i} onClick={() => { setSelectedMatch(m); setPage("chat"); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <div className="relative">
                  <span className="text-sm">{m.emoji}</span>
                  {m.online && <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border border-card" />}
                </div>
                <span className="flex-1 text-left truncate">{m.name}</span>
                {m.unread > 0 && <span className="w-4 h-4 rounded-full bg-cyan-500 text-white text-[9px] flex items-center justify-center">{m.unread}</span>}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white">TU</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Il Tuo Profilo</p>
              <p className="text-[10px] text-green-400">Online</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><Settings className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </>}>

        {/* ═══ SWIPE ═══ */}
        {page === "swipe" && (
          <div className="p-6 flex flex-col items-center">
            <h2 className="text-lg font-bold mb-1 self-start">Scopri</h2>
            <p className="text-xs text-muted-foreground mb-6 self-start">Profili selezionati dall&apos;AI per te</p>

            <div className="w-full max-w-md">
              <div className={`bg-card border border-border rounded-3xl overflow-hidden transition-all duration-300 ${animation === "left" ? "-translate-x-full opacity-0 rotate-[-12deg]" : animation === "right" ? "translate-x-full opacity-0 rotate-[12deg]" : ""}`}>
                <div className="h-56 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-pink-500/20 flex items-center justify-center relative">
                  <span className="text-8xl">{current.emoji}</span>
                  {current.verified && (
                    <div className="absolute top-4 right-4 bg-cyan-500 text-white rounded-full p-1"><Shield className="w-3.5 h-3.5" /></div>
                  )}
                  <div className="absolute bottom-4 left-4 flex gap-1">
                    {Array.from({ length: current.photos }).map((_, i) => (
                      <div key={i} className={`w-6 h-1 rounded-full ${i === 0 ? "bg-white" : "bg-white/30"}`} />
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">{current.name}, {current.age}</h3>
                      {current.verified && <Shield className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <div className="flex items-center gap-1 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-full text-xs font-bold">
                      <Sparkles className="w-3 h-3" />{current.compatibility}%
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{current.city}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{current.job}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{current.bio}</p>
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {current.interests.map(i => (
                      <span key={i} className="text-[10px] bg-muted rounded-full px-2.5 py-1 text-muted-foreground">{i}</span>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    {current.values.map(v => (
                      <span key={v} className="text-[10px] bg-cyan-500/10 text-cyan-400 rounded-full px-2.5 py-1">{v}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-5 mt-6">
                <button onClick={() => handleSwipe("left")} className="w-16 h-16 rounded-full border-2 border-red-500/30 flex items-center justify-center hover:bg-red-500/10 hover:scale-110 transition-all">
                  <X className="w-7 h-7 text-red-400" />
                </button>
                <button onClick={() => handleSwipe("right")} className="w-16 h-16 rounded-full border-2 border-cyan-500/30 flex items-center justify-center hover:bg-cyan-500/10 hover:scale-110 transition-all">
                  <Star className="w-7 h-7 text-cyan-400" />
                </button>
                <button onClick={() => handleSwipe("right")} className="w-16 h-16 rounded-full border-2 border-pink-500/30 flex items-center justify-center hover:bg-pink-500/10 hover:scale-110 transition-all">
                  <Heart className="w-7 h-7 text-pink-400" />
                </button>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-3">Compatibilità calcolata dall&apos;AI empatica • Profilo {currentIndex + 1}/{profiles.length}</p>
            </div>
          </div>
        )}

        {/* ═══ MATCHES ═══ */}
        {page === "matches" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">I Tuoi Match</h2>
            <p className="text-xs text-muted-foreground mb-6">{matches.length} connessioni attive</p>

            <div className="space-y-3">
              {matches.map((m, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-cyan-500/30 transition-colors cursor-pointer"
                  onClick={() => { setSelectedMatch(m); setPage("chat"); }}>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-2xl">{m.emoji}</div>
                    {m.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-card" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm">{m.name}</p>
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-400 rounded-full px-2 py-0.5">{m.compat}% match</span>
                      {m.online && <span className="text-[10px] text-green-400">Online</span>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{m.lastMsg}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-muted-foreground">{m.time}</p>
                    {m.unread > 0 && <span className="mt-1 inline-block w-5 h-5 rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center">{m.unread}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ CHAT ═══ */}
        {page === "chat" && selectedMatch && (
          <div className="flex-1 flex flex-col h-screen">
            <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-card/50">
              <button onClick={() => setPage("matches")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /></button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-lg">{selectedMatch.emoji}</div>
              <div className="flex-1">
                <p className="text-sm font-bold">{selectedMatch.name}</p>
                <p className="text-[10px] text-green-400 flex items-center gap-1">
                  {selectedMatch.online ? <><div className="w-1.5 h-1.5 rounded-full bg-green-400" />Online</> : <span className="text-muted-foreground">Ultimo accesso {selectedMatch.time} fa</span>}
                </p>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2.5 py-1 text-[10px] text-cyan-400 font-bold">{selectedMatch.compat}% match</div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${m.role === "me" ? "bg-cyan-500 text-white" : "bg-card border border-border"}`}>
                    <p className="text-sm">{m.text}</p>
                    <p className={`text-[10px] mt-0.5 ${m.role === "me" ? "text-white/60" : "text-muted-foreground"}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-border bg-card/50">
              <div className="flex items-center gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()}
                  placeholder="Scrivi un messaggio..." className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40" />
                <button onClick={sendChat} className="w-10 h-10 bg-cyan-500 text-white rounded-xl flex items-center justify-center hover:bg-cyan-600"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PROFILE ═══ */}
        {page === "profile" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Il Mio Profilo</h2>
            <p className="text-xs text-muted-foreground mb-6">Personalizza come ti vedono gli altri</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-4">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center text-4xl">👤</div>
                    <div>
                      <h3 className="text-lg font-bold">Tu, 27</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />Milano</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Shield className="w-3 h-3 text-cyan-400" />
                        <span className="text-[10px] text-cyan-400">Profilo verificato</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Bio</label>
                      <textarea rows={3} defaultValue="Curioso e creativo, amo le conversazioni che fanno riflettere. Cerco qualcuno con cui condividere avventure e pensieri."
                        className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/40" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Lavoro</label>
                        <input defaultValue="UX Designer" className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Città</label>
                        <input defaultValue="Milano" className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold text-sm mb-3">I Tuoi Interessi</h3>
                  <div className="flex flex-wrap gap-2">
                    {myInterests.map(({ name, icon: Icon }) => (
                      <span key={name} className="flex items-center gap-1.5 text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full px-3 py-1.5">
                        <Icon className="w-3 h-3" />{name}
                      </span>
                    ))}
                    <button className="text-xs bg-muted text-muted-foreground rounded-full px-3 py-1.5 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors">+ Aggiungi</button>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium hover:opacity-90">Salva Profilo</button>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-5 text-center">
                  <Award className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-cyan-400">87</p>
                  <p className="text-xs text-muted-foreground">Punteggio Empatia</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Basato su 42 interazioni</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Statistiche</h3>
                  <div className="space-y-2">
                    {[
                      { l: "Profili visti", v: "156" },
                      { l: "Like dati", v: "48" },
                      { l: "Match ottenuti", v: matches.length.toString() },
                      { l: "Conversazioni", v: "12" },
                      { l: "Tasso match", v: "10.4%" },
                    ].map(s => (
                      <div key={s.l} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{s.l}</span>
                        <span className="text-xs font-bold">{s.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ AI INSIGHTS ═══ */}
        {page === "insights" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">AI Insights</h2>
            <p className="text-xs text-muted-foreground mb-6">Analisi della tua personalità e suggerimenti AI</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6">
                <Sparkles className="w-6 h-6 text-cyan-400 mb-3" />
                <h3 className="font-bold mb-2">Il Tuo Tipo Ideale</h3>
                <p className="text-xs text-muted-foreground mb-3">Basato sulle tue interazioni e preferenze</p>
                <div className="space-y-2">
                  {[
                    { trait: "Creatività", pct: 92, color: "#06b6d4" },
                    { trait: "Empatia", pct: 88, color: "#8b5cf6" },
                    { trait: "Intelletto", pct: 85, color: "#3b82f6" },
                    { trait: "Avventura", pct: 78, color: "#f59e0b" },
                    { trait: "Umorismo", pct: 74, color: "#22c55e" },
                  ].map(t => (
                    <div key={t.trait} className="flex items-center gap-2">
                      <span className="text-[10px] w-16">{t.trait}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: t.color }}>{t.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <Zap className="w-6 h-6 text-amber-400 mb-3" />
                <h3 className="font-bold mb-2">Suggerimenti AI</h3>
                <div className="space-y-3">
                  {[
                    { tip: "Aggiungi foto che mostrino i tuoi hobby", impact: "+23% match", icon: Camera },
                    { tip: "Rispondi entro 2h per mantenere l'interesse", impact: "+18% engagement", icon: MessageCircle },
                    { tip: "Profili creativi ti attraggono di più", impact: "Pattern rilevato", icon: Sparkles },
                    { tip: "Sii più specifico nella bio", impact: "+15% qualità", icon: Eye },
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                      <s.icon className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs">{s.tip}</p>
                        <p className="text-[10px] text-amber-400">{s.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold text-sm mb-4">Attività della Settimana</h3>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map(d => (
                  <div key={d} className="text-center text-[10px] text-muted-foreground">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[12, 8, 15, 6, 20, 25, 10].map((v, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-full h-16 rounded-lg bg-muted relative overflow-hidden">
                      <div className="absolute bottom-0 w-full rounded-t-lg bg-cyan-500/60" style={{ height: `${(v / 25) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">Profili visualizzati per giorno</p>
            </div>
          </div>
        )}
    </MobileAppLayout>
  );
}
