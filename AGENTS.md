<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->


- Keep manuscript inference in a server function using the AI Gateway SDK; the browser only supplies validated image data so credentials never reach learners.
- Keep uploaded manuscript images and results in page memory, not persistent storage, because this flow is a one-shot reading tool with no requested archive.
- Validate structured transcription segments and distinguish tentative, uncertain and unreadable readings so contextual guesses cannot silently become source text.
- Recover failed route-module imports with an explicit document reload, not router invalidation, because browsers cache rejected imports; never automatically reload a page holding an uploaded manuscript.
- Keep upload-workspace routes (manuscript, compare) in the initial client graph with an empty codeSplitGroupings override so navigating to them cannot fail on a stale deferred route chunk; other routes retain automatic splitting.
- Return aligned source and modern-Armenian text per segment in one server-side inference; display modern text first and keep shared uncertainty, because translation must not hide ambiguous source readings.
- Compare model source transcriptions locally against learner-supplied expert source using normalized Levenshtein CER; never send the reference to inference or present sample agreement as general model accuracy, because ground truth must remain independent.
- No database or sign-in: the imported app keeps uploads in page memory and defines no tables, so Lovable Cloud stays off until persistence is requested.
- Presentation 3D motion (slide turns, depth entrances, letter rings, pointer tilt) is pure CSS transforms keyed on slide changes, with a prefers-reduced-motion off switch, because it needs no WebGL library and renders the same on SSR and phones.
