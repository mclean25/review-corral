-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

GRANT ALL ON TABLE public.users TO anon;

GRANT ALL ON TABLE public.users TO postgres;

GRANT ALL ON TABLE public.users TO supabase_admin;

GRANT ALL ON TABLE public.users TO authenticated;

GRANT ALL ON TABLE public.users TO service_role;

COMMENT ON TABLE public.users
    IS '1:1 mapping with auth.users';

CREATE TABLE IF NOT EXISTS public.users_and_teams
(
    "user" uuid NOT NULL,
    team uuid NOT NULL,
    CONSTRAINT users_and_teams_pkey PRIMARY KEY ("user", team),
    CONSTRAINT users_and_teams_team_fkey FOREIGN KEY (team)
        REFERENCES public.team (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_and_teams_user_fkey FOREIGN KEY ("user")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

GRANT ALL ON TABLE public.users_and_teams TO anon;

GRANT ALL ON TABLE public.users_and_teams TO postgres;

GRANT ALL ON TABLE public.users_and_teams TO supabase_admin;

GRANT ALL ON TABLE public.users_and_teams TO authenticated;

GRANT ALL ON TABLE public.users_and_teams TO service_role;

REVOKE ALL ON TABLE public.github_integration FROM authenticated;
REVOKE ALL ON TABLE public.github_integration FROM postgres;
REVOKE ALL ON TABLE public.github_integration FROM service_role;
GRANT ALL ON TABLE public.github_integration TO authenticated;

GRANT ALL ON TABLE public.github_integration TO postgres;

GRANT ALL ON TABLE public.github_integration TO service_role;

REVOKE ALL ON TABLE public.pull_requests FROM authenticated;
REVOKE ALL ON TABLE public.pull_requests FROM postgres;
REVOKE ALL ON TABLE public.pull_requests FROM service_role;
GRANT ALL ON TABLE public.pull_requests TO authenticated;

GRANT ALL ON TABLE public.pull_requests TO postgres;

GRANT ALL ON TABLE public.pull_requests TO service_role;

REVOKE ALL ON TABLE public.slack_integration FROM authenticated;
REVOKE ALL ON TABLE public.slack_integration FROM postgres;
REVOKE ALL ON TABLE public.slack_integration FROM service_role;
GRANT ALL ON TABLE public.slack_integration TO authenticated;

GRANT ALL ON TABLE public.slack_integration TO postgres;

GRANT ALL ON TABLE public.slack_integration TO service_role;

ALTER TABLE IF EXISTS public.slack_integration
    ALTER COLUMN team DROP DEFAULT;

ALTER TABLE IF EXISTS public.slack_integration
    ALTER COLUMN team DROP NOT NULL;

REVOKE ALL ON TABLE public.username_mappings FROM authenticated;
REVOKE ALL ON TABLE public.username_mappings FROM postgres;
REVOKE ALL ON TABLE public.username_mappings FROM service_role;
GRANT ALL ON TABLE public.username_mappings TO authenticated;

GRANT ALL ON TABLE public.username_mappings TO service_role;

GRANT ALL ON TABLE public.username_mappings TO postgres;

REVOKE ALL ON TABLE public.team FROM authenticated;
REVOKE ALL ON TABLE public.team FROM postgres;
REVOKE ALL ON TABLE public.team FROM service_role;
GRANT ALL ON TABLE public.team TO authenticated;

GRANT ALL ON TABLE public.team TO postgres;

GRANT ALL ON TABLE public.team TO service_role;

ALTER TABLE public.team
    ALTER COLUMN name TYPE text COLLATE pg_catalog."default";
ALTER TABLE IF EXISTS public.team
    ALTER COLUMN name DROP DEFAULT;

ALTER TABLE IF EXISTS public.team
    ALTER COLUMN name SET NOT NULL;

ALTER TABLE IF EXISTS public.team
    ALTER COLUMN name SET STORAGE EXTENDED;