import { json, requireAdmin } from '../_utils.js';

const DEFAULTS = {
  heroTitle: 'I build fast, reliable web products that ship.',
  heroSubtitle: 'Software engineer and product builder with 15 live products.',
  availabilityText: 'Accepting new projects',
  contactEmail: 'alimalikse002@gmail.com',
  pricingPlans: '[]'
};

/* GET — public (needed by homepage + pricing page) */
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT key, value FROM settings').all();
  const out = { ...DEFAULTS };
  for (const row of results) out[row.key] = row.value;
  return json(out);
}

/* PUT — admin only, save changed settings */
export async function onRequestPut({ request, env }) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  const ALLOWED = ['heroTitle', 'heroSubtitle', 'availabilityText', 'contactEmail', 'pricingPlans'];

  for (const key of ALLOWED) {
    if (typeof body[key] !== 'string') continue;
    const value = body[key].slice(0, 20000);

    if (key === 'pricingPlans') {
      try { JSON.parse(value); } catch { return json({ error: 'Pricing plans must be valid JSON.' }, 422); }
    }

    await env.DB.prepare(`
      INSERT INTO settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).bind(key, value).run();
  }

  return json({ ok: true });
}