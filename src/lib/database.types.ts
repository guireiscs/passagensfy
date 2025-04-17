export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      promotions: {
        Row: {
          id: number
          created_at: string
          from: string
          to: string
          price: number
          miles: number | null
          airline: string
          departure_date: string
          return_date: string
          image_url: string
          discount: number
          expires_in: string
          is_premium: boolean
          payment_type: string
          departure_time: string | null
          return_time: string | null
          passengers: number | null
          baggage: string | null
          stopover: string | null
          flight_duration: string | null
          description: string | null
          terms: string[] | null
          user_id: string | null
          title: string | null
          trip_type: string
          travel_class: string
        }
        Insert: {
          id?: number
          created_at?: string
          from: string
          to: string
          price: number
          miles?: number | null
          airline: string
          departure_date: string
          return_date: string
          image_url: string
          discount: number
          expires_in: string
          is_premium: boolean
          payment_type: string
          departure_time?: string | null
          return_time?: string | null
          passengers?: number | null
          baggage?: string | null
          stopover?: string | null
          flight_duration?: string | null
          description?: string | null
          terms?: string[] | null
          user_id?: string | null
          title?: string | null
          trip_type?: string
          travel_class?: string
        }
        Update: {
          id?: number
          created_at?: string
          from?: string
          to?: string
          price?: number
          miles?: number | null
          airline?: string
          departure_date?: string
          return_date?: string
          image_url?: string
          discount?: number
          expires_in?: string
          is_premium?: boolean
          payment_type?: string
          departure_time?: string | null
          return_time?: string | null
          passengers?: number | null
          baggage?: string | null
          stopover?: string | null
          flight_duration?: string | null
          description?: string | null
          terms?: string[] | null
          user_id?: string | null
          title?: string | null
          trip_type?: string
          travel_class?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string
          avatar_url: string | null
          is_premium: boolean
          premium_expires_at: string | null
          phone: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          name: string
          email: string
          avatar_url?: string | null
          is_premium?: boolean
          premium_expires_at?: string | null
          phone?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string
          avatar_url?: string | null
          is_premium?: boolean
          premium_expires_at?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      bookmarks: {
        Row: {
          id: number
          created_at: string
          user_id: string
          promotion_id: number
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          promotion_id: number
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string
          promotion_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          }
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