create table if not exists biography_profiles (
  biography_profile_id uuid primary key default gen_random_uuid(),
  customer_id uuid not null,
  user_id uuid not null,
  source_type text not null,
  source_url text,
  source_text text,
  subject_name text,
  personal_overview text,
  origin_story text,
  career_journey text,
  current_focus text,
  areas_of_expertise text,
  notable_achievements text,
  career_highlights text,
  personal_interests text,
  section_provenance jsonb,
  biography_job_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  constraint foreign_key_biography_profiles_customers_customer_id
    foreign key (customer_id) references customers(customer_id),
  constraint foreign_key_biography_profiles_users_user_id
    foreign key (user_id) references users(user_id),
  constraint foreign_key_biography_profiles_llm_jobs_biography_job_id
    foreign key (biography_job_id) references llm_jobs(llm_job_id),
  constraint foreign_key_biography_profiles_created_by_users_user_id
    foreign key (created_by) references users(user_id),
  constraint foreign_key_biography_profiles_updated_by_users_user_id
    foreign key (updated_by) references users(user_id),
  constraint foreign_key_biography_profiles_deleted_by_users_user_id
    foreign key (deleted_by) references users(user_id),
  constraint unique_biography_profiles_user_id unique (user_id),
  constraint check_biography_profiles_source_type_valid
    check (source_type in ('profile_url', 'pasted_text')),
  constraint check_biography_profiles_source_url_format
    check (source_url is null or source_url ~* '^https?://')
);

create index if not exists index_biography_profiles_user_id on biography_profiles(user_id);
create index if not exists index_biography_profiles_customer_id on biography_profiles(customer_id);
create index if not exists index_biography_profiles_biography_job_id on biography_profiles(biography_job_id);

alter table biography_profiles enable row level security;

drop policy if exists policy_select_own_biography_profile on biography_profiles;
create policy policy_select_own_biography_profile
on biography_profiles for select
using (user_id = current_user_id() or can_access_customer(customer_id));

drop policy if exists policy_insert_own_biography_profile on biography_profiles;
create policy policy_insert_own_biography_profile
on biography_profiles for insert
with check (user_id = current_user_id() and customer_id = customer_id());

drop policy if exists policy_update_own_biography_profile on biography_profiles;
create policy policy_update_own_biography_profile
on biography_profiles for update
using (user_id = current_user_id() or can_access_customer(customer_id));

drop policy if exists policy_delete_own_biography_profile on biography_profiles;
create policy policy_delete_own_biography_profile
on biography_profiles for delete
using (user_id = current_user_id() or is_system_role());
