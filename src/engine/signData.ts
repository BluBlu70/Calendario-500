import type { Sign } from './astrology';

export interface SignInfo {
  summary: string;
  favorableTraits: string[];
  unfavorableTraits: string[];
}

export const signData: Record<Sign, SignInfo> = {
  'ARIETE': {
    summary: "Segno di fuoco, rappresenta l'inizio, l'azione e l'energia primordiale. Indica una forte spinta vitale, coraggio ma anche potenziale impulsività.",
    favorableTraits: ['Coraggio', 'Iniziativa', 'Energia', 'Passione'],
    unfavorableTraits: ['Impulsività', 'Aggressività', 'Impazienza']
  },
  'TAURO': {
    summary: "Segno di terra, radicato e stabile. Simboleggia la costruzione materiale, la resistenza e la ricerca del piacere sensoriale e della sicurezza.",
    favorableTraits: ['Stabilità', 'Lealtà', 'Pazienza', 'Sensualità'],
    unfavorableTraits: ['Ostinazione', 'Possessività', 'Lentezza']
  },
  'GEMELLI': {
    summary: "Segno d'aria, legato alla mente e alla comunicazione. Rappresenta la dualità, la curiosità intellettuale e la necessità di movimento e scambio continuo.",
    favorableTraits: ['Versatilità', 'Intelligenza', 'Comunicativa', 'Curiosità'],
    unfavorableTraits: ['Incostanza', 'Superficialità', 'Nervosismo']
  },
  'CANCRO': {
    summary: "Segno d'acqua, dominato dalle emozioni e dalla sensibilità. È il simbolo della famiglia, delle radici, dell'intuizione profonda e del mondo interiore.",
    favorableTraits: ['Empatia', 'Dolcezza', 'Immaginazione', 'Protezione'],
    unfavorableTraits: ['Permalosità', 'Mutevolezza', 'Attaccamento']
  },
  'LEONE': {
    summary: "Segno di fuoco, espressione del sé e del potere personale. Incarna la nobiltà d'animo, la generosità, la creatività e la forza di volontà sovrana.",
    favorableTraits: ['Carisma', 'Generosità', 'Lealtà', 'Forza'],
    unfavorableTraits: ['Egocentrismo', 'Arroganza', 'Autoritarismo']
  },
  'VIRGINIA': {
    summary: "Segno di terra, focalizzato sull'ordine e l'analisi. Rappresenta la logica, la precisione, il servizio verso gli altri e la ricerca della perfezione pratica.",
    favorableTraits: ['Razionalità', 'Precisione', 'Affidabilità', 'Cura'],
    unfavorableTraits: ['Critica eccessiva', 'Pignoleria', 'Ansietà']
  },
  'LIBRA': {
    summary: "Segno d'aria, alla ricerca costante di equilibrio e armonia. Simboleggia le relazioni, il senso estetico, la giustizia e la diplomazia.",
    favorableTraits: ['Diplomazia', 'Fascino', 'Equità', 'Sociabilità'],
    unfavorableTraits: ['Indecisione', 'Vanità', 'Dipendenza']
  },
  'SCORPIONE': {
    summary: "Segno d'acqua, profondo e trasformativo. Legato al mistero, al potere dell'inconscio, alla rigenerazione e all'intensità emotiva radicale.",
    favorableTraits: ['Intensità', 'Magnetismo', 'Intuizione', 'Resilienza'],
    unfavorableTraits: ['Gelosia', 'Estremismo', 'Riservatezza']
  },
  'SAGITTARIO': {
    summary: "Segno di fuoco, orientato verso l'espansione e l'esplorazione. Rappresenta la filosofia, il viaggio (fisico e mentale), l'ottimismo e la ricerca di significato.",
    favorableTraits: ['Ottimismo', 'Avventura', 'Sincerità', 'Indipendenza'],
    unfavorableTraits: ['Eccesso', 'Inquietudine', 'Mancanza di tatto']
  },
  'CAPRICORNO': {
    summary: "Segno di terra, simbolo di struttura e ambizione. È il culmine dello sforzo, della disciplina, del tempo, e della realizzazione concreta a lungo termine.",
    favorableTraits: ['Disciplina', 'Ambizione', 'Saggezza', 'Responsabilità'],
    unfavorableTraits: ['Pessimismo', 'Freddezza', 'Rigidità']
  },
  'ACQUARIO': {
    summary: "Segno d'aria, orientato al futuro e al collettivo. Simboleggia l'innovazione, l'anticonformismo, la libertà ideale e la fraternità universale.",
    favorableTraits: ['Originalità', 'Indipendenza', 'Umanitarismo', 'Visione'],
    unfavorableTraits: ['Distacco emotivo', 'Ribellione fine a se stessa', 'Imprevedibilità']
  },
  'PESCE': {
    summary: "Segno d'acqua, l'ultimo del ciclo. Rappresenta la fusione con il tutto, l'ipersensibilità, la spiritualità profonda, l'illusione e la compassione universale.",
    favorableTraits: ['Compassione', 'Spiritualità', 'Ispirazione', 'Sacrificio'],
    unfavorableTraits: ['Confusione', 'Vittimismo', 'Fuga dalla realtà']
  }
};

export const daysOfWeek: Record<number, { name: string, planet: string, meaning: string }> = {
  0: { name: 'Domenica', planet: 'Sole', meaning: "Vitalità, espressione di sé e centralità." },
  1: { name: 'Lunedì', planet: 'Luna', meaning: "Emozioni, intuito, mutevolezza interiore e memoria." },
  2: { name: 'Martedì', planet: 'Marte', meaning: "Azione, coraggio, forza assertiva e desiderio." },
  3: { name: 'Mercoledì', planet: 'Mercurio', meaning: "Comunicazione, intelletto, scambi e agilità mentale." },
  4: { name: 'Giovedì', planet: 'Giove', meaning: "Espansione, fortuna, crescita e filosofia." },
  5: { name: 'Venerdì', planet: 'Venere', meaning: "Amore, armonia, relazioni, bellezza e valori." },
  6: { name: 'Sabato', planet: 'Saturno', meaning: "Disciplina, struttura, limite, tempo e responsabilità." }
};
