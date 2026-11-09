import { json, requireAdmin } from '../_utils.js';

// GET — public, fetch all projects
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  return json(results);
}

// POST — admin only, add new project
export async function onRequestPost({ request, env }) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  await env.DB.prepare(`
    INSERT INTO projects (title, description, tags, link, badge)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    String(body.title || '').slice(0, 120),
    String(body.description || '').slice(0, 500),
    String(body.tags || '').slice(0, 200),
    String(body.link || '').slice(0, 200),
    String(body.badge || 'LIVE').slice(0, 20)
  ).run();
  return json({ ok: true }, 201);
}

// DELETE — admin only, remove project
export async function onRequestDelete({ request, env }) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  
  const body = await request.json().catch(() => ({}));
  await env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(body.id).run();
  return json({ ok: true });
}