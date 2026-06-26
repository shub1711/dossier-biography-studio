

-- biography_profiles
drop policy if exists policy_select_own_biography_profile on biography_profiles;
create policy policy_select_own_biography_profile
on biography_profiles for select
using (user_id = current_user_id() or is_system_role());

drop policy if exists policy_insert_own_biography_profile on biography_profiles;
create policy policy_insert_own_biography_profile
on biography_profiles for insert
with check (user_id = current_user_id() and customer_id = customer_id());

drop policy if exists policy_update_own_biography_profile on biography_profiles;
create policy policy_update_own_biography_profile
on biography_profiles for update
using (user_id = current_user_id() or is_system_role())
with check (user_id = current_user_id() or is_system_role());

drop policy if exists policy_delete_own_biography_profile on biography_profiles;
create policy policy_delete_own_biography_profile
on biography_profiles for delete
using (user_id = current_user_id() or is_system_role());

-- llm_jobs
drop policy if exists policy_select_own_llm_jobs on llm_jobs;
create policy policy_select_own_llm_jobs
on llm_jobs for select
using (user_id = current_user_id() or is_system_role());

drop policy if exists policy_insert_own_llm_jobs on llm_jobs;
create policy policy_insert_own_llm_jobs
on llm_jobs for insert
with check (user_id = current_user_id() and customer_id = customer_id());

drop policy if exists policy_update_own_llm_jobs on llm_jobs;
create policy policy_update_own_llm_jobs
on llm_jobs for update
using (user_id = current_user_id() or is_system_role())
with check (user_id = current_user_id() or is_system_role());
