import Link from "next/link";
import {
  Heart, Brain, Users, Building2, FileText, Accessibility,
  MapPin, Leaf, Bus, Code2, Bot, Megaphone,
  Home, Sparkles, MousePointerClick, ScanFace, Lock, Wand2, UserSearch,
  ArrowRight, Globe, Zap
} from "lucide-react";

const suites = [
  {
    name: "Human & Service AI",
    color: "#ec4899",
    gradient: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/30",
    apps: [
      { name: "LifeLink", desc: "Marketplace P2P per servizi in tempo reale", href: "/lifelink", icon: Heart },
      { name: "Mente Serena", desc: "Supporto psicologico digitale con AI empatica", href: "/mente-serena", icon: Brain },
      { name: "Comunità Attiva", desc: "Social civico per mutuo aiuto e volontariato", href: "/comunita-attiva", icon: Users },
    ],
  },
  {
    name: "Public, Legal & GovTech",
    color: "#3b82f6",
    gradient: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-500/30",
    apps: [
      { name: "PA.ONE", desc: "Gestione digitale pratiche PA", href: "/pa-one", icon: Building2 },
      { name: "DocFacile", desc: "Creazione e firma documentale intelligente", href: "/docfacile", icon: FileText },
      { name: "InclusioneBridge", desc: "Accessibilità digitale e deleghe operative", href: "/inclusione-bridge", icon: Accessibility },
    ],
  },
  {
    name: "Smart City & GreenTech",
    color: "#22c55e",
    gradient: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    apps: [
      { name: "CittàViva", desc: "Segnalazioni urbane e partecipazione civica", href: "/citta-viva", icon: MapPin },
      { name: "EcoVita", desc: "Gamification della sostenibilità", href: "/ecovita", icon: Leaf },
      { name: "Mobilità Plus", desc: "Analisi e ottimizzazione flussi di mobilità", href: "/mobilita-plus", icon: Bus },
    ],
  },
  {
    name: "Enterprise & Automation",
    color: "#f59e0b",
    gradient: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    apps: [
      { name: "AI DevStudio", desc: "Genera applicazioni da linguaggio naturale", href: "/ai-devstudio", icon: Code2 },
      { name: "SkyWork", desc: "Agenti AI aziendali per automazione processi", href: "/skywork", icon: Bot },
      { name: "AI Marketing Engine", desc: "Marketing predittivo e multicanale", href: "/ai-marketing", icon: Megaphone },
    ],
  },
  {
    name: "Home, IoT & Living",
    color: "#8b5cf6",
    gradient: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-500/30",
    apps: [
      { name: "Casa Smart", desc: "Monitoraggio e automazione domestica", href: "/casa-smart", icon: Home },
    ],
  },
  {
    name: "BIDDI Suite – Social & Creative",
    color: "#06b6d4",
    gradient: "from-cyan-500/20 to-teal-500/20",
    borderColor: "border-cyan-500/30",
    apps: [
      { name: "MindSwipe", desc: "Connessioni empatiche e compatibilità sociale", href: "/mindswipe", icon: Sparkles },
      { name: "TapMe!", desc: "Micro-social gamificato", href: "/tapme", icon: MousePointerClick },
      { name: "ReaFace", desc: "Analisi facciale AI", href: "/reaface", icon: ScanFace },
      { name: "Shh…", desc: "Messaggistica temporanea cifrata", href: "/shh", icon: Lock },
      { name: "GlitchLife", desc: "Esperienze AR creative", href: "/glitchlife", icon: Wand2 },
      { name: "WhoAreU", desc: "Analisi comportamentale AI", href: "/whoareu", icon: UserSearch },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-600/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Globe className="w-8 h-8 text-violet-400" />
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Global Tech Suite
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-3">
            Catalogo industriale di applicazioni digitali e AI
          </p>
          <p className="text-sm text-muted-foreground/70">
            Global Consulting SRLS • Founder & Product Architect: Giuseppe Mignano
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <span className="text-xs bg-card border border-border rounded-full px-3 py-1 text-muted-foreground">
              19 Applicazioni
            </span>
            <span className="text-xs bg-card border border-border rounded-full px-3 py-1 text-muted-foreground">
              6 Suite Tematiche
            </span>
            <span className="text-xs bg-card border border-border rounded-full px-3 py-1 text-muted-foreground">
              AI-Powered
            </span>
            <span className="text-xs bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1 text-yellow-400 font-semibold">
              DEMO MODE
            </span>
          </div>
        </div>
      </section>

      {/* Suites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="space-y-12">
          {suites.map((suite) => (
            <div key={suite.name}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: suite.color }} />
                <h2 className="text-xl sm:text-2xl font-bold">{suite.name}</h2>
                <span className="text-xs text-muted-foreground bg-card border border-border rounded-full px-2 py-0.5">
                  {suite.apps.length} app
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suite.apps.map((app) => {
                  const Icon = app.icon;
                  return (
                    <Link
                      key={app.href}
                      href={app.href}
                      className={`group relative rounded-xl border ${suite.borderColor} bg-gradient-to-br ${suite.gradient} p-5 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: suite.color + "20" }}
                        >
                          <Icon className="w-5 h-5" style={{ color: suite.color }} />
                        </div>
                        <ArrowRight
                          className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <h3 className="font-semibold text-base mb-1">{app.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{app.desc}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Global Consulting SRLS — Tutti i diritti riservati
          </p>
          <p className="text-xs text-muted-foreground/50 mt-1">
            Sviluppo AI-assistito con Windsurf + Cascade
          </p>
        </div>
      </footer>
    </div>
  );
}
