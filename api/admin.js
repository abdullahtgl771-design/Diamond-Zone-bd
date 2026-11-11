const db = require('./_db');
module.exports = async (req, res) => {
  if (!process.env.ADMIN_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'unauthorized' });
  if (req.method === 'GET') {
    const { data } = await db.from('orders').select('*').order('id', { ascending: false }).limit(200);
    return res.json(data || []);
  }
  if (req.method === 'POST') {
    const { id, status } = req.body || {};
    if (!['pending','delivered','rejected'].includes(status)) return res.status(400).json({ error: 'bad status' });
    await db.from('orders').update({ status }).eq('id', id);
    return res.json({ ok: true });
  }
  res.status(405).end();
};
