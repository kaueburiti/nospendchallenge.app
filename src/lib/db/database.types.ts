export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string;
          description: string;
          id: number;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: never;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: never;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: number;
          name: Database['public']['Enums']['category'];
        };
        Insert: {
          id?: number;
          name: Database['public']['Enums']['category'];
        };
        Update: {
          id?: number;
          name?: Database['public']['Enums']['category'];
        };
        Relationships: [];
      };
      challenge_activities: {
        Row: {
          challenge_id: number;
          created_at: string;
          description: string;
          id: number;
          title: string;
          user_id: string;
        };
        Insert: {
          challenge_id: number;
          created_at?: string;
          description: string;
          id?: number;
          title: string;
          user_id: string;
        };
        Update: {
          challenge_id?: number;
          created_at?: string;
          description?: string;
          id?: number;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'challenge_activities_challenge_id_fkey';
            columns: ['challenge_id'];
            isOneToOne: false;
            referencedRelation: 'challenges';
            referencedColumns: ['id'];
          },
        ];
      };
      challenge_chat_messages: {
        Row: {
          challenge_id: number;
          created_at: string;
          id: string;
          message: string;
          profile_id: string;
          updated_at: string | null;
        };
        Insert: {
          challenge_id: number;
          created_at?: string;
          id?: string;
          message: string;
          profile_id: string;
          updated_at?: string | null;
        };
        Update: {
          challenge_id?: number;
          created_at?: string;
          id?: string;
          message?: string;
          profile_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'challenge_chat_messages_challenge_id_fkey';
            columns: ['challenge_id'];
            isOneToOne: false;
            referencedRelation: 'challenges';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'challenge_chat_messages_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      challenge_invitations: {
        Row: {
          challenge_id: number;
          created_at: string;
          id: number;
          invitee_email: string;
          inviter_id: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          challenge_id: number;
          created_at?: string;
          id?: number;
          invitee_email: string;
          inviter_id: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          challenge_id?: number;
          created_at?: string;
          id?: number;
          invitee_email?: string;
          inviter_id?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'challenge_invitations_challenge_id_fkey';
            columns: ['challenge_id'];
            isOneToOne: false;
            referencedRelation: 'challenges';
            referencedColumns: ['id'];
          },
        ];
      };
      challenge_participants: {
        Row: {
          challenge_id: number;
          id: number;
          joined_at: string;
          user_id: string;
        };
        Insert: {
          challenge_id: number;
          id?: number;
          joined_at?: string;
          user_id: string;
        };
        Update: {
          challenge_id?: number;
          id?: number;
          joined_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'challenge_participants_challenge_id_fkey';
            columns: ['challenge_id'];
            isOneToOne: false;
            referencedRelation: 'challenges';
            referencedColumns: ['id'];
          },
        ];
      };
      challenges: {
        Row: {
          cover: string | null;
          created_at: string;
          description: string | null;
          end_date: string;
          id: number;
          owner_id: string;
          start_date: string;
          title: string;
          token: string | null;
        };
        Insert: {
          cover?: string | null;
          created_at?: string;
          description?: string | null;
          end_date: string;
          id?: number;
          owner_id: string;
          start_date: string;
          title: string;
          token?: string | null;
        };
        Update: {
          cover?: string | null;
          created_at?: string;
          description?: string | null;
          end_date?: string;
          id?: number;
          owner_id?: string;
          start_date?: string;
          title?: string;
          token?: string | null;
        };
        Relationships: [];
      };
      checks: {
        Row: {
          challenge_id: number;
          created_at: string;
          date: string;
          id: number;
          message: string | null;
          saved_amount: number | null;
          user_id: string;
        };
        Insert: {
          challenge_id: number;
          created_at?: string;
          date: string;
          id?: number;
          message?: string | null;
          saved_amount?: number | null;
          user_id: string;
        };
        Update: {
          challenge_id?: number;
          created_at?: string;
          date?: string;
          id?: number;
          message?: string | null;
          saved_amount?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'checks_challenge_id_fkey';
            columns: ['challenge_id'];
            isOneToOne: false;
            referencedRelation: 'challenges';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'checks_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      data: {
        Row: {
          created_at: string | null;
          description: string | null;
          featured: boolean;
          href: string;
          id: string;
          name: string;
          src: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          featured?: boolean;
          href: string;
          id?: string;
          name: string;
          src: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          featured?: boolean;
          href?: string;
          id?: string;
          name?: string;
          src?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      data_categories: {
        Row: {
          category_id: number;
          data_id: string;
        };
        Insert: {
          category_id: number;
          data_id: string;
        };
        Update: {
          category_id?: number;
          data_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'data_categories_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'data_categories_data_id_fkey';
            columns: ['data_id'];
            isOneToOne: false;
            referencedRelation: 'data';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      wishlist_items: {
        Row: {
          cost: number;
          created_at: string;
          description: string | null;
          id: number;
          name: string;
          photo: string | null;
          updated_at: string;
          wishlist_id: number;
        };
        Insert: {
          cost: number;
          created_at?: string;
          description?: string | null;
          id?: number;
          name: string;
          photo?: string | null;
          updated_at?: string;
          wishlist_id: number;
        };
        Update: {
          cost?: number;
          created_at?: string;
          description?: string | null;
          id?: number;
          name?: string;
          photo?: string | null;
          updated_at?: string;
          wishlist_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'wishlist_items_wishlist_id_fkey';
            columns: ['wishlist_id'];
            isOneToOne: false;
            referencedRelation: 'wishlists';
            referencedColumns: ['id'];
          },
        ];
      };
      wishlists: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_challenge_token: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_challenge_by_token: {
        Args: {
          token_param: string;
        };
        Returns: {
          cover: string | null;
          created_at: string;
          description: string | null;
          end_date: string;
          id: number;
          owner_id: string;
          start_date: string;
          title: string;
          token: string | null;
        }[];
      };
      get_challenge_total_days: {
        Args: {
          challenge_row: unknown;
        };
        Returns: number;
      };
      get_challenge_total_savings: {
        Args: {
          challenge_id_param: number;
        };
        Returns: number;
      };
      get_challenge_total_spent: {
        Args: {
          challenge_id_param: number;
        };
        Returns: number;
      };
      join_challenge_by_token: {
        Args: {
          token_param: string;
          user_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      category:
        | 'Development'
        | 'Productivity'
        | 'Artificial Intelligence'
        | 'SEO'
        | 'Design'
        | 'Communication'
        | 'Others';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
