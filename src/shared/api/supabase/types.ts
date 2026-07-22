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
      guesthouses: {
        Row: {
          address: string
          check_in: string
          check_out: string
          contact: string | null
          created_at: string
          description: string
          id: string
          images: string[]
          latitude: number
          longitude: number
          name: string
          naver: string | null
          parking: boolean
          party: boolean
          region: Database["public"]["Enums"]["REGION"]
          sns: string | null
          status: Database["public"]["Enums"]["STATUS"]
          wishlisted_count: number
        }
        Insert: {
          address: string
          check_in: string
          check_out: string
          contact?: string | null
          created_at?: string
          description: string
          id?: string
          images?: string[]
          latitude: number
          longitude: number
          name: string
          naver?: string | null
          parking: boolean
          party: boolean
          region: Database["public"]["Enums"]["REGION"]
          sns?: string | null
          status: Database["public"]["Enums"]["STATUS"]
          wishlisted_count?: number
        }
        Update: {
          address?: string
          check_in?: string
          check_out?: string
          contact?: string | null
          created_at?: string
          description?: string
          id?: string
          images?: string[]
          latitude?: number
          longitude?: number
          name?: string
          naver?: string | null
          parking?: boolean
          party?: boolean
          region?: Database["public"]["Enums"]["REGION"]
          sns?: string | null
          status?: Database["public"]["Enums"]["STATUS"]
          wishlisted_count?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          email: string | null
          id: string
          nickname: string
          provider: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          id: string
          nickname: string
          provider: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nickname?: string
          provider?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string
          created_at: string
          guesthouse_id: string
          id: string
          images: string[]
          rating: number
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          guesthouse_id: string
          id?: string
          images?: string[]
          rating: number
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          guesthouse_id?: string
          id?: string
          images?: string[]
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_guesthouse_id_fkey"
            columns: ["guesthouse_id"]
            isOneToOne: false
            referencedRelation: "guesthouses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_guesthouse_id_fkey"
            columns: ["guesthouse_id"]
            isOneToOne: false
            referencedRelation: "vw_guesthouses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          base_capacity: number
          base_price: number
          bathroom: boolean
          beds: Json
          created_at: string
          description: string
          extra_person_fee: number
          guesthouse_id: string
          id: string
          images: string[]
          max_capacity: number
          name: string
          room_type: Database["public"]["Enums"]["ROOM_TYPE"]
        }
        Insert: {
          base_capacity: number
          base_price: number
          bathroom: boolean
          beds: Json
          created_at?: string
          description: string
          extra_person_fee?: number
          guesthouse_id: string
          id?: string
          images?: string[]
          max_capacity: number
          name: string
          room_type: Database["public"]["Enums"]["ROOM_TYPE"]
        }
        Update: {
          base_capacity?: number
          base_price?: number
          bathroom?: boolean
          beds?: Json
          created_at?: string
          description?: string
          extra_person_fee?: number
          guesthouse_id?: string
          id?: string
          images?: string[]
          max_capacity?: number
          name?: string
          room_type?: Database["public"]["Enums"]["ROOM_TYPE"]
        }
        Relationships: [
          {
            foreignKeyName: "rooms_guesthouse_id_fkey"
            columns: ["guesthouse_id"]
            isOneToOne: false
            referencedRelation: "guesthouses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_guesthouse_id_fkey"
            columns: ["guesthouse_id"]
            isOneToOne: false
            referencedRelation: "vw_guesthouses"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_items: {
        Row: {
          created_at: string
          guesthouse_id: string
          id: string
          user_id: string
          wishlist_id: string
        }
        Insert: {
          created_at?: string
          guesthouse_id: string
          id?: string
          user_id?: string
          wishlist_id: string
        }
        Update: {
          created_at?: string
          guesthouse_id?: string
          id?: string
          user_id?: string
          wishlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_guesthouse_id_fkey"
            columns: ["guesthouse_id"]
            isOneToOne: false
            referencedRelation: "guesthouses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_guesthouse_id_fkey"
            columns: ["guesthouse_id"]
            isOneToOne: false
            referencedRelation: "vw_guesthouses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_wishlist_id_fkey"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "vw_wishlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_wishlist_id_fkey"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "wishlists"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          base: boolean
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          base?: boolean
          created_at?: string
          id?: string
          name: string
          user_id?: string
        }
        Update: {
          base?: boolean
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vw_guesthouses: {
        Row: {
          address: string | null
          avg_rating: number | null
          check_in: string | null
          check_out: string | null
          contact: string | null
          created_at: string | null
          description: string | null
          id: string | null
          images: string[] | null
          latitude: number | null
          longitude: number | null
          min_price: number | null
          name: string | null
          naver: string | null
          parking: boolean | null
          party: boolean | null
          region: Database["public"]["Enums"]["REGION"] | null
          review_count: number | null
          sns: string | null
          status: Database["public"]["Enums"]["STATUS"] | null
          wishlisted_count: number | null
        }
        Relationships: []
      }
      vw_wishlists: {
        Row: {
          base: boolean | null
          created_at: string | null
          id: string | null
          item_count: number | null
          name: string | null
          thumbnails: string[] | null
          user_id: string | null
        }
        Insert: {
          base?: boolean | null
          created_at?: string | null
          id?: string | null
          item_count?: never
          name?: string | null
          thumbnails?: never
          user_id?: string | null
        }
        Update: {
          base?: boolean | null
          created_at?: string | null
          id?: string | null
          item_count?: never
          name?: string | null
          thumbnails?: never
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_random_nickname: { Args: never; Returns: string }
      search_guesthouses: {
        Args: {
          p_guests?: number
          p_keyword?: string
          p_limit?: number
          p_max_price?: number
          p_min_price?: number
          p_offset?: number
          p_parking?: boolean
          p_party?: boolean
          p_regions?: Database["public"]["Enums"]["REGION"][]
        }
        Returns: Json
      }
    }
    Enums: {
      REGION:
        | "JEJU_CITY"
        | "JOCHEON"
        | "GUJWA"
        | "UDO"
        | "SEONGSAN"
        | "PYOSEON"
        | "NAMWON"
        | "SEOGWIPO_CITY"
        | "JUNGMUN"
        | "ANDEOK"
        | "DAEJEONG"
        | "HANGYEONG"
        | "HALLIM"
        | "AEWOL"
      ROOM_TYPE: "PRIVATE" | "DORMITORY"
      STATUS: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED"
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
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
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
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
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
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
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
      REGION: [
        "JEJU_CITY",
        "JOCHEON",
        "GUJWA",
        "UDO",
        "SEONGSAN",
        "PYOSEON",
        "NAMWON",
        "SEOGWIPO_CITY",
        "JUNGMUN",
        "ANDEOK",
        "DAEJEONG",
        "HANGYEONG",
        "HALLIM",
        "AEWOL",
      ],
      ROOM_TYPE: ["PRIVATE", "DORMITORY"],
      STATUS: ["PENDING", "APPROVED", "REJECTED", "CLOSED"],
    },
  },
} as const
