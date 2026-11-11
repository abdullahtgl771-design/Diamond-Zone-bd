create table orders(
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  user_id uuid not null references auth.users(id),
  email text,
  pack int not null, price int not null,
  uid text not null, method text not null, sender text not null,
  trx_id text not null unique,
  status text not null default 'pending' check (status in ('pending','delivered','rejected'))
);
alter table orders enable row level security; -- no policies: only service key (server) can access
