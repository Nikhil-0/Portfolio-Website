# Portfolio Website

Personal portfolio built with React + Vite and React Router.

## Running locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint     # eslint
```

## Updating content

**All page content lives in `src/data/` — you shouldn't need to touch the
components to keep the site current.** Each file has comments explaining its
shape.

| File | Controls |
| --- | --- |
| `src/data/profile.js` | Name, tagline, bio, email, location, résumé link, social links |
| `src/data/nav.js` | Navigation links and per-page browser titles |
| `src/data/projects.js` | `experience` and `projects` arrays (title, description, tech tags, links) |
| `src/data/certifications.js` | Certification cards (import the image, add an entry) |
| `src/data/education.js` | Schools, logos, details |
| `src/data/activities.js` | "Holistic Development" — activities grouped by life stage, with photo galleries |
| `src/data/blog.js` | Blog posts (summary + expandable sections + optional external link) |

### Common tasks

- **Add a project:** add an object to the `projects` array in
  `src/data/projects.js`. Optionally give it `links: [{ label, href }]`.
- **Add a certification:** drop the image in `src/assets/`, `import` it at the
  top of `src/data/certifications.js`, and add `{ title, issuer, image }`.
- **Add a blog post:** add an object to `posts` in `src/data/blog.js`. `body`
  can be a string or an array of paragraphs.
- **Add a photo to an activity:** import it in `src/data/activities.js` and add
  `{ src, alt }` to that activity's `images` array. Photos open in a lightbox.
- **Add the résumé:** put `resume.pdf` in `public/`, then set
  `showResume: true` in `src/data/profile.js`.

## Design system

Colours, spacing, radius and shadows are CSS custom properties in
`src/styles/theme.css`, defined once per theme (dark + light). Change a token
there and it updates across the whole site. The light/dark toggle is in the
header and remembers the visitor's choice.

## Deployment

`vercel.json` rewrites all routes to `/` so client-side routing works on
refresh. The build is served from the domain root. For GitHub Pages instead,
build with `VITE_BASE_PATH=/<repo-name>/ npm run build`.
