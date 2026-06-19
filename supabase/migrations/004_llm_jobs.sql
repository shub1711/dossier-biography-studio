create table if not exists llm_jobs (
  llm_job_id uuid primary key default gen_random_uuid(),
  customer_id uuid not null,
  user_id uuid not null,
  job_type text not null,
  status text not null default 'queued',
  input_ref jsonb,
  result_ref jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz,
  constraint foreign_key_llm_jobs_customers_customer_id
    foreign key (customer_id) references customers(customer_id),
  constraint foreign_key_llm_jobs_users_user_id
    foreign key (user_id) references users(user_id),
  constraint check_llm_jobs_status_valid
    check (status in ('queued', 'running', 'waiting_llm', 'completed', 'failed'))
);

create index if not exists index_llm_jobs_customer_id on llm_jobs(customer_id);
create index if not exists index_llm_jobs_user_id on llm_jobs(user_id);
create index if not exists index_llm_jobs_status on llm_jobs(status);

alter table llm_jobs enable row level security;

drop policy if exists policy_select_own_llm_jobs on llm_jobs;
create policy policy_select_own_llm_jobs
on llm_jobs for select
using (user_id = current_user_id() or can_access_customer(customer_id));

drop policy if exists policy_insert_own_llm_jobs on llm_jobs;
create policy policy_insert_own_llm_jobs
on llm_jobs for insert
with check (user_id = current_user_id() and customer_id = customer_id());

drop policy if exists policy_update_own_llm_jobs on llm_jobs;
create policy policy_update_own_llm_jobs
on llm_jobs for update
using (user_id = current_user_id() or can_access_customer(customer_id));
