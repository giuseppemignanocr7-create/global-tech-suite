"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Wand2, Sparkles, Camera, Share2, Heart, Eye, Download,
  Layers, Settings, TrendingUp, Star, Bookmark
} from "lucide-react";
import MobileAppLayout from "@/components/MobileAppLayout";

/* ───────── DATA ───────── */
const experiences = [
  { id: 1, title: "Neon Dreams", desc: "Trasforma il mondo in neon cyberpunk", style: "from-purple-600/40 to-pink-600/40", emoji: "🌆", likes: 2340, views: 8900, creator: "ArtBot_AI", tags: ["Cyberpunk", "Neon"], featured: true },
  { id: 2, title: "Nature Glitch", desc: "Effetti glitch sulla natura reale", style: "from-green-600/40 to-emerald-600/40", emoji: "🌿", likes: 1890, views: 6200, creator: "GlitchMaster", tags: ["Natura", "Glitch"], featured: false },
  { id: 3, title: "Retro Pixel", desc: "Il mondo in pixel art 8-bit", style: "from-amber-600/40 to-red-600/40", emoji: "👾", likes: 3100, views: 12400, creator: "PixelWizard", tags: ["Retro", "Pixel"], featured: true },
  { id: 4, title: "Liquid Metal", desc: "Superfici che si sciolgono in metallo liquido", style: "from-gray-600/40 to-slate-600/40", emoji: "🪩", likes: 1560, views: 5800, creator: "MetalArt_3D", tags: ["3D", "Metal"], featured: false },
  { id: 5, title: "Aurora Boreale", desc: "Proiezione aurora in qualsiasi stanza", style: "from-cyan-600/40 to-blue-600/40", emoji: "🌌", likes: 4200, views: 15600, creator: "SkyDreamer", tags: ["Cielo", "Aurora"], featured: true },
  { id: 6, title: "Frattali Viventi", desc: "Pattern frattali che reagiscono al movimento", style: "from-violet-600/40 to-indigo-600/40", emoji: "🔮", likes: 2780, views: 9300, creator: "FractalAI", tags: ["Math", "Frattali"], featured: false },
  { id: 7, title: "Underwater Dream", desc: "Vivi sott'acqua in realtà aumentata", style: "from-blue-600/40 to-teal-600/40", emoji: "🐠", likes: 1920, views: 7100, creator: "OceanAR", tags: ["Oceano", "Sogno"], featured: false },
  { id: 8, title: "Galaxy Portal", desc: "Apri un portale verso galassie lontane", style: "from-indigo-600/40 to-purple-600/40", emoji: "🌀", likes: 3450, views: 11200, creator: "CosmicAI", tags: ["Spazio", "Galaxy"], featured: true },
];

const myCreations = [
  { id: 1, title: "Il Mio Glitch #1", date: "10/02/2026", likes: 45, views: 320, status: "pubblicato", filter: "Neon Pulse", emoji: "💜" },
  { id: 2, title: "Esperimento Neon", date: "08/02/2026", likes: 23, views: 156, status: "bozza", filter: "Glitch Wave", emoji: "🌊" },
  { id: 3, title: "Pixel Art Room", date: "05/02/2026", likes: 89, views: 780, status: "pubblicato", filter: "Pixel Storm", emoji: "⚡" },
  { id: 4, title: "Cosmic Vibes", date: "03/02/2026", likes: 112, views: 940, status: "pubblicato", filter: "Cosmic", emoji: "🌟" },
];

const filters = [
  { name: "Glitch Wave", preview: "🌊", category: "Glitch", color: "#06b6d4" },
  { name: "Neon Pulse", preview: "💜", category: "Neon", color: "#8b5cf6" },
  { name: "Pixel Storm", preview: "⚡", category: "Retro", color: "#f59e0b" },
  { name: "Hologram", preview: "✨", category: "Futuristico", color: "#ec4899" },
  { name: "Vaporwave", preview: "🌸", category: "Aesthetic", color: "#f472b6" },
  { name: "Matrix", preview: "💚", category: "Hacker", color: "#22c55e" },
  { name: "Retro VHS", preview: "📼", category: "Retro", color: "#ef4444" },
  { name: "Cosmic", preview: "🌟", category: "Spazio", color: "#6366f1" },
  { name: "Liquid Chrome", preview: "🪩", category: "3D", color: "#a1a1aa" },
  { name: "Dreamscape", preview: "🦋", category: "Sogno", color: "#a78bfa" },
  { name: "Infrared", preview: "🔴", category: "Sci-fi", color: "#dc2626" },
  { name: "Frost", preview: "❄️", category: "Natura", color: "#38bdf8" },
];

const trending = [
  { tag: "Cyberpunk", count: "12.4K" },
  { tag: "Aurora", count: "8.7K" },
  { tag: "PixelArt", count: "6.2K" },
  { tag: "Frattali", count: "5.1K" },
];

/* ───────── COMPONENT ───────── */
type Page = "explore" | "create" | "my_creations" | "detail" | "trending";

export default function GlitchLifePage() {
  const [page, setPage] = useState<Page>("explore");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<typeof experiences[0] | null>(null);

  const mobileNav = [
    { id: "explore", label: "Esplora", icon: Sparkles },
    { id: "create", label: "Crea", icon: Wand2 },
    { id: "my_creations", label: "Le Mie", icon: Layers },
    { id: "trending", label: "Trending", icon: TrendingUp },
  ];

  return (
    <MobileAppLayout appName="GlitchLife" accentColor="#d946ef" navItems={mobileNav} activePage={page} onPageChange={(p) => setPage(p as Page)} sidebar={<>
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">GlitchLife</h1>
              <p className="text-[10px] text-muted-foreground">Esperienze AR Creative</p>
            </div>
          </div>
        </div>

        <div className="p-3 border-b border-border">
          <div className="bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-xl p-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm font-bold text-fuchsia-400">{myCreations.length}</p>
                <p className="text-[10px] text-muted-foreground">Creazioni</p>
              </div>
              <div>
                <p className="text-sm font-bold text-pink-400">269</p>
                <p className="text-[10px] text-muted-foreground">Like</p>
              </div>
              <div>
                <p className="text-sm font-bold text-violet-400">2.2K</p>
                <p className="text-[10px] text-muted-foreground">Views</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "explore" as Page, label: "Esplora", icon: Sparkles },
            { key: "create" as Page, label: "Crea", icon: Wand2 },
            { key: "my_creations" as Page, label: "Le Mie Creazioni", icon: Layers, badge: myCreations.length },
            { key: "trending" as Page, label: "Trending", icon: TrendingUp },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button key={key} onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                page === key || (page === "detail" && key === "explore") ? "bg-fuchsia-500/10 text-fuchsia-400" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge !== undefined && <span className="text-[10px] bg-fuchsia-500/20 text-fuchsia-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}

          <div className="pt-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Trending Tags</p>
            {trending.map(t => (
              <div key={t.tag} className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
                <span className="text-fuchsia-400">#</span>
                <span className="flex-1">{t.tag}</span>
                <span className="text-[10px]">{t.count}</span>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">GL</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">@GlitchCreator</p>
              <p className="text-[10px] text-fuchsia-400">Pro Creator</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><Settings className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </>}>

        {/* ═══ EXPLORE ═══ */}
        {page === "explore" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Esplora</h2>
                <p className="text-xs text-muted-foreground">Esperienze AR dalla community</p>
              </div>
              <button onClick={() => setPage("create")} className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />Crea Nuovo
              </button>
            </div>

            {/* Featured */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" />In Evidenza</h3>
              <div className="grid grid-cols-2 gap-4">
                {experiences.filter(e => e.featured).slice(0, 2).map(e => (
                  <div key={e.id} className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer group hover:border-fuchsia-500/30 transition-all"
                    onClick={() => { setSelectedExp(e); setPage("detail"); }}>
                    <div className={`h-44 bg-gradient-to-br ${e.style} flex items-center justify-center relative`}>
                      <span className="text-6xl group-hover:scale-110 transition-transform">{e.emoji}</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-[9px] font-bold rounded-full px-2 py-0.5">IN EVIDENZA</div>
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-white font-bold text-sm">{e.title}</p>
                        <p className="text-white/70 text-xs">{e.creator}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All */}
            <h3 className="text-sm font-semibold mb-3">Tutte le Esperienze</h3>
            <div className="grid grid-cols-3 gap-4">
              {experiences.map(e => (
                <div key={e.id} className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer group hover:border-fuchsia-500/30 hover:scale-[1.02] transition-all"
                  onClick={() => { setSelectedExp(e); setPage("detail"); }}>
                  <div className={`h-36 bg-gradient-to-br ${e.style} flex items-center justify-center relative`}>
                    <span className="text-4xl group-hover:scale-110 transition-transform">{e.emoji}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-white/80">
                      <span>{e.creator}</span>
                      <div className="flex gap-1.5">
                        <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" />{(e.views / 1000).toFixed(1)}K</span>
                        <span className="flex items-center gap-0.5"><Heart className="w-2.5 h-2.5" />{(e.likes / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-xs mb-0.5">{e.title}</h3>
                    <p className="text-[10px] text-muted-foreground">{e.desc}</p>
                    <div className="flex gap-1 mt-2">
                      {e.tags.map(t => (
                        <span key={t} className="text-[9px] bg-fuchsia-500/10 text-fuchsia-400 rounded px-1.5 py-0.5">#{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ DETAIL ═══ */}
        {page === "detail" && selectedExp && (
          <div className="p-6">
            <button onClick={() => setPage("explore")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-3 h-3" />Torna a Esplora
            </button>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <div className={`h-64 bg-gradient-to-br ${selectedExp.style} rounded-3xl flex items-center justify-center relative mb-4`}>
                  <span className="text-8xl">{selectedExp.emoji}</span>
                  {selectedExp.featured && <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold rounded-full px-3 py-1">IN EVIDENZA</div>}
                </div>
                <h2 className="text-xl font-bold mb-1">{selectedExp.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{selectedExp.desc}</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{selectedExp.views.toLocaleString()} visualizzazioni</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{selectedExp.likes.toLocaleString()} like</span>
                  <span className="text-xs text-muted-foreground">di {selectedExp.creator}</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white rounded-xl font-medium text-sm flex items-center gap-2">
                    <Camera className="w-4 h-4" />Prova in AR
                  </button>
                  <button className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <Heart className="w-4 h-4" />Like
                  </button>
                  <button className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <Bookmark className="w-4 h-4" />Salva
                  </button>
                  <button className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Dettagli</h3>
                  <div className="space-y-2">
                    {[
                      { l: "Creatore", v: selectedExp.creator },
                      { l: "Visualizzazioni", v: selectedExp.views.toLocaleString() },
                      { l: "Like", v: selectedExp.likes.toLocaleString() },
                      { l: "Tags", v: selectedExp.tags.join(", ") },
                    ].map(d => (
                      <div key={d.l} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{d.l}</span>
                        <span className="text-xs font-bold">{d.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-semibold text-sm mb-3">Esperienze Simili</h3>
                  <div className="space-y-2">
                    {experiences.filter(e => e.id !== selectedExp.id).slice(0, 3).map(e => (
                      <div key={e.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => setSelectedExp(e)}>
                        <span className="text-lg">{e.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{e.title}</p>
                          <p className="text-[10px] text-muted-foreground">{e.creator}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ CREATE ═══ */}
        {page === "create" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Crea Esperienza AR</h2>
            <p className="text-xs text-muted-foreground mb-6">Seleziona un filtro e crea la tua esperienza</p>

            <div className="max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-3xl p-6">
                <div className={`h-56 rounded-2xl mb-5 flex items-center justify-center ${selectedFilter ? "bg-gradient-to-br from-fuchsia-500/20 via-violet-500/10 to-pink-500/20 border-2 border-fuchsia-500/30" : "bg-muted/50 border-2 border-dashed border-border"}`}>
                  {selectedFilter ? (
                    <div className="text-center">
                      <span className="text-6xl block mb-2">{filters.find(f => f.name === selectedFilter)?.preview}</span>
                      <p className="text-sm font-bold text-fuchsia-400">{selectedFilter}</p>
                      <p className="text-[10px] text-muted-foreground">{filters.find(f => f.name === selectedFilter)?.category}</p>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Camera className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Seleziona un filtro per iniziare</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-6 gap-2 mb-5">
                  {filters.map(f => (
                    <button key={f.name} onClick={() => setSelectedFilter(f.name)}
                      className={`p-3 rounded-xl text-center transition-all border-2 ${selectedFilter === f.name ? "scale-105" : "border-transparent hover:scale-105"}`}
                      style={{ backgroundColor: (selectedFilter === f.name ? f.color : "#00000000") + "15", borderColor: selectedFilter === f.name ? f.color : "transparent" }}>
                      <span className="text-xl block mb-0.5">{f.preview}</span>
                      <span className="text-[9px] text-muted-foreground">{f.name}</span>
                    </button>
                  ))}
                </div>

                {selectedFilter && (
                  <div className="mb-4 space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Titolo</label>
                      <input placeholder="Nome della tua esperienza..." className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Descrizione</label>
                      <textarea rows={2} placeholder="Descrivi la tua creazione..." className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm resize-none" />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90">
                    <Camera className="w-4 h-4" />Apri Fotocamera AR
                  </button>
                  <button className="px-4 py-3 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ MY CREATIONS ═══ */}
        {page === "my_creations" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Le Mie Creazioni</h2>
            <p className="text-xs text-muted-foreground mb-6">{myCreations.length} esperienze create</p>

            <div className="grid grid-cols-2 gap-4">
              {myCreations.map(c => (
                <div key={c.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-fuchsia-500/30 transition-colors">
                  <div className="h-32 bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 flex items-center justify-center relative">
                    <span className="text-4xl">{c.emoji}</span>
                    <span className={`absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full font-bold ${c.status === "pubblicato" ? "bg-green-500/80 text-white" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-0.5">{c.title}</h3>
                    <p className="text-[10px] text-muted-foreground mb-2">Filtro: {c.filter} • {c.date}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" />{c.likes}</span>
                      <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{c.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TRENDING ═══ */}
        {page === "trending" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Trending</h2>
            <p className="text-xs text-muted-foreground mb-6">Le esperienze più popolari</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {trending.map((t, i) => (
                <div key={t.tag} className="bg-card border border-border rounded-2xl p-4 text-center hover:border-fuchsia-500/30 cursor-pointer transition-colors">
                  <p className="text-2xl font-black text-fuchsia-400">#{i + 1}</p>
                  <p className="text-sm font-bold">{t.tag}</p>
                  <p className="text-xs text-muted-foreground">{t.count} esperienze</p>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold mb-3">Top Esperienze</h3>
            <div className="space-y-3">
              {[...experiences].sort((a, b) => b.likes - a.likes).map((e, i) => (
                <div key={e.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-fuchsia-500/30 cursor-pointer transition-colors"
                  onClick={() => { setSelectedExp(e); setPage("detail"); }}>
                  <span className="text-lg font-black text-fuchsia-400 w-8 text-center">#{i + 1}</span>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${e.style} flex items-center justify-center text-xl`}>{e.emoji}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{e.title}</p>
                    <p className="text-[10px] text-muted-foreground">{e.creator} • {e.tags.map(t => `#${t}`).join(" ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold">{e.likes.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">like</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </MobileAppLayout>
  );
}
