# sahilsinghrawat.com

Personal blog built with [Astro](https://astro.build) + Tailwind CSS v4, deployed on Cloudflare Pages.

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` (drafts are visible, search index not built) |
| `npm run build` | Build to `./dist` and index the site for search (Pagefind) |
| `npm run preview` | Preview the production build |
| `npm run check:links` | Verify internal links in `dist/` (run after build) |

## Writing posts

Posts are Markdown files in `src/content/posts/` named `YYYY-MM-DD-slug.md`. Frontmatter:

```yaml
---
title: "My post"
date: 2025-05-03 10:24:00 +0530
description: "One sentence for cards, search and social previews."
categories: [BugBounty, Web]   # first value is the primary category
series: "Intro to C"           # optional: groups multi-part posts
tags: [web, xss]
featured: false                # pin to the homepage
draft: false                   # true = hidden in production
updated: 2025-06-01            # optional "Updated" date
---
```

Markdown extras: callouts (`> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`), footnotes (`text[^1]`), code titles (```` ```js title="app.js" ````) and line highlights (`// [!code highlight]`).

Images go in `public/assets/img/posts/` and are referenced as `/assets/img/posts/name.jpg`.

You can also write and edit through the browser at **/admin** (Decap CMS). It commits to `main` via GitHub.

## Admin setup (one-time)

1. Create a GitHub OAuth App (Settings → Developer settings → OAuth Apps). Callback URL: `https://www.sahilsinghrawat.com/api/callback`.
2. In Cloudflare Pages → Settings → Variables and Secrets, add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.
3. Optional: put `/admin*` and `/api/*` behind Cloudflare Access for a second lock.

## Project layout

- `src/lib/posts.ts` — post helpers (categories, series, tags, related posts, excerpts)
- `src/layouts/BaseLayout.astro` — head, SEO and Open Graph tags
- `src/pages/og/[slug].png.ts` — generates a social card image per post
- `functions/api/` — Cloudflare Pages Functions for the CMS login
- `public/_headers` — security and cache headers

Categories are normalised in `normalizeCategory()` so typos in frontmatter do not create new filters.

## Deploy

Cloudflare Pages: build command `npm run build`, output directory `dist`, Node 22+.
