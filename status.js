const db = require('./_db');
const auth = require('./_auth');
module.exports = async (req, res) => {
  const user = await auth(req);
  if (!user) return res.status(401).json({ error: 'Login required' });
  const id = parseInt(req.query.id);
  if (!id) return res.status(400).json({ error: 'bad id' });
  const { data } = await db.from('orders').select('status').eq('id', id).eq('user_id', user.id).single();
  res.json({ status: data ? data.status : 'unknown' });
};
