"use client";

import { useState } from "react";
import { InvitationRenderer } from "@/components/InvitationRenderer";
import { InvitationDraft } from "@/lib/invitation";

export function PublicInvite({ draft }: { draft: InvitationDraft }) {
  const [submitted, setSubmitted] = useState(false);

  function handleRsvp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return <InvitationRenderer draft={draft} publicMode rsvpSubmitted={submitted} onRsvp={handleRsvp} />;
}
