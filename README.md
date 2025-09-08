Project Overview

Coding Buddy aggregates a user’s progress across GitHub, LeetCode, Codeforces, and CodeChef; provides a unique Buddy Rating and college-filtered leaderboards; and hosts secure contests with an integrated judge and plagiarism checks. The platform also implements a hearts system (3 hearts start) which penalizes cheating.

Features

Authentication (email/password, OAuth)

Link multiple external accounts (GitHub, LeetCode, Codeforces, CodeChef)

Unified dashboard with graphs and stats

Global & College-filtered leaderboards

Create and host programming contests with integrated online judge

Anti-cheating: fullscreen enforcement, copy/paste blocking, tab-switch detection

Post-contest plagiarism detection and AI-code flags

Heart system (3 → 0) with penalties on BuddyRating

Unique BuddyRating that blends platform scores, internal contest rating (Glicko-2), activity consistency, and hearts modifier

Tech Stack

Frontend: React (Vite or Next.js) + TypeScript + Tailwind CSS

Backend: Node.js + Express + TypeScript

Database: MongoDB (Mongoose)

Background jobs & queues: (Optional) Redis + BullMQ or Agenda

Code execution: Judge0 (self-host or cloud)

Dev tooling: ESLint, Prettier, Husky, Playwright (E2E)

System Architecture (local / minimal)

web (React) ↔ api (Express) ↔ MongoDB

Background workers for: data sync (linked platforms), contest processing, plagiarism checks. Optionally backed by Redis queues.

Judge0 runs as a separate service (docker-compose) and receives compile/execute requests.

Quickstart (Development)
Prerequisites

Node.js 18+ & pnpm/npm

MongoDB (local or Atlas)

(Optional) Redis and Judge0 via Docker

Environment variables (example .env)
# API
PORT=4000
JWT_SECRET=supersecret
JWT_REFRESH_SECRET=anothersecret
MONGO_URI=mongodb://localhost:27017/coding-buddy


# Judge0
JUDGE0_URL=http://localhost:2358
JUDGE0_KEY=


# OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
Run locally
# from repo root
pnpm install
pnpm --filter api dev    # runs Express (ts-node/vite-node)
pnpm --filter web dev    # runs React app
# (optional) docker-compose up -d for mongo, redis, judge0
Database Models (summary)

User { _id, email, username, college, hearts: number, buddyRating, linkedAccounts: [{platform, username, lastSyncedAt}], createdAt }

Contest { _id, name, startAt, endAt, organizerId, problems: [...], settings }

Problem { _id, contestId, title, statement, testcases }

Submission { _id, userId, problemId, code, lang, verdict, runtime, plagiarismScore }

Buddy Rating (summary)

BuddyRating = (PlatformScore + ContestScore) * ConsistencyFactor * HeartModifier

PlatformScore: normalized score from external platforms (weighted)

ContestScore: internal Glicko-2 rating

ConsistencyFactor: based on 30-day activity (0.8–1.2)

HeartModifier: {3->1.0, 2->0.75, 1->0.5}

Running the Contest Judge (notes)

Use Judge0's REST API for compile/execute. For production, self-host Judge0 to avoid third-party limits.

Always sanitize inputs and run submissions with strict resource limits.

Plagiarism Detection (notes)

Use tokenization + k-gram fingerprinting (Rabin-Karp rolling hash) to compare submissions.

Run post-contest as a background job with pairwise comparisons within the same problem.

Integrate third-party AI-code detectors for improved accuracy if available.

Security / Anti-Cheat (notes)

Fullscreen enforcement + visibility API logging. Do not rely on client-only checks for final verdicts — use logs as evidence and combine with plagiarism scores.

Disable copy/paste via client-side listeners during contest, but assume these can be bypassed — design server-side punishments based on combined signals.

Contributing

Fork → feature branch → PR with tests and changelog entry.

Run pnpm test and pnpm lint before pushing.

Roadmap / Phases

Phase 1 (MVP): core auth, linking, dashboard, leaderboards. Phase 2: Judge integration, contest lifecycle, rating system. Phase 3: Plagiarism detection, advanced anti-cheat, UX polish.

License

MIT