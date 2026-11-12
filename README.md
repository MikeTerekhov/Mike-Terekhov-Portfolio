# Mike Terekhov Portfolio

Next.js portfolio using the App Router, React, and Tailwind CSS. Requires Node.js 22.

## Development

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run build` to validate the production build and `npm start` to serve it.

## Organization

- `app/`: route pages, the shared root layout, and global styles.
- `app/projects/<slug>/page.js`: individual project details.
- `components/`: shared UI, including the navbar with scoped CSS and project cards.
- `data/projects.js`: project card content and image references.
- `public/images/`, `public/videos/`, `public/fonts/`: static assets grouped by type.
- `public/emoji/`: memory game images.

The root layout renders the navbar once for every route. Keep route-specific UI beside its page and move reusable UI into `components/`.

Legacy page URLs redirect to their current routes in `next.config.js`. Rewrites preserve the original static asset URLs after asset organization. Existing environment configuration belongs in `.env.local` and should not be committed.
