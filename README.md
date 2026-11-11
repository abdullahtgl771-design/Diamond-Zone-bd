# Deploy (Vercel + Supabase + Google login)
1. supabase.com -> new project -> SQL Editor -> run supabase.sql
2. Google login:
   - console.cloud.google.com -> APIs & Services -> Credentials -> OAuth client ID (Web app)
   - Authorized redirect URI: https://<PROJECT_REF>.supabase.co/auth/v1/callback
   - Supabase -> Authentication -> Providers -> Google -> enable, paste Client ID + Secret
   - Supabase -> Authentication -> URL Configuration: Site URL = your Vercel domain, add it to Redirect URLs
3. Supabase -> Project Settings -> API: copy URL, anon key (public, goes in index.html), service_role key (secret, Vercel env only)
4. public/index.html: set SB_URL + SB_ANON, PAY numbers, PACKS; api/order.js PRICES must match PACKS
5. Push to GitHub -> Vercel import
6. Vercel env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, ADMIN_KEY (long random)
7. /admin.html -> enter ADMIN_KEY -> verify orders -> Delivered / Reject
