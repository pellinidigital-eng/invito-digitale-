import { PublicInvite } from "@/components/PublicInvite";
import { defaultDraft } from "@/lib/invitation";

export default function InvitePage() {
  return (
    <main className="public-page">
      <PublicInvite draft={defaultDraft} />
    </main>
  );
}
