

create table if not exists biography_profile_versions (
  biography_profile_version_id uuid primary key default gen_random_uuid(),
  customer_id uuid not null,
  biography_profile_id uuid not null,
  version_number integer not null,
  snapshot_json jsonb not null,
  change_summary text,
  created_at timestamptz not null default now(),
  created_by uuid not null,
  constraint foreign_key_biography_profile_versions_customers_customer_id
    foreign key (customer_id) references customers(customer_id),
  constraint foreign_key_biography_profile_versions_profiles_profile_id
    foreign key (biography_profile_id) references biography_profiles(biography_profile_id),
  constraint foreign_key_biography_profile_versions_created_by_users_user_id
    foreign key (created_by) references users(user_id),
  constraint unique_biography_profile_versions_profile_version_number
    unique (biography_profile_id, version_number)
);

create index if not exists index_biography_profile_versions_customer_profile
  on biography_profile_versions(customer_id, biography_profile_id);

alter table biography_profile_versions enable row level security;

-- RLS mirrors the parent biography_profiles: owner (or system role) only.
drop policy if exists policy_select_own_biography_profile_versions on biography_profile_versions;
create policy policy_select_own_biography_profile_versions
on biography_profile_versions for select
using (
  exists (
    select 1
    from biography_profiles bp
    where bp.biography_profile_id = biography_profile_versions.biography_profile_id
      and (bp.user_id = current_user_id() or is_system_role())
  )
);

drop policy if exists policy_insert_own_biography_profile_versions on biography_profile_versions;
create policy policy_insert_own_biography_profile_versions
on biography_profile_versions for insert
with check (
  created_by = current_user_id()
  and exists (
    select 1
    from biography_profiles bp
    where bp.biography_profile_id = biography_profile_versions.biography_profile_id
      and bp.user_id = current_user_id()
  )
);
