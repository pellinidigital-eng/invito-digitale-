"use client";

/* eslint-disable @next/next/no-img-element */

import { MapPin, Music, Play, QrCode, Send } from "lucide-react";
import {
  InvitationDraft,
  MediaAsset,
  PreviewDevice,
  ThemeConfig,
  eventTypeConfig,
  styleConfig,
  themeConfigs
} from "@/lib/invitation";

type Props = {
  draft: InvitationDraft;
  device?: PreviewDevice;
  publicMode?: boolean;
  rsvpSubmitted?: boolean;
  onRsvp?: (event: React.FormEvent<HTMLFormElement>) => void;
};

function mediaFor(draft: InvitationDraft, placement: MediaAsset["placement"]) {
  return draft.media.filter((asset) => asset.placement === placement);
}

function cssVars(theme: ThemeConfig) {
  return {
    "--paper": theme.paper,
    "--surface": theme.surface,
    "--accent": theme.accent,
    "--accent-2": theme.accent2,
    "--accent-soft": theme.accentSoft,
    "--ink": theme.ink,
    "--deep": theme.deep,
    "--muted": theme.muted
  } as React.CSSProperties;
}

export function InvitationRenderer({ draft, device = "desktop", publicMode = false, rsvpSubmitted = false, onRsvp }: Props) {
  const theme = themeConfigs[draft.theme];
  const eventConfig = eventTypeConfig[draft.theme];
  const visualStyle = styleConfig[draft.graphic];
  const hero = mediaFor(draft, "hero")[0];
  const background = mediaFor(draft, "background")[0];
  const locationImage = mediaFor(draft, "location")[0];
  const gallery = mediaFor(draft, "gallery");
  const story = mediaFor(draft, "story");
  const video = draft.media.find((asset) => asset.type === "video" || asset.placement === "story");
  const music = draft.media.find((asset) => asset.type === "audio" || asset.type === "embed");
  const title = draft.title || eventConfig.title;
  const subtitle = draft.subtitle || eventConfig.subtitle;
  const finalMessage = draft.finalMessage || eventConfig.finalMessage;
  const hasExtras =
    draft.sections.iban || draft.sections.dressCode || draft.sections.hotel || draft.sections.businessAgenda;

  const sectionOrder: Array<"program" | "location" | "gallery" | "video" | "music" | "extras" | "rsvp" | "final"> =
    eventConfig.layout === "agenda"
      ? ["program", "video", "location", "extras", "rsvp", "final"]
      : eventConfig.layout === "party"
        ? ["gallery", "program", "music", "video", "location", "extras", "rsvp", "final"]
        : eventConfig.layout === "soft"
          ? ["location", "program", "gallery", "music", "rsvp", "final"]
          : eventConfig.layout === "achievement"
            ? ["program", "gallery", "video", "location", "extras", "rsvp", "final"]
            : ["program", "location", "gallery", "video", "music", "extras", "rsvp", "final"];

  function renderSection(key: (typeof sectionOrder)[number]) {
    if (key === "program" && draft.sections.program) {
      return (
        <section className="invite-section program-section" key={key}>
          <div className="section-heading">
            <span>{eventConfig.icon}</span>
            <h2>{eventConfig.programTitle}</h2>
          </div>
          <div className="program-list">
            {draft.program.map((item) => (
              <div className="program-row" key={item.id}>
                <time>{item.time}</time>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (key === "location" && draft.sections.location) {
      return (
        <section className="invite-section location-section" key={key}>
          <div className="location-media">
            {locationImage ? <img src={locationImage.src} alt={draft.venueName} /> : <MapPin />}
          </div>
          <div className="location-copy">
            <span className="eyebrow">{eventConfig.locationLabel}</span>
            <h2>{draft.venueName}</h2>
            <p>{draft.venueAddress}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(draft.venueAddress)}`}
              target="_blank"
              rel="noreferrer"
            >
              Apri mappa
            </a>
          </div>
        </section>
      );
    }

    if (key === "gallery" && draft.sections.gallery && gallery.length) {
      return (
        <section className="invite-section gallery-section" key={key}>
          <div className="section-heading">
            <span>+</span>
            <h2>{draft.theme === "business" ? "Momenti" : "Galleria"}</h2>
          </div>
          <div className="gallery-grid">
            {gallery.map((asset) => (
              <img key={asset.id} src={asset.src} alt={asset.label} />
            ))}
          </div>
        </section>
      );
    }

    if (key === "video" && draft.sections.video && video) {
      return (
        <section className="invite-section media-feature" key={key}>
          <div className="section-heading">
            <span>
              <Play size={15} />
            </span>
            <h2>{draft.mode === "video" ? "Video invito" : "Video"}</h2>
          </div>
          {video.type === "video" ? (
            <video src={video.src} controls playsInline />
          ) : video.type === "embed" ? (
            <iframe src={video.src} title={video.label} allow="autoplay; encrypted-media; picture-in-picture" />
          ) : null}
        </section>
      );
    }

    if (key === "music" && draft.sections.music && music) {
      return (
        <section className="music-player" key={key}>
          <Music size={18} />
          <div>
            <strong>{music.label}</strong>
            {music.type === "audio" ? <audio src={music.src} controls /> : <iframe src={music.src} title={music.label} />}
          </div>
        </section>
      );
    }

    if (key === "extras" && hasExtras) {
      return (
        <section className="extras-grid" key={key}>
          {draft.sections.iban ? (
            <div>
              <span className="eyebrow">{eventConfig.giftLabel}</span>
              <h3>{eventConfig.giftTitle}</h3>
              <p>{draft.iban}</p>
              <small>{draft.giftList}</small>
            </div>
          ) : null}
          {draft.sections.dressCode ? (
            <div>
              <span className="eyebrow">Mood</span>
              <h3>Dress code</h3>
              <p>{draft.dressCode || eventConfig.dressCode}</p>
            </div>
          ) : null}
          {draft.sections.hotel ? (
            <div>
              <span className="eyebrow">Ospitalita</span>
              <h3>Hotel</h3>
              <p>{draft.hotel || eventConfig.hotel}</p>
            </div>
          ) : null}
          {draft.sections.businessAgenda ? (
            <div>
              <span className="eyebrow">Focus</span>
              <h3>Speaker e agenda</h3>
              <p>{draft.businessAgenda || eventConfig.businessAgenda}</p>
            </div>
          ) : null}
        </section>
      );
    }

    if (key === "rsvp" && draft.sections.rsvp) {
      return (
        <section className="rsvp-box" key={key}>
          <div>
            <span className="eyebrow">RSVP</span>
            <h2>{eventConfig.rsvpTitle}</h2>
            <p>{eventConfig.rsvpText}</p>
          </div>
          {rsvpSubmitted ? (
            <div className="rsvp-success">
              <strong>Grazie, risposta ricevuta.</strong>
              <span>Gli organizzatori riceveranno la tua conferma.</span>
            </div>
          ) : (
            <form onSubmit={onRsvp}>
              <input name="name" required placeholder="Nome e cognome" />
              <input name="email" type="email" placeholder="Email" />
              <div className="form-row">
                <select name="attending" defaultValue="yes">
                  <option value="yes">Partecipo</option>
                  <option value="no">Non posso</option>
                </select>
                <input name="guests" type="number" min="1" max="20" defaultValue="1" />
              </div>
              <textarea name="note" placeholder="Allergie o messaggio" />
              <button type="submit">
                <Send size={16} />
                {eventConfig.rsvpButton}
              </button>
            </form>
          )}
        </section>
      );
    }

    if (key === "final" && draft.sections.finalMessage) {
      return (
        <footer className="invite-footer" key={key}>
          <QrCode size={20} />
          <p>{finalMessage}</p>
          <strong>{draft.hostNames || title}</strong>
          {publicMode ? <span>Ti aspettiamo</span> : null}
        </footer>
      );
    }

    return null;
  }

  return (
    <article
      id="invitation-preview"
      className={`invite invite-${device} invite-event-${draft.theme} invite-layout-${eventConfig.layout} invite-mode-${draft.mode} ${visualStyle.className} invite-hero-${visualStyle.heroShape} invite-card-${visualStyle.cardShape} ${theme.fontClass}`}
      style={cssVars(theme)}
    >
      <div className="invite-pattern" aria-hidden="true">{eventConfig.icon}</div>
      {background ? <img className="invite-bg" src={background.src} alt="" aria-hidden="true" /> : null}

      <section className="invite-hero">
        <div className="invite-hero-copy">
          <span className="invite-kicker">{eventConfig.heroLabel}</span>
          <i className="event-mark" aria-hidden="true">{eventConfig.icon}</i>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <div className="invite-meta">
            <span>{draft.eventDate}</span>
            <span>{draft.eventTime}</span>
            <span>{draft.city}</span>
          </div>
        </div>
        <div className="invite-hero-media">
          {hero ? <img src={hero.src} alt={hero.label} /> : <div className="media-empty">Aggiungi una foto</div>}
        </div>
      </section>

      {draft.mode === "story" ? (
        <section className="story-strip" aria-label="Story">
          {[hero, ...story].filter((asset): asset is MediaAsset => Boolean(asset)).map((asset) => (
            <div className="story-frame" key={asset.id}>
              <img src={asset.src} alt={asset.label} />
            </div>
          ))}
        </section>
      ) : null}

      {sectionOrder.map(renderSection)}
    </article>
  );
}
