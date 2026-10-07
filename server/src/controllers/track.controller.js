import PageView from '../models/PageView.js';

export function trackPageView(req, res) {
  const { visitorId, path } = req.body || {};
  const valid =
    typeof visitorId === 'string' && visitorId.length >= 8 && visitorId.length <= 64 &&
    typeof path === 'string' && path.startsWith('/') && path.length <= 200 &&
    !path.startsWith('/admin');
  if (valid) PageView.create({ visitorId, path, userId: req.user?.id || null }).catch(() => {});
  res.status(204).end();
}