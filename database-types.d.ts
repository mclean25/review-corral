export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      github_integration: {
        Row: {
          team_id: string
          access_token: string
          id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          team_id: string
          access_token: string
          id?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          team_id?: string
          access_token?: string
          id?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      github_repositories: {
        Row: {
          repository_name: string
          id: string
          created_at: string | null
          installation_id: number
          updated_at: string | null
          repository_id: number
          is_active: boolean
          organization_id: string
        }
        Insert: {
          repository_name: string
          id?: string
          created_at?: string | null
          installation_id: number
          updated_at?: string | null
          repository_id: number
          is_active?: boolean
          organization_id: string
        }
        Update: {
          repository_name?: string
          id?: string
          created_at?: string | null
          installation_id?: number
          updated_at?: string | null
          repository_id?: number
          is_active?: boolean
          organization_id?: string
        }
      }
      organizations: {
        Row: {
          account_name: string
          account_id: number
          installation_id: number
          avatar_url: string
          id: string
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          account_name: string
          account_id: number
          installation_id: number
          avatar_url: string
          id?: string
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          account_name?: string
          account_id?: number
          installation_id?: number
          avatar_url?: string
          id?: string
          updated_at?: string | null
          created_at?: string | null
        }
      }
      pull_requests: {
        Row: {
          thread_ts: string
          created_at: string | null
          pr_id: string
          id: string
          organization_id: string | null
        }
        Insert: {
          thread_ts: string
          created_at?: string | null
          pr_id: string
          id?: string
          organization_id?: string | null
        }
        Update: {
          thread_ts?: string
          created_at?: string | null
          pr_id?: string
          id?: string
          organization_id?: string | null
        }
      }
      slack_integration: {
        Row: {
          id: string
          channel_name: string
          team_id: string | null
          channel_id: string
          slack_team_name: string
          slack_team_id: string
          organization_id: string
          created_at: string
          updated_at: string
          access_token: string
        }
        Insert: {
          id?: string
          channel_name: string
          team_id?: string | null
          channel_id: string
          slack_team_name: string
          slack_team_id: string
          organization_id: string
          created_at?: string
          updated_at?: string
          access_token: string
        }
        Update: {
          id?: string
          channel_name?: string
          team_id?: string | null
          channel_id?: string
          slack_team_name?: string
          slack_team_id?: string
          organization_id?: string
          created_at?: string
          updated_at?: string
          access_token?: string
        }
      }
      team: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          installation_id: string | null
          installation_image_url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          installation_id?: string | null
          installation_image_url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          installation_id?: string | null
          installation_image_url?: string | null
        }
      }
      username_mappings: {
        Row: {
          github_username: string
          id: string
          created_at: string | null
          slack_user_id: string
          organization_id: string | null
          updated_at: string | null
        }
        Insert: {
          github_username: string
          id?: string
          created_at?: string | null
          slack_user_id: string
          organization_id?: string | null
          updated_at?: string | null
        }
        Update: {
          github_username?: string
          id?: string
          created_at?: string | null
          slack_user_id?: string
          organization_id?: string | null
          updated_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string | null
          email: string | null
          gh_access_token: string | null
          gh_refresh_token: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          email?: string | null
          gh_access_token?: string | null
          gh_refresh_token?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          email?: string | null
          gh_access_token?: string | null
          gh_refresh_token?: string | null
          updated_at?: string | null
        }
      }
      users_and_organizations: {
        Row: {
          user_id: string
          org_id: string
          id: string
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          user_id: string
          org_id: string
          id?: string
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          user_id?: string
          org_id?: string
          id?: string
          updated_at?: string | null
          created_at?: string | null
        }
      }
      users_and_teams: {
        Row: {
          user: string
          team: string
        }
        Insert: {
          user: string
          team: string
        }
        Update: {
          user?: string
          team?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
