import React, { useEffect, useState } from 'react';
import { getAstrologicalData, generateTimeline } from './engine/astrology';
import type { AgePrediction } from './engine/astrology';
import { calculateAge } from './engine/age';
import { Star, ShieldAlert, Sparkles, Moon, Sun, Info, BookOpen, AlertTriangle, AlertCircle } from 'lucide-react';
import { signData, daysOfWeek } from './engine/signData';

type Theme = 'light' | 'dark';

// Colore della barra della finestra (quando l'app è installata) per ciascun tema
const THEME_BAR_COLOR: Record<Theme, string> = { dark: '#0B0B13', light: '#F7F3EA' };

function App() {
  // Tema chiaro/scuro: il valore iniziale viene deciso dallo script in index.html
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_BAR_COLOR[theme]);
    try {
      localStorage.setItem('tema', theme); // ricorda la scelta alla prossima apertura
    } catch {
      // se il browser non permette di salvare, il tema funziona lo stesso
    }
  }, [theme]);

  // Data confermata per i calcoli astrologici
  const [day, setDay] = useState(12);
  const [month, setMonth] = useState(4);
  const [year, setYear] = useState(1950);

  // Campi di input testuali per digitazione libera
  const [inputDay, setInputDay] = useState('12');
  const [inputMonth, setInputMonth] = useState('4');
  const [inputYear, setInputYear] = useState('1950');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calcolo dell'età (tiene conto di giorno e mese, non solo dell'anno)
  const currentAge = calculateAge(day, month, year);

  // Calcolo giorno della settimana (month è 1-indexed)
  const birthDate = new Date(year, month - 1, day);
  const dayOfWeekIndex = birthDate.getDay();
  const dayInfo = daysOfWeek[dayOfWeekIndex];

  // Usa l'engine
  const astroData = getAstrologicalData(day, month);
  const timeline = generateTimeline(day, month, 100);

  const currentTimeline = timeline.find(t => t.age === currentAge);
  const nextTimeline = timeline.find(t => t.age === currentAge + 1);
  const futureFavorableYears = timeline.filter(t => t.age > currentAge && t.isFavorevole).slice(0, 4);
  const futureContraryYears = timeline.filter(t => t.age > currentAge && !t.isFavorevole).slice(0, 4);

  const capoStellaInfo = signData[astroData.capoStella];
  const etaStellaInfo = currentTimeline ? signData[currentTimeline.stella] : null;

  // Validazione ed esecuzione calcolo
  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const d = parseInt(inputDay.trim(), 10);
    const m = parseInt(inputMonth.trim(), 10);
    const y = parseInt(inputYear.trim(), 10);

    if (isNaN(d) || isNaN(m) || isNaN(y)) {
      setErrorMessage("Inserisci valori numerici validi per giorno, mese e anno.");
      return;
    }

    if (y < 1) {
      setErrorMessage("Inserisci un anno valido.");
      return;
    }

    if (m < 1 || m > 12) {
      setErrorMessage("Il mese deve essere compreso tra 1 e 12.");
      return;
    }

    // Calcolo giorni massimi per quel mese e anno
    const maxDays = new Date(y, m, 0).getDate();
    if (d < 1 || d > maxDays) {
      setErrorMessage(`Per il mese ${m}/${y} il giorno deve essere compreso tra 1 e ${maxDays}.`);
      return;
    }

    if (calculateAge(d, m, y) < 0) {
      setErrorMessage("La data di nascita non può essere nel futuro.");
      return;
    }

    // Dati validi: aggiorna lo stato dei calcoli
    setErrorMessage(null);
    setDay(d);
    setMonth(m);
    setYear(y);
  };

  const inputClass =
    "bg-field border border-edge rounded-lg px-4 py-2 text-lg text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 text-center font-medium transition-colors";

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-12 max-w-7xl mx-auto space-y-8">
      {/* Header & Input */}
      <header className="glass-panel p-6 sm:p-8 text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-button via-accent-2 to-button"></div>

        {/* Pulsante cambio tema */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-2 text-sm font-medium text-ink-soft border border-edge rounded-full px-4 py-2 hover:bg-panel-hover hover:text-ink transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={16} className="text-sun" /> : <Moon size={16} className="text-info" />}
            <span>{theme === 'dark' ? 'Tema chiaro' : 'Tema scuro'}</span>
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight gold-text pb-1">
          Astrologia Antica del '500
        </h1>
        <p className="text-lg text-ink-soft max-w-2xl mx-auto">
          Sistema predittivo e operativo basato sui quadrati astrologici, Capo Stella e Stella dell'Età.
        </p>

        <form onSubmit={handleCalculate} className="space-y-4 mt-8">
          <div className="flex flex-wrap justify-center items-end gap-4">
            <div className="flex flex-col text-left">
              <label htmlFor="giorno" className="text-sm uppercase tracking-wider text-muted mb-1 font-semibold">Giorno</label>
              <input
                id="giorno"
                type="text"
                inputMode="numeric"
                placeholder="GG"
                maxLength={2}
                value={inputDay}
                onChange={(e) => {
                  setInputDay(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className={`${inputClass} w-24`}
              />
            </div>
            <div className="flex flex-col text-left">
              <label htmlFor="mese" className="text-sm uppercase tracking-wider text-muted mb-1 font-semibold">Mese</label>
              <input
                id="mese"
                type="text"
                inputMode="numeric"
                placeholder="MM"
                maxLength={2}
                value={inputMonth}
                onChange={(e) => {
                  setInputMonth(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className={`${inputClass} w-24`}
              />
            </div>
            <div className="flex flex-col text-left">
              <label htmlFor="anno" className="text-sm uppercase tracking-wider text-muted mb-1 font-semibold flex items-center gap-1">
                Anno Nascita
                <span tabIndex={0} className="group relative cursor-help outline-none">
                  <Info size={14} className="text-accent" />
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 p-3 bg-field border border-edge text-sm normal-case tracking-normal font-normal text-ink rounded shadow-xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity z-50 leading-relaxed text-center">
                    Attenzione alle divergenze di metà anno: a seconda della tradizione (es. anno solare vs capodanno cinese a febbraio), la Stella dell'anno potrebbe variare.
                  </span>
                </span>
              </label>
              <input
                id="anno"
                type="text"
                inputMode="numeric"
                placeholder="AAAA"
                maxLength={4}
                value={inputYear}
                onChange={(e) => {
                  setInputYear(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className={`${inputClass} w-32`}
              />
            </div>
            <button
              type="submit"
              className="bg-linear-to-r from-button to-button-2 hover:brightness-105 text-on-button text-lg font-bold px-6 py-2 rounded-lg shadow-lg transition-all flex items-center gap-2 cursor-pointer h-[46px]"
            >
              <Sparkles size={18} />
              <span>Calcola</span>
            </button>
          </div>

          {errorMessage && (
            <div role="alert" className="flex items-center justify-center gap-2 text-danger text-base bg-danger/10 border border-danger/30 py-2.5 px-4 rounded-lg max-w-md mx-auto">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </form>

        <div className="flex justify-center gap-12 mt-6 pt-6 border-t border-edge">
           <div><span className="text-muted block text-sm uppercase">Età Corrente</span><span className="text-3xl font-normal text-accent">{currentAge} anni</span></div>
           <div><span className="text-muted block text-sm uppercase">N° Segni Sequenza</span><span className="text-3xl font-normal text-accent">{astroData.numSegni}</span></div>
        </div>

        {/* Box Giorno di Nascita */}
        <div className="mt-8 p-5 bg-panel border border-edge rounded-2xl inline-block max-w-lg shadow-lg hover:bg-panel-hover transition-colors">
           <h3 className="text-2xl font-normal text-accent mb-2">{dayInfo.name} <span className="text-lg text-muted">/ Giorno di {dayInfo.planet}</span></h3>
           <p className="text-base text-ink-soft leading-relaxed">{dayInfo.meaning}</p>
        </div>
      </header>

      {/* Resoconto Dati */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard title="Capo Stella" value={astroData.capoStella} icon={<Star className="text-accent" />} desc="Reazione fissa" />
        <DataCard title="Stella Avversa" value={astroData.stellaAvversa} icon={<ShieldAlert className="text-danger" />} desc="Punto di perdita (Rutilius 1)" />
        <DataCard title="Stella dell'Età" value={currentTimeline?.stella || '-'} icon={<Sun className="text-sun" />} desc={currentTimeline?.isFavorevole ? 'Favorevole' : 'Contraria'} />
        <DataCard title="Stella Anno Succ." value={nextTimeline?.stella || '-'} icon={<Moon className="text-info" />} desc={nextTimeline?.isFavorevole ? 'Favorevole' : 'Contraria'} />
      </section>

      {/* Riassunto Quadrante */}
      <section className="glass-panel p-6 sm:p-8">
        <h2 className="text-2xl font-normal mb-6 flex items-center gap-2"><Sparkles className="text-accent" /> Riassunto Quadrante Nascita</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead>
              <tr className="border-b border-edge text-muted text-sm uppercase">
                <th className="pb-3 font-semibold">Ordine</th>
                <th className="pb-3 font-semibold">Costellazione</th>
                <th className="pb-3 font-semibold">Ruolo</th>
              </tr>
            </thead>
            <tbody>
              {astroData.sequence.map((sign, idx) => (
                <tr key={idx} className="border-b border-edge hover:bg-panel-hover transition-colors">
                  <td className="py-3 text-accent font-semibold">{idx + 1}°</td>
                  <td className="py-3 font-semibold">{sign}</td>
                  <td className="py-3 text-ink-soft">
                    {idx === 0 ? 'Capo Stella' : idx === 1 ? 'Stella Avversa / Rutilius 1' : idx === 2 ? 'Posizione 3' : 'Fase evolutiva'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Dettaglio Segni (Capo Stella e Stella Età) */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Capo Stella Info */}
        <div className="glass-panel p-6 sm:p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-panel rounded-full"><Star className="text-accent" /></div>
            <div>
              <h2 className="text-2xl font-normal">Capo Stella</h2>
              <span className="text-accent font-semibold text-lg">{astroData.capoStella}</span>
            </div>
          </div>
          <p className="text-ink-soft mb-6 text-base leading-relaxed">{capoStellaInfo.summary}</p>
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <TraitList title="Tratti Favorevoli" tone="success" items={capoStellaInfo.favorableTraits} />
            <TraitList title="Tratti Sfavorevoli" tone="danger" items={capoStellaInfo.unfavorableTraits} />
          </div>
        </div>

        {/* Stella dell'Età Info */}
        {etaStellaInfo && currentTimeline && (
          <div className="glass-panel p-6 sm:p-8 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-panel rounded-full"><Sun className="text-sun" /></div>
              <div>
                <h2 className="text-2xl font-normal">Stella dell'Età ({currentAge} anni)</h2>
                <span className="text-accent font-semibold text-lg">{currentTimeline.stella} - {currentTimeline.isFavorevole ? 'Favorevole' : 'Contraria'}</span>
              </div>
            </div>
            <p className="text-ink-soft mb-6 text-base leading-relaxed">{etaStellaInfo.summary}</p>
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <TraitList title="In fase Favorevole" tone="success" items={etaStellaInfo.favorableTraits} active={currentTimeline.isFavorevole} />
              <TraitList title="In fase Sfavorevole" tone="danger" items={etaStellaInfo.unfavorableTraits} active={!currentTimeline.isFavorevole} />
            </div>
          </div>
        )}
      </section>

      {/* Previsione degli anni: prima i favorevoli, poi i contrari */}
      <YearForecast
        tone="success"
        title="Previsione degli Anni Favorevoli"
        text="Gli anni con Stella Favorevole sostengono le iniziative: è il momento di agire, avviare progetti e cogliere le occasioni che la stella dell'età porta con sé."
        years={futureFavorableYears}
        birth={{ day, month, year }}
        emptyText="Nessun anno favorevole nel prossimo futuro."
      />
      <YearForecast
        tone="danger"
        title="Previsione degli Anni Contrari"
        text="Secondo gli studi sulle ciclicità astrologiche, gli anni con Stella Contraria richiedono maggiore attenzione, introspezione e prudenza. Le energie sfidanti mettono alla prova la resilienza e invitano a non forzare gli eventi."
        years={futureContraryYears}
        birth={{ day, month, year }}
        emptyText="Nessun anno contrario nel prossimo futuro."
      />

    </div>
  );
}

function DataCard({ title, value, icon, desc }: { title: string, value: string, icon: React.ReactNode, desc: string }) {
  return (
    <div className="glass-panel p-6 flex flex-col items-center justify-center text-center gap-2 hover:-translate-y-1 transition-transform cursor-default">
      <div className="p-3 bg-panel rounded-full mb-2">{icon}</div>
      <span className="text-sm uppercase tracking-widest text-muted font-semibold">{title}</span>
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-base text-accent font-medium">{desc}</span>
    </div>
  );
}

// Elenco tratti. Se "active" è indicato, il riquadro della fase attuale viene evidenziato
// (invece di rendere sbiadita l'altra colonna, che diventava difficile da leggere).
function TraitList({ title, tone, items, active }: { title: string, tone: 'success' | 'danger', items: string[], active?: boolean }) {
  const titleColor = tone === 'success' ? 'text-success' : 'text-danger';
  const highlight = active
    ? tone === 'success' ? 'border-success/50 bg-success/10' : 'border-danger/50 bg-danger/10'
    : 'border-transparent';

  return (
    <div className={`rounded-xl border p-3 ${highlight}`}>
      <span className={`text-sm uppercase ${titleColor} flex flex-wrap items-center gap-2 mb-2 font-bold`}>
        {title}
        {active && <span className="normal-case font-semibold text-xs rounded-full px-2 py-0.5 border border-current">attuale</span>}
      </span>
      <ul className="text-base text-ink-soft space-y-1">
        {items.map((t, i) => <li key={i}>• {t}</li>)}
      </ul>
    </div>
  );
}

// Riquadro con i prossimi 4 anni favorevoli o contrari
function YearForecast({ tone, title, text, years, birth, emptyText }: {
  tone: 'success' | 'danger',
  title: string,
  text: string,
  years: AgePrediction[],
  birth: { day: number, month: number, year: number },
  emptyText: string,
}) {
  const isGood = tone === 'success';
  const color = isGood ? 'text-success' : 'text-danger';
  const Icon = isGood ? Sparkles : AlertTriangle;

  return (
    <section className={`glass-panel p-6 sm:p-8 border-l-4 ${isGood ? 'border-l-success/60' : 'border-l-danger/60'}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full mt-1 hidden sm:block ${isGood ? 'bg-success/10' : 'bg-danger/10'}`}>
          {isGood ? <Sparkles className={color} /> : <BookOpen className={color} />}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-normal mb-2">{title}</h2>
          <p className="text-ink-soft text-base mb-6 max-w-3xl leading-relaxed">{text}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {years.length > 0 ? (
              years.map((t) => (
                <div key={t.age} className={`bg-panel border p-4 rounded-xl flex flex-col gap-2 ${isGood ? 'border-success/30' : 'border-danger/30'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`${color} font-bold text-lg`}>{t.stella}</span>
                    <Icon size={18} className={color} />
                  </div>
                  <span className="text-sm text-muted uppercase tracking-wider font-semibold">{t.yearOfLife}° Anno (Età {t.age})</span>
                  <span className="text-sm text-muted">dal {birth.day}/{birth.month}/{birth.year + t.age}</span>
                  <span className="text-base text-ink-soft mt-1">
                    {isGood
                      ? `Occasioni favorevoli legate a ${signData[t.stella].favorableTraits.slice(0, 2).join(', ').toLowerCase()}.`
                      : `Potenziali ostacoli o prove legate a ${signData[t.stella].unfavorableTraits.slice(0, 2).join(', ').toLowerCase()}.`}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-ink-soft text-base">{emptyText}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
