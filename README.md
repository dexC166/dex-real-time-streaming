<div align="center">
  <br />
    <a href="https://dex-real-time-streaming.vercel.app/" target="_blank">
      <kbd><img src="./public/images/project-banner.png" alt="Project Banner"></kbd>
    </a>
  <br />

---

# Dex-Real-Time-Streaming 📽️

An original, full-featured and responsive streaming platform inspired by Netflix. Designed, developed, and crafted by **Dayle Cortes**. Built with premium technologies for high-quality streaming, seamless authentication, personalized profiles, and a delightful user experience.

</div>

---

## 📑 Table of Contents

📌 [About This Project](#about-this-project)

🛠️ [Tech Stack](#tech-stack)

📚 [docs](#docs)

🚀 [Quick Start](#quick-start)

🧩 [Key Features](#key-features)

🗂️ [Folder Structures](#folder-structures)

📖 [My Learning Journey](#my-learning-journey)

📜 [License](#license)

🚀 [Deployment](#deployment)

📌 [Note](#note)

---

<a name="about-this-project"></a>

## 📌 About This Project

**Dex-Real-Time-Streaming** is my own comprehensive streaming app, featuring modern movie browsing, secure user authentication, intuitive UI, and personalized features.  
Motivated by Netflix’s industry-leading design and fueled by expertise gained through Antonio Erdeljac (“codewithantonio”) YouTube tutorials, this project is a testament to my growth as a full-stack JavaScript/TypeScript developer. Every feature and visual flourish is a result of hands-on learning and intentional customization.

---

<a name="tech-stack"></a>

## 🛠️ Tech Stack

| Layer / Purpose        | Technology                                      | Why                                                         |
| ---------------------- | ----------------------------------------------- | ----------------------------------------------------------- |
| **Frontend**           | Next.js 14 (App Router) + TypeScript + React 18 | For scalable, server-rendered and modern React development  |
| **Styling**            | Tailwind CSS                                    | To achieve a consistent, beautiful, utility-first UI        |
| **Authentication**     | NextAuth.js                                     | For secure, robust auth flows (credentials, Google, GitHub) |
| **Database**           | MongoDB + Prisma ORM                            | Flexible, scalable, and developer-friendly                  |
| **State Management**   | SWR (server data) & Zustand (local state)       | Fast, reliable state patterns                               |
| **Storage / CDN**      | Cloudinary                                      | Easy, performant file & image uploads                       |
| **Forms / Validation** | React-Hook-Form                                 | Lightweight, extensible form handling                       |
| **Notifications**      | react-hot-toast                                 | User-friendly success/error toasts                          |
| **Deployment**         | Vercel                                          | Effortless CI/CD and serverless delivery                    |

---

## 📦 `package.json` at a Glance

```json
{
  "name": "dex-real-time-streaming",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@next-auth/prisma-adapter": "^1.0.7",
    "@prisma/client": "^6.5.0",
    "axios": "^1.8.4",
    "bcrypt": "^5.1.1",
    "lodash": "^4.17.21",
    "next": "13.5.11",
    "next-auth": "^4.24.11",
    "react": "^18",
    "react-dom": "^18",
    "react-icons": "^5.5.0",
    "swr": "^2.3.3",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/lodash": "^4.17.16",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.21",
    "eslint": "^8",
    "eslint-config-next": "13.5.11",
    "postcss": "^8.5.3",
    "prisma": "^6.5.0",
    "tailwindcss": "^3.4.17",
    "typescript": "^5"
  }
}
```

---

<a name="docs"></a>

## 📚 Docs

- 🛠️ [Architecture Overview](./architecture.md)
- 🔄 [User Flow Diagram](./flowchart.md)

---

<a name="quick-start"></a>

## 🚀 Quick Start

### 1. Requirements

- Node.js ≥ 14
- MongoDB (local or Atlas)
- npm (or pnpm)

### 2. Set Up Environment Variables

Create a `.env` file in your project root and add:

```env
DATABASE_URL=
NEXTAUTH_JWT_SECRET=
NEXTAUTH_SECRET=

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 3. Install & Run

```bash
git clone https://github.com/dexC166/dex-real-time-streaming.git
cd dex-real-time-streaming

npm install
npx prisma db push
npm run dev
```

---

<a name="key-features"></a>

## 🧩 Key Features

| Feature                   | Purpose                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| 🔐 **Authentication**     | Sign-up/sign-in with email & password plus Google/GitHub OAuth, secure JWT session management |
| 👤 **Profile Management** | Create, switch, and customize your own streaming profiles                                     |
| 🎥 **Movie Browsing**     | Dynamic billboard, smart categories                                                           |
| ❤️ **Favorites System**   | Build and manage your personal watchlist in real time                                         |
| 📱 **Responsive UI**      | Fully mobile & desktop-ready with fluid layouts                                               |
| 📦 **Pop-up Modals**      | In-depth movie details one click away                                                         |
| ▶️ **Video Playback**     | High-performance, full-screen movie watching                                                  |
| 🚧 **Protected Routes**   | Access control throughout the app                                                             |

---

<a name="folder-structures"></a>

## 🗂️ Folder Structure

```
components/           # Reusable UI building blocks
hooks/                # Custom React hooks
lib/                  # Utility functions and helpers

pages/                # Next.js Pages Router
  └── api/            # API route handlers
  └── watch/          # Dynamic movie player route
  └── _app.tsx        # Custom App component for global providers/layout
  └── auth.tsx        # Login and signup page
  └── browse.tsx      # Homepage after login
  └── index.tsx       # Entry point, redirects or renders based on auth
  └── profiles.tsx    # Profile selection screen

prisma/               # Prisma schema and database configuration
public/               # Static assets

styles/               # Global CSS

.env                  # Environment variables (local)
.env.example          # Example env for collaborators

architecture.md       # Overview of the system design and tech stack
flowchart.md          # Visual flow diagram of feature/component interaction

.eslintrc.json        # ESLint configuration
.gitignore            # Git ignored files and folders
global.d.ts           # Global TypeScript type declarations

next-env.d.ts         # TypeScript declarations for Next.js
next.config.js        # Next.js project configuration
tailwind.config.js    # Tailwind CSS configuration
postcss.config.js     # PostCSS plugin configuration
tsconfig.json         # TypeScript compiler options
package.json          # NPM package definitions and scripts
package-lock.json     # Exact dependency lockfile
README.md             # Project overview and usage guide (You are here!)
```

---

<a name="my-learning-journey"></a>

## 📖 My Learning Journey

I dove deeply into:

- **Custom Hooks**: `useBillboard`, `useMovieList`, `useFavorites`, `useInfoModal`
- **Secure API Design**: Next.js App Router + API routes
- **Advanced Auth Flows**: NextAuth.js with JWT
- **State Management**: SWR for server data & Zustand for local UI state
- **Responsive, Netflix-esque UI**: Tailwind CSS best practices

This project isn’t a straight copy, it’s an **evolution**! Inspiration came from Antonio Erdeljac’s (“codewithantonio”) YouTube content, whose lessons turbocharged my skills and confidence. Fully understanding every file now, and reflects my own touch and problem solving.

---

<a name="deployment"></a>

## 🚀 Deployment

**Deployed & production-ready via Vercel:**

1. Push your repo to GitHub
2. Link it in the Vercel dashboard
3. Add your `.env` variables in Vercel’s settings
4. Deploy instantly!

_(Any platform supporting Next.js 14 works; Vercel simply makes it seamless.)_

---

<a name="license"></a>

## 📜 License

All code and design proudly created and maintained by **Dex**.  
© 2025 Dex. All rights reserved.

---

<a name="acknowledgements"></a>

## 🙏 Acknowledgments

Special thanks to **Antonio Erdeljac**, your real-world tutorials and code galore have been a phenomenal resource and inspiration. Every lesson built my confidence to innovate and expand.

This README marks my full ownership over **“Dex Real-Time-Streaming.”**  
If you have questions, improvements, or want to discuss streaming development, feel free to reach out!

---

<a name="note"></a>

## 📌 Note

This app was originally built by following @codewithantonio’s YouTube tutorial for learning and inspiration.  
The project was developed entirely in my local IDE (outside of GitHub) without initializing git, and I’ve reconstructed the commit history solely to reflect a realistic development flow and demonstrate my understanding of fullstack architecture and recent modifications, not as a record of the actual chronological build.

---
