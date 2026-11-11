const db = require('./_db');
const auth = require('./_auth');
const PRICES = {25:22,50:40,115:80,240:160,610:400,1240:800,2530:1600}; // server-side price, client can't tamper
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const user = await auth(req);
  if (!user) return res.status(401).json({ error: 'Login required' });
  const b = req.body || {};
  const price = PRICES[b.pack];
  const uid = String(b.uid || ''), sender = String(b.sender || ''), method = String(b.method || '');
  const trx = String(b.trx || '').toUpperCase().trim();
  if (!price || !/^\d{6,12}$/.test(uid) || !/^01\d{9}$/.test(sender) || !/^[A-Z0-9]{8,14}$/.test(trx) || !['bKash','Nagad','Rocket'].includes(method))
    return res.status(400).json({ error: 'Invalid input' });
  const { data, error } = await db.from('orders').insert({ pack: b.pack, price, uid, method, sender, trx_id: trx, user_id: user.id, email: user.email }).select('id').single();
  if (error) return res.status(error.code === '23505' ? 409 : 500).json({ error: error.code === '23505' ? 'This TrxID is already used' : 'Server error' });
  res.json({ id: data.id });
};
