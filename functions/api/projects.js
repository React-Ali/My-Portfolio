import { json, requireAdmin } from '../_utils.js';

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  return json(results);
}

export async function onRequestPost({ request, env }) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  await env.DB.prepare(`INSERT INTO projects (title, description, tags, link, badge) VALUES (?, ?, ?, ?, ?)`)
    .bind(String(body.title), String(body.description), String(body.tags), String(body.link), String(body.badge || 'LIVE')).run();
  return json({ ok: true }, 201);
}

export async function onRequestDelete({ request, env }) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  await env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(body.id).run();
  return json({ ok: true });
}