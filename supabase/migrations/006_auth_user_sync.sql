create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
begin
  select customer_id
  into v_customer_id
  from customers
  order by created_at asc
  limit 1;

  if v_customer_id is null then
    insert into customers (name)
    values ('Default Customer')
    returning customer_id into v_customer_id;
  end if;

  insert into users (customer_id, auth_user_id, email, full_name)
  values (
    v_customer_id,
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();
