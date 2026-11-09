export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers }
  });
}

const enc = new TextEncoder();

function b64url(bytes) {
  let str = '';
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function b64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return b64url(new Uint8Array(sig));
}

export async function signSession(secret, hours = 24) {
  const payload = b64url(enc.encode(JSON.stringify({
    exp: Date.now() + hours * 3600 * 1000
  })));
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function verifySession(request, secret) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/(?:^|;\s*)admin_session=([^;]+)/);
  if (!match) return false;
  const [payload, sig] = match[1].split('.');
  if (!payload || !sig) return false;
  if (sig !== await hmac(secret, payload)) return false;
  try {
    const data = JSON.parse(b64urlDecode(payload));
    return typeof data.exp === 'number' && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function requireAdmin(request, env) {
  if (!env.SESSION_SECRET || !(await verifySession(request, env.SESSION_SECRET))) {
    return json({ error: 'Unauthorized' }, 401);
  }
  return null;
}

export function cookieAttrs(request, maxAge = 86400) {
  const isHttps = new URL(request.url).protocol === 'https:';
  return `Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${isHttps ? '; Secure' : ''}`;
}