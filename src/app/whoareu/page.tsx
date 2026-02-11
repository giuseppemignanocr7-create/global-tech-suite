"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, UserSearch, Brain, Target, Sparkles, ChevronRight, BarChart3,
  RefreshCw, Settings, Users, Heart, Lightbulb,
  TrendingUp, Share2, Download, CheckCircle2, Compass, Zap
} from "lucide-react";
import DemoBadge from "@/components/DemoBadge";

/* ───────── DATA ───────── */
const quizQuestions = [
  { q: "Quando devi prendere una decisione importante, cosa fai?", options: ["Analizzo tutti i dati", "Seguo l'istinto", "Chiedo consiglio", "Aspetto e vedo"], emoji: "🤔" },
  { q: "In un gruppo di lavoro, quale ruolo ti viene naturale?", options: ["Leader organizzativo", "Creativo visionario", "Mediatore empatico", "Esecutore preciso"], emoji: "👥" },
  { q: "Come reagisci allo stress?", options: ["Pianificazione extra", "Attività fisica", "Parlo con qualcuno", "Mi isolo per riflettere"], emoji: "😰" },
  { q: "Cosa ti motiva di più?", options: ["Raggiungere obiettivi", "Creare qualcosa di nuovo", "Aiutare gli altri", "Imparare cose nuove"], emoji: "🔥" },
  { q: "Come ti descriverebbero gli amici?", options: ["Affidabile e preciso", "Energico e creativo", "Gentile e disponibile", "Riflessivo e profondo"], emoji: "💭" },
  { q: "Quale ambiente ti fa sentire più a tuo agio?", options: ["Ufficio strutturato", "Studio creativo", "Gruppo di amici", "Biblioteca silenziosa"], emoji: "🏠" },
  { q: "Come affronti un conflitto?", options: ["Con logica e fatti", "Con creatività", "Con empatia", "Con pazienza"], emoji: "⚡" },
];

const personalityResult = {
  type: "Il Visionario Empatico",
  emoji: "🧠✨",
  description: "Combini una forte capacità analitica con un'intelligenza emotiva sopra la media. Sei naturalmente portato a vedere soluzioni creative ai problemi, mantenendo sempre un occhio attento alle dinamiche umane.",
  traits: [
    { name: "Creatività", value: 88, color: "#8b5cf6" },
    { name: "Empatia", value: 92, color: "#ec4899" },
    { name: "Analisi", value: 75, color: "#3b82f6" },
    { name: "Leadership", value: 70, color: "#f59e0b" },
    { name: "Resilienza", value: 82, color: "#22c55e" },
    { name: "Intuizione", value: 86, color: "#06b6d4" },
  ],
  strengths: ["Pensiero laterale", "Ascolto attivo", "Problem solving creativo", "Comunicazione efficace"],
  areas: ["Decisionalità rapida", "Gestione del perfezionismo", "Delega compiti"],
  compatibility: {
    best: [{ type: "L'Architetto Pragmatico", pct: 92 }, { type: "Il Connettore Sociale", pct: 88 }],
    challenging: [{ type: "Il Controller Analitico", pct: 45 }],
  },
};

const insights = [
  { title: "Stile Decisionale", text: "Tendi a combinare analisi e intuizione. Nelle decisioni importanti, il tuo processo ideale è: raccogliere dati, consultare persone fidate, seguire l'intuito.", icon: Compass, color: "#8b5cf6" },
  { title: "Comunicazione", text: "Sei un comunicatore adattivo: sai passare dal linguaggio tecnico a quello emotivo. Efficace in contesti professionali e personali.", icon: Users, color: "#ec4899" },
  { title: "Produttività", text: "Rendi meglio in ambienti con un mix di struttura e libertà creativa. Deep work alternato a brainstorming è il tuo flow ideale.", icon: Zap, color: "#f59e0b" },
  { title: "Relazioni", text: "Sei naturalmente empatico ma a volte rischi di assorbire le emozioni altrui. Impara a mettere confini sani.", icon: Heart, color: "#ef4444" },
  { title: "Crescita Consigliata", text: "Sviluppa maggiore assertività nelle decisioni rapide. Non tutto richiede un'analisi approfondita — fidati del tuo istinto.", icon: TrendingUp, color: "#22c55e" },
  { title: "Ambiente Ideale", text: "Startup creative, team cross-funzionali, ruoli che combinano strategia e contatto umano sono i tuoi habitat naturali.", icon: Lightbulb, color: "#06b6d4" },
];

const personalityTypes = [
  { type: "Il Visionario Empatico", pct: 22, emoji: "🧠✨" },
  { type: "L'Architetto Pragmatico", pct: 18, emoji: "🏗️" },
  { type: "Il Connettore Sociale", pct: 15, emoji: "🤝" },
  { type: "Il Pensatore Profondo", pct: 14, emoji: "📚" },
  { type: "Il Controller Analitico", pct: 12, emoji: "📊" },
  { type: "L'Esploratore Curioso", pct: 10, emoji: "🧭" },
  { type: "Il Mediatore Armonioso", pct: 9, emoji: "🕊️" },
];

/* ───────── COMPONENT ───────── */
type Page = "quiz" | "profile" | "insights" | "compare" | "settings";

export default function WhoAreUPage() {
  const [page, setPage] = useState<Page>("quiz");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnswer = (optIndex: number) => {
    const newAnswers = [...answers, optIndex];
    setAnswers(newAnswers);
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setQuizDone(true);
        setPage("profile");
      }, 2500);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setAnswers([]);
    setQuizDone(false);
    setPage("quiz");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DemoBadge />

      {/* ─── SIDEBAR ─── */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs mb-3">
            <ArrowLeft className="w-3 h-3" />Portale
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">WhoAreU</h1>
              <p className="text-[10px] text-muted-foreground">Analisi Comportamentale AI</p>
            </div>
          </div>
        </div>

        <div className="p-3 border-b border-border">
          <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-3 text-center">
            {quizDone ? (
              <>
                <span className="text-2xl block mb-1">{personalityResult.emoji}</span>
                <p className="text-xs font-bold text-violet-400">{personalityResult.type}</p>
                <p className="text-[10px] text-muted-foreground">Profilo completato</p>
              </>
            ) : (
              <>
                <Brain className="w-6 h-6 text-violet-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Completa il quiz</p>
                <p className="text-[10px] text-muted-foreground">per scoprire chi sei</p>
              </>
            )}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">Navigazione</p>
          {[
            { key: "quiz" as Page, label: "Quiz", icon: Brain },
            { key: "profile" as Page, label: "Il Tuo Profilo", icon: UserSearch },
            { key: "insights" as Page, label: "AI Insights", icon: Sparkles },
            { key: "compare" as Page, label: "Confronta", icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setPage(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                page === key ? "bg-violet-500/10 text-violet-400" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span>
            </button>
          ))}

          {quizDone && (
            <div className="pt-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2">I Tuoi Tratti</p>
              {personalityResult.traits.slice(0, 4).map(t => (
                <div key={t.name} className="px-3 py-1 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-[10px] flex-1 text-muted-foreground">{t.name}</span>
                  <span className="text-[10px] font-bold" style={{ color: t.color }}>{t.value}%</span>
                </div>
              ))}
            </div>
          )}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white">TU</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Il Tuo Profilo</p>
              <p className="text-[10px] text-violet-400">{quizDone ? "Analizzato" : "In attesa"}</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><Settings className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="flex-1 min-h-screen overflow-y-auto">

        {/* ═══ QUIZ ═══ */}
        {page === "quiz" && !quizDone && !analyzing && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Quiz Comportamentale</h2>
            <p className="text-xs text-muted-foreground mb-6">{quizQuestions.length} domande per scoprire chi sei davvero</p>

            <div className="max-w-xl mx-auto">
              {/* Progress */}
              <div className="flex items-center gap-3 mb-6">
                {quizQuestions.map((_, i) => (
                  <div key={i} className={`flex-1 h-2 rounded-full ${i < currentQ ? "bg-violet-500" : i === currentQ ? "bg-violet-500/50" : "bg-muted"}`} />
                ))}
                <span className="text-xs text-muted-foreground shrink-0">{currentQ + 1}/{quizQuestions.length}</span>
              </div>

              <div className="bg-card border border-border rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-2xl">
                    {quizQuestions[currentQ].emoji}
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Domanda {currentQ + 1} di {quizQuestions.length}</p>
                    <h3 className="text-lg font-bold">{quizQuestions[currentQ].q}</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  {quizQuestions[currentQ].options.map((opt, i) => (
                    <button key={i} onClick={() => handleAnswer(i)}
                      className="w-full text-left p-4 rounded-2xl border border-border hover:border-violet-500/50 hover:bg-violet-500/5 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-violet-500/10 group-hover:text-violet-400">{String.fromCharCode(65 + i)}</span>
                        <span className="text-sm">{opt}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {page === "quiz" && analyzing && (
          <div className="p-6 flex items-center justify-center min-h-[80vh]">
            <div className="text-center max-w-sm">
              <div className="w-24 h-24 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-3">Analisi AI in corso...</h3>
              <div className="space-y-2 text-sm">
                {[
                  { step: "Risposte elaborate", done: true },
                  { step: "Pattern comportamentali rilevati", done: true },
                  { step: "Confronto con database personalità", done: false },
                  { step: "Generazione profilo", done: false },
                ].map((s, i) => (
                  <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${s.done ? "bg-green-500/5 text-green-400" : "bg-muted/30 text-muted-foreground"}`}>
                    {s.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span className="text-xs">{s.step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {page === "quiz" && quizDone && (
          <div className="p-6 flex items-center justify-center min-h-[80vh]">
            <div className="text-center max-w-sm">
              <span className="text-6xl block mb-4">{personalityResult.emoji}</span>
              <h3 className="text-2xl font-bold mb-2">Quiz Completato!</h3>
              <p className="text-sm text-muted-foreground mb-6">Il tuo profilo è pronto.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setPage("profile")} className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-xl font-bold">Vedi Profilo</button>
                <button onClick={resetQuiz} className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" />Rifai
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PROFILE ═══ */}
        {page === "profile" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Il Tuo Profilo</h2>
            <p className="text-xs text-muted-foreground mb-6">{quizDone ? "Analisi comportamentale completata" : "Completa il quiz per scoprire il tuo profilo"}</p>

            {quizDone ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-4">
                  <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-3xl p-8 text-center">
                    <span className="text-6xl block mb-3">{personalityResult.emoji}</span>
                    <h2 className="text-2xl font-bold mb-2">{personalityResult.type}</h2>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">{personalityResult.description}</p>
                    <div className="flex gap-2 justify-center mt-4">
                      <button className="px-4 py-1.5 bg-card border border-border rounded-lg text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"><Share2 className="w-3 h-3" />Condividi</button>
                      <button className="px-4 py-1.5 bg-card border border-border rounded-lg text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"><Download className="w-3 h-3" />PDF</button>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-violet-400" />I Tuoi Tratti</h3>
                    <div className="space-y-3">
                      {personalityResult.traits.map(t => (
                        <div key={t.name} className="flex items-center gap-3">
                          <span className="text-sm w-24 font-medium">{t.name}</span>
                          <div className="flex-1 bg-muted rounded-full h-3">
                            <div className="h-3 rounded-full flex items-center justify-end pr-1.5" style={{ width: `${t.value}%`, backgroundColor: t.color }}>
                              {t.value > 30 && <span className="text-[8px] text-white font-bold">{t.value}%</span>}
                            </div>
                          </div>
                          <span className="text-sm font-bold w-10 text-right" style={{ color: t.color }}>{t.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card border border-green-500/20 rounded-2xl p-5">
                      <h3 className="font-bold mb-3 text-green-400 text-sm flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />Punti di Forza</h3>
                      <div className="space-y-2">
                        {personalityResult.strengths.map(s => (
                          <div key={s} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />{s}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-card border border-amber-500/20 rounded-2xl p-5">
                      <h3 className="font-bold mb-3 text-amber-400 text-sm flex items-center gap-1"><TrendingUp className="w-4 h-4" />Aree di Crescita</h3>
                      <div className="space-y-2">
                        {personalityResult.areas.map(a => (
                          <div key={a} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />{a}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-violet-400" />Compatibilità</h3>
                    <div className="space-y-3">
                      <p className="text-[10px] text-green-400 font-semibold">Ottima sinergia con:</p>
                      {personalityResult.compatibility.best.map(b => (
                        <div key={b.type} className="flex items-center justify-between p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                          <span className="text-xs">{b.type}</span>
                          <span className="text-xs font-bold text-green-400">{b.pct}%</span>
                        </div>
                      ))}
                      <p className="text-[10px] text-amber-400 font-semibold mt-2">Sfida costruttiva:</p>
                      {personalityResult.compatibility.challenging.map(c => (
                        <div key={c.type} className="flex items-center justify-between p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                          <span className="text-xs">{c.type}</span>
                          <span className="text-xs font-bold text-amber-400">{c.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-semibold text-sm mb-3">Tipo Raro?</h3>
                    <p className="text-xs text-muted-foreground mb-2">Solo il 22% degli utenti ha il tuo profilo.</p>
                    <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-3 text-center">
                      <p className="text-3xl font-black text-violet-400">22%</p>
                      <p className="text-[10px] text-muted-foreground">della popolazione</p>
                    </div>
                  </div>

                  <button onClick={resetQuiz} className="w-full py-2.5 bg-card border border-border rounded-xl text-xs text-muted-foreground flex items-center justify-center gap-1 hover:text-foreground">
                    <RefreshCw className="w-3 h-3" />Rifai il Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-md mx-auto">
                <UserSearch className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Quiz Non Completato</h3>
                <p className="text-sm text-muted-foreground mb-6">Completa il quiz per scoprire il tuo profilo comportamentale AI.</p>
                <button onClick={() => setPage("quiz")} className="px-8 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-xl font-bold">Inizia il Quiz</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ INSIGHTS ═══ */}
        {page === "insights" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">AI Insights</h2>
            <p className="text-xs text-muted-foreground mb-6">{quizDone ? "Insight personalizzati basati sulla tua analisi" : "Completa il quiz per ricevere insight"}</p>

            {quizDone ? (
              <div className="space-y-4 max-w-2xl">
                <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-5 flex items-center gap-4">
                  <Sparkles className="w-8 h-8 text-violet-400 shrink-0" />
                  <div>
                    <h3 className="font-bold">Insight Personalizzati</h3>
                    <p className="text-xs text-muted-foreground">Basati sulla tua analisi comportamentale e {quizQuestions.length} risposte elaborate dall&apos;AI.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {insights.map((ins, i) => {
                    const Icon = ins.icon;
                    return (
                      <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:border-violet-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: ins.color + "15" }}>
                            <Icon className="w-4 h-4" style={{ color: ins.color }} />
                          </div>
                          <h4 className="font-bold text-sm">{ins.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{ins.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-md mx-auto">
                <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-6">Completa il quiz per ricevere insight personalizzati.</p>
                <button onClick={() => setPage("quiz")} className="px-8 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-xl font-bold">Inizia il Quiz</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ COMPARE ═══ */}
        {page === "compare" && (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1">Confronta Personalità</h2>
            <p className="text-xs text-muted-foreground mb-6">Come ti posizioni rispetto agli altri tipi</p>

            <div className="max-w-2xl">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {personalityTypes.map((p) => (
                  <div key={p.type} className={`flex items-center gap-4 px-5 py-4 border-b border-border/50 last:border-0 ${p.type === personalityResult.type ? "bg-violet-500/5" : "hover:bg-muted/30"} transition-colors`}>
                    <span className="w-8 text-center text-lg">{p.emoji}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${p.type === personalityResult.type ? "text-violet-400" : ""}`}>
                        {p.type}
                        {p.type === personalityResult.type && <span className="text-[10px] ml-2 bg-violet-500/20 text-violet-400 rounded-full px-2 py-0.5">Tu</span>}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-muted rounded-full h-2 max-w-[200px]">
                          <div className="h-2 rounded-full bg-violet-500/60" style={{ width: `${p.pct * 4}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{p.pct}% utenti</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
