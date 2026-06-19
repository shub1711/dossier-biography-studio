alter table biography_profiles
  add column if not exists section_provenance jsonb;
