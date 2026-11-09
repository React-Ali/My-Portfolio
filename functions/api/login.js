import { json, signSession, cookieAttrs } from '../_utils.js';

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
    return json({ error: 'Admin is not configured. Set ADMIN_PASSWORD and SESSION_SECRET env vars.' }, 500);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }

  const password = String(body.password || '');
  if (!password || password !== env.ADMIN_PASSWORD) {
    await new Promise(r => setTimeout(r, 400));
    return json({ error: 'Invalid password.' }, 401);
  }

  const token = await signSession(env.SESSION_SECRET, 24);
  return json({ ok: true }, 200, {
    'Set-Cookie': `admin_session=${token}; ${cookieAttrs(request, 86400)}`
  });
}