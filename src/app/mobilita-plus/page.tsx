"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Bus, TrendingUp, MapPin, Clock, Users, AlertTriangle, BarChart3,
  ArrowUpDown, Settings, Train, Bike, Car, Gauge, Sparkles, Activity,
  Navigation, Eye, ChevronRight, Zap, Radio, Signal, Thermometer,
  Wind, CloudRain, RefreshCw
} from "lucide-react";
import MobileAppLayout from "@/components/MobileAppLayout";

/* ───────── DATA ───────── */
const transportData = [
  { line: "M1 - Rossa", type: "Metro", icon: Train, color: "#ef4444", passengers: 42300, delay: 2, load: 87, status: "alto", freq: "3 min", direction: "Sesto FS ↔ Rho Fiera" },
  { line: "M2 - Verde", type: "Metro", icon: Train, color: "#22c55e", passengers: 38100, delay: 1, load: 72, status: "medio", freq: "3.5 min", direction: "Gessate ↔ Abbiategrasso" },
  { line: "M3 - Gialla", type: "Metro", icon: Train, color: "#f59e0b", passengers: 35600, delay: 0, load: 65, status: "medio", freq: "4 min", direction: "S.Donato ↔ Comasina" },
  { line: "M4 - Blu", type: "Metro", icon: Train, color: "#3b82f6", passengers: 28400, delay: 0, load: 55, status: "basso", freq: "4 min", direction: "Linate ↔ S.Cristoforo" },
  { line: "M5 - Lilla", type: "Metro", icon: Train, color: "#a855f7", passengers: 22100, delay: 1, load: 48, status: "basso", freq: "5 min", direction: "Bignami ↔ S.Siro" },
  { line: "Tram 15", type: "Tram", icon: Bus, color: "#f97316", passengers: 8200, delay: 5, load: 91, status: "critico", freq: "8 min", direction: "P.za Fontana ↔ Rozzano" },
  { line: "Bus 54", type: "Bus", icon: Bus, color: "#6b7280", passengers: 4100, delay: 3, load: 78, status: "alto", freq: "12 min", direction: "Lambrate ↔ Gratosoglio" },
  { line: "Bus 90/91", type: "Bus", icon: Bus, color: "#6b7280", passengers: 12400, delay: 4, load: 85, status: "alto", freq: "6 min", direction: "Circolare esterna" },
];

const hourlyFlow = [12, 18, 45, 78, 92, 88, 75, 65, 58, 62, 70, 85, 90, 82, 68, 72, 80, 95, 88, 60, 42, 28, 18, 10];

const predictions = [
  { time: "17:00-18:00", zone: "Stazione Centrale", prediction: "Picco massimo previsto — afflusso da treni regionali e Alta Velocità", risk: "alto", suggestion: "Attivare bus sostitutivi linea 60. Deviare flussi su M2 Garibaldi.", confidence: 94 },
  { time: "18:00-19:00", zone: "Cadorna", prediction: "Sovraccarico M1 direzione Sesto FS — evento sportivo San Siro", risk: "medio", suggestion: "Aumentare frequenza M1 a 2 min. Attivare navetta stadio.", confidence: 88 },
  { time: "19:00-20:00", zone: "Loreto", prediction: "Deflusso graduale — interscambio M1/M2 ancora congestionato", risk: "basso", suggestion: "Ripristino frequenza standard entro le 19:30.", confidence: 91 },
  { time: "20:00-21:00", zone: "San Siro", prediction: "Deflusso post-evento — 45.000 spettatori", risk: "alto", suggestion: "Attivare linea notturna N90. Prolungare orario M5.", confidence: 96 },
];

const zones = [
  { name: "Stazione Centrale", flow: 32000, pct: 95, trend: "+12%", status: "critico" },
  { name: "Cadorna FN", flow: 28400, pct: 82, trend: "+8%", status: "alto" },
  { name: "Loreto", flow: 24100, pct: 71, trend: "+3%", status: "medio" },
  { name: "Duomo", flow: 21800, pct: 64, trend: "-2%", status: "medio" },
  { name: "Garibaldi FS", flow: 19500, pct: 58, trend: "+15%", status: "medio" },
  { name: "Porta Genova", flow: 14200, pct: 42, trend: "-5%", status: "basso" },
];

const alerts = [
  { title: "Tram 15 — Ritardo 5 min", desc: "Guasto tecnico a fermata Vigentina. Stima ripristino: 10 min.", severity: "warning", time: "5 min fa" },
  { title: "M1 — Carico elevato", desc: "Tratta Cadorna-Lotto al 92% di capacità. Treni aggiuntivi in servizio.", severity: "info", time: "12 min fa" },
  { title: "Evento San Siro 20:45", desc: "Match Inter-Milan. Previsti 65.000 spettatori. Piano mobilità attivo.", severity: "alert", time: "1 ora fa" },
];

const statusColors: Record<string, string> = { critico: "#ef4444", alto: "#f59e0b", medio: "#22c55e", basso: "#3b82f6" };

/* ───────── COMPONENT ───────── */
type Page = "dashboard" | "lines" | "predictions" | "flows" | "heatmap";

export default function MobilitaPlusPage() {
  const [page, setPage] = useState<Page>("dashboard");
  const [selectedLine, setSelectedLine] = useState<typeof transportData[0] | null>(null);

  const totalPassengers = transportData.reduce((s, t) => s + t.passengers, 0);
  const avgDelay = (transportData.reduce((s, t) => s + t.delay, 0) / transportData.length).toFixed(1);
  const avgLoad = Math.round(transportData.reduce((s, t) => s + t.load, 0) / transportData.length);
  const criticalLines = transportData.filter(t => t.status === "critico").length;

  const mobileNav = [
    { id: "dashboard", label: "Home", icon: BarChart3 },
    { id: "lines", label: "Linee", icon: Train },
    { id: "predictions", label: "AI", icon: Sparkles },
    { id: "flows", label: "Flussi", icon: Activity },
    { id: "heatmap", label: "Mappa", icon: Navigation },
  ];

  return (
    <MobileAppLayout appName="Mobilit\u00e0+" accentColor="#06b6d4" navItems={mobileNav} activePage={page} onPageChange={(p) => setPage(p as Page)} sidebar={<>
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">Mobilità Plus</h1>
              <p className="text-[10px] text-muted-foreground">Flussi in Tempo Reale</p>
            </div>
          </div>
        </div>

        {/* Live status */}
        <div className="p-3 border-b border-border">
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-400 font-medium">LIVE — Aggiornato ora</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-sm font-bold text-cyan-400">{(totalPassengers / 1000).toFixed(1)}K</p>
                <p className="text-[10px] text-muted-foreground">Passeggeri</p>
              </div>
              <div>
                <p className="text-sm font-bold text-amber-400">{avgDelay} min</p>
                <p className="text-[10px] text-muted-foreground">Ritardo Medio</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "dashboard" as Page, label: "Dashboard", icon: BarChart3 },
            { key: "lines" as Page, label: "Linee & Mezzi", icon: Train, badge: transportData.length },
            { key: "predictions" as Page, label: "AI Predittiva", icon: Sparkles },
            { key: "flows" as Page, label: "Flussi Orari", icon: Activity },
            { key: "heatmap" as Page, label: "Heatmap Zone", icon: Navigation },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                page === key ? "bg-cyan-500/10 text-cyan-400" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge && <span className="text-[10px] bg-cyan-500/20 text-cyan-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}

          <div className="pt-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Avvisi</p>
            {alerts.slice(0, 2).map((a, i) => (
              <div key={i} className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${a.severity === "warning" ? "bg-amber-500" : a.severity === "alert" ? "bg-red-500" : "bg-blue-500"}`} />
                  <span className="font-medium text-foreground text-[11px] truncate">{a.title}</span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{a.time}</p>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" />12°C</span>
            <span className="flex items-center gap-1"><Wind className="w-3 h-3" />15 km/h</span>
            <span className="flex items-center gap-1"><CloudRain className="w-3 h-3" />Sereno</span>
          </div>
        </div>
      </>}>

        {/* ═══ DASHBOARD ═══ */}
        {page === "dashboard" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Dashboard Mobilità</h2>
                <p className="text-xs text-muted-foreground">Milano — Monitoraggio in tempo reale</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Live</span>
                <button className="ml-2 p-1.5 rounded-lg bg-card border border-border hover:bg-muted"><RefreshCw className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Passeggeri Oggi", value: `${(totalPassengers / 1000).toFixed(1)}K`, color: "#06b6d4", icon: Users, sub: "+8% vs ieri" },
                { label: "Ritardo Medio", value: `${avgDelay} min`, color: "#f59e0b", icon: Clock, sub: "-15% vs ieri" },
                { label: "Carico Medio", value: `${avgLoad}%`, color: "#8b5cf6", icon: Gauge, sub: "Nella norma" },
                { label: "Linee Critiche", value: `${criticalLines}`, color: "#ef4444", icon: AlertTriangle, sub: "Tram 15" },
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

            {/* Lines quick + Alerts */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="col-span-2 bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Stato Linee</h3>
                  <button onClick={() => setPage("lines")} className="text-xs text-cyan-400 hover:underline">Dettagli</button>
                </div>
                <div className="space-y-2">
                  {transportData.slice(0, 5).map(t => (
                    <div key={t.line} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => { setSelectedLine(t); setPage("lines"); }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                      <span className="text-xs font-medium flex-1">{t.line}</span>
                      <div className="w-20 bg-muted rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${t.load}%`, backgroundColor: statusColors[t.status] }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-10 text-right">{t.load}%</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ color: statusColors[t.status], backgroundColor: statusColors[t.status] + "15" }}>{t.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" />Avvisi</h3>
                <div className="space-y-3">
                  {alerts.map((a, i) => (
                    <div key={i} className={`p-3 rounded-xl border ${a.severity === "warning" ? "bg-amber-500/5 border-amber-500/20" : a.severity === "alert" ? "bg-red-500/5 border-red-500/20" : "bg-blue-500/5 border-blue-500/20"}`}>
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-xs font-medium">{a.title}</p>
                        <span className="text-[10px] text-muted-foreground">{a.time}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hourly flow mini */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Flusso Passeggeri 24h</h3>
                <button onClick={() => setPage("flows")} className="text-xs text-cyan-400 hover:underline">Espandi</button>
              </div>
              <div className="flex items-end gap-1 h-24">
                {hourlyFlow.map((v, i) => (
                  <div key={i} className="flex-1 group cursor-pointer relative">
                    <div className="w-full rounded-t-sm transition-all opacity-70 group-hover:opacity-100" style={{ height: `${v}%`, backgroundColor: v > 85 ? "#ef4444" : v > 65 ? "#f59e0b" : "#06b6d4" }} />
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: v > 85 ? "#ef4444" : v > 65 ? "#f59e0b" : "#06b6d4" }}>{v}K</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1 text-[9px] text-muted-foreground">
                <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ LINES ═══ */}
        {page === "lines" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Linee & Mezzi</h2>
            <p className="text-xs text-muted-foreground mb-6">{transportData.length} linee monitorate in tempo reale</p>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left bg-muted/30">
                    <th className="px-4 py-3 font-medium">Linea</th>
                    <th className="px-4 py-3 font-medium">Direzione</th>
                    <th className="px-4 py-3 font-medium">Passeggeri</th>
                    <th className="px-4 py-3 font-medium">Frequenza</th>
                    <th className="px-4 py-3 font-medium">Ritardo</th>
                    <th className="px-4 py-3 font-medium">Carico</th>
                    <th className="px-4 py-3 font-medium">Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {transportData.map(t => {
                    const Icon = t.icon;
                    return (
                      <tr key={t.line} className={`border-b border-border/50 hover:bg-cyan-500/5 transition-colors cursor-pointer ${selectedLine?.line === t.line ? "bg-cyan-500/5" : ""}`}
                        onClick={() => setSelectedLine(selectedLine?.line === t.line ? null : t)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                            <span className="font-semibold">{t.line}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{t.direction}</td>
                        <td className="px-4 py-3 font-medium">{t.passengers.toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs">{t.freq}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium ${t.delay > 3 ? "text-red-400" : t.delay > 0 ? "text-amber-400" : "text-green-400"}`}>
                            {t.delay > 0 ? `+${t.delay} min` : "In orario"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div className="h-2 rounded-full transition-all" style={{ width: `${t.load}%`, backgroundColor: statusColors[t.status] }} />
                            </div>
                            <span className="text-xs w-8">{t.load}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: statusColors[t.status], backgroundColor: statusColors[t.status] + "15" }}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {selectedLine && (
              <div className="mt-4 bg-card border border-cyan-500/30 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedLine.color }} />
                  <h3 className="font-bold text-lg">{selectedLine.line}</h3>
                  <span className="text-xs text-muted-foreground">{selectedLine.type}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { l: "Passeggeri", v: selectedLine.passengers.toLocaleString() },
                    { l: "Carico", v: `${selectedLine.load}%` },
                    { l: "Ritardo", v: selectedLine.delay > 0 ? `+${selectedLine.delay} min` : "In orario" },
                    { l: "Frequenza", v: selectedLine.freq },
                  ].map(d => (
                    <div key={d.l} className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold">{d.v}</p>
                      <p className="text-[10px] text-muted-foreground">{d.l}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Percorso: {selectedLine.direction}</p>
              </div>
            )}
          </div>
        )}

        {/* ═══ PREDICTIONS ═══ */}
        {page === "predictions" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">AI Predittiva</h2>
            <p className="text-xs text-muted-foreground mb-6">Previsioni basate su ML — dati storici, meteo, eventi</p>

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-bold">Modello Predittivo Attivo</h3>
                  <p className="text-xs text-muted-foreground">Accuratezza media: <strong className="text-cyan-400">92.3%</strong> • Aggiornamento ogni 5 minuti • Dati: 2.4M record storici</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {predictions.map((p, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-cyan-500/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: statusColors[p.risk] + "15" }}>
                        <Clock className="w-5 h-5" style={{ color: statusColors[p.risk] }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-sm">{p.time}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: statusColors[p.risk], backgroundColor: statusColors[p.risk] + "15" }}>Rischio {p.risk}</span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{p.zone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Confidenza</p>
                      <p className="text-lg font-bold text-cyan-400">{p.confidence}%</p>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{p.prediction}</p>
                  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-cyan-400 mb-0.5">Suggerimento AI</p>
                        <p className="text-xs text-muted-foreground">{p.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ FLOWS ═══ */}
        {page === "flows" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Flussi Orari</h2>
            <p className="text-xs text-muted-foreground mb-6">Distribuzione passeggeri nelle ultime 24 ore</p>

            <div className="bg-card border border-border rounded-xl p-5 mb-6">
              <h3 className="text-sm font-semibold mb-4">Flusso Passeggeri — 24 Ore (migliaia)</h3>
              <div className="flex items-end gap-1.5 h-48">
                {hourlyFlow.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="relative w-full">
                      <div className="w-full rounded-t-md transition-all opacity-70 group-hover:opacity-100" style={{ height: `${v * 1.8}px`, backgroundColor: v > 85 ? "#ef4444" : v > 65 ? "#f59e0b" : "#06b6d4" }} />
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{ color: v > 85 ? "#ef4444" : v > 65 ? "#f59e0b" : "#06b6d4" }}>{v}K</div>
                    </div>
                    {i % 2 === 0 && <span className="text-[9px] text-muted-foreground">{String(i).padStart(2, "0")}</span>}
                  </div>
                ))}
              </div>
              <div className="flex gap-6 mt-4 justify-center text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-500" />Normale (&lt;65K)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500" />Alto (65-85K)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500" />Critico (&gt;85K)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Picchi di Traffico</h3>
                <div className="space-y-3">
                  {[
                    { time: "07:30-09:00", label: "Punta Mattutina", value: "92K", color: "#ef4444" },
                    { time: "12:30-13:30", label: "Pausa Pranzo", value: "85K", color: "#f59e0b" },
                    { time: "17:00-19:00", label: "Punta Serale", value: "95K", color: "#ef4444" },
                    { time: "20:30-21:30", label: "Evento Sportivo", value: "88K", color: "#f59e0b" },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                      <div className="flex-1">
                        <p className="text-xs font-medium">{p.label}</p>
                        <p className="text-[10px] text-muted-foreground">{p.time}</p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: p.color }}>{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-4">Distribuzione per Tipo</h3>
                <div className="space-y-4">
                  {[
                    { type: "Metro", pct: 68, value: "95.2K", color: "#06b6d4" },
                    { type: "Bus", pct: 22, value: "30.8K", color: "#f59e0b" },
                    { type: "Tram", pct: 6, value: "8.2K", color: "#f97316" },
                    { type: "Bike Sharing", pct: 4, value: "5.6K", color: "#22c55e" },
                  ].map((d, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{d.type}</span>
                        <span className="text-xs text-muted-foreground">{d.value} ({d.pct}%)</span>
                      </div>
                      <div className="bg-muted rounded-full h-2.5">
                        <div className="h-2.5 rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ HEATMAP ═══ */}
        {page === "heatmap" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Heatmap Zone</h2>
            <p className="text-xs text-muted-foreground mb-6">Concentrazione passeggeri per zona — tempo reale</p>

            {/* Simulated heatmap */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden relative mb-6" style={{ height: 420 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-blue-900/10">
                <div className="absolute inset-0 opacity-10" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 35px, #27272a 35px, #27272a 36px), repeating-linear-gradient(90deg, transparent, transparent 35px, #27272a 35px, #27272a 36px)" }} />
                {zones.map((z, i) => {
                  const size = Math.max(60, z.pct * 1.2);
                  return (
                    <div key={z.name} className="absolute group cursor-pointer" style={{ top: `${12 + i * 14}%`, left: `${10 + (i * 16) % 70}%` }}>
                      <div className="rounded-full animate-pulse" style={{
                        width: `${size}px`, height: `${size}px`,
                        backgroundColor: statusColors[z.status] + "20",
                        border: `2px solid ${statusColors[z.status]}50`,
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <span className="text-[10px] font-bold" style={{ color: statusColors[z.status] }}>{z.pct}%</span>
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-xl p-3 text-xs w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-10">
                        <p className="font-semibold text-sm mb-0.5">{z.name}</p>
                        <p className="text-muted-foreground">{z.flow.toLocaleString()} passeggeri</p>
                        <p className="text-muted-foreground">Trend: <span className={z.trend.startsWith("+") ? "text-red-400" : "text-green-400"}>{z.trend}</span></p>
                      </div>
                    </div>
                  );
                })}
                <div className="absolute bottom-4 left-4 bg-card/95 border border-border rounded-xl p-3 text-xs">
                  <p className="font-semibold text-cyan-400 mb-1.5">Milano — Heatmap Mobilità</p>
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />Critico</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />Alto</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />Medio</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />Basso</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone ranking */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-4">Classifica Zone per Traffico</h3>
              <div className="space-y-3">
                {zones.map((z, i) => (
                  <div key={z.name} className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground w-6 text-center">{i + 1}</span>
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: statusColors[z.status] }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium">{z.name}</span>
                        <span className="text-xs text-muted-foreground">{z.flow.toLocaleString()} pass.</span>
                      </div>
                      <div className="bg-muted rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${z.pct}%`, backgroundColor: statusColors[z.status] }} />
                      </div>
                    </div>
                    <span className={`text-xs font-medium w-10 text-right ${z.trend.startsWith("+") ? "text-red-400" : "text-green-400"}`}>{z.trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
    </MobileAppLayout>
  );
}
