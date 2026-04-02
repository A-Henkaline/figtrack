-- FigTrack Database Schema
-- Paste this into Supabase → SQL Editor → New Query → Run

-- Trees table
CREATE TABLE trees (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  variety             TEXT NOT NULL,
  date_planted        DATE,
  location_on_property TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Health logs
CREATE TABLE health_logs (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tree_id   UUID NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
  log_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  note      TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Harvest logs
CREATE TABLE harvest_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tree_id        UUID NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
  harvest_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  quantity       INTEGER NOT NULL,
  quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (open for personal use)
ALTER TABLE trees        ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvest_logs ENABLE ROW LEVEL SECURITY;

-- Allow all operations (personal app, no auth needed)
CREATE POLICY "Allow all" ON trees        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON health_logs  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON harvest_logs FOR ALL USING (true) WITH CHECK (true);

-- Indexes for performance
CREATE INDEX ON health_logs  (tree_id, log_date DESC);
CREATE INDEX ON harvest_logs (tree_id, harvest_date DESC);
