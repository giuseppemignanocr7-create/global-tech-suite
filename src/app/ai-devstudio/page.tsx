"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2, Download, Sparkles, Terminal, Eye, FileCode,
  Settings, FolderTree, ChevronRight, ChevronDown, File, Folder,
  GitBranch, Package, RefreshCw, Plus, X,
  AlertCircle, CheckCircle2,
  Cpu, Globe
} from "lucide-react";
import DemoBadge from "@/components/DemoBadge";
import { Menu } from "lucide-react";

/* ───────── DATA ───────── */
const fileTree = [
  { name: "src", type: "folder", open: true, children: [
    { name: "components", type: "folder", open: true, children: [
      { name: "LoginForm.tsx", type: "file", lang: "tsx", lines: 68, active: true },
      { name: "Button.tsx", type: "file", lang: "tsx", lines: 24 },
      { name: "Input.tsx", type: "file", lang: "tsx", lines: 32 },
    ]},
    { name: "pages", type: "folder", open: false, children: [
      { name: "index.tsx", type: "file", lang: "tsx", lines: 45 },
      { name: "login.tsx", type: "file", lang: "tsx", lines: 38 },
    ]},
    { name: "styles", type: "folder", open: false, children: [
      { name: "globals.css", type: "file", lang: "css", lines: 52 },
    ]},
    { name: "lib", type: "folder", open: false, children: [
      { name: "utils.ts", type: "file", lang: "ts", lines: 18 },
      { name: "api.ts", type: "file", lang: "ts", lines: 42 },
    ]},
  ]},
  { name: "package.json", type: "file", lang: "json", lines: 28 },
  { name: "tsconfig.json", type: "file", lang: "json", lines: 22 },
  { name: "README.md", type: "file", lang: "md", lines: 45 },
];

const generatedCode = `import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  loading?: boolean;
}

export default function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) {
      newErrors.email = 'Email obbligatoria';
    } else if (!email.includes('@')) {
      newErrors.email = 'Email non valida';
    }
    if (!password) {
      newErrors.password = 'Password obbligatoria';
    } else if (password.length < 8) {
      newErrors.password = 'Minimo 8 caratteri';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Bentornato</h2>
        <p className="text-gray-500 text-sm">Accedi al tuo account</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2.5 text-sm
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="nome@esempio.com"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm pr-10
                       focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded-lg py-2.5
                   font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Accesso in corso...' : 'Accedi'}
      </button>
      <p className="text-center text-xs text-gray-500">
        Non hai un account?{' '}
        <a href="#" className="text-blue-600 hover:underline">Registrati</a>
      </p>
    </form>
  );
}`;

const terminalLines = [
  { type: "cmd", text: "$ npx create-next-app@latest login-form --typescript" },
  { type: "out", text: "Creating a new Next.js app in /login-form..." },
  { type: "out", text: "Installing dependencies: react, react-dom, next..." },
  { type: "success", text: "✓ Dependencies installed successfully" },
  { type: "cmd", text: "$ npm run dev" },
  { type: "out", text: "ready - started server on 0.0.0.0:3000" },
  { type: "success", text: "✓ Compiled successfully in 1.2s" },
  { type: "out", text: "Local: http://localhost:3000" },
];

const projects = [
  { name: "Login Form", lang: "React + TypeScript", date: "10/02/2026", files: 3, size: "12KB", status: "completato", desc: "Form di autenticazione con validazione" },
  { name: "Dashboard Vendite", lang: "Next.js + Recharts", date: "08/02/2026", files: 7, size: "48KB", status: "completato", desc: "Dashboard interattiva con grafici real-time" },
  { name: "API Utenti", lang: "Node.js + Express", date: "05/02/2026", files: 5, size: "22KB", status: "completato", desc: "API REST con CRUD e autenticazione JWT" },
  { name: "Landing Page", lang: "HTML + TailwindCSS", date: "02/02/2026", files: 2, size: "8KB", status: "completato", desc: "Landing page responsive con animazioni" },
  { name: "Chat App", lang: "React + Socket.io", date: "28/01/2026", files: 9, size: "56KB", status: "in_corso", desc: "Chat real-time con rooms e notifiche" },
  { name: "E-commerce", lang: "Next.js + Stripe", date: "25/01/2026", files: 14, size: "92KB", status: "in_corso", desc: "Store completo con carrello e pagamenti" },
];

const examples = [
  { prompt: "Crea un form di login con validazione email e password", icon: "🔐", category: "Form" },
  { prompt: "Genera una tabella dati con paginazione e filtri", icon: "📊", category: "UI" },
  { prompt: "Crea un\'API REST per gestire utenti con CRUD", icon: "🔌", category: "Backend" },
  { prompt: "Genera un dashboard con grafici per vendite", icon: "📈", category: "Dashboard" },
  { prompt: "Crea un componente chat con WebSocket", icon: "💬", category: "Real-time" },
  { prompt: "Genera un sistema di autenticazione JWT", icon: "🛡️", category: "Auth" },
];

const langColors: Record<string, string> = {
  tsx: "#3b82f6", ts: "#3b82f6", css: "#8b5cf6", json: "#f59e0b", md: "#22c55e",
};

/* ───────── COMPONENT ───────── */
type Page = "ide" | "preview" | "projects" | "terminal";

export default function AIDevStudioPage() {
  const [page, setPage] = useState<Page>("ide");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [activeFile, setActiveFile] = useState("LoginForm.tsx");
  const [openTabs, setOpenTabs] = useState(["LoginForm.tsx", "Button.tsx"]);
  const [showTerminal, setShowTerminal] = useState(true);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowCode(true);
    }, 2000);
  };

  const codeLines = generatedCode.split("\n");

  const mobileNav = [
    { key: "ide" as Page, icon: FileCode, label: "Editor" },
    { key: "preview" as Page, icon: Eye, label: "Preview" },
    { key: "projects" as Page, icon: FolderTree, label: "Progetti" },
    { key: "terminal" as Page, icon: Terminal, label: "Terminal" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <DemoBadge />

      {/* ── Mobile top header ── */}
      <header className="lg:hidden sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border px-4 py-2.5 flex items-center gap-3">
        <Link href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Code2 className="w-3.5 h-3.5 text-white" />
        </Link>
        <span className="text-sm font-bold text-amber-400">AI DevStudio</span>
        <span className="text-xs text-muted-foreground">{mobileNav.find(n => n.key === page)?.label}</span>
      </header>

      {/* ─── ACTIVITY BAR (VS Code style narrow bar) ─── */}
      <div className="hidden lg:flex w-12 bg-card border-r border-border flex-col items-center py-2 gap-1 shrink-0">
        <Link href="/" className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-2">
          <Code2 className="w-4 h-4 text-white" />
        </Link>
        {[
          { key: "ide" as Page, icon: FileCode, tip: "Editor" },
          { key: "preview" as Page, icon: Eye, tip: "Preview" },
          { key: "projects" as Page, icon: FolderTree, tip: "Progetti" },
          { key: "terminal" as Page, icon: Terminal, tip: "Terminal" },
        ].map(({ key, icon: Icon, tip }) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              page === key ? "bg-amber-500/10 text-amber-400" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title={tip}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
        <div className="flex-1" />
        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted" title="Impostazioni">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* ─── FILE EXPLORER ─── */}
      {page === "ide" && (
        <aside className="hidden lg:flex w-56 border-r border-border bg-card/50 flex-col shrink-0">
          <div className="p-2 border-b border-border flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-1">Explorer</span>
            <div className="flex gap-0.5">
              <button className="p-1 rounded hover:bg-muted text-muted-foreground"><Plus className="w-3 h-3" /></button>
              <button className="p-1 rounded hover:bg-muted text-muted-foreground"><RefreshCw className="w-3 h-3" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-1 text-xs">
            {fileTree.map((item, i) => (
              <div key={i}>
                {item.type === "folder" ? (
                  <>
                    <button className="w-full flex items-center gap-1 px-2 py-1 hover:bg-muted/50 text-muted-foreground">
                      {item.open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      <Folder className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.name}</span>
                    </button>
                    {item.open && item.children?.map((child, ci) => (
                      <div key={ci}>
                        {child.type === "folder" ? (
                          <>
                            <button className="w-full flex items-center gap-1 px-2 py-1 pl-5 hover:bg-muted/50 text-muted-foreground">
                              {child.open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              <Folder className="w-3.5 h-3.5 text-amber-400/70" />
                              <span>{child.name}</span>
                            </button>
                            {child.open && child.children?.map((f: any, fi: number) => (
                              <button key={fi}
                                onClick={() => { setActiveFile(f.name); if (!openTabs.includes(f.name)) setOpenTabs([...openTabs, f.name]); }}
                                className={`w-full flex items-center gap-1 px-2 py-1 pl-9 hover:bg-muted/50 ${activeFile === f.name ? "bg-amber-500/10 text-amber-400" : "text-muted-foreground"}`}
                              >
                                <File className="w-3 h-3" style={{ color: langColors[f.lang] || "#6b7280" }} />
                                <span>{f.name}</span>
                              </button>
                            ))}
                          </>
                        ) : (
                          <button
                            onClick={() => { setActiveFile(child.name); if (!openTabs.includes(child.name)) setOpenTabs([...openTabs, child.name]); }}
                            className={`w-full flex items-center gap-1 px-2 py-1 pl-5 hover:bg-muted/50 ${activeFile === child.name ? "bg-amber-500/10 text-amber-400" : "text-muted-foreground"}`}
                          >
                            <File className="w-3 h-3" style={{ color: langColors[(child as any).lang] || "#6b7280" }} />
                            <span>{child.name}</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <button
                    onClick={() => { setActiveFile(item.name); if (!openTabs.includes(item.name)) setOpenTabs([...openTabs, item.name]); }}
                    className={`w-full flex items-center gap-1 px-2 py-1 hover:bg-muted/50 ${activeFile === item.name ? "bg-amber-500/10 text-amber-400" : "text-muted-foreground"}`}
                  >
                    <File className="w-3 h-3" style={{ color: langColors[(item as any).lang] || "#6b7280" }} />
                    <span>{item.name}</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* AI Prompt panel */}
          <div className="border-t border-border p-2">
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-2">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-amber-400 font-medium">AI Assistant</span>
              </div>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={2}
                placeholder="Descrivi cosa generare..."
                className="w-full px-2 py-1.5 bg-background border border-border rounded text-[11px] resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/40"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full mt-1.5 py-1.5 bg-amber-500 text-black rounded text-[10px] font-semibold hover:bg-amber-400 disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {isGenerating ? <><RefreshCw className="w-2.5 h-2.5 animate-spin" />Generando...</> : <><Sparkles className="w-2.5 h-2.5" />Genera</>}
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 min-w-0 pb-16 lg:pb-0 flex flex-col overflow-hidden">

        {/* ═══ IDE ═══ */}
        {page === "ide" && (
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex items-center border-b border-border bg-card/50 px-1">
              {openTabs.map(tab => (
                <div key={tab} onClick={() => setActiveFile(tab)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs cursor-pointer border-b-2 transition-colors ${
                    activeFile === tab ? "border-amber-500 text-amber-400 bg-background" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <File className="w-3 h-3" />
                  <span>{tab}</span>
                  <button onClick={e => { e.stopPropagation(); setOpenTabs(openTabs.filter(t => t !== tab)); if (activeFile === tab) setActiveFile(openTabs[0] || ""); }}
                    className="ml-1 p-0.5 rounded hover:bg-muted">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              <div className="flex-1" />
              <div className="flex items-center gap-1 px-2 text-[10px] text-muted-foreground">
                <GitBranch className="w-3 h-3" />main
                <span className="ml-2">TypeScript</span>
                <span className="ml-2">UTF-8</span>
              </div>
            </div>

            {/* Editor area */}
            <div className="flex-1 overflow-auto bg-background">
              {showCode ? (
                <div className="font-mono text-xs leading-6">
                  {codeLines.map((line, i) => (
                    <div key={i} className="flex hover:bg-muted/30 group">
                      <span className="w-12 text-right pr-4 text-muted-foreground/50 select-none shrink-0 border-r border-border/50">{i + 1}</span>
                      <pre className="pl-4 flex-1 whitespace-pre-wrap">
                        <code className={`${line.includes("import") ? "text-purple-400" : line.includes("//") ? "text-muted-foreground" : line.includes("const ") || line.includes("function ") ? "text-blue-400" : line.includes("return") ? "text-pink-400" : line.includes("'") || line.includes('"') || line.includes('`') ? "text-green-400" : "text-foreground/80"}`}>{line || " "}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 text-amber-400/30" />
                    <p className="text-sm">Usa l&apos;AI Assistant per generare codice</p>
                    <p className="text-xs text-muted-foreground mt-1">Oppure seleziona un file dall&apos;explorer</p>
                  </div>
                </div>
              )}
            </div>

            {/* Terminal panel */}
            {showTerminal && (
              <div className="h-44 border-t border-border bg-card/80 flex flex-col shrink-0">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-amber-400 font-medium">TERMINALE</span>
                    <span className="text-muted-foreground">PROBLEMI 0</span>
                    <span className="text-muted-foreground">OUTPUT</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-0.5 rounded hover:bg-muted text-muted-foreground"><Plus className="w-3 h-3" /></button>
                    <button onClick={() => setShowTerminal(false)} className="p-0.5 rounded hover:bg-muted text-muted-foreground"><X className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] space-y-0.5">
                  {terminalLines.map((l, i) => (
                    <div key={i} className={l.type === "cmd" ? "text-amber-400" : l.type === "success" ? "text-green-400" : "text-muted-foreground"}>
                      {l.text}
                    </div>
                  ))}
                  <div className="text-amber-400 flex items-center">$ <span className="ml-1 w-2 h-4 bg-amber-400 animate-pulse" /></div>
                </div>
              </div>
            )}

            {/* Status bar */}
            <div className="flex items-center justify-between px-3 py-1 bg-amber-600 text-[10px] text-white/90">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />main</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />0 errori</span>
                <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" />0 warning</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Riga {codeLines.length}, Col 1</span>
                <span>TypeScript React</span>
                <span>UTF-8</span>
                <span className="flex items-center gap-1"><Cpu className="w-3 h-3" />AI DevStudio v2.0</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PREVIEW ═══ */}
        {page === "preview" && (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3 py-1">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">localhost:3000/login</span>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><RefreshCw className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 bg-white overflow-auto">
              <div className="max-w-sm mx-auto mt-16 p-6">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-3 flex items-center justify-center"><Code2 className="w-6 h-6 text-white" /></div>
                  <h2 className="text-xl font-bold text-gray-900">Bentornato</h2>
                  <p className="text-gray-500 text-sm mt-1">Accedi al tuo account</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">nome@esempio.com</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-400 flex items-center justify-between">
                      <span>••••••••</span>
                      <span className="text-gray-400 cursor-pointer">👁</span>
                    </div>
                  </div>
                  <div className="bg-blue-600 text-white text-center rounded-lg py-2.5 text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors">Accedi</div>
                  <p className="text-center text-xs text-gray-500">Non hai un account? <span className="text-blue-600 cursor-pointer hover:underline">Registrati</span></p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-1.5 border-t border-border bg-card/50 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" />Compilato con successo</span>
              <span>•</span>
              <span>Rendering: 12ms</span>
              <span>•</span>
              <span>Bundle: 48KB</span>
            </div>
          </div>
        )}

        {/* ═══ PROJECTS ═══ */}
        {page === "projects" && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">I Miei Progetti</h2>
                <p className="text-xs text-muted-foreground">{projects.length} progetti generati con AI</p>
              </div>
              <button onClick={() => setPage("ide")} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />Nuovo Progetto
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Stats */}
              {[
                { label: "Progetti", value: projects.length, icon: Package, color: "#f59e0b" },
                { label: "File Generati", value: projects.reduce((s, p) => s + p.files, 0), icon: FileCode, color: "#3b82f6" },
                { label: "Completati", value: projects.filter(p => p.status === "completato").length, icon: CheckCircle2, color: "#22c55e" },
                { label: "In Corso", value: projects.filter(p => p.status === "in_corso").length, icon: RefreshCw, color: "#8b5cf6" },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + "15" }}>
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {projects.map((p, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-amber-500/30 transition-colors cursor-pointer" onClick={() => setPage("ide")}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                        <FileCode className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-semibold text-sm">{p.name}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.status === "completato" ? "bg-green-500/10 text-green-400" : "bg-purple-500/10 text-purple-400"}`}>
                            {p.status === "completato" ? "Completato" : "In corso"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{p.desc}</p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                          <span>{p.lang}</span>
                          <span>{p.files} file</span>
                          <span>{p.size}</span>
                          <span>{p.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-500/20">Apri</button>
                      <button className="px-3 py-1.5 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground"><Download className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TERMINAL FULL ═══ */}
        {page === "terminal" && (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/50">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">Terminale</span>
              <div className="flex-1" />
              <button className="text-[10px] px-2 py-1 bg-muted rounded text-muted-foreground">bash</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-background">
              {terminalLines.map((l, i) => (
                <div key={i} className={`mb-1 ${l.type === "cmd" ? "text-amber-400" : l.type === "success" ? "text-green-400" : "text-muted-foreground"}`}>
                  {l.text}
                </div>
              ))}
              <div className="mt-4 text-muted-foreground">
                <p>$ ai-devstudio generate --prompt &quot;Login form&quot;</p>
                <p className="text-amber-400">Analyzing prompt...</p>
                <p className="text-amber-400">Selecting framework: React + TypeScript</p>
                <p className="text-amber-400">Generating components...</p>
                <p className="text-green-400">✓ LoginForm.tsx created (68 lines)</p>
                <p className="text-green-400">✓ Button.tsx created (24 lines)</p>
                <p className="text-green-400">✓ Input.tsx created (32 lines)</p>
                <p className="text-green-400">✓ 3 files generated successfully</p>
                <p className="mt-2">$ npm run build</p>
                <p className="text-muted-foreground">Creating optimized production build...</p>
                <p className="text-green-400">✓ Build completed in 2.4s</p>
                <p className="text-green-400">✓ Bundle size: 48KB (gzipped: 16KB)</p>
              </div>
              <div className="mt-2 text-amber-400 flex items-center">$ <span className="ml-1 w-2 h-5 bg-amber-400 animate-pulse" /></div>
            </div>
            <div className="flex items-center justify-between px-3 py-1 bg-amber-600 text-[10px] text-white/90">
              <span className="flex items-center gap-1"><Terminal className="w-3 h-3" />bash — login-form</span>
              <span>AI DevStudio v2.0</span>
            </div>
          </div>
        )}
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border">
        <div className="flex justify-around items-center py-1.5 px-1">
          {mobileNav.map(item => {
            const Icon = item.icon;
            const active = page === item.key;
            return (
              <button key={item.key} onClick={() => setPage(item.key)} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${active ? "text-amber-400" : "text-muted-foreground"}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
