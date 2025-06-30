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
      agent_packages: {
        Row: {
          agent_count: number | null
          created_at: string
          description: string | null
          file_path: string
          file_size: number | null
          id: string
          name: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_count?: number | null
          created_at?: string
          description?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_count?: number | null
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_templates: {
        Row: {
          category: string | null
          configuration: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          prompt_template: string | null
          rating: number | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          category?: string | null
          configuration?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          prompt_template?: string | null
          rating?: number | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          category?: string | null
          configuration?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          prompt_template?: string | null
          rating?: number | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          automation_rules: Json | null
          calendar_config: Json | null
          configuration: Json | null
          created_at: string | null
          description: string | null
          id: string
          meta_integration_config: Json | null
          n8n_workflow_id: string | null
          name: string
          performance_metrics: Json | null
          prompt_template: string | null
          response_templates: Json | null
          sms_config: Json | null
          status: Database["public"]["Enums"]["agent_status"] | null
          updated_at: string | null
          user_id: string
          voice_config: Json | null
        }
        Insert: {
          automation_rules?: Json | null
          calendar_config?: Json | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          meta_integration_config?: Json | null
          n8n_workflow_id?: string | null
          name: string
          performance_metrics?: Json | null
          prompt_template?: string | null
          response_templates?: Json | null
          sms_config?: Json | null
          status?: Database["public"]["Enums"]["agent_status"] | null
          updated_at?: string | null
          user_id: string
          voice_config?: Json | null
        }
        Update: {
          automation_rules?: Json | null
          calendar_config?: Json | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          meta_integration_config?: Json | null
          n8n_workflow_id?: string | null
          name?: string
          performance_metrics?: Json | null
          prompt_template?: string | null
          response_templates?: Json | null
          sms_config?: Json | null
          status?: Database["public"]["Enums"]["agent_status"] | null
          updated_at?: string | null
          user_id?: string
          voice_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_logs: {
        Row: {
          action_type: string
          details: Json | null
          executed_at: string
          id: string
          lead_id: string | null
          rule_id: string
          status: string
          user_id: string
        }
        Insert: {
          action_type: string
          details?: Json | null
          executed_at?: string
          id?: string
          lead_id?: string | null
          rule_id: string
          status?: string
          user_id: string
        }
        Update: {
          action_type?: string
          details?: Json | null
          executed_at?: string
          id?: string
          lead_id?: string | null
          rule_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          action: Json
          created_at: string
          delay: number
          description: string | null
          id: string
          is_active: boolean
          name: string
          trigger: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          action?: Json
          created_at?: string
          delay?: number
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          trigger?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: Json
          created_at?: string
          delay?: number
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          trigger?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      communications: {
        Row: {
          agent_id: string | null
          content: string | null
          cost_cents: number | null
          created_at: string | null
          direction: string | null
          external_id: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          status: string | null
          type: Database["public"]["Enums"]["communication_type"]
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          content?: string | null
          cost_cents?: number | null
          created_at?: string | null
          direction?: string | null
          external_id?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          status?: string | null
          type: Database["public"]["Enums"]["communication_type"]
          user_id: string
        }
        Update: {
          agent_id?: string | null
          content?: string | null
          cost_cents?: number | null
          created_at?: string | null
          direction?: string | null
          external_id?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          status?: string | null
          type?: Database["public"]["Enums"]["communication_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_analysis: {
        Row: {
          ad_data: Json | null
          competitor_name: string
          created_at: string | null
          id: string
          insights: Json | null
          scraped_at: string | null
          user_id: string
        }
        Insert: {
          ad_data?: Json | null
          competitor_name: string
          created_at?: string | null
          id?: string
          insights?: Json | null
          scraped_at?: string | null
          user_id: string
        }
        Update: {
          ad_data?: Json | null
          competitor_name?: string
          created_at?: string | null
          id?: string
          insights?: Json | null
          scraped_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitor_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      container_events: {
        Row: {
          container_id: string
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          user_id: string
          workflow_id: string | null
        }
        Insert: {
          container_id: string
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          user_id: string
          workflow_id?: string | null
        }
        Update: {
          container_id?: string
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
          workflow_id?: string | null
        }
        Relationships: []
      }
      credential_access_logs: {
        Row: {
          action: string
          id: string
          ip_address: string | null
          service_name: string
          timestamp: string
          user_id: string
        }
        Insert: {
          action: string
          id?: string
          ip_address?: string | null
          service_name: string
          timestamp?: string
          user_id: string
        }
        Update: {
          action?: string
          id?: string
          ip_address?: string | null
          service_name?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      deployment_logs: {
        Row: {
          agent_id: string | null
          container_id: string
          deployment_time: string
          id: string
          metadata: Json | null
          status: string
          template_id: string | null
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          container_id: string
          deployment_time?: string
          id?: string
          metadata?: Json | null
          status?: string
          template_id?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string | null
          container_id?: string
          deployment_time?: string
          id?: string
          metadata?: Json | null
          status?: string
          template_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deployment_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deployment_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "agent_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      extracted_workflows: {
        Row: {
          created_at: string
          id: string
          package_id: string
          status: string | null
          template_id: string | null
          updated_at: string
          workflow_data: Json
          workflow_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          package_id: string
          status?: string | null
          template_id?: string | null
          updated_at?: string
          workflow_data: Json
          workflow_name: string
        }
        Update: {
          created_at?: string
          id?: string
          package_id?: string
          status?: string | null
          template_id?: string | null
          updated_at?: string
          workflow_data?: Json
          workflow_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "extracted_workflows_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "agent_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extracted_workflows_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "agent_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          configuration: Json | null
          created_at: string | null
          credentials: Json | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          name: string
          type: Database["public"]["Enums"]["integration_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          credentials?: Json | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          name: string
          type: Database["public"]["Enums"]["integration_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          credentials?: Json | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          name?: string
          type?: Database["public"]["Enums"]["integration_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          agent_id: string | null
          converted_at: string | null
          created_at: string | null
          custom_fields: Json | null
          email: string | null
          first_name: string | null
          id: string
          last_contacted_at: string | null
          last_name: string | null
          meta_ad_id: string | null
          meta_form_id: string | null
          notes: string | null
          phone: string | null
          score: number | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          converted_at?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_contacted_at?: string | null
          last_name?: string | null
          meta_ad_id?: string | null
          meta_form_id?: string | null
          notes?: string | null
          phone?: string | null
          score?: number | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string | null
          converted_at?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_contacted_at?: string | null
          last_name?: string | null
          meta_ad_id?: string | null
          meta_form_id?: string | null
          notes?: string | null
          phone?: string | null
          score?: number | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          onboarding_completed: boolean | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_tracking: {
        Row: {
          agents_deployed: number | null
          created_at: string | null
          id: string
          leads_processed: number | null
          period_end: string
          period_start: string
          sms_sent: number | null
          subscription_id: string | null
          total_cost_cents: number | null
          user_id: string
          voice_calls_made: number | null
        }
        Insert: {
          agents_deployed?: number | null
          created_at?: string | null
          id?: string
          leads_processed?: number | null
          period_end: string
          period_start: string
          sms_sent?: number | null
          subscription_id?: string | null
          total_cost_cents?: number | null
          user_id: string
          voice_calls_made?: number | null
        }
        Update: {
          agents_deployed?: number | null
          created_at?: string | null
          id?: string
          leads_processed?: number | null
          period_end?: string
          period_start?: string
          sms_sent?: number | null
          subscription_id?: string | null
          total_cost_cents?: number | null
          user_id?: string
          voice_calls_made?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_tracking_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_containers: {
        Row: {
          container_id: string
          container_url: string | null
          created_at: string
          deployed_at: string | null
          id: string
          last_deployed_at: string | null
          last_restart_at: string | null
          region: string
          resources: Json | null
          status: string
          stopped_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          container_id: string
          container_url?: string | null
          created_at?: string
          deployed_at?: string | null
          id?: string
          last_deployed_at?: string | null
          last_restart_at?: string | null
          region?: string
          resources?: Json | null
          status?: string
          stopped_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          container_id?: string
          container_url?: string | null
          created_at?: string
          deployed_at?: string | null
          id?: string
          last_deployed_at?: string | null
          last_restart_at?: string | null
          region?: string
          resources?: Json | null
          status?: string
          stopped_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_credentials: {
        Row: {
          created_at: string
          encrypted_credentials: string
          id: string
          service_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          encrypted_credentials: string
          id?: string
          service_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          encrypted_credentials?: string
          id?: string
          service_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agent_status: "draft" | "active" | "paused" | "archived"
      communication_type: "sms" | "voice" | "email"
      integration_type:
        | "meta_ads"
        | "google_ads"
        | "calendly"
        | "zapier"
        | "webhooks"
      lead_status: "new" | "contacted" | "qualified" | "converted" | "lost"
      subscription_plan: "starter" | "professional" | "enterprise"
      subscription_status: "active" | "canceled" | "past_due" | "incomplete"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_status: ["draft", "active", "paused", "archived"],
      communication_type: ["sms", "voice", "email"],
      integration_type: [
        "meta_ads",
        "google_ads",
        "calendly",
        "zapier",
        "webhooks",
      ],
      lead_status: ["new", "contacted", "qualified", "converted", "lost"],
      subscription_plan: ["starter", "professional", "enterprise"],
      subscription_status: ["active", "canceled", "past_due", "incomplete"],
    },
  },
} as const
