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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addons: {
        Row: {
          availability: boolean
          id: number
          label: string
          price: number
        }
        Insert: {
          availability?: boolean
          id?: number
          label: string
          price: number
        }
        Update: {
          availability?: boolean
          id?: number
          label?: string
          price?: number
        }
        Relationships: []
      }
      branches: {
        Row: {
          address: string
          contact_number: string | null
          google_map_url: string
          id: number
          map_img: string
          name: string | null
          schedule: Json | null
          tagline: string | null
        }
        Insert: {
          address: string
          contact_number?: string | null
          google_map_url: string
          id?: number
          map_img: string
          name?: string | null
          schedule?: Json | null
          tagline?: string | null
        }
        Update: {
          address?: string
          contact_number?: string | null
          google_map_url?: string
          id?: number
          map_img?: string
          name?: string | null
          schedule?: Json | null
          tagline?: string | null
        }
        Relationships: []
      }
      category: {
        Row: {
          id: number
          label: string
          sub_category_ids: number[] | null
        }
        Insert: {
          id?: number
          label: string
          sub_category_ids?: number[] | null
        }
        Update: {
          id?: number
          label?: string
          sub_category_ids?: number[] | null
        }
        Relationships: []
      }
      landing_page: {
        Row: {
          ctaLink: string
          ctaText: string
          id: number
          image: string
          subtitle: string | null
          title: string | null
        }
        Insert: {
          ctaLink: string
          ctaText: string
          id?: number
          image: string
          subtitle?: string | null
          title?: string | null
        }
        Update: {
          ctaLink?: string
          ctaText?: string
          id?: number
          image?: string
          subtitle?: string | null
          title?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          availability: boolean
          badge: string | null
          category_id: number
          description: string | null
          id: number
          img: string | null
          is_popular: boolean | null
          name: string
          opt_addons: number[] | null
          req_addons: number[] | null
          sub_category_: number | null
          variant: Json
        }
        Insert: {
          availability?: boolean
          badge?: string | null
          category_id: number
          description?: string | null
          id?: number
          img?: string | null
          is_popular?: boolean | null
          name: string
          opt_addons?: number[] | null
          req_addons?: number[] | null
          sub_category_?: number | null
          variant: Json
        }
        Update: {
          availability?: boolean
          badge?: string | null
          category_id?: number
          description?: string | null
          id?: number
          img?: string | null
          is_popular?: boolean | null
          name?: string
          opt_addons?: number[] | null
          req_addons?: number[] | null
          sub_category_?: number | null
          variant?: Json
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_sub_category__fkey"
            columns: ["sub_category_"]
            isOneToOne: false
            referencedRelation: "sub_category"
            referencedColumns: ["id"]
          },
        ]
      }
      promos: {
        Row: {
          day: string
          description: string | null
          id: number
          img: string | null
          label: string
          time: string | null
        }
        Insert: {
          day: string
          description?: string | null
          id?: number
          img?: string | null
          label: string
          time?: string | null
        }
        Update: {
          day?: string
          description?: string | null
          id?: number
          img?: string | null
          label?: string
          time?: string | null
        }
        Relationships: []
      }
      sub_category: {
        Row: {
          id: number
          label: string
        }
        Insert: {
          id?: number
          label: string
        }
        Update: {
          id?: number
          label?: string
        }
        Relationships: []
      }
      user_types: {
        Row: {
          id: number
          label: string | null
        }
        Insert: {
          id?: number
          label?: string | null
        }
        Update: {
          id?: number
          label?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          id: string
          password: string
          user_type_id: number
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password?: string
          user_type_id: number
          username?: string
        }
        Update: {
          created_at?: string
          id?: string
          password?: string
          user_type_id?: number
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_user_type_id_fkey"
            columns: ["user_type_id"]
            isOneToOne: true
            referencedRelation: "user_types"
            referencedColumns: ["id"]
          },
        ]
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
