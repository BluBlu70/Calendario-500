import React, { useState } from 'react';
import { getAstrologicalData, generateTimeline } from './engine/astrology';
import { Star, ShieldAlert, Sparkles, Moon, Sun, Info, BookOpen, AlertTriangle } from 'lucide-react';
import { signData, daysOfWeek } from './engine/signData';

function App() {
  const [day, setDay] = useState(12);
  const [month, setMonth] = useState(4);
  const [year, setYear] = useState(1950);

  // Calcolo dell'età e del giorno
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - year;

  // Calcolo giorno della settimana (month è 1-indexed)
  const birthDate = new Date(year, month - 1, day);
  const dayOfWeekIndex = birthDate.getDay();
  const dayInfo = daysOfWeek[dayOfWeekIndex];

  // Usa l'engine
  const astroData = getAstrologicalData(day, month);
  const timeline = generateTimeline(day, month, 100);

  const currentTimeline = timeline.find(t => t.age === currentAge);
  const nextTimeline = timeline.find(t => t.age === currentAge + 1);
  const futureDifficultYears = timeline.filter(t => t.age > currentAge && !t.isFavorevole).slice(0, 4);

  const capoStellaInfo = signData[astroData.capoStella];
  const etaStellaInfo = currentTimeline ? signData[currentTimeline.stella] : null;

  // Calcolo giorni massimi per il mese/anno selezionati
  const maxDaysInMonth = new Date(year, month, 0).getDate();

  // Handler sicuri per gli input
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setDay(Math.max(1, Math.min(maxDaysInMonth, val)));
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      const newMonth = Math.max(1, Math.min(12, val));
      setMonth(newMonth);
      // Aggiorna anche il giorno se il nuovo mese ha meno giorni (es. da 31 Gennaio a Febbraio -> diventa 28 Febbraio)
      const newMaxDays = new Date(year, newMonth, 0).getDate();
      if (day > newMaxDays) setDay(newMaxDays);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      const newYear = Math.max(1, Math.min(currentYear + 100, val));
      setYear(newYear);
      const newMaxDays = new Date(newYear, month, 0).getDate();
      if (day > newMaxDays) setDay(newMaxDays);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-8">
      {/* Header & Input */}
      <header className="glass-panel p-8 text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-500 via-yellow-200 to-gold-600"></div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight gold-text">
          Astrologia Antica del '500
        </h1>
        <p className="text-brand-100/70 max-w-2xl mx-auto">
          Sistema predittivo e operativo basato sui quadrati astrologici, Capo Stella e Stella dell'Età.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="flex flex-col text-left">
            <label className="text-xs uppercase tracking-wider text-brand-100/50 mb-1 font-semibold">Giorno</label>
            <input type="number" min={1} max={maxDaysInMonth} value={day} onChange={handleDayChange} className="bg-brand-800 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500 w-24 transition-colors" />
          </div>
          <div className="flex flex-col text-left">
            <label className="text-xs uppercase tracking-wider text-brand-100/50 mb-1 font-semibold">Mese</label>
            <input type="number" min={1} max={12} value={month} onChange={handleMonthChange} className="bg-brand-800 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500 w-24 transition-colors" />
          </div>
          <div className="flex flex-col text-left">
            <label className="text-xs uppercase tracking-wider text-brand-100/50 mb-1 font-semibold flex items-center gap-1">Anno Nascita
              <span className="group relative cursor-help">
                <Info size={12} className="text-gold-500 hover:text-white transition-colors" />
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-brand-900 border border-white/20 text-xs text-brand-100 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 leading-relaxed text-center">
                  Attenzione alle divergenze di metà anno: a seconda della tradizione (es. anno solare vs capodanno cinese a febbraio), la Stella dell'anno potrebbe variare.
                </span>
              </span>
            </label>
            <input type="number" min={1} max={currentYear + 100} value={year} onChange={handleYearChange} className="bg-brand-800 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-500 w-32 transition-colors" />
          </div>
        </div>

        <div className="flex justify-center gap-12 mt-6 pt-6 border-t border-white/5">
           <div><span className="text-brand-100/50 block text-xs uppercase">Età Corrente</span><span className="text-2xl font-light text-gold-500">{currentAge} anni</span></div>
           <div><span className="text-brand-100/50 block text-xs uppercase">N° Segni Sequenza</span><span className="text-2xl font-light text-gold-500">{astroData.numSegni}</span></div>
        </div>

        {/* Box Giorno di Nascita */}
        <div className="mt-8 p-5 bg-white/5 border border-white/10 rounded-2xl inline-block max-w-lg shadow-lg hover:bg-white/10 transition-colors">
           <h3 className="text-2xl font-light text-gold-500 mb-2">{dayInfo.name} <span className="text-lg text-brand-100/50">/ Giorno di {dayInfo.planet}</span></h3>
           <p className="text-sm text-brand-100/80 leading-relaxed">{dayInfo.meaning}</p>
        </div>
      </header>

      {/* Resoconto Dati */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard title="Capo Stella" value={astroData.capoStella} icon={<Star className="text-gold-500" />} desc="Reazione fissa" />
        <DataCard title="Stella Avversa" value={astroData.stellaAvversa} icon={<ShieldAlert className="text-red-400" />} desc="Punto di perdita (Rutilius 1)" />
        <DataCard title="Stella Anno Succ." value={nextTimeline?.stella || '-'} icon={<Moon className="text-blue-400" />} desc={nextTimeline?.isFavorevole ? 'Favorevole' : 'Contraria'} />
        <DataCard title="Stella dell'Età" value={currentTimeline?.stella || '-'} icon={<Sun className="text-yellow-400" />} desc={currentTimeline?.isFavorevole ? 'Favorevole' : 'Contraria'} />
      </section>

      {/* Riassunto Quadrante */}
      <section className="glass-panel p-8">
        <h2 className="text-2xl font-light mb-6 flex items-center gap-2"><Sparkles className="text-gold-500" /> Riassunto Quadrante Nascita</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-brand-100/50 uppercase">
                <th className="pb-3 font-medium">Ordine</th>
                <th className="pb-3 font-medium">Costellazione</th>
                <th className="pb-3 font-medium">Ruolo</th>
              </tr>
            </thead>
            <tbody>
              {astroData.sequence.map((sign, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 text-gold-500">{idx + 1}°</td>
                  <td className="py-3 font-semibold">{sign}</td>
                  <td className="py-3 text-brand-100/70">
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
        <div className="glass-panel p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/5 rounded-full"><Star className="text-gold-500" /></div>
            <div>
              <h2 className="text-2xl font-light">Capo Stella</h2>
              <span className="text-gold-500 font-semibold">{astroData.capoStella}</span>
            </div>
          </div>
          <p className="text-brand-100/80 mb-6 text-sm leading-relaxed">{capoStellaInfo.summary}</p>
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div>
              <span className="text-xs uppercase text-green-400 block mb-2 font-semibold">Tratti Favorevoli</span>
              <ul className="text-sm text-brand-100/70 space-y-1">
                {capoStellaInfo.favorableTraits.map((t, i) => <li key={i}>• {t}</li>)}
              </ul>
            </div>
            <div>
              <span className="text-xs uppercase text-red-400 block mb-2 font-semibold">Tratti Sfavorevoli</span>
              <ul className="text-sm text-brand-100/70 space-y-1">
                {capoStellaInfo.unfavorableTraits.map((t, i) => <li key={i}>• {t}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Stella dell'Età Info */}
        {etaStellaInfo && currentTimeline && (
          <div className="glass-panel p-8 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/5 rounded-full"><Sun className="text-yellow-400" /></div>
              <div>
                <h2 className="text-2xl font-light">Stella dell'Età ({currentAge} anni)</h2>
                <span className="text-gold-500 font-semibold">{currentTimeline.stella} - {currentTimeline.isFavorevole ? 'Favorevole' : 'Contraria'}</span>
              </div>
            </div>
            <p className="text-brand-100/80 mb-6 text-sm leading-relaxed">{etaStellaInfo.summary}</p>
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className={currentTimeline.isFavorevole ? 'opacity-100' : 'opacity-40'}>
                <span className="text-xs uppercase text-green-400 block mb-2 font-semibold">In fase Favorevole</span>
                <ul className="text-sm text-brand-100/70 space-y-1">
                  {etaStellaInfo.favorableTraits.map((t, i) => <li key={i}>• {t}</li>)}
                </ul>
              </div>
              <div className={!currentTimeline.isFavorevole ? 'opacity-100' : 'opacity-40'}>
                <span className="text-xs uppercase text-red-400 block mb-2 font-semibold">In fase Sfavorevole</span>
                <ul className="text-sm text-brand-100/70 space-y-1">
                  {etaStellaInfo.unfavorableTraits.map((t, i) => <li key={i}>• {t}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Previsioni Anni Futuri (Libro) */}
      <section className="glass-panel p-8 border-l-4 border-l-red-500/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 rounded-full mt-1">
            <BookOpen className="text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-light mb-2">Previsione degli Anni (Situazioni Difficili)</h2>
            <p className="text-brand-100/70 text-sm mb-6 max-w-3xl">
              Secondo gli studi sulle ciclicità astrologiche, gli anni con Stella Contraria richiedono maggiore attenzione, introspezione e prudenza. Le energie sfidanti mettono alla prova la resilienza e invitano a non forzare gli eventi.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {futureDifficultYears.length > 0 ? (
                futureDifficultYears.map((t) => (
                  <div key={t.age} className="bg-brand-900/50 border border-red-500/20 p-4 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-red-400 font-bold">{t.stella}</span>
                      <AlertTriangle size={16} className="text-red-400/50" />
                    </div>
                    <span className="text-xs text-brand-100/50 uppercase tracking-widest">{t.yearOfLife}° Anno (Età {t.age})</span>
                    <span className="text-sm text-brand-100/80 mt-1">
                      Potenziali ostacoli o prove legate a {signData[t.stella].unfavorableTraits.slice(0, 2).join(', ').toLowerCase()}.
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-green-400 text-sm">Nessun anno difficile previsto nel prossimo futuro.</p>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function DataCard({ title, value, icon, desc }: { title: string, value: string, icon: React.ReactNode, desc: string }) {
  return (
    <div className="glass-panel p-6 flex flex-col items-center justify-center text-center gap-2 hover:-translate-y-1 transition-transform cursor-default">
      <div className="p-3 bg-white/5 rounded-full mb-2">{icon}</div>
      <span className="text-xs uppercase tracking-widest text-brand-100/50 font-semibold">{title}</span>
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-gold-500">{desc}</span>
    </div>
  );
}

export default App;
