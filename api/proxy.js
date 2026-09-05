export default async function handler(req, res) {
  const configuredBase = process.env.BACKEND_URL || 'https://detelder-be.vercel.app/';
  const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
  const rawPath = typeof req.query.path === 'string' ? req.query.path : '';

  if (!rawPath || rawPath.includes('://')) {
    res.status(400).json({ message: 'Invalid API path' });
    return;
  }

  const target = new URL(rawPath.replace(/^\/+/, ''), base);
  const headers = {
    accept: 'application/json',
    'content-type': req.headers['content-type'] || 'application/json',
  };

  if (req.headers.authorization) {
    headers.authorization = req.headers.authorization;
  }

  if (req.headers.cookie) {
    headers.cookie = req.headers.cookie;
  }

  const init = {
    method: req.method,
    headers,
    redirect: 'manual',
  };

  if (req.method !== 'GET' && req.method !== 'HEAD' && typeof req.body !== 'undefined') {
    init.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  try {
    const upstream = await fetch(target, init);
    const text = await upstream.text();

    const contentType = upstream.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);

    const setCookie = upstream.headers.get('set-cookie');
    if (setCookie) {
      const rewritten = setCookie.replace(/;\s*Domain=[^;]+/gi, '');
      res.setHeader('set-cookie', rewritten);
    }

    res.setHeader('x-preview-backend', base);
    res.status(upstream.status).send(text);
  } catch (error) {
    console.error('Detelder preview proxy error', error);
    res.status(502).json({
      message: 'Backend non raggiungibile dalla preview',
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
