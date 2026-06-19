create table if not exists customers (
  customer_id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists users (
  user_id uuid primary key default gen_random_uuid(),
  customer_id uuid not null,
  auth_user_id uuid not null unique,
  email text not null,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  constraint foreign_key_users_customers_customer_id
    foreign key (customer_id) references customers(customer_id)
);

create index if not exists index_users_auth_user_id on users(auth_user_id);
create index if not exists index_users_customer_id on users(customer_id);
