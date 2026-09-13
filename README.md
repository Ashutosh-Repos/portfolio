This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🚀 Production Deployment Notes & Reminders

### Dynamic Link Previews (Internal Routes like `/about`)

This portfolio uses **100% dynamic link previews** powered by the [Microlink](https://microlink.io) cloud screenshot service.

#### 1. Why internal routes (e.g. `/about`) show 404 during local development

- Microlink is a public cloud service on the internet. It **cannot** connect to `http://localhost:3000` on your private machine.
- For internal relative routes (`/about`), the `LinkPreview` component resolves the URL against the public domain (`process.env.NEXT_PUBLIC_SITE_URL`).
- During local development, this defaults to the existing live Vercel deployment. If a newly created route (like `/about`) has **not been pushed/deployed** to that live URL yet, the cloud screenshot service captures what is currently live on that domain — which returns 404.

#### 2. What to do when deploying to Production (e.g. Vercel)

In your production hosting dashboard (e.g., **Vercel Project Settings &rarr; Environment Variables**), configure:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

_(or your custom domain, e.g. `https://ashutoshkumar.dev`)_

#### 3. Result in Production

Once your code is deployed to Vercel with the `/about` page live:

1. `NEXT_PUBLIC_SITE_URL` points to your live deployment.
2. Microlink captures the real, rendered `/about` page over the public web.
3. The hover preview card displays the actual page content with zero hardcoded assets!
