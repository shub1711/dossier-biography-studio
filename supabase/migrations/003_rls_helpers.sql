create or replace function public.current_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.user_id
  from users u
  where u.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public.customer_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.customer_id
  from users u
  where u.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public.can_access_customer(target_customer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from users u
    where u.auth_user_id = auth.uid()
      and u.customer_id = target_customer_id
  );
$$;

create or replace function public.is_system_role()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select false;
$$;
