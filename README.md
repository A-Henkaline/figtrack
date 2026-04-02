# FigTrack 🌿

> Track your Western New York fig trees through every season.

## What it does
- Dashboard showing current seasonal care tasks
- Add and manage multiple fig trees
- Health log per tree — notes and observations
- Harvest log — count figs, rate quality
- AI chat — ask questions about your specific tree
- Full year care calendar for Western NY

## Tech stack
- React (Create React App)
- Supabase (Postgres database)
- Vercel (hosting)

---

## Step 1 — Set up Supabase

1. Go to your Supabase project dashboard
2. Click **SQL Editor** → **New Query**
3. Paste the contents of `SUPABASE_SCHEMA.sql`
4. Click **Run**

That creates your three tables: `trees`, `health_logs`, `harvest_logs`.

---

## Step 2 — Push to GitHub

```bash
cd figtrack
git init
git add .
git commit -m "Initial FigTrack build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/figtrack.git
git push -u origin main
```

---

## Step 3 — Deploy to Vercel

1. Go to vercel.com → **Add New Project**
2. Import your `figtrack` GitHub repo
3. Framework preset: **Create React App** (auto-detected)
4. Click **Deploy** — done!

Your app will be live at `https://figtrack.vercel.app` (or similar).

---

## Local development

```bash
npm install
npm start
```

Opens at http://localhost:3000
