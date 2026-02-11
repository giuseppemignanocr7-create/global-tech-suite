"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Heart, Star, MessageCircle, Clock, MapPin, Search, Filter,
  ChevronRight, Shield, CreditCard, CheckCircle2, Phone, Video,
  Send, Image, Paperclip, Mic, MoreVertical, User, Calendar,
  Briefcase, ThumbsUp, Award, Wallet, Bell, Settings, Home,
  Wrench, Baby, BookOpen, PawPrint, Truck, Dumbbell, Sparkles,
  X, ChevronDown, AlertCircle
} from "lucide-react";
import DemoBadge from "@/components/DemoBadge";

/* ───────── DATA ───────── */
const categories = [
  { id: "all", label: "Tutti", icon: Sparkles, count: 48 },
  { id: "casa", label: "Casa", icon: Home, count: 14 },
  { id: "famiglia", label: "Famiglia", icon: Baby, count: 8 },
  { id: "educazione", label: "Educazione", icon: BookOpen, count: 6 },
  { id: "animali", label: "Animali", icon: PawPrint, count: 5 },
  { id: "trasporto", label: "Trasporto", icon: Truck, count: 7 },
  { id: "fitness", label: "Fitness", icon: Dumbbell, count: 4 },
  { id: "riparazioni", label: "Riparazioni", icon: Wrench, count: 4 },
];

const providers = [
  { id: 1, name: "Marco Rinaldi", avatar: "MR", rating: 4.8, reviews: 127, service: "Idraulico d'emergenza", price: 40, unit: "ora", distance: 1.2, available: true, category: "casa", verified: true, bio: "Idraulico professionista con 15 anni di esperienza. Specializzato in emergenze e ristrutturazioni bagno. Disponibile anche nei weekend.", completedJobs: 342, responseTime: "~5 min", skills: ["Riparazioni urgenti", "Ristrutturazione bagno", "Impianti nuovi", "Manutenzione caldaia"], availability: [true,true,false,true,true,true,false] },
  { id: 2, name: "Laura Bianchi", avatar: "LB", rating: 4.9, reviews: 89, service: "Babysitter esperta", price: 15, unit: "ora", distance: 0.8, available: true, category: "famiglia", verified: true, bio: "Educatrice con laurea in Scienze della Formazione. Esperienza con bambini da 0 a 10 anni. Parlo inglese e francese.", completedJobs: 215, responseTime: "~10 min", skills: ["Neonati", "Bambini 3-6 anni", "Aiuto compiti", "Bilingue EN/FR"], availability: [true,true,true,true,true,false,false] },
  { id: 3, name: "Andrea Moretti", avatar: "AM", rating: 4.7, reviews: 56, service: "Lezioni di matematica", price: 25, unit: "ora", distance: 2.1, available: false, category: "educazione", verified: false, bio: "Laureato in Matematica, dottorando in Fisica. Insegno analisi, algebra, geometria e fisica per superiori e università.", completedJobs: 178, responseTime: "~30 min", skills: ["Analisi matematica", "Algebra lineare", "Fisica", "Preparazione esami"], availability: [false,true,false,true,false,true,false] },
  { id: 4, name: "Sofia Pellegrini", avatar: "SP", rating: 5.0, reviews: 203, service: "Dog sitting", price: 20, unit: "ora", distance: 0.5, available: true, category: "animali", verified: true, bio: "Veterinaria part-time e amante degli animali. Casa con giardino. Accolgo cani di tutte le taglie con attenzione e amore.", completedJobs: 489, responseTime: "~3 min", skills: ["Dog walking", "Pensione giornaliera", "Pet taxi", "Somministrazione farmaci"], availability: [true,true,true,true,true,true,true] },
  { id: 5, name: "Luca Torretti", avatar: "LT", rating: 4.6, reviews: 34, service: "Traslochi e trasporti", price: 35, unit: "ora", distance: 3.4, available: true, category: "trasporto", verified: true, bio: "Furgone attrezzato per traslochi, trasporti e sgomberi. Lavoro da solo o con aiutante. Preventivi gratuiti.", completedJobs: 156, responseTime: "~15 min", skills: ["Traslochi", "Trasporto mobili", "Sgomberi", "Montaggio IKEA"], availability: [true,true,true,true,true,true,false] },
  { id: 6, name: "Elena Greco", avatar: "EG", rating: 4.9, reviews: 167, service: "Personal trainer", price: 30, unit: "sessione", distance: 1.8, available: true, category: "fitness", verified: true, bio: "Certificata ISSA e FIF. Programmi personalizzati per dimagrimento, tonificazione e preparazione atletica. Anche online.", completedJobs: 523, responseTime: "~8 min", skills: ["Dimagrimento", "Tonificazione", "Yoga", "Nutrizione sportiva"], availability: [true,false,true,false,true,true,true] },
  { id: 7, name: "Giuseppe Ferraro", avatar: "GF", rating: 4.5, reviews: 42, service: "Elettricista certificato", price: 45, unit: "ora", distance: 2.8, available: true, category: "casa", verified: true, bio: "Elettricista con certificazione CEI. Installazioni, riparazioni, messa a norma impianti. Preventivo gratuito.", completedJobs: 198, responseTime: "~20 min", skills: ["Impianti civili", "Domotica", "Certificazioni", "Illuminazione LED"], availability: [true,true,true,true,true,false,false] },
  { id: 8, name: "Chiara Fontana", avatar: "CF", rating: 4.8, reviews: 91, service: "Pulizie professionali", price: 18, unit: "ora", distance: 1.5, available: true, category: "casa", verified: false, bio: "Servizio pulizie professionale per case e uffici. Prodotti eco-friendly. Disponibile anche per pulizie post-ristrutturazione.", completedJobs: 312, responseTime: "~12 min", skills: ["Pulizie casa", "Pulizie ufficio", "Post-ristrutturazione", "Eco-friendly"], availability: [true,true,true,true,true,true,false] },
];

const reviewsData = [
  { user: "Francesca D.", rating: 5, text: "Marco è arrivato in 20 minuti e ha risolto tutto! Professionale e preciso. Super consigliato.", date: "3 giorni fa" },
  { user: "Alessandro R.", rating: 5, text: "Problema alla caldaia risolto rapidamente. Prezzo onesto, lavoro pulito.", date: "1 settimana fa" },
  { user: "Marta L.", rating: 4, text: "Buon lavoro, puntuale. Unico neo: un po' di disordine lasciato, ma poi ha ripulito.", date: "2 settimane fa" },
  { user: "Giovanni P.", rating: 5, text: "Eccezionale! Ha anche individuato un problema che non avevo notato. Molto onesto.", date: "3 settimane fa" },
];

const chatConversations = [
  { id: 1, name: "Laura Bianchi", avatar: "LB", lastMsg: "Perfetto, a domani alle 15!", time: "14:36", unread: 0, online: true },
  { id: 2, name: "Marco Rinaldi", avatar: "MR", lastMsg: "Il preventivo è €120 tutto incluso", time: "12:15", unread: 2, online: true },
  { id: 3, name: "Sofia Pellegrini", avatar: "SP", lastMsg: "Foto del tuo cane ricevute! 🐕", time: "Ieri", unread: 0, online: false },
  { id: 4, name: "Elena Greco", avatar: "EG", lastMsg: "Sessione confermata per giovedì", time: "Ieri", unread: 1, online: false },
];

const chatMessagesData: Record<number, Array<{text: string; mine: boolean; time: string; type?: string}>> = {
  1: [
    { text: "Ciao Laura! Avrei bisogno di una babysitter per domani pomeriggio.", mine: true, time: "14:28" },
    { text: "Ciao! Certo, a che ora e per quanti bambini?", mine: false, time: "14:29" },
    { text: "Dalle 15 alle 19, per due bambini di 4 e 7 anni.", mine: true, time: "14:30" },
    { text: "Perfetto, sono disponibile! Il costo sarà €15/ora, totale €60 per 4 ore.", mine: false, time: "14:31" },
    { text: "Ottimo! Confermo. Ti mando l'indirizzo.", mine: true, time: "14:33" },
    { text: "Via Garibaldi 23, citofono Rossi, terzo piano.", mine: true, time: "14:34" },
    { text: "Ricevuto! ✅ Ho confermato la prenotazione nel sistema.", mine: false, time: "14:35" },
    { text: "Perfetto, a domani alle 15!", mine: false, time: "14:36" },
  ],
  2: [
    { text: "Buongiorno, ho un problema alla tubatura del bagno.", mine: true, time: "11:45" },
    { text: "Buongiorno! Può descrivermi il problema?", mine: false, time: "11:47" },
    { text: "C'è una perdita sotto il lavandino. Gocciola costantemente.", mine: true, time: "11:48" },
    { text: "Capito. Posso passare oggi pomeriggio alle 16. Il preventivo è €120 tutto incluso", mine: false, time: "12:15" },
    { text: "", mine: false, time: "12:15", type: "escrow_request" },
  ],
};

const myBookings = [
  { id: 1, provider: "Laura Bianchi", service: "Babysitter", date: "12 Feb 2026, 15:00-19:00", status: "confermata", price: "€60", escrow: true },
  { id: 2, provider: "Marco Rinaldi", service: "Idraulico", date: "12 Feb 2026, 16:00", status: "in_attesa", price: "€120", escrow: false },
  { id: 3, provider: "Elena Greco", service: "Personal trainer", date: "13 Feb 2026, 10:00", status: "confermata", price: "€30", escrow: true },
  { id: 4, provider: "Sofia Pellegrini", service: "Dog sitting", date: "9 Feb 2026, 08:00-18:00", status: "completata", price: "€45", escrow: true },
];

/* ───────── COMPONENT ───────── */
type Page = "explore" | "provider" | "booking" | "chat" | "bookings" | "notifications";

export default function LifeLinkPage() {
  const [page, setPage] = useState<Page>("explore");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState<typeof providers[0] | null>(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [liveMessages, setLiveMessages] = useState<Record<number, typeof chatMessagesData[1]>>(chatMessagesData);
  const [sidebarSection, setSidebarSection] = useState<"nav" | "filters">("nav");

  const filteredProviders = providers.filter((p) => {
    const matchCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchSearch = search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.service.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openProvider = (p: typeof providers[0]) => { setSelectedProvider(p); setPage("provider"); };
  const startBooking = () => { setBookingStep(0); setPage("booking"); };
  const openChat = (id: number) => { setSelectedChatId(id); setPage("chat"); };

  const sendMessage = () => {
    if (!chatInput.trim() || !selectedChatId) return;
    const msgs = liveMessages[selectedChatId] || [];
    setLiveMessages({
      ...liveMessages,
      [selectedChatId]: [...msgs, { text: chatInput, mine: true, time: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) }],
    });
    setChatInput("");
  };

  const days = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  return (
    <div className="min-h-screen bg-background flex">
      <DemoBadge />

      {/* ─── SIDEBAR ─── */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">LifeLink</h1>
              <p className="text-[10px] text-muted-foreground">Marketplace P2P</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Menu</p>
          {[
            { key: "explore" as Page, label: "Esplora Servizi", icon: Search },
            { key: "bookings" as Page, label: "Le Mie Prenotazioni", icon: Calendar },
            { key: "chat" as Page, label: "Messaggi", icon: MessageCircle, badge: 3 },
            { key: "notifications" as Page, label: "Notifiche", icon: Bell, badge: 2 },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => { setPage(key); setSelectedChatId(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                (page === key || (key === "explore" && page === "provider"))
                  ? "bg-pink-500/10 text-pink-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1 text-left">{label}</span>
              {badge && <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center">{badge}</span>}
            </button>
          ))}

          <div className="pt-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Categorie</p>
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCategory(c.id); setPage("explore"); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedCategory === c.id
                      ? "bg-pink-500/10 text-pink-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="flex-1 text-left">{c.label}</span>
                  <span className="text-[10px] text-muted-foreground">{c.count}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">TU</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Mario Rossi</p>
              <p className="text-[10px] text-muted-foreground">Milano, Centro</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><Settings className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 min-h-screen overflow-y-auto">

        {/* ═══ EXPLORE PAGE ═══ */}
        {page === "explore" && (
          <div className="p-6">
            {/* Search bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cerca servizi, professionisti..."
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40 transition-shadow"
                />
              </div>
              <button className="h-[46px] px-4 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm">
                <Filter className="w-4 h-4" />Filtri
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: "Provider attivi", value: "48", sub: "nella tua zona" },
                { label: "Tempo risposta", value: "~8 min", sub: "media" },
                { label: "Valutazione media", value: "4.8 ★", sub: "su 1.240 recensioni" },
                { label: "Lavori completati", value: "2.413", sub: "questo mese" },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-3">
                  <p className="text-lg font-bold">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Results heading */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">
                  {selectedCategory === "all" ? "Tutti i servizi" : categories.find(c=>c.id===selectedCategory)?.label}
                </h2>
                <p className="text-xs text-muted-foreground">{filteredProviders.length} professionisti trovati</p>
              </div>
              <select className="text-xs bg-card border border-border rounded-lg px-2 py-1.5 text-muted-foreground">
                <option>Più vicini</option>
                <option>Migliori recensioni</option>
                <option>Prezzo crescente</option>
                <option>Più attivi</option>
              </select>
            </div>

            {/* Provider grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredProviders.map((p) => {
                const CatIcon = categories.find(c => c.id === p.category)?.icon || Briefcase;
                return (
                  <div
                    key={p.id}
                    onClick={() => openProvider(p)}
                    className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/5 transition-all group"
                  >
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center text-pink-400 font-bold text-lg border border-pink-500/20">
                          {p.avatar}
                        </div>
                        {p.available && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-card" />}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-semibold text-sm truncate">{p.name}</h3>
                          {p.verified && <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                        </div>
                        <p className="text-xs text-pink-400 font-medium flex items-center gap-1"><CatIcon className="w-3 h-3" />{p.service}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{p.rating} <span className="text-muted-foreground/60">({p.reviews})</span></span>
                          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{p.distance} km</span>
                          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{p.responseTime}</span>
                        </div>
                      </div>
                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-pink-400">€{p.price}</p>
                        <p className="text-[10px] text-muted-foreground">/{p.unit}</p>
                        <ChevronRight className="w-4 h-4 text-muted-foreground mt-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    {/* Skills preview */}
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {p.skills.slice(0, 3).map((s) => (
                        <span key={s} className="text-[10px] bg-muted rounded-md px-2 py-0.5 text-muted-foreground">{s}</span>
                      ))}
                      {p.skills.length > 3 && <span className="text-[10px] text-muted-foreground">+{p.skills.length - 3}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ PROVIDER DETAIL PAGE ═══ */}
        {page === "provider" && selectedProvider && (
          <div className="p-6">
            <button onClick={() => setPage("explore")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
              <ArrowLeft className="w-3 h-3" />Torna ai risultati
            </button>

            <div className="grid grid-cols-3 gap-6">
              {/* Left col — main info */}
              <div className="col-span-2 space-y-4">
                {/* Header card */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center text-pink-400 font-bold text-2xl border border-pink-500/20">
                      {selectedProvider.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold">{selectedProvider.name}</h2>
                        {selectedProvider.verified && (
                          <span className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full"><Shield className="w-3 h-3" />Verificato</span>
                        )}
                      </div>
                      <p className="text-pink-400 font-medium text-sm mb-2">{selectedProvider.service}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /><strong className="text-foreground">{selectedProvider.rating}</strong> ({selectedProvider.reviews} recensioni)</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{selectedProvider.completedJobs} lavori</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Risponde in {selectedProvider.responseTime}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selectedProvider.distance} km</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-2">Chi sono</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedProvider.bio}</p>
                </div>

                {/* Skills */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Competenze</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.skills.map((s) => (
                      <span key={s} className="text-xs bg-pink-500/10 text-pink-400 rounded-lg px-3 py-1.5 border border-pink-500/20">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Disponibilità Settimanale</h3>
                  <div className="flex gap-2">
                    {days.map((d, i) => (
                      <div key={d} className={`flex-1 text-center py-2 rounded-lg text-xs font-medium ${
                        selectedProvider.availability[i]
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-muted text-muted-foreground/40"
                      }`}>{d}</div>
                    ))}
                  </div>
                </div>

                {/* Reviews */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm">Recensioni ({selectedProvider.reviews})</h3>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                      <span className="text-sm font-bold ml-1">{selectedProvider.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {reviewsData.map((r, i) => (
                      <div key={i} className="pb-4 border-b border-border last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">{r.user[0]}</div>
                            <span className="text-sm font-medium">{r.user}</span>
                            <div className="flex">{Array.from({length: r.rating}).map((_,j) => <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />)}</div>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{r.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-8">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right col — booking widget */}
              <div className="space-y-4">
                <div className="bg-card border border-pink-500/30 rounded-xl p-5 sticky top-6">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-pink-400">€{selectedProvider.price}</p>
                    <p className="text-xs text-muted-foreground">per {selectedProvider.unit}</p>
                  </div>
                  <button onClick={startBooking} className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg shadow-pink-500/20 mb-3">
                    Prenota Ora
                  </button>
                  <button onClick={() => { setSelectedChatId(selectedProvider.id <= 2 ? selectedProvider.id : 1); setPage("chat"); }} className="w-full py-2.5 bg-card border border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />Contatta
                  </button>

                  <div className="mt-4 pt-4 border-t border-border space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-3.5 h-3.5 text-green-400" /><span>Pagamento escrow protetto</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CreditCard className="w-3.5 h-3.5 text-blue-400" /><span>Paghi solo a lavoro completato</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Award className="w-3.5 h-3.5 text-amber-400" /><span>Garanzia soddisfazione 100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ BOOKING FLOW ═══ */}
        {page === "booking" && selectedProvider && (
          <div className="p-6 max-w-2xl mx-auto">
            <button onClick={() => setPage("provider")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
              <ArrowLeft className="w-3 h-3" />Torna al profilo
            </button>

            {/* Steps indicator */}
            <div className="flex items-center justify-between mb-8 px-4">
              {["Data e ora", "Dettagli", "Pagamento", "Conferma"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i < bookingStep ? "bg-green-500 text-white" :
                    i === bookingStep ? "bg-pink-500 text-white" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {i < bookingStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs ${i === bookingStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                  {i < 3 && <div className={`w-12 h-px ${i < bookingStep ? "bg-green-500" : "bg-border"}`} />}
                </div>
              ))}
            </div>

            {/* Step 0: Date */}
            {bookingStep === 0 && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h3 className="text-lg font-bold">Scegli data e ora</h3>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Data</label>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({length: 7}).map((_, i) => {
                      const d = new Date(); d.setDate(d.getDate() + i);
                      const isAvail = selectedProvider.availability[d.getDay() === 0 ? 6 : d.getDay() - 1];
                      return (
                        <button key={i} disabled={!isAvail} className={`p-3 rounded-xl text-center transition-colors ${
                          i === 1 ? "bg-pink-500 text-white" :
                          isAvail ? "bg-muted hover:bg-pink-500/10 hover:text-pink-400" :
                          "bg-muted/30 text-muted-foreground/30 cursor-not-allowed"
                        }`}>
                          <p className="text-[10px]">{days[d.getDay() === 0 ? 6 : d.getDay() - 1]}</p>
                          <p className="text-lg font-bold">{d.getDate()}</p>
                          <p className="text-[10px]">{d.toLocaleDateString("it-IT", { month: "short" })}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Orario</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((t, i) => (
                      <button key={t} className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${i === 4 ? "bg-pink-500 text-white" : "bg-muted text-muted-foreground hover:bg-pink-500/10 hover:text-pink-400"}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Durata stimata</label>
                  <div className="flex gap-2">
                    {["1 ora", "2 ore", "3 ore", "4 ore", "Mezza giornata", "Giornata intera"].map((d, i) => (
                      <button key={d} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${i === 1 ? "bg-pink-500 text-white" : "bg-muted text-muted-foreground hover:bg-pink-500/10 hover:text-pink-400"}`}>{d}</button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setBookingStep(1)} className="w-full py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition-colors">Continua</button>
              </div>
            )}

            {/* Step 1: Details */}
            {bookingStep === 1 && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h3 className="text-lg font-bold">Dettagli del servizio</h3>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Descrivi cosa ti serve</label>
                  <textarea rows={4} defaultValue="Ho bisogno di un intervento urgente per una perdita sotto il lavandino del bagno." className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/40" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Indirizzo</label>
                  <div className="flex gap-2">
                    <input defaultValue="Via Garibaldi 23, Milano" className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40" />
                    <button className="px-4 bg-muted rounded-xl text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-4 h-4" />GPS</button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Foto (opzionale)</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-pink-500/30 cursor-pointer transition-colors">
                    <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Trascina foto o clicca per caricare</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setBookingStep(0)} className="px-6 py-3 bg-muted rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground">Indietro</button>
                  <button onClick={() => setBookingStep(2)} className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600">Continua</button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {bookingStep === 2 && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h3 className="text-lg font-bold">Pagamento Escrow</h3>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                  <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-400">Pagamento Protetto</p>
                    <p className="text-xs text-muted-foreground">L&apos;importo viene trattenuto in escrow e rilasciato al professionista solo quando confermi che il lavoro è stato completato correttamente.</p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Servizio ({selectedProvider.service})</span><span>€{selectedProvider.price * 2}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Durata (2 ore)</span><span></span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Fee piattaforma (5%)</span><span>€{(selectedProvider.price * 2 * 0.05).toFixed(0)}</span></div>
                  <div className="border-t border-border pt-2 flex justify-between text-sm font-bold"><span>Totale</span><span className="text-pink-400">€{(selectedProvider.price * 2 * 1.05).toFixed(0)}</span></div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Metodo di pagamento</label>
                  <div className="space-y-2">
                    {[{ label: "Carta •••• 4242", sub: "Visa - scad. 08/27", selected: true }, { label: "PayPal", sub: "mario.rossi@email.com", selected: false }].map((m, i) => (
                      <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${m.selected ? "border-pink-500/50 bg-pink-500/5" : "border-border hover:border-pink-500/30"}`}>
                        <input type="radio" name="payment" defaultChecked={m.selected} className="accent-pink-500" />
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <div><p className="text-sm font-medium">{m.label}</p><p className="text-[10px] text-muted-foreground">{m.sub}</p></div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setBookingStep(1)} className="px-6 py-3 bg-muted rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground">Indietro</button>
                  <button onClick={() => setBookingStep(3)} className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-700 shadow-lg shadow-pink-500/20">Paga e Prenota</button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {bookingStep === 3 && (
              <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold">Prenotazione Confermata!</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">Il pagamento è in escrow. {selectedProvider.name} è stato notificato e confermerà a breve.</p>
                <div className="bg-muted/50 rounded-xl p-4 max-w-sm mx-auto text-left space-y-1.5 text-sm">
                  <p><span className="text-muted-foreground">Professionista:</span> <strong>{selectedProvider.name}</strong></p>
                  <p><span className="text-muted-foreground">Servizio:</span> {selectedProvider.service}</p>
                  <p><span className="text-muted-foreground">Data:</span> 12 Febbraio 2026, 15:00</p>
                  <p><span className="text-muted-foreground">Durata:</span> 2 ore</p>
                  <p><span className="text-muted-foreground">Totale:</span> <strong className="text-pink-400">€{(selectedProvider.price * 2 * 1.05).toFixed(0)}</strong></p>
                </div>
                <div className="flex gap-3 justify-center pt-2">
                  <button onClick={() => setPage("bookings")} className="px-6 py-2.5 bg-pink-500 text-white rounded-xl text-sm font-medium hover:bg-pink-600">Le Mie Prenotazioni</button>
                  <button onClick={() => setPage("explore")} className="px-6 py-2.5 bg-card border border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground">Torna all&apos;esplorazione</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ CHAT PAGE ═══ */}
        {page === "chat" && (
          <div className="flex h-screen">
            {/* Chat list */}
            <div className={`${selectedChatId ? "hidden lg:flex" : "flex"} w-full lg:w-80 flex-col border-r border-border`}>
              <div className="p-4 border-b border-border">
                <h2 className="font-bold text-lg mb-3">Messaggi</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input placeholder="Cerca conversazioni..." className="w-full pl-9 pr-3 py-2 bg-muted rounded-lg text-xs focus:outline-none" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {chatConversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChatId(c.id)}
                    className={`w-full flex items-center gap-3 p-4 border-b border-border/50 text-left hover:bg-muted/50 transition-colors ${selectedChatId === c.id ? "bg-pink-500/5 border-l-2 border-l-pink-500" : ""}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center text-pink-400 font-bold text-xs">{c.avatar}</div>
                      {c.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{c.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{c.lastMsg}</p>
                    </div>
                    {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center shrink-0">{c.unread}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat conversation */}
            {selectedChatId ? (
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedChatId(null)} className="lg:hidden text-muted-foreground"><ArrowLeft className="w-4 h-4" /></button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center text-pink-400 font-bold text-xs">
                      {chatConversations.find(c=>c.id===selectedChatId)?.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{chatConversations.find(c=>c.id===selectedChatId)?.name}</p>
                      <p className="text-[10px] text-green-400">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><Phone className="w-4 h-4" /></button>
                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><Video className="w-4 h-4" /></button>
                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {(liveMessages[selectedChatId] || []).map((m, i) => {
                    if (m.type === "escrow_request") {
                      return (
                        <div key={i} className="flex justify-center">
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 max-w-sm text-center">
                            <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <p className="text-sm font-medium">Richiesta pagamento Escrow</p>
                            <p className="text-xs text-muted-foreground mb-3">€120 — Riparazione tubatura bagno</p>
                            <div className="flex gap-2">
                              <button className="flex-1 py-2 bg-pink-500 text-white rounded-lg text-xs font-medium hover:bg-pink-600">Accetta e Paga</button>
                              <button className="px-3 py-2 bg-muted rounded-lg text-xs text-muted-foreground">Rifiuta</button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={i} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${m.mine ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-br-md" : "bg-card border border-border rounded-bl-md"}`}>
                          <p>{m.text}</p>
                          <p className={`text-[10px] mt-1 ${m.mine ? "text-pink-200" : "text-muted-foreground"}`}>{m.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-muted-foreground hover:text-foreground"><Paperclip className="w-4 h-4" /></button>
                    <button className="p-2 text-muted-foreground hover:text-foreground"><Image className="w-4 h-4" /></button>
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Scrivi un messaggio..."
                      className="flex-1 px-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                    />
                    <button className="p-2 text-muted-foreground hover:text-foreground"><Mic className="w-4 h-4" /></button>
                    <button onClick={sendMessage} className="p-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600"><Send className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 hidden lg:flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Seleziona una conversazione</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ BOOKINGS PAGE ═══ */}
        {page === "bookings" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Le Mie Prenotazioni</h2>
            <p className="text-xs text-muted-foreground mb-6">{myBookings.length} prenotazioni totali</p>

            <div className="space-y-3">
              {myBookings.map((b) => (
                <div key={b.id} className="bg-card border border-border rounded-xl p-5 hover:border-pink-500/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{b.service}</h3>
                      <p className="text-sm text-muted-foreground">{b.provider}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      b.status === "confermata" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      b.status === "in_attesa" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {b.status === "confermata" ? "Confermata" : b.status === "in_attesa" ? "In attesa" : "Completata"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{b.date}</span>
                    <span className="flex items-center gap-1"><Wallet className="w-3.5 h-3.5" />{b.price}</span>
                    {b.escrow && <span className="flex items-center gap-1 text-blue-400"><Shield className="w-3.5 h-3.5" />Escrow</span>}
                  </div>
                  <div className="flex gap-2">
                    {b.status === "completata" ? (
                      <button className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-medium flex items-center gap-1"><Star className="w-3 h-3" />Lascia Recensione</button>
                    ) : (
                      <>
                        <button className="px-4 py-2 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-lg text-xs font-medium flex items-center gap-1"><MessageCircle className="w-3 h-3" />Contatta</button>
                        {b.status === "confermata" && <button className="px-4 py-2 bg-muted rounded-lg text-xs font-medium text-muted-foreground flex items-center gap-1"><X className="w-3 h-3" />Annulla</button>}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ NOTIFICATIONS PAGE ═══ */}
        {page === "notifications" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Notifiche</h2>
            <p className="text-xs text-muted-foreground mb-6">2 nuove</p>
            <div className="space-y-2">
              {[
                { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", title: "Prenotazione confermata", desc: "Laura Bianchi ha confermato la prenotazione per domani alle 15:00", time: "14:36", unread: true },
                { icon: CreditCard, color: "text-blue-400", bg: "bg-blue-500/10", title: "Pagamento escrow attivato", desc: "€60 trattenuti per la prenotazione con Laura Bianchi", time: "14:35", unread: true },
                { icon: Star, color: "text-amber-400", bg: "bg-amber-500/10", title: "Nuova recensione ricevuta", desc: "Sofia Pellegrini ha lasciato una recensione 5★", time: "Ieri", unread: false },
                { icon: MessageCircle, color: "text-pink-400", bg: "bg-pink-500/10", title: "Nuovo messaggio", desc: "Marco Rinaldi ti ha inviato un preventivo", time: "Ieri", unread: false },
                { icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10", title: "Promemoria", desc: "La sessione con Elena Greco è tra 2 giorni", time: "2 giorni fa", unread: false },
              ].map((n, i) => {
                const Icon = n.icon;
                return (
                  <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer hover:border-pink-500/30 ${n.unread ? "border-pink-500/20 bg-pink-500/5" : "border-border bg-card"}`}>
                    <div className={`w-9 h-9 rounded-lg ${n.bg} flex items-center justify-center shrink-0`}><Icon className={`w-4 h-4 ${n.color}`} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{n.title}</p>
                        {n.unread && <span className="w-2 h-2 rounded-full bg-pink-500" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
