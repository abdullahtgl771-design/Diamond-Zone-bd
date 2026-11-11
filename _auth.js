const db = require('./_db');
// verifies Supabase JWT from Authorization: Bearer <access_token>
module.exports = async (req) => {
  const h = req.headers.authorization || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!t) return null;
  const { data, error } = await db.auth.getUser(t);
  return error ? null : data.user;
};
