"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Users, HandHeart, Star, MapPin, Clock, MessageCircle, ThumbsUp,
  Plus, Calendar, Heart, Share2, Flag, Award, TrendingUp, Search,
  Filter, Bell, Settings, Bookmark, Send, Image, MoreHorizontal,
  ChevronRight, CheckCircle2, Flame, Globe, TreePine, Utensils
} from "lucide-react";
import MobileAppLayout from "@/components/MobileAppLayout";

/* ───────── DATA ───────── */
const feedPosts = [
  { id: 1, user: "Anna Marchetti", avatar: "AM", role: "Volontaria Gold", type: "aiuto", title: "Spesa per anziana sola", desc: "Mia nonna (87 anni) vive da sola in zona Città Studi e ha bisogno di qualcuno che le faccia la spesa 2 volte a settimana. È una persona dolcissima e sarà felice di fare due chiacchiere!", zone: "Milano - Città Studi", time: "2 ore fa", likes: 34, comments: 8, shares: 3, urgent: true, saved: false, joined: 2, needed: 3, image: false },
  { id: 2, user: "Roberto Colombo", avatar: "RC", role: "Organizzatore", type: "evento", title: "🌿 Pulizia parco Via Padova — Sabato 15 Feb", desc: "Organizziamo la pulizia mensile del parco! Guanti e sacchi forniti. Merenda finale offerta dal bar del quartiere. L'anno scorso abbiamo raccolto 200kg di rifiuti — quest'anno puntiamo a 300!", zone: "Milano - Loreto", time: "5 ore fa", likes: 87, comments: 32, shares: 15, urgent: false, saved: true, joined: 28, needed: 40, image: true },
  { id: 3, user: "Giulia Ferretti", avatar: "GF", role: "Membro", type: "scambio", title: "Offro lezioni di italiano per inglese", desc: "Sono insegnante di italiano L2 e cerco un madrelingua inglese per scambio conversazione. 1 ora a settimana, zona Navigli o online.", zone: "Milano - Navigli", time: "1 giorno fa", likes: 19, comments: 6, shares: 4, urgent: false, saved: false, joined: 3, needed: 1, image: false },
  { id: 4, user: "Paolo Lombardi", avatar: "PL", role: "Nuovo membro", type: "aiuto", title: "Cercasi tutor per ragazzo con DSA", desc: "Mio figlio Lorenzo (12 anni) ha bisogno di supporto scolastico specializzato, soprattutto in matematica e italiano. Cerco qualcuno con esperienza DSA, disponibile 2 pomeriggi a settimana.", zone: "Milano - Brera", time: "1 giorno fa", likes: 12, comments: 5, shares: 2, urgent: true, saved: false, joined: 1, needed: 1, image: false },
  { id: 5, user: "Maria Santoro", avatar: "MS", role: "Volontaria Platino", type: "evento", title: "🍲 Distribuzione pasti — Ogni venerdì sera", desc: "Il nostro gruppo cucina e distribuisce 80 pasti caldi ogni venerdì sera. Servono volontari per cucinare (dalle 16), servire (dalle 19) e trasportare. Anche solo 2 ore fanno la differenza!", zone: "Milano - Stazione Centrale", time: "2 giorni fa", likes: 156, comments: 45, shares: 28, urgent: false, saved: true, joined: 18, needed: 25, image: true },
  { id: 6, user: "Luca Bianchi", avatar: "LB", role: "Volontario Silver", type: "scambio", title: "Offro riparazioni bici in cambio di lezioni di cucina", desc: "Sono un ciclista appassionato e so riparare qualsiasi bici. Cerco qualcuno che mi insegni a cucinare piatti vegani!", zone: "Milano - Isola", time: "3 giorni fa", likes: 42, comments: 11, shares: 7, urgent: false, saved: false, joined: 0, needed: 1, image: false },
];

const events = [
  { id: 1, title: "Pulizia Parco Via Padova", date: "15 Feb 2026", time: "09:00 - 13:00", location: "Parco Via Padova", attendees: 28, max: 40, organizer: "Roberto C.", icon: TreePine, color: "#22c55e" },
  { id: 2, title: "Distribuzione Pasti", date: "14 Feb 2026", time: "16:00 - 21:00", location: "Stazione Centrale", attendees: 18, max: 25, organizer: "Maria S.", icon: Utensils, color: "#f59e0b" },
  { id: 3, title: "Workshop Inclusione Digitale", date: "18 Feb 2026", time: "15:00 - 17:00", location: "Biblioteca Sormani", attendees: 12, max: 30, organizer: "Giulia F.", icon: Globe, color: "#3b82f6" },
  { id: 4, title: "Mercatino Solidale", date: "22 Feb 2026", time: "10:00 - 18:00", location: "Piazza del Duomo", attendees: 45, max: 100, organizer: "Anna M.", icon: Heart, color: "#ec4899" },
];

const groups = [
  { name: "Volontari Stazione Centrale", members: 156, posts: 23, desc: "Coordinamento distribuzione pasti e assistenza", color: "#f59e0b" },
  { name: "Green Milano", members: 342, posts: 45, desc: "Iniziative ambientali e pulizia quartieri", color: "#22c55e" },
  { name: "Scambio Saperi", members: 89, posts: 12, desc: "Scambio competenze e lezioni gratuite", color: "#3b82f6" },
  { name: "Aiuto Anziani", members: 67, posts: 8, desc: "Rete di supporto per anziani soli", color: "#ec4899" },
  { name: "Genitori Solidali", members: 123, posts: 18, desc: "Supporto tra genitori, babysitting condiviso", color: "#8b5cf6" },
];

const leaderboardData = [
  { name: "Maria Santoro", avatar: "MS", points: 2840, level: "Platino", actions: 156, streak: 45, badge: "🏆", rank: 1 },
  { name: "Roberto Colombo", avatar: "RC", points: 2310, level: "Gold", actions: 128, streak: 32, badge: "🥈", rank: 2 },
  { name: "Anna Marchetti", avatar: "AM", points: 1950, level: "Gold", actions: 97, streak: 28, badge: "🥉", rank: 3 },
  { name: "Giulia Ferretti", avatar: "GF", points: 1620, level: "Silver", actions: 84, streak: 15, badge: "4", rank: 4 },
  { name: "Paolo Lombardi", avatar: "PL", points: 1180, level: "Silver", actions: 62, streak: 8, badge: "5", rank: 5 },
  { name: "Luca Bianchi", avatar: "LB", points: 980, level: "Bronze", actions: 45, streak: 12, badge: "6", rank: 6 },
  { name: "Tu (Mario Rossi)", avatar: "MR", points: 720, level: "Bronze", actions: 31, streak: 7, badge: "12", rank: 12 },
];

const myStats = {
  points: 720, level: "Bronze", actions: 31, streak: 7, nextLevel: "Silver", pointsToNext: 280,
  badges: ["🌱 Primo Aiuto", "🤝 Connettore", "📅 Costante"],
  recentActions: [
    { action: "Aiutato Anna con la spesa", points: 50, date: "Oggi" },
    { action: "Partecipato alla pulizia parco", points: 75, date: "Ieri" },
    { action: "Donato vestiti al mercatino", points: 30, date: "3 giorni fa" },
  ],
};

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  aiuto: { bg: "bg-red-500/10", text: "text-red-400", label: "Aiuto" },
  evento: { bg: "bg-green-500/10", text: "text-green-400", label: "Evento" },
  scambio: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Scambio" },
};

/* ───────── COMPONENT ───────── */
type Page = "feed" | "events" | "groups" | "leaderboard" | "profile" | "create";

export default function ComunitaAttivaPage() {
  const [page, setPage] = useState<Page>("feed");
  const [filter, setFilter] = useState("tutti");
  const [search, setSearch] = useState("");
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({ 2: true, 5: true });
  const [commentOpen, setCommentOpen] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  const filteredPosts = feedPosts.filter(p => {
    if (filter !== "tutti" && p.type !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.desc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const mobileNav = [
    { id: "feed", label: "Bacheca", icon: Users },
    { id: "events", label: "Eventi", icon: Calendar },
    { id: "groups", label: "Gruppi", icon: Globe },
    { id: "leaderboard", label: "Classifica", icon: Award },
    { id: "profile", label: "Profilo", icon: Star },
  ];

  return (
    <MobileAppLayout appName="Comunità Attiva" accentColor="#f97316" navItems={mobileNav} activePage={page} onPageChange={(p) => setPage(p as Page)} sidebar={<>
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center">
              <HandHeart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">Comunità Attiva</h1>
              <p className="text-[10px] text-muted-foreground">Social Civico</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Naviga</p>
          {[
            { key: "feed" as Page, label: "Bacheca", icon: Users },
            { key: "events" as Page, label: "Eventi", icon: Calendar, badge: 4 },
            { key: "groups" as Page, label: "Gruppi", icon: Globe },
            { key: "leaderboard" as Page, label: "Classifica", icon: Award },
            { key: "profile" as Page, label: "Il Mio Profilo", icon: Star },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                page === key ? "bg-orange-500/10 text-orange-400" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge && <span className="text-[10px] bg-orange-500/20 text-orange-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}

          <div className="pt-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">I Miei Gruppi</p>
            {groups.slice(0, 3).map(g => (
              <button key={g.name} className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                <span className="flex-1 text-left truncate">{g.name}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={() => setPage("create")}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />Pubblica
          </button>
        </div>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/30 to-rose-500/30 flex items-center justify-center text-xs font-bold text-orange-400">MR</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Mario Rossi</p>
              <p className="text-[10px] text-orange-400">720 pts • Bronze</p>
            </div>
          </div>
        </div>
      </>}>

        {/* ═══ FEED ═══ */}
        {page === "feed" && (
          <div className="max-w-2xl mx-auto p-6">
            {/* Search */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca nella bacheca..." className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
              {[
                { key: "tutti", label: "Tutti", icon: Globe },
                { key: "aiuto", label: "Aiuto", icon: HandHeart },
                { key: "evento", label: "Eventi", icon: Calendar },
                { key: "scambio", label: "Scambio", icon: Share2 },
              ].map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f.key ? "bg-orange-500 text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
                  <f.icon className="w-3 h-3" />{f.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map(post => {
                const tc = typeColors[post.type];
                const isLiked = likedPosts[post.id];
                const isSaved = savedPosts[post.id];
                return (
                  <div key={post.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-orange-500/30 transition-colors">
                    {/* Post header */}
                    <div className="p-4 pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-rose-500/20 flex items-center justify-center text-orange-400 font-bold text-xs border border-orange-500/20">
                            {post.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{post.user}</span>
                              <span className="text-[10px] bg-muted text-muted-foreground rounded-full px-2 py-0.5">{post.role}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{post.time}</span>
                              <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{post.zone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tc.bg} ${tc.text}`}>{tc.label}</span>
                          {post.urgent && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium flex items-center gap-0.5"><Flame className="w-2.5 h-2.5" />Urgente</span>}
                        </div>
                      </div>

                      <h3 className="font-bold text-sm mb-1.5">{post.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{post.desc}</p>

                      {/* Progress bar for needed people */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all" style={{ width: `${Math.min((post.joined / post.needed) * 100, 100)}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          <strong className="text-foreground">{post.joined}</strong>/{post.needed} partecipanti
                        </span>
                      </div>
                    </div>

                    {/* Image placeholder for events */}
                    {post.image && (
                      <div className="mx-4 mb-3 h-40 rounded-xl bg-gradient-to-br from-orange-500/10 to-green-500/10 border border-border flex items-center justify-center">
                        <div className="text-center">
                          <TreePine className="w-10 h-10 text-green-400 mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground">Foto evento</p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setLikedPosts(p => ({ ...p, [post.id]: !p[post.id] }))} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${isLiked ? "text-rose-400 bg-rose-500/10" : "text-muted-foreground hover:bg-muted"}`}>
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-400" : ""}`} />{post.likes + (isLiked ? 1 : 0)}
                        </button>
                        <button onClick={() => setCommentOpen(commentOpen === post.id ? null : post.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted">
                          <MessageCircle className="w-3.5 h-3.5" />{post.comments}
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted">
                          <Share2 className="w-3.5 h-3.5" />{post.shares}
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSavedPosts(p => ({ ...p, [post.id]: !p[post.id] }))} className={`p-1.5 rounded-lg transition-colors ${isSaved ? "text-amber-400" : "text-muted-foreground hover:bg-muted"}`}>
                          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-amber-400" : ""}`} />
                        </button>
                        {post.joined < post.needed && (
                          <button className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg text-xs font-semibold">
                            Partecipa
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Comment section */}
                    {commentOpen === post.id && (
                      <div className="px-4 pb-4 border-t border-border pt-3">
                        <div className="space-y-2 mb-3">
                          <div className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold shrink-0">LC</div>
                            <div className="bg-muted rounded-xl px-3 py-2 text-xs"><strong>Laura C.</strong> Fantastico, mi iscrivo subito! 💪</div>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold shrink-0">FD</div>
                            <div className="bg-muted rounded-xl px-3 py-2 text-xs"><strong>Franco D.</strong> Posso portare anche mia figlia?</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Scrivi un commento..." className="flex-1 px-3 py-2 bg-muted rounded-lg text-xs focus:outline-none" />
                          <button className="p-2 text-orange-400"><Send className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ EVENTS ═══ */}
        {page === "events" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Eventi in Programma</h2>
                <p className="text-xs text-muted-foreground">{events.length} eventi questo mese</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />Crea Evento
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {events.map(ev => {
                const Icon = ev.icon;
                const pct = Math.round((ev.attendees / ev.max) * 100);
                return (
                  <div key={ev.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/5 cursor-pointer">
                    <div className="h-32 flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${ev.color}15, ${ev.color}05)` }}>
                      <Icon className="w-12 h-12" style={{ color: ev.color }} />
                      <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium">{ev.date}</div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold mb-1">{ev.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: ev.color }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{ev.attendees}/{ev.max}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Org: {ev.organizer}</span>
                        <button className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: ev.color }}>Partecipa</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ GROUPS ═══ */}
        {page === "groups" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Gruppi</h2>
            <p className="text-xs text-muted-foreground mb-6">Unisciti ai gruppi della tua comunità</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {groups.map(g => (
                <div key={g.name} className="bg-card border border-border rounded-2xl p-5 hover:border-orange-500/30 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: g.color + "15" }}>
                      <Users className="w-6 h-6" style={{ color: g.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-0.5">{g.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{g.desc}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{g.members} membri</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{g.posts} post questa settimana</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors" style={{ borderColor: g.color + "50", color: g.color }}>
                      Unisciti
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ LEADERBOARD ═══ */}
        {page === "leaderboard" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Classifica Volontari</h2>
            <p className="text-xs text-muted-foreground mb-6">Febbraio 2026</p>

            {/* Top 3 podium */}
            <div className="flex items-end justify-center gap-4 mb-8">
              {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map((u, i) => {
                const heights = ["h-28", "h-36", "h-24"];
                const sizes = ["text-3xl", "text-4xl", "text-3xl"];
                return (
                  <div key={u.rank} className="text-center flex-1 max-w-[160px]">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500/20 to-rose-500/20 flex items-center justify-center text-orange-400 font-bold mx-auto mb-2 border-2 border-orange-500/30">
                      {u.avatar}
                    </div>
                    <p className="text-xs font-semibold truncate">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground">{u.points} pts</p>
                    <div className={`${heights[i]} bg-gradient-to-t from-orange-500/20 to-orange-500/5 rounded-t-xl mt-2 flex items-center justify-center border-t-2 border-x border-orange-500/30`}>
                      <span className={sizes[i]}>{u.badge}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full list */}
            <div className="space-y-2">
              {leaderboardData.map(u => (
                <div key={u.rank} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${u.avatar === "MR" ? "border-orange-500/30 bg-orange-500/5" : "border-border bg-card"}`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${u.rank <= 3 ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white" : "bg-muted text-muted-foreground"}`}>
                    {u.rank <= 3 ? u.badge : u.rank}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-rose-500/20 flex items-center justify-center text-orange-400 font-bold text-xs">{u.avatar}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground">{u.level} • {u.actions} azioni • 🔥 {u.streak} giorni</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-400">{u.points.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">punti</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PROFILE ═══ */}
        {page === "profile" && (
          <div className="p-6 max-w-2xl">
            {/* Profile header */}
            <div className="bg-gradient-to-br from-orange-500/10 to-rose-500/10 border border-orange-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/30 to-rose-500/30 flex items-center justify-center text-orange-400 font-bold text-2xl border-2 border-orange-500/30">MR</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">Mario Rossi</h2>
                  <p className="text-sm text-muted-foreground">Membro da Gennaio 2026 • Milano</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs bg-orange-500/10 text-orange-400 rounded-full px-3 py-1 font-medium">🥉 {myStats.level}</span>
                    <span className="text-xs text-muted-foreground">🔥 {myStats.streak} giorni streak</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-400">{myStats.points}</p>
                  <p className="text-xs text-muted-foreground">punti</p>
                </div>
              </div>

              {/* Progress to next level */}
              <div className="mt-4 pt-4 border-t border-orange-500/20">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Prossimo livello: <strong className="text-foreground">{myStats.nextLevel}</strong></span>
                  <span className="text-orange-400">{myStats.pointsToNext} pts rimasti</span>
                </div>
                <div className="bg-background/50 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500" style={{ width: `${(myStats.points / (myStats.points + myStats.pointsToNext)) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-orange-400">{myStats.actions}</p>
                <p className="text-xs text-muted-foreground">Azioni</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-rose-400">{myStats.badges.length}</p>
                <p className="text-xs text-muted-foreground">Badge</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">#12</p>
                <p className="text-xs text-muted-foreground">Posizione</p>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-card border border-border rounded-xl p-5 mb-4">
              <h3 className="font-semibold text-sm mb-3">I Tuoi Badge</h3>
              <div className="flex gap-3">
                {myStats.badges.map(b => (
                  <div key={b} className="bg-muted rounded-xl px-4 py-3 text-xs text-center font-medium">{b}</div>
                ))}
                <div className="bg-muted/50 rounded-xl px-4 py-3 text-xs text-center text-muted-foreground border-2 border-dashed border-border">🔒 Prossimo</div>
              </div>
            </div>

            {/* Recent actions */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-3">Azioni Recenti</h3>
              <div className="space-y-3">
                {myStats.recentActions.map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">{a.action}</p>
                      <p className="text-[10px] text-muted-foreground">{a.date}</p>
                    </div>
                    <span className="text-xs text-orange-400 font-medium">+{a.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ CREATE POST ═══ */}
        {page === "create" && (
          <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-lg font-bold mb-1">Pubblica nella Bacheca</h2>
            <p className="text-xs text-muted-foreground mb-6">Chiedi aiuto, organizza un evento o proponi uno scambio</p>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <div>
                <label className="text-sm font-medium block mb-2">Tipo di post</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "aiuto", label: "Aiuto", icon: HandHeart, color: "#ef4444", desc: "Chiedi o offri aiuto" },
                    { key: "evento", label: "Evento", icon: Calendar, color: "#22c55e", desc: "Organizza un evento" },
                    { key: "scambio", label: "Scambio", icon: Share2, color: "#3b82f6", desc: "Proponi uno scambio" },
                  ].map(t => (
                    <button key={t.key} className="p-4 rounded-xl border border-border hover:border-orange-500/30 text-center transition-colors">
                      <t.icon className="w-6 h-6 mx-auto mb-1" style={{ color: t.color }} />
                      <p className="text-xs font-medium">{t.label}</p>
                      <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Titolo</label>
                <input placeholder="Breve descrizione della tua richiesta..." className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Descrizione</label>
                <textarea rows={4} placeholder="Spiega in dettaglio cosa serve, quando e come..." className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Zona</label>
                  <input placeholder="Es. Milano - Navigli" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Partecipanti necessari</label>
                  <input type="number" defaultValue={3} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Foto (opzionale)</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-orange-500/30 cursor-pointer transition-colors">
                  <Image className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Clicca per caricare</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="urgent" className="accent-orange-500" />
                <label htmlFor="urgent" className="text-sm text-muted-foreground">Segna come <strong className="text-amber-400">urgente</strong></label>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-shadow">
                Pubblica nella Bacheca
              </button>
            </div>
          </div>
        )}
    </MobileAppLayout>
  );
}
