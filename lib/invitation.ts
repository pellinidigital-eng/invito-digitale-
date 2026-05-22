export type InviteMode = "static" | "animated" | "story" | "video";

export type EventTheme =
  | "wedding"
  | "baptism"
  | "graduation"
  | "birthday"
  | "anniversary"
  | "business";

export type PreviewDevice = "mobile" | "desktop";

export type MediaPlacement =
  | "hero"
  | "background"
  | "gallery"
  | "location"
  | "story"
  | "footer";

export type SectionKey =
  | "program"
  | "location"
  | "rsvp"
  | "iban"
  | "dressCode"
  | "hotel"
  | "gallery"
  | "video"
  | "music"
  | "finalMessage"
  | "businessAgenda";

export type ProgramItem = {
  id: string;
  time: string;
  title: string;
  detail: string;
};

export type MediaAsset = {
  id: string;
  type: "image" | "video" | "audio" | "embed";
  label: string;
  src: string;
  placement: MediaPlacement;
};

export type RsvpEntry = {
  id: string;
  name: string;
  email: string;
  attending: "yes" | "no";
  guests: number;
  note: string;
  createdAt: string;
};

export type InvitationDraft = {
  title: string;
  subtitle: string;
  hostNames: string;
  eventDate: string;
  eventTime: string;
  city: string;
  venueName: string;
  venueAddress: string;
  finalMessage: string;
  theme: EventTheme;
  mode: InviteMode;
  graphic: "floral" | "minimal" | "editorial" | "celebration" | "corporate";
  sections: Record<SectionKey, boolean>;
  program: ProgramItem[];
  iban: string;
  giftList: string;
  dressCode: string;
  hotel: string;
  businessAgenda: string;
  media: MediaAsset[];
  rsvps: RsvpEntry[];
};

export type ThemeConfig = {
  name: string;
  accent: string;
  accent2: string;
  accentSoft: string;
  ink: string;
  paper: string;
  surface: string;
  deep: string;
  muted: string;
  fontClass: string;
  pattern: "rings" | "clouds" | "laurel" | "confetti" | "hearts" | "grid";
};

export type EventTypeConfig = {
  name: string;
  icon: string;
  layout: "ceremony" | "soft" | "achievement" | "party" | "romantic" | "agenda";
  heroLabel: string;
  title: string;
  subtitle: string;
  programTitle: string;
  locationLabel: string;
  giftTitle: string;
  giftLabel: string;
  rsvpTitle: string;
  rsvpText: string;
  rsvpButton: string;
  finalMessage: string;
  sections: Record<SectionKey, boolean>;
  program: ProgramItem[];
  dressCode: string;
  hotel: string;
  businessAgenda: string;
};

export type StyleConfig = {
  name: string;
  className: string;
  heroShape: "split" | "centered" | "editorial" | "poster" | "agenda";
  cardShape: "soft" | "sharp" | "pill" | "frame";
  decoration: string;
};

export const themeConfigs: Record<EventTheme, ThemeConfig> = {
  wedding: {
    name: "Matrimonio",
    accent: "#b88a4a",
    accent2: "#d8b978",
    accentSoft: "#f1e4d0",
    ink: "#24180f",
    paper: "#fbf8f3",
    surface: "#f2ebe0",
    deep: "#17110c",
    muted: "#76634d",
    fontClass: "font-serif",
    pattern: "rings"
  },
  baptism: {
    name: "Battesimo",
    accent: "#77a9c9",
    accent2: "#f0c7a8",
    accentSoft: "#e5f3f8",
    ink: "#143145",
    paper: "#f8fcff",
    surface: "#e8f5fb",
    deep: "#123045",
    muted: "#637f90",
    fontClass: "font-soft",
    pattern: "clouds"
  },
  graduation: {
    name: "Laurea",
    accent: "#a51f2f",
    accent2: "#2f6d45",
    accentSoft: "#f5dbd7",
    ink: "#25080d",
    paper: "#fff8f3",
    surface: "#f5e3d7",
    deep: "#170407",
    muted: "#755258",
    fontClass: "font-display",
    pattern: "laurel"
  },
  birthday: {
    name: "Compleanno",
    accent: "#e25d3b",
    accent2: "#ffba49",
    accentSoft: "#ffe6ce",
    ink: "#2b1209",
    paper: "#fff9ef",
    surface: "#ffe9d5",
    deep: "#291008",
    muted: "#8a5c42",
    fontClass: "font-rounded",
    pattern: "confetti"
  },
  anniversary: {
    name: "Anniversario",
    accent: "#b73f67",
    accent2: "#e5a0ac",
    accentSoft: "#f4d4df",
    ink: "#2a0715",
    paper: "#fff6f8",
    surface: "#f9e4eb",
    deep: "#1c050e",
    muted: "#8e5368",
    fontClass: "font-serif",
    pattern: "hearts"
  },
  business: {
    name: "Business",
    accent: "#2f6f73",
    accent2: "#94a3b8",
    accentSoft: "#d7e9e8",
    ink: "#0d2022",
    paper: "#f7faf9",
    surface: "#e8efed",
    deep: "#071719",
    muted: "#526b6d",
    fontClass: "font-sans",
    pattern: "grid"
  }
};

export const eventTypeConfig: Record<EventTheme, EventTypeConfig> = {
  wedding: {
    name: "Matrimonio",
    icon: "✦",
    layout: "ceremony",
    heroLabel: "Siete invitati al matrimonio di",
    title: "Sofia & Marco",
    subtitle: "Con gioia vi invitano a celebrare il loro giorno speciale.",
    programTitle: "Cerimonia e ricevimento",
    locationLabel: "La villa",
    giftTitle: "Lista nozze",
    giftLabel: "Un pensiero per il nostro futuro insieme",
    rsvpTitle: "Conferma la tua presenza",
    rsvpText: "Rispondi entro la data indicata e segnala eventuali esigenze alimentari.",
    rsvpButton: "Invia conferma",
    finalMessage: "La vostra presenza rendera questo giorno ancora piu prezioso.",
    sections: {
      program: true,
      location: true,
      rsvp: true,
      iban: true,
      dressCode: true,
      hotel: true,
      gallery: true,
      video: true,
      music: true,
      finalMessage: true,
      businessAgenda: false
    },
    program: [
      { id: "w1", time: "15:30", title: "Accoglienza ospiti", detail: "Giardino della villa" },
      { id: "w2", time: "16:00", title: "Cerimonia", detail: "Scambio delle promesse" },
      { id: "w3", time: "17:30", title: "Aperitivo", detail: "Brindisi in terrazza" },
      { id: "w4", time: "20:00", title: "Ricevimento", detail: "Cena e festa" }
    ],
    dressCode: "Elegante, toni naturali",
    hotel: "Hotel consigliato con navetta su prenotazione",
    businessAgenda: ""
  },
  baptism: {
    name: "Battesimo",
    icon: "✧",
    layout: "soft",
    heroLabel: "Celebriamo il battesimo di",
    title: "Aurora",
    subtitle: "Una giornata di luce, famiglia e piccoli sorrisi da condividere insieme.",
    programTitle: "La giornata",
    locationLabel: "Chiesa e festa",
    giftTitle: "Pensiero regalo",
    giftLabel: "Un ricordo dolce per Aurora",
    rsvpTitle: "Conferma la partecipazione",
    rsvpText: "Aiutaci a organizzare al meglio la festa in famiglia.",
    rsvpButton: "Conferma partecipazione",
    finalMessage: "Grazie per essere parte di questo momento di gioia.",
    sections: {
      program: true,
      location: true,
      rsvp: true,
      iban: false,
      dressCode: false,
      hotel: false,
      gallery: true,
      video: false,
      music: true,
      finalMessage: true,
      businessAgenda: false
    },
    program: [
      { id: "b1", time: "10:30", title: "Cerimonia in chiesa", detail: "Con genitori, padrino e madrina" },
      { id: "b2", time: "12:30", title: "Pranzo in famiglia", detail: "Tavola riservata" },
      { id: "b3", time: "15:30", title: "Torta e foto", detail: "Un ricordo con tutti" }
    ],
    dressCode: "Toni chiari e delicati",
    hotel: "",
    businessAgenda: ""
  },
  graduation: {
    name: "Laurea",
    icon: "❧",
    layout: "achievement",
    heroLabel: "Festeggiamo il traguardo di",
    title: "Dott.ssa Sofia",
    subtitle: "La corona d'alloro, un brindisi e una festa per celebrare un grande traguardo.",
    programTitle: "Brindisi e festa",
    locationLabel: "Dove festeggiamo",
    giftTitle: "Regalo laurea",
    giftLabel: "Un contributo per il prossimo capitolo",
    rsvpTitle: "Ci sarai al brindisi?",
    rsvpText: "Conferma la tua presenza alla festa di laurea.",
    rsvpButton: "Conferma brindisi",
    finalMessage: "Grazie per aver camminato con me fino a questo traguardo.",
    sections: {
      program: true,
      location: true,
      rsvp: true,
      iban: true,
      dressCode: false,
      hotel: false,
      gallery: true,
      video: true,
      music: true,
      finalMessage: true,
      businessAgenda: false
    },
    program: [
      { id: "g1", time: "17:00", title: "Proclamazione", detail: "Universita" },
      { id: "g2", time: "19:30", title: "Brindisi", detail: "Calici e corona d'alloro" },
      { id: "g3", time: "21:00", title: "Festa", detail: "Musica e buffet" }
    ],
    dressCode: "Un tocco di rosso",
    hotel: "",
    businessAgenda: ""
  },
  birthday: {
    name: "Compleanno",
    icon: "✺",
    layout: "party",
    heroLabel: "Sei invitato al compleanno di",
    title: "Sofia compie 30",
    subtitle: "Una festa piena di musica, brindisi e sorprese: porta solo voglia di divertirti.",
    programTitle: "Party plan",
    locationLabel: "Dove si festeggia",
    giftTitle: "Regalo",
    giftLabel: "Il regalo piu bello e festeggiare insieme",
    rsvpTitle: "Vieni alla festa?",
    rsvpText: "Conferma e indica se porti un accompagnatore.",
    rsvpButton: "Conferma presenza",
    finalMessage: "Preparati a spegnere le candeline con noi.",
    sections: {
      program: true,
      location: true,
      rsvp: true,
      iban: false,
      dressCode: true,
      hotel: false,
      gallery: true,
      video: true,
      music: true,
      finalMessage: true,
      businessAgenda: false
    },
    program: [
      { id: "c1", time: "20:30", title: "Aperitivo", detail: "Drink di benvenuto" },
      { id: "c2", time: "22:00", title: "Musica", detail: "DJ set" },
      { id: "c3", time: "23:30", title: "Torta", detail: "Candeline e brindisi" }
    ],
    dressCode: "Colorato, party mood",
    hotel: "",
    businessAgenda: ""
  },
  anniversary: {
    name: "Anniversario",
    icon: "♡",
    layout: "romantic",
    heroLabel: "Celebriamo l'anniversario di",
    title: "Sofia & Marco",
    subtitle: "Un altro capitolo della nostra storia, da brindare con le persone piu care.",
    programTitle: "Una serata insieme",
    locationLabel: "Il luogo del brindisi",
    giftTitle: "Un pensiero",
    giftLabel: "La vostra presenza e il dono piu bello",
    rsvpTitle: "Festeggerai con noi?",
    rsvpText: "Conferma la tua presenza alla cena.",
    rsvpButton: "Conferma cena",
    finalMessage: "Grazie per far parte della nostra storia.",
    sections: {
      program: true,
      location: true,
      rsvp: true,
      iban: false,
      dressCode: true,
      hotel: true,
      gallery: true,
      video: true,
      music: true,
      finalMessage: true,
      businessAgenda: false
    },
    program: [
      { id: "a1", time: "19:30", title: "Aperitivo", detail: "Primo brindisi" },
      { id: "a2", time: "20:30", title: "Cena", detail: "Tavola riservata" },
      { id: "a3", time: "22:30", title: "Torta", detail: "Ricordi e musica" }
    ],
    dressCode: "Elegante romantico",
    hotel: "Camere disponibili nelle vicinanze",
    businessAgenda: ""
  },
  business: {
    name: "Business",
    icon: "◆",
    layout: "agenda",
    heroLabel: "Invito ufficiale",
    title: "Future Retail Summit",
    subtitle: "Un evento esclusivo per incontrare speaker, partner e nuove opportunita.",
    programTitle: "Agenda",
    locationLabel: "Venue",
    giftTitle: "Registrazione",
    giftLabel: "Accesso nominale su conferma",
    rsvpTitle: "Registrati all'evento",
    rsvpText: "Conferma la partecipazione e indica eventuali note per l'organizzazione.",
    rsvpButton: "Invia registrazione",
    finalMessage: "Ti aspettiamo per costruire nuove connessioni.",
    sections: {
      program: true,
      location: true,
      rsvp: true,
      iban: false,
      dressCode: true,
      hotel: true,
      gallery: false,
      video: true,
      music: false,
      finalMessage: true,
      businessAgenda: true
    },
    program: [
      { id: "bu1", time: "09:30", title: "Welcome coffee", detail: "Accredito ospiti" },
      { id: "bu2", time: "10:15", title: "Keynote", detail: "Visione e scenari" },
      { id: "bu3", time: "11:30", title: "Panel speaker", detail: "Q&A con esperti" },
      { id: "bu4", time: "13:00", title: "Networking lunch", detail: "Incontri e partnership" }
    ],
    dressCode: "Business smart",
    hotel: "Hotel convenzionati disponibili su richiesta",
    businessAgenda: "Speaker, workshop, networking e registrazione ospiti"
  }
};

export const styleConfig: Record<InvitationDraft["graphic"], StyleConfig> = {
  floral: {
    name: "Floreale",
    className: "style-floral",
    heroShape: "split",
    cardShape: "soft",
    decoration: "cornici botaniche"
  },
  minimal: {
    name: "Minimal",
    className: "style-minimal",
    heroShape: "centered",
    cardShape: "pill",
    decoration: "linee essenziali"
  },
  editorial: {
    name: "Editoriale",
    className: "style-editorial",
    heroShape: "editorial",
    cardShape: "sharp",
    decoration: "titoli magazine"
  },
  celebration: {
    name: "Festa",
    className: "style-celebration",
    heroShape: "poster",
    cardShape: "soft",
    decoration: "pattern dinamici"
  },
  corporate: {
    name: "Business",
    className: "style-corporate",
    heroShape: "agenda",
    cardShape: "frame",
    decoration: "griglia professionale"
  }
};

export const defaultDraft: InvitationDraft = {
  title: "Sofia & Marco",
  subtitle: "Vi invitano a condividere un giorno speciale",
  hostNames: "Sofia & Marco",
  eventDate: "12 Luglio 2026",
  eventTime: "16:00",
  city: "Firenze",
  venueName: "Villa Medicea di Lilliano",
  venueAddress: "Via di Lilliano 8, Firenze",
  finalMessage: "La vostra presenza sara il regalo piu bello.",
  theme: "wedding",
  mode: "animated",
  graphic: "floral",
  sections: {
    program: true,
    location: true,
    rsvp: true,
    iban: true,
    dressCode: true,
    hotel: true,
    gallery: true,
    video: true,
    music: true,
    finalMessage: true,
    businessAgenda: false
  },
  program: [
    { id: "p1", time: "15:30", title: "Accoglienza", detail: "Giardino della villa" },
    { id: "p2", time: "16:00", title: "Cerimonia", detail: "Salone delle feste" },
    { id: "p3", time: "17:30", title: "Aperitivo", detail: "Terrazza panoramica" },
    { id: "p4", time: "20:00", title: "Cena", detail: "Limonaia" }
  ],
  iban: "IT00 A000 0000 0000 0000 0000 000",
  giftList: "Lista nozze disponibile su richiesta",
  dressCode: "Elegante, colori naturali",
  hotel: "Hotel consigliato: Firenze Hills Resort, navetta su prenotazione",
  businessAgenda: "Welcome coffee, keynote, workshop, networking cocktail",
  media: [
    {
      id: "m1",
      type: "image",
      label: "Hero",
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80",
      placement: "hero"
    },
    {
      id: "m2",
      type: "image",
      label: "Location",
      src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
      placement: "location"
    }
  ],
  rsvps: []
};

export const sectionLabels: Record<SectionKey, string> = {
  program: "Programma",
  location: "Location",
  rsvp: "RSVP",
  iban: "IBAN / lista nozze",
  dressCode: "Dress code",
  hotel: "Hotel",
  gallery: "Galleria",
  video: "Video",
  music: "Musica",
  finalMessage: "Messaggio finale",
  businessAgenda: "Agenda business"
};
