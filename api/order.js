const db = require('./_db');
const auth = require('./_auth');
const PRICES = {25:22,50:40,115:80,240:160,610:400,1240:800,2530:1600};
module.exports = async (req, res) => {
  try {
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
    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'This TrxID is already used' });
      return res.status(500).json({ error: 'DEBUG ' + error.code + ' | ' + error.message });
    }
    res.json({ id: data.id });
  } catch (e) {
    res.status(500).json({ error: 'DEBUG catch | ' + e.message });
  }
};
