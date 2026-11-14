# softstroke-feedback

A Cloudflare Worker that turns the site's **Request an icon** and **Report an issue** forms into GitHub issues on `softstroke/softstroke`, so visitors need no GitHub account. The issue is opened with the project's token; the visitor's name (optional) appears in the issue text.

```
site modal  --POST /issue-->  Worker  --checks-->  GitHub REST API (create issue)
```

Every request is checked, in this order: allowed origin (CORS), 5 submissions a minute per visitor (Workers rate limiting), body size, field validation (`src/issue.ts`), then Cloudflare Turnstile. Visitor text is defused before it reaches the public issue: no HTML, no remote images, no @mentions that ping people, at most 3 links. GitHub errors are logged (`npx wrangler tail`), never shown to visitors.

## One-time setup

1. **Cloudflare account** (free): https://dash.cloudflare.com/sign-up
2. **Turnstile widget**: Cloudflare dashboard → Turnstile → Add widget. Name `softstroke`, hostnames `softstroke.github.io` and `localhost`, mode *Invisible* (no box on the form), pre-clearance off. Keep the page open: you need the **site key** (public) and the **secret key** (private).
3. **GitHub token**: https://github.com/settings/personal-access-tokens/new
   - Resource owner: `softstroke` (if it is not listed, allow fine-grained tokens in the org: Settings → Personal access tokens).
   - Repository access: only `softstroke/softstroke`.
   - Permissions: **Issues: Read and write**. Nothing else.
   - Expiration: up to a year; note the date, the form stops working when it expires.
4. **Deploy and add the secrets** (each `secret put` asks you to paste the value; it never touches a file):
   ```bash
   cd api
   npm install
   npx wrangler login
   npx wrangler deploy
   npx wrangler secret put GITHUB_TOKEN
   npx wrangler secret put TURNSTILE_SECRET
   ```
   `wrangler deploy` prints the Worker address, like `https://softstroke-feedback.<you>.workers.dev`.
5. **Point the site at it**: set `FEEDBACK_API` (the Worker address) and `TURNSTILE_SITE_KEY` (the site key) in `web/src/lib/site.ts`. Both are public values. Until both are set, the modal hands off to the GitHub issue forms instead.

## Develop

```bash
npm test            # unit + handler tests (vitest), no network
npm run typecheck
npx wrangler dev    # local Worker on :8787; put test values in .dev.vars (gitignored)
```

For a local end-to-end run, `.dev.vars` can use Cloudflare's always-pass Turnstile test secret `1x0000000000000000000000000000000AA`, a fake `GITHUB_API` (any server answering `POST /repos/<repo>/issues`) and `ALLOWED_ORIGINS` for your local site; build the site with `NEXT_PUBLIC_FEEDBACK_API=http://127.0.0.1:8787 NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA`.

## Rotating the token

Create a new token as in step 3, run `npx wrangler secret put GITHUB_TOKEN`, then delete the old token on GitHub.
