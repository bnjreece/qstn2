export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
          is_complete: boolean
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          created_at?: string
          updated_at?: string
          is_complete?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
          is_complete?: boolean
        }
      }
      document_sections: {
        Row: {
          id: string
          document_id: string
          section_type: string
          content: Json
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_id: string
          section_type: string
          content?: Json
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          section_type?: string
          content?: Json
          order_index?: number
          created_at?: string
          updated_at?: string
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