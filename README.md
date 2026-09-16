# Portfolio v2 — Ashutosh Kumar

> A high-performance personal portfolio, digital garden, and engineering showcase featuring physical liquid glass shaders, interactive micro-animations, and developer integrations.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## ✨ Features

- **💧 Physical Liquid Glass Droplets & Shaders**: Custom Signed Distance Field (SDF) normal maps, caustic refraction, convex specular glints, and per-instance mouse displacement physics.
- **🫧 Interactive Tech Stack Bubbles**: Spherical liquid droplets representing core languages and tools (Go, TypeScript, Rust, Node.js, React, PostgreSQL, etc.) with dynamic cloud link previews.
- **📄 Resume Viewer & Downloader**: Standalone liquid action bubbles for viewing the PDF in a custom glass lightbox modal and direct one-click downloading.
- **📊 Real-time Developer Analytics**: Live GitHub activity feed, commit counts, merged PRs, and LeetCode problem-solving statistics.
- **📚 Writings & Papershelf**: Minimalist essay reader and curated computer science paper repository with markdown formatting.
- **🖼️ Interactive Pixel Avatar**: Multi-layer avatar with pixel-dissolve transition upon interaction.
- **🌓 Dynamic Light/Dark Themes**: Persistent theme support with smooth visual mode toggling.
- **📱 Responsive & Foldable-Ready**: Optimized layouts across ultra-wide monitors down to compact foldable screens (e.g. Samsung Galaxy Z Fold 5).
- **🚀 Complete SEO Suite**: Dynamic OpenGraph cards (`opengraph-image.tsx`), automated `sitemap.ts`, `robots.ts`, and structured semantic metadata.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (Turbopack, App Router)](https://nextjs.org/)
- **Core**: [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), CSS Modules, and custom canvas/SVG shaders
- **Animation & Optics**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/), [Three.js](https://threejs.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data & Storage**: [Drizzle ORM](https://orm.drizzle.team/), [LibSQL](https://github.com/tursodatabase/libsql)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 📁 Project Structure

```text
portfolio_v2/
├── public/                     # Static assets (SVGs, images, Resume.pdf)
├── scripts/                    # Content sync and data management CLI tools
├── src/
│   ├── app/                    # Next.js App Router pages and metadata
│   │   ├── about/              # Full dedicated about page
│   │   ├── blogs/              # Blog posts & technical essays
│   │   ├── contactme/          # Contact details & links
│   │   ├── myworks/            # Projects showcase
│   │   ├── papershelf/         # Research paper summaries
│   │   ├── opengraph-image.tsx # Dynamic OG banner generator
│   │   ├── robots.ts           # Crawling directives
│   │   └── sitemap.ts          # Search engine index generator
│   ├── components/
│   │   ├── about/              # About me card, TechBubble, ResumeViewer & Modal
│   │   ├── animate-ui/         # Interactive primitive animation components
│   │   ├── liquid/             # Liquid container, shader generation & physics
│   │   ├── navbar/             # Floating navigation bar
│   │   ├── footer/             # Site footer
│   │   ├── skills/             # Categorized skill showcases & asset badges
│   │   └── ui/                 # Reusable UI controls (LinkPreview, PixelTransition)
│   ├── lib/                    # Utility functions and glass configurations
│   └── platform/               # Database schemas, seed data & API integrations
├── .env.example                # Environment variable documentation
└── package.json                # Dependencies and project scripts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher recommended)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Ashutosh-Repos/portfolio_v2.git
   cd portfolio_v2
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Set `NEXT_PUBLIC_SITE_URL` to your local dev URL or your production domain:

   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script         | Description                                                  |
| :------------- | :----------------------------------------------------------- |
| `pnpm dev`     | Starts the Next.js Turbopack development server on port 3000 |
| `pnpm build`   | Creates an optimized production build                        |
| `pnpm start`   | Runs the production build locally                            |
| `pnpm lint`    | Runs ESLint checks                                           |
| `pnpm format`  | Formats the codebase using Prettier                          |
| `pnpm db:push` | Pushes Drizzle database schema migrations                    |
| `pnpm db:seed` | Seeds local content and platform entries                     |

---

## 🌐 Production Deployment

### Deploying to Vercel

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Under **Project Settings &rarr; Environment Variables**, configure:
   ```env
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```
4. Deploy! Dynamic link previews powered by Microlink will automatically capture live rendered routes from your production domain.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Ashutosh Kumar](https://github.com/Ashutosh-Repos).
