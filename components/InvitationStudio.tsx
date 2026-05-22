"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  ChevronDown,
  Download,
  Eye,
  FileImage,
  Gift,
  ImagePlus,
  LayoutTemplate,
  Maximize2,
  Monitor,
  Music,
  Palette,
  QrCode,
  Save,
  Send,
  Smartphone,
  Sparkles,
  Trash2,
  Upload,
  Video
} from "lucide-react";
import { InvitationRenderer } from "@/components/InvitationRenderer";
import {
  EventTheme,
  InvitationDraft,
  InviteMode,
  MediaAsset,
  MediaPlacement,
  PreviewDevice,
  SectionKey,
  defaultDraft,
  eventTypeConfig,
  sectionLabels,
  themeConfigs
} from "@/lib/invitation";
import { loadDraft, saveDraft } from "@/lib/storage";

const modes: Array<{ value: InviteMode; label: string }> = [
  { value: "static", label: "Classico" },
  { value: "animated", label: "Animato" },
  { value: "story", label: "Story" },
  { value: "video", label: "Video" }
];

const placements: Array<{ value: MediaPlacement; label: string; help: string }> = [
  { value: "hero", label: "Copertina principale", help: "La prima immagine dell'invito" },
  { value: "background", label: "Sfondo invito", help: "Texture leggera dietro al layout" },
  { value: "gallery", label: "Galleria foto", help: "Foto extra nella sezione ricordi" },
  { value: "location", label: "Foto location", help: "Immagine del luogo evento" },
  { value: "story", label: "Story/video", help: "Media per formato verticale o video" },
  { value: "footer", label: "Chiusura", help: "Immagine finale decorativa" }
];

const graphics: Array<{ value: InvitationDraft["graphic"]; label: string }> = [
  { value: "floral", label: "Floreale" },
  { value: "minimal", label: "Minimal" },
  { value: "editorial", label: "Editoriale" },
  { value: "celebration", label: "Festa" },
  { value: "corporate", label: "Business" }
];

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function updateField<T extends keyof InvitationDraft>(
  draft: InvitationDraft,
  key: T,
  value: InvitationDraft[T]
): InvitationDraft {
  return { ...draft, [key]: value };
}

function getInviteUrl() {
  if (typeof window === "undefined") {
    return "https://tuosito.it/invite/demo";
  }

  return `${window.location.origin}/invite/demo`;
}

export function InvitationStudio() {
  const [draft, setDraft] = useState<InvitationDraft>(defaultDraft);
  const [screen, setScreen] = useState<"home" | "studio" | "client">("home");
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [shareUrl, setShareUrl] = useState("https://tuosito.it/invite/demo");
  const [isExporting, setIsExporting] = useState(false);
  const [notice, setNotice] = useState("Modifiche salvate");
  const [openPanel, setOpenPanel] = useState("evento");
  const previewShellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(loadDraft());
    setShareUrl(getInviteUrl());
  }, []);

  useEffect(() => {
    saveDraft(draft);
  }, [draft]);

  useEffect(() => {
    if (!shareUrl || shareUrl.includes("tuosito.it")) {
      setShareUrl(getInviteUrl());
    }
  }, [shareUrl]);

  const theme = themeConfigs[draft.theme];
  const rsvpCount = useMemo(() => draft.rsvps.filter((entry) => entry.attending === "yes").length, [draft.rsvps]);

  function setValue<T extends keyof InvitationDraft>(key: T, value: InvitationDraft[T]) {
    setDraft((current) => updateField(current, key, value));
  }

  function applyEventType(theme: EventTheme) {
    const preset = eventTypeConfig[theme];
    const presetStyle: Record<EventTheme, InvitationDraft["graphic"]> = {
      wedding: "floral",
      baptism: "minimal",
      graduation: "editorial",
      birthday: "celebration",
      anniversary: "floral",
      business: "corporate"
    };

    setDraft((current) => ({
      ...current,
      theme,
      title: preset.title,
      subtitle: preset.subtitle,
      hostNames: preset.title,
      finalMessage: preset.finalMessage,
      sections: preset.sections,
      program: preset.program,
      dressCode: preset.dressCode,
      hotel: preset.hotel,
      businessAgenda: preset.businessAgenda,
      graphic: presetStyle[theme]
    }));
    setNotice(`${preset.name} applicato`);
  }

  async function addMedia(files: FileList | null, placement: MediaPlacement) {
    if (!files?.length) {
      return;
    }

    const assets = await Promise.all(
      Array.from(files).map(async (file) => {
        const type = file.type.startsWith("video")
          ? "video"
          : file.type.startsWith("audio")
            ? "audio"
            : "image";

        return {
          id: crypto.randomUUID(),
          type,
          label: file.name.replace(/\.[^.]+$/, ""),
          src: await readFile(file),
          placement
        } satisfies MediaAsset;
      })
    );

    setDraft((current) => ({ ...current, media: [...current.media, ...assets] }));
    setNotice("Media aggiunti all'invito");
  }

  function addEmbed() {
    const url = window.prompt("Incolla il link YouTube, Spotify, SoundCloud o video");
    if (!url) {
      return;
    }

    setDraft((current) => ({
      ...current,
      media: [
        ...current.media,
        {
          id: crypto.randomUUID(),
          type: "embed",
          label: "Brano o video",
          src: normalizeEmbed(url),
          placement: "story"
        }
      ]
    }));
    setNotice("Link multimediale aggiunto");
  }

  function normalizeEmbed(url: string) {
    const youtube = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (youtube) {
      return `https://www.youtube.com/embed/${youtube[1]}`;
    }

    const spotify = url.match(/open\.spotify\.com\/(track|playlist|album)\/([A-Za-z0-9]+)/);
    if (spotify) {
      return `https://open.spotify.com/embed/${spotify[1]}/${spotify[2]}`;
    }

    if (url.includes("soundcloud.com")) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`;
    }

    return url;
  }

  function toggleSection(key: SectionKey) {
    setDraft((current) => ({
      ...current,
      sections: { ...current.sections, [key]: !current.sections[key] }
    }));
  }

  async function generateQr(url = shareUrl) {
    const dataUrl = await QRCode.toDataURL(url, {
      width: 520,
      margin: 2,
      color: { dark: theme.deep, light: "#ffffff" }
    });
    setQrDataUrl(dataUrl);
    setNotice("QR pronto per la condivisione");
    return dataUrl;
  }

  async function downloadQr() {
    const dataUrl = qrDataUrl || (await generateQr());
    download(dataUrl, "qr-invito.png");
  }

  async function exportPng() {
    setIsExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const node = document.getElementById("invitation-preview");
      if (!node) {
        return;
      }
      const canvas = await html2canvas(node, { scale: 2, backgroundColor: theme.paper, useCORS: true });
      download(canvas.toDataURL("image/png"), "invito-digitale.png");
      setNotice("Immagine esportata");
    } finally {
      setIsExporting(false);
    }
  }

  async function exportPdf() {
    setIsExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const node = document.getElementById("invitation-preview");
      if (!node) {
        return;
      }
      const canvas = await html2canvas(node, { scale: 2, backgroundColor: theme.paper, useCORS: true });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pages = Math.ceil(height / pageHeight);

      for (let page = 0; page < pages; page += 1) {
        if (page > 0) {
          pdf.addPage();
        }
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, -page * pageHeight, width, height);
      }

      pdf.save("invito-digitale.pdf");
      setNotice("PDF esportato");
    } finally {
      setIsExporting(false);
    }
  }

  function download(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }

  async function fullscreenPreview() {
    await previewShellRef.current?.requestFullscreen();
  }

  function handleRsvp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const entry = {
      id: crypto.randomUUID(),
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      attending: String(data.get("attending")) === "no" ? "no" : "yes",
      guests: Number(data.get("guests") ?? 1),
      note: String(data.get("note") ?? ""),
      createdAt: new Date().toISOString()
    } as const;

    setDraft((current) => ({ ...current, rsvps: [entry, ...current.rsvps] }));
    event.currentTarget.reset();
    setNotice("Conferma ricevuta");
  }

  if (screen === "home") {
    return (
      <main className="landing">
        <header className="landing-nav">
          <div className="brand-mark">
            <Sparkles size={18} />
            <div>
              <strong>Invitation Creator PRO</strong>
              <span>Inviti digitali eleganti, pronti da condividere</span>
            </div>
          </div>
          <button onClick={() => setScreen("studio")}>Area admin</button>
        </header>

        <section className="landing-hero">
          <div className="landing-copy">
            <span className="landing-kicker">Inviti premium per eventi speciali</span>
            <h1>Crea un invito digitale elegante in pochi minuti.</h1>
            <p>
              Scegli lo stile, aggiungi foto, programma, location, RSVP e QR code. Ottieni una pagina
              condivisibile e pronta per i tuoi invitati.
            </p>
            <div className="landing-actions">
              <button className="cta-main" onClick={() => setScreen("studio")}>
                Crea il tuo invito
              </button>
              <button className="cta-secondary" onClick={() => setScreen("client")}>
                Guarda demo
              </button>
            </div>
          </div>
          <div className="landing-preview">
            <InvitationRenderer draft={draft} device="mobile" publicMode />
          </div>
        </section>

        <section className="steps">
          {[
            ["1", "Scegli lo stile", "Tema, colori e formato dell'invito."],
            ["2", "Personalizza i dettagli", "Foto, programma, location, musica e RSVP."],
            ["3", "Condividi", "Scarica QR, esporta o invia il link dell'invito."]
          ].map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </section>
      </main>
    );
  }

  if (screen === "client") {
    return (
      <main className="client-preview-page">
        <div className="client-preview-actions">
          <button onClick={() => setScreen("home")}>Home</button>
          <button onClick={() => setScreen("studio")}>Personalizza</button>
        </div>
        <InvitationRenderer draft={draft} device={device} publicMode onRsvp={handleRsvp} />
      </main>
    );
  }

  return (
    <main className="studio">
      <header className="topbar">
        <div className="brand-mark">
          <Sparkles size={18} />
          <div>
            <strong>Invitation Creator PRO</strong>
            <span>Area admin</span>
          </div>
        </div>

        <div className="toolbar">
          <button onClick={() => setScreen("home")}>Home</button>
          <button onClick={() => setScreen("client")}>
            <Eye size={16} />
            Vedi invito
          </button>
          <button onClick={() => setDevice("mobile")} className={device === "mobile" ? "active" : ""}>
            <Smartphone size={16} />
          </button>
          <button onClick={() => setDevice("desktop")} className={device === "desktop" ? "active" : ""}>
            <Monitor size={16} />
          </button>
          <button onClick={fullscreenPreview}>
            <Maximize2 size={16} />
          </button>
        </div>
      </header>

      <div className="studio-grid">
        <aside className="control-panel">
          <Accordion id="evento" icon={<Sparkles size={17} />} title="Dettagli evento" openPanel={openPanel} setOpenPanel={setOpenPanel}>
            <label>
              Titolo invito
              <input value={draft.title} onChange={(event) => setValue("title", event.target.value)} />
            </label>
            <label>
              Testo introduttivo
              <textarea value={draft.subtitle} onChange={(event) => setValue("subtitle", event.target.value)} />
            </label>
            <div className="two-cols">
              <label>
                Data
                <input value={draft.eventDate} onChange={(event) => setValue("eventDate", event.target.value)} />
              </label>
              <label>
                Ora
                <input value={draft.eventTime} onChange={(event) => setValue("eventTime", event.target.value)} />
              </label>
            </div>
            <label>
              Citta
              <input value={draft.city} onChange={(event) => setValue("city", event.target.value)} />
            </label>
            <label>
              Location
              <input value={draft.venueName} onChange={(event) => setValue("venueName", event.target.value)} />
            </label>
            <label>
              Indirizzo
              <input value={draft.venueAddress} onChange={(event) => setValue("venueAddress", event.target.value)} />
            </label>
          </Accordion>

          <Accordion id="stile" icon={<Palette size={17} />} title="Stile invito" openPanel={openPanel} setOpenPanel={setOpenPanel}>
            <div className="segmented">
              {modes.map((mode) => (
                <button
                  key={mode.value}
                  className={draft.mode === mode.value ? "active" : ""}
                  onClick={() => setValue("mode", mode.value)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <div className="theme-grid">
              {(Object.keys(themeConfigs) as EventTheme[]).map((key) => (
                <button
                  key={key}
                  className={draft.theme === key ? "theme-chip active" : "theme-chip"}
                  onClick={() => applyEventType(key)}
                  style={{ "--chip": themeConfigs[key].accent } as React.CSSProperties}
                >
                  <span />
                  {themeConfigs[key].name}
                </button>
              ))}
            </div>
            <label>
              Grafica
              <select
                value={draft.graphic}
                onChange={(event) => setValue("graphic", event.target.value as InvitationDraft["graphic"])}
              >
                {graphics.map((graphic) => (
                  <option key={graphic.value} value={graphic.value}>
                    {graphic.label}
                  </option>
                ))}
              </select>
            </label>
          </Accordion>

          <Accordion id="sezioni" icon={<LayoutTemplate size={17} />} title="Sezioni dell'invito" openPanel={openPanel} setOpenPanel={setOpenPanel}>
            <div className="toggle-list">
              {(Object.keys(sectionLabels) as SectionKey[]).map((key) => (
                <button key={key} className={draft.sections[key] ? "on" : ""} onClick={() => toggleSection(key)}>
                  <span>{sectionLabels[key]}</span>
                  <i />
                </button>
              ))}
            </div>
          </Accordion>

          <Accordion id="media" icon={<ImagePlus size={17} />} title="Foto, video e musica" openPanel={openPanel} setOpenPanel={setOpenPanel}>
            <div className="upload-list">
              {placements.map((placement) => (
                <label className="upload-card" key={placement.value}>
                  <Upload size={17} />
                  <span>
                    <strong>{placement.label}</strong>
                    <small>{placement.help}</small>
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    multiple
                    onChange={(event) => addMedia(event.target.files, placement.value)}
                  />
                </label>
              ))}
            </div>
            <button className="ghost-button" onClick={addEmbed}>
              <Video size={16} />
              Aggiungi link video o musica
            </button>
            <div className="media-list">
              {draft.media.map((asset) => (
                <div key={asset.id} className="media-row">
                  <span>{asset.type === "audio" ? <Music size={14} /> : <ImagePlus size={14} />}</span>
                  <input
                    aria-label="Nome media"
                    value={asset.label}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        media: current.media.map((item) =>
                          item.id === asset.id ? { ...item, label: event.target.value } : item
                        )
                      }))
                    }
                  />
                  <select
                    aria-label="Posizione media"
                    value={asset.placement}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        media: current.media.map((item) =>
                          item.id === asset.id ? { ...item, placement: event.target.value as MediaPlacement } : item
                        )
                      }))
                    }
                  >
                    {placements.map((placement) => (
                      <option key={placement.value} value={placement.value}>
                        {placement.label}
                      </option>
                    ))}
                  </select>
                  <button
                    aria-label="Rimuovi media"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        media: current.media.filter((item) => item.id !== asset.id)
                      }))
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </Accordion>

          <Accordion id="extra" icon={<Gift size={17} />} title="Informazioni extra" openPanel={openPanel} setOpenPanel={setOpenPanel}>
            <label>
              IBAN
              <input value={draft.iban} onChange={(event) => setValue("iban", event.target.value)} />
            </label>
            <label>
              Lista nozze
              <textarea value={draft.giftList} onChange={(event) => setValue("giftList", event.target.value)} />
            </label>
            <label>
              Dress code
              <input value={draft.dressCode} onChange={(event) => setValue("dressCode", event.target.value)} />
            </label>
            <label>
              Hotel
              <textarea value={draft.hotel} onChange={(event) => setValue("hotel", event.target.value)} />
            </label>
            <label>
              Messaggio finale
              <textarea value={draft.finalMessage} onChange={(event) => setValue("finalMessage", event.target.value)} />
            </label>
          </Accordion>

          <Accordion id="condividi" icon={<QrCode size={17} />} title="Condivisione" openPanel={openPanel} setOpenPanel={setOpenPanel}>
            <label>
              Link invito
              <input value={shareUrl} onChange={(event) => setShareUrl(event.target.value)} />
            </label>
            <div className="share-actions">
              <button className="primary-button" onClick={() => generateQr()}>
                <QrCode size={16} />
                Genera QR
              </button>
              <button className="ghost-button" onClick={downloadQr}>
                <Download size={16} />
                Scarica QR
              </button>
            </div>
            {qrDataUrl ? <img className="qr-preview" src={qrDataUrl} alt="QR code invito" /> : null}
          </Accordion>
        </aside>

        <section className="workspace">
          <div className="workspace-head">
            <div>
              <span>{notice}</span>
              <strong>{rsvpCount > 0 ? `${rsvpCount} conferme ricevute` : "Invito pronto per la condivisione"}</strong>
            </div>
            <div className="export-actions">
              <button onClick={() => setNotice("Modifiche salvate")}>
                <Save size={16} />
                Salva
              </button>
              <button onClick={() => setScreen("client")}>
                <Eye size={16} />
                Vedi invito
              </button>
              <button onClick={downloadQr}>
                <QrCode size={16} />
                Scarica QR
              </button>
              <button onClick={exportPng} disabled={isExporting}>
                <FileImage size={16} />
                Esporta
              </button>
              <button onClick={exportPdf} disabled={isExporting}>
                <Download size={16} />
                PDF
              </button>
            </div>
          </div>

          <div className={`preview-shell ${device}`} ref={previewShellRef}>
            <InvitationRenderer draft={draft} device={device} onRsvp={handleRsvp} />
          </div>
        </section>
      </div>
    </main>
  );
}

function Accordion({
  id,
  title,
  icon,
  openPanel,
  setOpenPanel,
  children
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  openPanel: string;
  setOpenPanel: (id: string) => void;
  children: React.ReactNode;
}) {
  const isOpen = openPanel === id;

  return (
    <section className="panel-block">
      <button className="accordion-title" onClick={() => setOpenPanel(isOpen ? "" : id)} aria-expanded={isOpen}>
        <span>
          {icon}
          {title}
        </span>
        <ChevronDown size={16} />
      </button>
      {isOpen ? <div className="accordion-body">{children}</div> : null}
    </section>
  );
}
