create table organizations (
  id bigserial primary key,
  org_name text not null,
  email text not null,
  address text,
  contact text,
  website text,
  industry_type text,
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  primary_contact_designation text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (recommended for Supabase)
alter table organizations enable row level security;

-- Allow insert for all users (including anon)
create policy "Allow insert for all organizations"
  on organizations
  for insert
  with check (true);