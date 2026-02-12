"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Home, Thermometer, Lightbulb, Shield, Zap, Droplets,
  Power, Lock, Sun, Moon, Settings, Camera,
  Wifi, Speaker, Tv, Coffee, WashingMachine, Fan, Plus, Play,
  CheckCircle2, TrendingDown, BarChart3, Snowflake
} from "lucide-react";
import MobileAppLayout from "@/components/MobileAppLayout";

/* ───────── DATA ───────── */
const rooms = [
  { id: "soggiorno", name: "Soggiorno", temp: 22, humidity: 45, lights: true, devices: 4, icon: Tv, color: "#8b5cf6", consumption: 2.4 },
  { id: "camera", name: "Camera da Letto", temp: 20, humidity: 50, lights: false, devices: 3, icon: Moon, color: "#3b82f6", consumption: 0.8 },
  { id: "cucina", name: "Cucina", temp: 23, humidity: 55, lights: true, devices: 5, icon: Coffee, color: "#f59e0b", consumption: 3.1 },
  { id: "bagno", name: "Bagno", temp: 24, humidity: 65, lights: false, devices: 2, icon: Droplets, color: "#06b6d4", consumption: 1.2 },
  { id: "studio", name: "Studio", temp: 21, humidity: 42, lights: true, devices: 3, icon: Lightbulb, color: "#22c55e", consumption: 1.8 },
  { id: "ingresso", name: "Ingresso", temp: 19, humidity: 40, lights: false, devices: 2, icon: Lock, color: "#ef4444", consumption: 0.3 },
];

const devices = [
  { id: 1, name: "Luci Soggiorno", type: "light", room: "Soggiorno", status: true, value: "75%", icon: Lightbulb, color: "#f59e0b", consumption: 0.12 },
  { id: 2, name: "Termostato Smart", type: "thermo", room: "Casa", status: true, value: "22°C", icon: Thermometer, color: "#ef4444", consumption: 0.8 },
  { id: 3, name: "Telecamera Ingresso", type: "security", room: "Ingresso", status: true, value: "Attiva", icon: Camera, color: "#22c55e", consumption: 0.05 },
  { id: 4, name: "Lavatrice Smart", type: "appliance", room: "Bagno", status: false, value: "Spenta", icon: WashingMachine, color: "#3b82f6", consumption: 0 },
  { id: 5, name: "Serratura Smart", type: "lock", room: "Ingresso", status: true, value: "Chiusa", icon: Lock, color: "#22c55e", consumption: 0.01 },
  { id: 6, name: "Condizionatore", type: "climate", room: "Camera", status: false, value: "Spento", icon: Snowflake, color: "#06b6d4", consumption: 0 },
  { id: 7, name: "TV 55\" OLED", type: "media", room: "Soggiorno", status: true, value: "Netflix", icon: Tv, color: "#8b5cf6", consumption: 0.15 },
  { id: 8, name: "Speaker Multi-room", type: "media", room: "Soggiorno", status: true, value: "Musica", icon: Speaker, color: "#ec4899", consumption: 0.03 },
  { id: 9, name: "Luci Cucina", type: "light", room: "Cucina", status: true, value: "100%", icon: Lightbulb, color: "#f59e0b", consumption: 0.15 },
  { id: 10, name: "Ventilatore Studio", type: "climate", room: "Studio", status: true, value: "Velocità 2", icon: Fan, color: "#06b6d4", consumption: 0.04 },
  { id: 11, name: "Telecamera Giardino", type: "security", room: "Esterno", status: true, value: "Attiva", icon: Camera, color: "#22c55e", consumption: 0.05 },
  { id: 12, name: "Router WiFi 6", type: "network", room: "Studio", status: true, value: "248 Mbps", icon: Wifi, color: "#3b82f6", consumption: 0.02 },
];

const scenes = [
  { name: "Buongiorno", desc: "Luci calde, termostato 22°C, caffettiera on", icon: Sun, color: "#f59e0b", active: false },
  { name: "Buonanotte", desc: "Tutto spento, allarme attivo, temp 19°C", icon: Moon, color: "#3b82f6", active: false },
  { name: "Film", desc: "Luci soffuse, TV on, surround attivo", icon: Tv, color: "#8b5cf6", active: true },
  { name: "Assente", desc: "Allarme on, risparmio energetico, telecamere", icon: Shield, color: "#ef4444", active: false },
  { name: "Lavoro", desc: "Studio illuminato, silenzio, focus mode", icon: Lightbulb, color: "#22c55e", active: false },
  { name: "Ospiti", desc: "Luci al massimo, musica soft, temp 22°C", icon: Speaker, color: "#ec4899", active: false },
];

const alerts = [
  { type: "warning", message: "Consumo energetico sopra la media (+12%)", time: "2 ore fa", icon: Zap },
  { type: "info", message: "Serratura aperta da Mario alle 08:45", time: "3 ore fa", icon: Lock },
  { type: "success", message: "Lavatrice ciclo completato", time: "5 ore fa", icon: CheckCircle2 },
  { type: "info", message: "Aggiornamento firmware termostato disponibile", time: "8 ore fa", icon: Settings },
];

const energyData = [3.2, 2.8, 2.1, 1.8, 1.5, 2.0, 3.5, 5.2, 4.8, 3.6, 3.1, 2.9, 3.4, 3.8, 4.1, 4.5, 5.8, 6.2, 5.5, 4.2, 3.8, 3.2, 2.8, 2.4];

const roomEnergy = [
  { room: "Cucina", kwh: 28.5, pct: 39, color: "#f59e0b" },
  { room: "Soggiorno", kwh: 18.2, pct: 25, color: "#8b5cf6" },
  { room: "Studio", kwh: 12.8, pct: 18, color: "#22c55e" },
  { room: "Camera", kwh: 7.5, pct: 10, color: "#3b82f6" },
  { room: "Bagno", kwh: 5.4, pct: 8, color: "#06b6d4" },
];

/* ───────── COMPONENT ───────── */
type Page = "dashboard" | "rooms" | "devices" | "scenes" | "energy" | "security";

export default function CasaSmartPage() {
  const [page, setPage] = useState<Page>("dashboard");
  const [deviceStates, setDeviceStates] = useState<Record<number, boolean>>(
    Object.fromEntries(devices.map(d => [d.id, d.status]))
  );
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const toggleDevice = (id: number) => {
    setDeviceStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeDevices = Object.values(deviceStates).filter(Boolean).length;
  const totalConsumption = devices.reduce((s, d) => s + (deviceStates[d.id] ? d.consumption : 0), 0).toFixed(1);

  const mobileNav = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "rooms", label: "Stanze", icon: BarChart3 },
    { id: "scenes", label: "Scene", icon: Play },
    { id: "energy", label: "Energia", icon: Zap },
    { id: "security", label: "Sicurezza", icon: Shield },
  ];

  return (
    <MobileAppLayout appName="Casa Smart" accentColor="#8b5cf6" navItems={mobileNav} activePage={page} onPageChange={(p) => setPage(p as Page)} sidebar={<>
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">Casa Smart</h1>
              <p className="text-[10px] text-muted-foreground">Automazione Domestica</p>
            </div>
          </div>
        </div>

        {/* Home status */}
        <div className="p-3 border-b border-border">
          <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-green-400 font-medium">Casa Protetta</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm font-bold text-violet-400">22°C</p>
                <p className="text-[10px] text-muted-foreground">Temp</p>
              </div>
              <div>
                <p className="text-sm font-bold text-blue-400">48%</p>
                <p className="text-[10px] text-muted-foreground">Umidità</p>
              </div>
              <div>
                <p className="text-sm font-bold text-amber-400">{totalConsumption} kW</p>
                <p className="text-[10px] text-muted-foreground">Consumo</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "dashboard" as Page, label: "Dashboard", icon: Home },
            { key: "rooms" as Page, label: "Stanze", icon: BarChart3, badge: rooms.length },
            { key: "devices" as Page, label: "Dispositivi", icon: Power, badge: activeDevices },
            { key: "scenes" as Page, label: "Scene", icon: Play, badge: scenes.filter(s => s.active).length },
            { key: "energy" as Page, label: "Energia", icon: Zap },
            { key: "security" as Page, label: "Sicurezza", icon: Shield },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                page === key ? "bg-violet-500/10 text-violet-400" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
              {badge !== undefined && <span className="text-[10px] bg-violet-500/20 text-violet-400 rounded-full px-1.5 py-0.5">{badge}</span>}
            </button>
          ))}

          <div className="pt-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Stanze</p>
            {rooms.map(r => {
              const Icon = r.icon;
              return (
                <button key={r.id} onClick={() => { setSelectedRoom(r.id); setPage("rooms"); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <Icon className="w-3 h-3" style={{ color: r.color }} />
                  <span className="flex-1 text-left">{r.name}</span>
                  <span className="text-[10px]">{r.temp}°C</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white"><Home className="w-3.5 h-3.5" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Casa Bianchi</p>
              <p className="text-[10px] text-green-400">{activeDevices}/{devices.length} dispositivi attivi</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><Settings className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </>}>

        {/* ═══ DASHBOARD ═══ */}
        {page === "dashboard" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Dashboard</h2>
            <p className="text-xs text-muted-foreground mb-6">Panoramica della tua casa smart</p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Temperatura", value: "22°C", icon: Thermometer, color: "#ef4444", sub: "Media casa" },
                { label: "Umidità", value: "48%", icon: Droplets, color: "#3b82f6", sub: "Nella norma" },
                { label: "Sicurezza", value: "Attiva", icon: Shield, color: "#22c55e", sub: "Allarme on" },
                { label: "Consumo", value: `${totalConsumption} kW`, icon: Zap, color: "#f59e0b", sub: "-8% vs ieri" },
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

            {/* Rooms grid + Active scene */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Stanze</h3>
                  <button onClick={() => setPage("rooms")} className="text-xs text-violet-400 hover:underline">Vedi tutte</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {rooms.slice(0, 6).map(r => {
                    const Icon = r.icon;
                    return (
                      <div key={r.id} className="bg-card border border-border rounded-xl p-4 hover:border-violet-500/30 transition-colors cursor-pointer"
                        onClick={() => { setSelectedRoom(r.id); setPage("rooms"); }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: r.color + "15" }}>
                            <Icon className="w-4 h-4" style={{ color: r.color }} />
                          </div>
                          <Lightbulb className={`w-3.5 h-3.5 ${r.lights ? "text-amber-400" : "text-muted-foreground/20"}`} />
                        </div>
                        <p className="text-xs font-semibold mb-0.5">{r.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span>{r.temp}°C</span>
                          <span>{r.humidity}%</span>
                          <span>{r.devices} disp.</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Scene Rapide</h3>
                  <button onClick={() => setPage("scenes")} className="text-xs text-violet-400 hover:underline">Tutte</button>
                </div>
                <div className="space-y-2">
                  {scenes.slice(0, 4).map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.name} className={`p-3 rounded-xl border cursor-pointer transition-colors ${s.active ? "border-violet-500/40 bg-violet-500/5" : "border-border hover:border-violet-500/20"}`}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + "15" }}>
                            <Icon className="w-4 h-4" style={{ color: s.color }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold">{s.name}</p>
                            <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                          </div>
                          {s.active && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Alerts + Energy mini */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-3">Notifiche Recenti</h3>
                <div className="space-y-2">
                  {alerts.map((a, i) => {
                    const Icon = a.icon;
                    return (
                      <div key={i} className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${a.type === "warning" ? "border-amber-500/20 bg-amber-500/5" : a.type === "success" ? "border-green-500/20 bg-green-500/5" : "border-blue-500/20 bg-blue-500/5"}`}>
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${a.type === "warning" ? "text-amber-400" : a.type === "success" ? "text-green-400" : "text-blue-400"}`} />
                        <span className="text-xs flex-1">{a.message}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Consumo 24h</h3>
                  <button onClick={() => setPage("energy")} className="text-xs text-violet-400 hover:underline">Dettagli</button>
                </div>
                <div className="flex items-end gap-1 h-24 mb-2">
                  {energyData.map((v, i) => {
                    const maxV = Math.max(...energyData);
                    const pct = (v / maxV) * 100;
                    return (
                      <div key={i} className="flex-1 group cursor-pointer relative">
                        <div className="w-full rounded-t-sm opacity-70 group-hover:opacity-100 transition-all" style={{ height: `${pct}%`, backgroundColor: pct > 80 ? "#ef4444" : pct > 50 ? "#f59e0b" : "#8b5cf6" }} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground">
                  <span>00:00</span><span>12:00</span><span>23:00</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ROOMS ═══ */}
        {page === "rooms" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Stanze</h2>
            <p className="text-xs text-muted-foreground mb-6">{rooms.length} stanze monitorate</p>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map(r => {
                const Icon = r.icon;
                const roomDevices = devices.filter(d => d.room === r.name);
                const isSelected = selectedRoom === r.id;
                return (
                  <div key={r.id} className={`bg-card border rounded-2xl p-5 transition-all cursor-pointer ${isSelected ? "border-violet-500/50 shadow-lg shadow-violet-500/5" : "border-border hover:border-violet-500/30"}`}
                    onClick={() => setSelectedRoom(isSelected ? null : r.id)}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: r.color + "15" }}>
                          <Icon className="w-6 h-6" style={{ color: r.color }} />
                        </div>
                        <div>
                          <h3 className="font-bold">{r.name}</h3>
                          <p className="text-xs text-muted-foreground">{r.devices} dispositivi</p>
                        </div>
                      </div>
                      <Lightbulb className={`w-5 h-5 ${r.lights ? "text-amber-400" : "text-muted-foreground/20"}`} />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-muted/30 rounded-lg p-2 text-center">
                        <p className="text-sm font-bold">{r.temp}°C</p>
                        <p className="text-[9px] text-muted-foreground">Temp</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2 text-center">
                        <p className="text-sm font-bold">{r.humidity}%</p>
                        <p className="text-[9px] text-muted-foreground">Umidità</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2 text-center">
                        <p className="text-sm font-bold">{r.consumption} kW</p>
                        <p className="text-[9px] text-muted-foreground">Consumo</p>
                      </div>
                    </div>

                    {isSelected && roomDevices.length > 0 && (
                      <div className="pt-3 border-t border-border space-y-2">
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase">Dispositivi</p>
                        {roomDevices.map(d => {
                          const DIcon = d.icon;
                          const isOn = deviceStates[d.id];
                          return (
                            <div key={d.id} className="flex items-center gap-2">
                              <DIcon className="w-3.5 h-3.5" style={{ color: isOn ? d.color : "#6b7280" }} />
                              <span className="text-xs flex-1">{d.name}</span>
                              <button onClick={e => { e.stopPropagation(); toggleDevice(d.id); }}
                                className={`w-10 h-5 rounded-full transition-colors relative ${isOn ? "bg-violet-500" : "bg-muted"}`}>
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${isOn ? "translate-x-5" : "translate-x-0.5"}`} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ DEVICES ═══ */}
        {page === "devices" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Dispositivi</h2>
            <p className="text-xs text-muted-foreground mb-6">{activeDevices}/{devices.length} dispositivi attivi</p>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map(d => {
                const Icon = d.icon;
                const isOn = deviceStates[d.id];
                return (
                  <div key={d.id} className={`bg-card border rounded-2xl p-5 transition-all ${isOn ? "border-violet-500/30" : "border-border"}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOn ? "" : "opacity-40"}`} style={{ backgroundColor: d.color + "15" }}>
                          <Icon className="w-5 h-5" style={{ color: d.color }} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{d.name}</h4>
                          <p className="text-xs text-muted-foreground">{d.room}</p>
                        </div>
                      </div>
                      <button onClick={() => toggleDevice(d.id)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${isOn ? "bg-violet-500" : "bg-muted"}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isOn ? "translate-x-6" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isOn ? "text-foreground" : "text-muted-foreground"}`}>{isOn ? d.value : "Spento"}</span>
                      {isOn && d.consumption > 0 && <span className="text-[10px] text-muted-foreground">{d.consumption} kW</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ SCENES ═══ */}
        {page === "scenes" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Scene</h2>
                <p className="text-xs text-muted-foreground">Automazioni preconfigurate per la tua casa</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />Nuova Scena
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {scenes.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.name} className={`bg-card border rounded-2xl p-5 transition-all cursor-pointer ${s.active ? "border-violet-500/40 bg-violet-500/5 shadow-lg shadow-violet-500/5" : "border-border hover:border-violet-500/30"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + "15" }}>
                        <Icon className="w-6 h-6" style={{ color: s.color }} />
                      </div>
                      {s.active ? (
                        <span className="text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-medium">Attiva</span>
                      ) : (
                        <button className="px-3 py-1.5 bg-muted rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-violet-500/10 transition-colors">Attiva</button>
                      )}
                    </div>
                    <h3 className="font-bold mb-0.5">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ ENERGY ═══ */}
        {page === "energy" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Energia</h2>
            <p className="text-xs text-muted-foreground mb-6">Monitoraggio consumi e ottimizzazione</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Consumo Oggi", value: "72.4 kWh", color: "#8b5cf6", icon: Zap },
                { label: "Costo Stimato", value: "\u20AC12.80", color: "#22c55e", icon: TrendingDown },
                { label: "vs Ieri", value: "-8%", color: "#f59e0b", icon: TrendingDown },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-sm mb-4">Consumo Orario (kWh)</h3>
              <div className="flex items-end gap-1.5 h-44">
                {energyData.map((v, i) => {
                  const maxV = Math.max(...energyData);
                  const pct = (v / maxV) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                      <div className="relative w-full">
                        <div className="w-full rounded-t-md opacity-60 group-hover:opacity-100 transition-all" style={{ height: `${pct * 1.6}px`, backgroundColor: pct > 80 ? "#ef4444" : pct > 50 ? "#f59e0b" : "#8b5cf6" }} />
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-violet-400 bg-card border border-border rounded px-1 py-0.5">{v}</div>
                      </div>
                      {i % 3 === 0 && <span className="text-[9px] text-muted-foreground">{i}:00</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-4">Consumi per Stanza</h3>
              <div className="space-y-3">
                {roomEnergy.map(r => (
                  <div key={r.room} className="flex items-center gap-3">
                    <span className="text-xs w-24 font-medium">{r.room}</span>
                    <div className="flex-1 bg-muted rounded-full h-3">
                      <div className="h-3 rounded-full transition-all flex items-center justify-end pr-1.5" style={{ width: `${r.pct * 2.2}%`, backgroundColor: r.color }}>
                        <span className="text-[8px] text-white font-bold">{r.pct}%</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">{r.kwh} kWh</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ SECURITY ═══ */}
        {page === "security" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Sicurezza</h2>
            <p className="text-xs text-muted-foreground mb-6">Monitoraggio e controllo sicurezza domestica</p>

            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-green-400">Casa Protetta</p>
                  <p className="text-xs text-muted-foreground">Allarme attivo • 2 telecamere online • Serratura chiusa</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { name: "Telecamera Ingresso", status: "Online", lastEvent: "Movimento rilevato 14:32", icon: Camera, color: "#22c55e" },
                { name: "Telecamera Giardino", status: "Online", lastEvent: "Nessun evento", icon: Camera, color: "#22c55e" },
                { name: "Serratura Principale", status: "Chiusa", lastEvent: "Aperta da Mario 08:45", icon: Lock, color: "#22c55e" },
                { name: "Sensore Finestre", status: "Tutto chiuso", lastEvent: "Finestra cucina aperta 09:00", icon: Shield, color: "#22c55e" },
              ].map((d, i) => {
                const Icon = d.icon;
                return (
                  <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-green-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{d.name}</p>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span className="text-[10px] text-green-400">{d.status}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{d.lastEvent}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-3">Log Accessi</h3>
              <div className="space-y-2">
                {[
                  { who: "Mario Bianchi", action: "Serratura aperta", time: "08:45", method: "Impronta digitale" },
                  { who: "Sara Bianchi", action: "Serratura aperta", time: "07:30", method: "App Smart" },
                  { who: "Sistema", action: "Allarme attivato", time: "23:00 ieri", method: "Automatico (scena Buonanotte)" },
                  { who: "Mario Bianchi", action: "Allarme disattivato", time: "22:15 ieri", method: "Codice PIN" },
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-[10px] font-bold text-violet-400">
                      {l.who.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{l.who} — {l.action}</p>
                      <p className="text-[10px] text-muted-foreground">{l.method}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{l.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
    </MobileAppLayout>
  );
}
