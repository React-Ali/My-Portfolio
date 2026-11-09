CREATE TABLE IF NOT EXISTS quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  project_type TEXT,
  plan TEXT,
  budget TEXT,
  timeline TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON quotes(created_at DESC);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR IGNORE INTO settings (key, value) VALUES
('heroTitle', 'I build fast, reliable web products that ship.'),
('heroSubtitle', 'Software engineer and product builder with 15 live products. I help businesses turn ideas into fast, scalable web experiences.'),
('availabilityText', 'Accepting new projects'),
('contactEmail', 'alimalikse002@gmail.com'),
('pricingPlans', '[{"name":"Starter","price":"$299","suffix":"starting","desc":"For a clean landing page or small business site.","cta":"Get Started","featured":false,"features":["1–3 page website","Mobile responsive","Basic SEO setup","Contact form","7-day support"]},{"name":"Professional","price":"$799","suffix":"starting","desc":"For e-commerce, SaaS tools, and serious business sites.","cta":"Get Started","featured":true,"features":["Up to 8 pages / product catalogue","Advanced animations","SEO + analytics","Quote / checkout flow","30-day support"]},{"name":"Scale","price":"$1,500+","suffix":"custom","desc":"For AI tools, custom dashboards, and ongoing work.","cta":"Discuss Project","featured":false,"features":["Custom web app","API / AI integration","Admin dashboard","Deployment + CI/CD","Priority support"]}]');