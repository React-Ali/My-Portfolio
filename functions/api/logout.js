import { json, cookieAttrs } from '../_utils.js';

export async function onRequestPost({ request }) {
  return json({ ok: true }, 200, {
    'Set-Cookie': `admin_session=; ${cookieAttrs(request, 0)}`
  });
}