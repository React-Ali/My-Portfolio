import { json, requireAdmin } from '../_utils.js';

const STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'];

/* POST — public, submit a quote */
export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().slice(0, 160);
  const message = String(body.message || '').trim().slice(0, 4000);

  if (!name || !email || !message) {
    return json({ error: 'Name, email, and message are required.' }, 422);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: 'Invalid email address.' }, 422);
  }

  await env.DB.prepare(`
    INSERT INTO quotes
      (name, email, phone, company, project_type, plan, budget, timeline, message, status, created_at)
    VALUES (?,?,?,?,?,?,?,?,?, 'new', datetime('now'))
  `).bind(
    name, email,
    String(body.phone || '').slice(0, 40),
    String(body.company || '').slice(0, 120),
    String(body.projectType || '').slice(0, 60),
    String(body.plan || '').slice(0, 60),
    String(body.budget || '').slice(0, 60),
    String(body.timeline || '').slice(0, 60),
    message
  ).run();

  return json({ ok: true }, 201);
}

/* GET — admin only, list all quotes */
export async function onRequestGet({ request, env }) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;

  const { results } = await env.DB.prepare(
    'SELECT * FROM quotes ORDER BY created_at DESC'
  ).all();
  return json(results);
}

/* PATCH — admin only, update quote status */
export async function onRequestPatch({ request, env }) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  const id = Number(body.id);
  const status = String(body.status || '');

  if (!id || !STATUSES.includes(status)) {
    return json({ error: 'Invalid payload.' }, 422);
  }

  await env.DB.prepare('UPDATE quotes SET status = ? WHERE id = ?')
    .bind(status, id).run();
  return json({ ok: true });
}

/* DELETE — admin only, remove a quote */
export async function onRequestDelete({ request, env }) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  const id = Number(body.id);
  if (!id) return json({ error: 'Missing quote id.' }, 422);

  await env.DB.prepare('DELETE FROM quotes WHERE id = ?').bind(id).run();
  return json({ ok: true });
}