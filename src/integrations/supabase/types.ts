export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string
          event_at: string | null
          id: string
          location: string
          media_ids: string[]
          publication_status: Database["public"]["Enums"]["content_status"]
          published_at: string | null
          source_notes: string | null
          status: Database["public"]["Enums"]["activity_status"]
          title: string
          updated_at: string
          updated_by: string | null
          verification_status: string
          ward_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          event_at?: string | null
          id?: string
          location?: string
          media_ids?: string[]
          publication_status?: Database["public"]["Enums"]["content_status"]
          published_at?: string | null
          source_notes?: string | null
          status?: Database["public"]["Enums"]["activity_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
          verification_status?: string
          ward_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          event_at?: string | null
          id?: string
          location?: string
          media_ids?: string[]
          publication_status?: Database["public"]["Enums"]["content_status"]
          published_at?: string | null
          source_notes?: string | null
          status?: Database["public"]["Enums"]["activity_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          verification_status?: string
          ward_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      agenda_items: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          item_type: string
          media_id: string | null
          proposed_actions: string
          sort_order: number
          source_notes: string | null
          summary: string
          title: string
          updated_at: string
          updated_by: string | null
          verification_status: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          item_type?: string
          media_id?: string | null
          proposed_actions?: string
          sort_order?: number
          source_notes?: string | null
          summary?: string
          title: string
          updated_at?: string
          updated_by?: string | null
          verification_status?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          item_type?: string
          media_id?: string | null
          proposed_actions?: string
          sort_order?: number
          source_notes?: string | null
          summary?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "agenda_items_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_name: string
          body: string
          category: string
          cover_media_id: string | null
          created_at: string
          created_by: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          summary: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          author_name?: string
          body?: string
          category?: string
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          author_name?: string
          body?: string
          category?: string
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          category: string
          consented_at: string
          contact: string
          created_at: string
          full_name: string
          id: string
          message: string
          status: string
          updated_at: string
          ward_id: string | null
        }
        Insert: {
          category: string
          consented_at: string
          contact: string
          created_at?: string
          full_name: string
          id?: string
          message: string
          status?: string
          updated_at?: string
          ward_id?: string | null
        }
        Update: {
          category?: string
          consented_at?: string
          contact?: string
          created_at?: string
          full_name?: string
          id?: string
          message?: string
          status?: string
          updated_at?: string
          ward_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string
          caption: string | null
          created_at: string
          created_by: string | null
          id: string
          is_published: boolean
          public_url: string
          storage_path: string
          updated_at: string
        }
        Insert: {
          alt_text?: string
          caption?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          public_url: string
          storage_path: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          caption?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          public_url?: string
          storage_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_agent: string | null
          ward: string | null
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_agent?: string | null
          ward?: string | null
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_agent?: string | null
          ward?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          announcement_banner: string | null
          campaign_slogan: string
          candidate_bio: string
          candidate_name: string
          candidate_photo_media_id: string | null
          contact_email: string | null
          election_date: string | null
          footer_text: string
          id: string
          logo_media_id: string | null
          social_links: Json
          updated_at: string
          updated_by: string | null
          whatsapp_number: string | null
        }
        Insert: {
          announcement_banner?: string | null
          campaign_slogan?: string
          candidate_bio?: string
          candidate_name?: string
          candidate_photo_media_id?: string | null
          contact_email?: string | null
          election_date?: string | null
          footer_text?: string
          id?: string
          logo_media_id?: string | null
          social_links?: Json
          updated_at?: string
          updated_by?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          announcement_banner?: string | null
          campaign_slogan?: string
          candidate_bio?: string
          candidate_name?: string
          candidate_photo_media_id?: string | null
          contact_email?: string | null
          election_date?: string | null
          footer_text?: string
          id?: string
          logo_media_id?: string | null
          social_links?: Json
          updated_at?: string
          updated_by?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_candidate_photo_media_id_fkey"
            columns: ["candidate_photo_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_settings_logo_media_id_fkey"
            columns: ["logo_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wards: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      activity_status: "scheduled" | "completed" | "cancelled"
      app_role: "super_admin" | "editor"
      content_status: "draft" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_status: ["scheduled", "completed", "cancelled"],
      app_role: ["super_admin", "editor"],
      content_status: ["draft", "published", "archived"],
    },
  },
} as const
