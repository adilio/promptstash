// Database types
export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string;
          created_at?: string;
        };
      };
      memberships: {
        Row: {
          team_id: string;
          user_id: string;
          role: 'owner' | 'editor' | 'viewer';
          created_at: string;
        };
        Insert: {
          team_id: string;
          user_id: string;
          role: 'owner' | 'editor' | 'viewer';
          created_at?: string;
        };
        Update: {
          team_id?: string;
          user_id?: string;
          role?: 'owner' | 'editor' | 'viewer';
          created_at?: string;
        };
      };
      folders: {
        Row: {
          id: string;
          team_id: string;
          parent_id: string | null;
          name: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          parent_id?: string | null;
          name: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          parent_id?: string | null;
          name?: string;
          created_by?: string;
          created_at?: string;
        };
      };
      prompts: {
        Row: {
          id: string;
          team_id: string;
          folder_id: string | null;
          owner_id: string;
          title: string;
          body_md: string;
          visibility: 'private' | 'team' | 'public';
          public_slug: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          folder_id?: string | null;
          owner_id: string;
          title: string;
          body_md: string;
          visibility?: 'private' | 'team' | 'public';
          public_slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          folder_id?: string | null;
          owner_id?: string;
          title?: string;
          body_md?: string;
          visibility?: 'private' | 'team' | 'public';
          public_slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      prompt_versions: {
        Row: {
          id: string;
          prompt_id: string;
          version: number;
          body_md: string;
          edited_by: string;
          edited_at: string;
        };
        Insert: {
          id?: string;
          prompt_id: string;
          version: number;
          body_md: string;
          edited_by: string;
          edited_at?: string;
        };
        Update: {
          id?: string;
          prompt_id?: string;
          version?: number;
          body_md?: string;
          edited_by?: string;
          edited_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          name: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          name?: string;
          created_by?: string;
          created_at?: string;
        };
      };
      prompt_tags: {
        Row: {
          prompt_id: string;
          tag_id: string;
        };
        Insert: {
          prompt_id: string;
          tag_id: string;
        };
        Update: {
          prompt_id?: string;
          tag_id?: string;
        };
      };
      shares: {
        Row: {
          id: string;
          prompt_id: string;
          target_user: string;
          permission: 'view' | 'edit';
          created_at: string;
        };
        Insert: {
          id?: string;
          prompt_id: string;
          target_user: string;
          permission: 'view' | 'edit';
          created_at?: string;
        };
        Update: {
          id?: string;
          prompt_id?: string;
          target_user?: string;
          permission?: 'view' | 'edit';
          created_at?: string;
        };
      };
    };
  };
}

// App types
export type Team = Database['public']['Tables']['teams']['Row'];
export type Membership = Database['public']['Tables']['memberships']['Row'];
export type Folder = Database['public']['Tables']['folders']['Row'];
export type Prompt = Database['public']['Tables']['prompts']['Row'];
export type PromptVersion = Database['public']['Tables']['prompt_versions']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type PromptTag = Database['public']['Tables']['prompt_tags']['Row'];
export type Share = Database['public']['Tables']['shares']['Row'];

export type PromptWithTags = Prompt & {
  tags?: Tag[];
};
