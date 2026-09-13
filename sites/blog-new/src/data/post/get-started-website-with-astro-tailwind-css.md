---
publishDate: 2025-11-03T00:00:00Z
author: David de Jesus
title: How Localization Works With Rive in Native Mobile Apps
excerpt: Localization can feel intimidating when your Rive animation includes text. This guide explains how Rive works with native app localization systems, in simple terms for designers and light-technical readers.
image: https://images.unsplash.com/photo-1502101872923-d48509bff386?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80
imageAlt: Two toddlers standing at the bottom of a beige concrete staircase
category: Tutorials
tags:
  - astro
  - tailwind css
---

Rive makes it easy to design interactive graphics, but once your animation needs to show text in different languages, things become a little more complicated. Many designers think the answer is to create multiple Rive files or embed fonts directly inside the animation. In reality, native apps like iOS and Android already give you smarter ways to localize your text without blowing up your file size or duplicating work.

This article explains how localization works when you use Rive inside a native app. It is written for designers and people with basic coding skills who want to understand how everything connects without needing deep engineering knowledge.

## Why localization inside Rive looks confusing at first

When you open Rive, it feels natural to place text directly into the animation. You style it, animate it, and make it look perfect. That works great for a single language.

But when a project requires Spanish, English, French, German, Japanese, and more, suddenly you face questions like:

- Should I create a separate Rive file for every language?
- Should I animate all languages inside the same file and toggle visibility?
- Should I embed every font?
- Should the developer take care of the text?

The good news is that native apps already have solutions for this, and Rive integrates nicely with them.

## Create your Astro + Tailwind project

The Astro CLI scaffolds a project from any GitHub repository:

```shell
npm create astro@latest -- --template arthelokyo/astrowind
```

Answer the prompts (project folder, install dependencies, initialize git), then:

```shell
cd my-site
npm run dev
```

Open `http://localhost:4321`. You are looking at the demo site: a home page, several alternative home pages, a set of landing pages, a demo blog and the usual about, services, pricing, contact and legal pages. Everything you see is a file you can edit, and the dev server reloads on save.

## Where things live in the AstroWind template

You will spend nearly all your time in `src/`:

| Path                                | What is there                                                                          |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| `src/pages/`                        | One file per route. `index.astro` is the home page.                                    |
| `src/components/widgets/`           | The page sections: heroes, features, pricing, FAQ, testimonials…                       |
| `src/data/post/`                    | Blog posts as Markdown or MDX files.                                                   |
| `src/config.yaml`                   | Site name, URL, default SEO metadata, blog settings, analytics, theme.                 |
| `src/navigation.ts`                 | The header menu, the header button and the footer columns.                             |
| `src/components/CustomStyles.astro` | Colors and fonts as CSS variables, for light and dark mode.                            |
| `src/assets/images/`                | Images that Astro optimizes at build time.                                             |
| `public/`                           | Files copied as they are: `robots.txt`, headers, anything a host wants at a fixed URL. |

The template's own machinery lives in `vendor/integration/`. You do not need to touch it.

## The three files to edit first

**`src/config.yaml`.** Change `site.name` and `site.site` (your final URL, needed for the sitemap, RSS and Open Graph tags), then the default `metadata.title` and `metadata.description`. The `apps.blog` block controls the blog: set `isEnabled: false` if you do not want one, or change `postsPerPage` and the `permalink` pattern.

**`src/navigation.ts`.** Replace the demo menus with your pages. Each entry is `{ text, href }`; use `getPermalink('/about')` for internal links so the base path is respected if you ever deploy under a sub-folder.

**`src/components/CustomStyles.astro`.** Your brand colors: `--aw-color-primary`, `--aw-color-secondary` and `--aw-color-accent`, plus the text and background colors, once for light and once for dark. Everything in the template reads these variables. Fonts are declared in `astro.config.ts` (the `fonts` entry, served by Astro's Fonts API) and mapped to the `--aw-font-*` variables in `CustomStyles.astro`. The [customization guide](/how-to-customize-astrowind-to-your-brand) covers all of this in depth.

## Edit the home page

Open `src/pages/index.astro`. A page is a layout plus a stack of widgets, each configured with props:

```astro
---
import Layout from '~/layouts/PageLayout.astro';
import Hero from '~/components/widgets/Hero.astro';
import Features from '~/components/widgets/Features.astro';
import CallToAction from '~/components/widgets/CallToAction.astro';

const metadata = {
  title: 'Acme: invoices without the spreadsheet',
  description: 'Send, track and reconcile invoices in one place.',
};
---

<Layout metadata={metadata}>
  <Hero
    tagline="Invoicing"
    title="Invoices without the spreadsheet"
    subtitle="Send, track and reconcile in one place."
    actions={[{ variant: 'primary', text: 'Start free', href: '#pricing' }]}
    image={{ src: '~/assets/images/hero-image.png', alt: 'Product screenshot' }}
  />

  <Features
    id="features"
    title="What you get"
    items={[
      { title: 'Recurring invoices', description: 'Set it once.', icon: 'tabler:repeat' },
      { title: 'Payment links', description: 'Card or bank transfer.', icon: 'tabler:credit-card' },
    ]}
  />

  <CallToAction title="Ready?" actions={[{ variant: 'primary', text: 'Start free', href: '/signup' }]} />
</Layout>
```

Most section widgets share the same base props: `title`, `subtitle`, `tagline`, an `id` for anchors and a `bg` slot for a custom background. Icons come from the [Tabler](https://tabler.io/icons) set through `astro-icon`. A catalog of the section widgets, their main props and the demo page where each is used is in `.agents/skills/use-widgets.md`; the landing pages under `src/pages/landing/` show them combined into complete pages, and the [landing page guide](/landing) explains the thinking behind them.

## Publish your first post

Create `src/data/post/hello-world.md`:

```markdown
---
publishDate: 2026-08-24T00:00:00Z
title: Hello, world
excerpt: The first post on the new site.
image: ~/assets/images/hello.jpg
imageAlt: The team at the launch party
category: News
tags:
  - company
author: Your name
---

Write in Markdown. Headings, lists, tables, code blocks and images all work;
use the `.mdx` extension to embed components.
```

The post appears at `/hello-world` (the `permalink` setting in `config.yaml` decides the pattern), in the blog list, in its category and tag pages, in the RSS feed and in the sitemap, with its Open Graph tags and structured data generated for you. `draft: true` keeps a post out of the build while you work on it; `updateDate` marks a revision, shown under the title and sent to search engines. The [Markdown demo post](/markdown-elements-demo-post) shows how every element renders.

## Check and build

```shell
npm run check   # astro check, ESLint and Prettier
npm run build   # static site in dist/
npm run preview # serve dist/ locally
```

The build is fully static: `dist/` is a folder of HTML, CSS, JavaScript and optimized images that any web server can host.

## Deploy your Astro site (Vercel, Netlify, Cloudflare)

- **Vercel or Netlify:** connect the repository; both detect Astro and use `npm run build` with `dist/` as the output. The README has one-click buttons for these and other hosts.
- **Cloudflare Pages, GitHub Pages, any static host:** upload `dist/`. The `deploy-cloudflare` and `deploy-with-base-path` skills in `.agents/skills/` cover the two cases that need a setting.
- **Your own server:** the repository includes a `Dockerfile` that serves `dist/` with nginx.

After the first deploy, set `site.site` in `config.yaml` to the real URL if you have not already, so canonical links, the sitemap and social previews point to the right place.

## Next steps

- [Customize the template to your brand](/how-to-customize-astrowind-to-your-brand): colors, fonts, logo, favicons.
- [How the template works under the hood](/astrowind-template-in-depth): the integration, permalinks, images and metadata.
- [Build a landing page that converts](/landing): the guide behind the six landing page examples.
- Working with an AI coding assistant? The repository ships an `AGENTS.md` and step-by-step skills in `.agents/skills/` so the assistant follows the template's conventions. [Here is how to get the most out of it](/build-websites-with-ai).