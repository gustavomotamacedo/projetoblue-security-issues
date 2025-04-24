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
      chips: {
        Row: {
          data_alocacao: string | null
          data_criacao: string | null
          iccid: string
          id: number
          id_cliente: number | null
          linha: string
          operadora: string | null
          status: string | null
        }
        Insert: {
          data_alocacao?: string | null
          data_criacao?: string | null
          iccid: string
          id?: never
          id_cliente?: number | null
          linha: string
          operadora?: string | null
          status?: string | null
        }
        Update: {
          data_alocacao?: string | null
          data_criacao?: string | null
          iccid?: string
          id?: never
          id_cliente?: number | null
          linha?: string
          operadora?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chips_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          cnpj: string | null
          data_criacao: string | null
          email: string | null
          flag_cnpj_faltando: boolean | null
          id: number
          nome_empresa: string
          status: boolean
        }
        Insert: {
          cnpj?: string | null
          data_criacao?: string | null
          email?: string | null
          flag_cnpj_faltando?: boolean | null
          id?: never
          nome_empresa: string
          status: boolean
        }
        Update: {
          cnpj?: string | null
          data_criacao?: string | null
          email?: string | null
          flag_cnpj_faltando?: boolean | null
          id?: never
          nome_empresa?: string
          status?: boolean
        }
        Relationships: []
      }
      consumo_dados: {
        Row: {
          data_registro: string | null
          download_mb: number | null
          id: number
          id_chip: number
          id_cliente: number
          upload_mb: number | null
        }
        Insert: {
          data_registro?: string | null
          download_mb?: number | null
          id?: never
          id_chip: number
          id_cliente: number
          upload_mb?: number | null
        }
        Update: {
          data_registro?: string | null
          download_mb?: number | null
          id?: never
          id_chip?: number
          id_cliente?: number
          upload_mb?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "consumo_dados_id_chip_fkey"
            columns: ["id_chip"]
            isOneToOne: false
            referencedRelation: "chips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consumo_dados_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      controle_acesso_remoto: {
        Row: {
          bloqueado: boolean | null
          data_intervencao: string | null
          descricao_motivo: string | null
          id: number
          id_chip: number | null
          id_roteador: number | null
          possui_acesso: boolean | null
        }
        Insert: {
          bloqueado?: boolean | null
          data_intervencao?: string | null
          descricao_motivo?: string | null
          id?: never
          id_chip?: number | null
          id_roteador?: number | null
          possui_acesso?: boolean | null
        }
        Update: {
          bloqueado?: boolean | null
          data_intervencao?: string | null
          descricao_motivo?: string | null
          id?: never
          id_chip?: number | null
          id_roteador?: number | null
          possui_acesso?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "controle_acesso_remoto_id_chip_fkey"
            columns: ["id_chip"]
            isOneToOne: false
            referencedRelation: "chips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "controle_acesso_remoto_id_roteador_fkey"
            columns: ["id_roteador"]
            isOneToOne: false
            referencedRelation: "roteadores"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_movimentacoes: {
        Row: {
          comentarios: string | null
          data_movimentacao: string | null
          evento: string | null
          id: number
          id_chip: number | null
          id_cliente: number
          id_roteador: number | null
          tipo_movimentacao: string | null
        }
        Insert: {
          comentarios?: string | null
          data_movimentacao?: string | null
          evento?: string | null
          id?: never
          id_chip?: number | null
          id_cliente: number
          id_roteador?: number | null
          tipo_movimentacao?: string | null
        }
        Update: {
          comentarios?: string | null
          data_movimentacao?: string | null
          evento?: string | null
          id?: never
          id_chip?: number | null
          id_cliente?: number
          id_roteador?: number | null
          tipo_movimentacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_movimentacoes_id_chip_fkey"
            columns: ["id_chip"]
            isOneToOne: false
            referencedRelation: "chips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_movimentacoes_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_movimentacoes_id_roteador_fkey"
            columns: ["id_roteador"]
            isOneToOne: false
            referencedRelation: "roteadores"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_wifi_analizer: {
        Row: {
          data_analise: string | null
          descricao_problema: string | null
          id: number
          id_chip: number | null
          id_roteador: number | null
          qualidade_sinal: string | null
        }
        Insert: {
          data_analise?: string | null
          descricao_problema?: string | null
          id?: never
          id_chip?: number | null
          id_roteador?: number | null
          qualidade_sinal?: string | null
        }
        Update: {
          data_analise?: string | null
          descricao_problema?: string | null
          id?: never
          id_chip?: number | null
          id_roteador?: number | null
          qualidade_sinal?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_wifi_analizer_id_chip_fkey"
            columns: ["id_chip"]
            isOneToOne: false
            referencedRelation: "chips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_wifi_analizer_id_roteador_fkey"
            columns: ["id_roteador"]
            isOneToOne: false
            referencedRelation: "roteadores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          is_approved: boolean
          last_login: string | null
          role: Database["public"]["Enums"]["user_role"]
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          is_active?: boolean
          is_approved?: boolean
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          is_approved?: boolean
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          username?: string | null
        }
        Relationships: []
      }
      roteadores: {
        Row: {
          data_alocacao: string | null
          data_criacao: string | null
          id: number
          id_cliente: number | null
          identificador: string
          marca: string | null
          modelo: string | null
          senha_wifi: string | null
          ssid: string | null
          status: string | null
        }
        Insert: {
          data_alocacao?: string | null
          data_criacao?: string | null
          id?: never
          id_cliente?: number | null
          identificador: string
          marca?: string | null
          modelo?: string | null
          senha_wifi?: string | null
          ssid?: string | null
          status?: string | null
        }
        Update: {
          data_alocacao?: string | null
          data_criacao?: string | null
          id?: never
          id_cliente?: number | null
          identificador?: string
          marca?: string | null
          modelo?: string | null
          senha_wifi?: string | null
          ssid?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roteadores_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          data_atualizacao: string | null
          data_criacao: string | null
          email: string
          flag_cadastro_aprovado: boolean
          id: number
          nome_completo: string
          perfil: Database["public"]["Enums"]["user_role"]
          senha_hash: string
          status: boolean
        }
        Insert: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          email: string
          flag_cadastro_aprovado?: boolean
          id?: never
          nome_completo: string
          perfil: Database["public"]["Enums"]["user_role"]
          senha_hash: string
          status: boolean
        }
        Update: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          email?: string
          flag_cadastro_aprovado?: boolean
          id?: never
          nome_completo?: string
          perfil?: Database["public"]["Enums"]["user_role"]
          senha_hash?: string
          status?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { _role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "tech" | "analyst"
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
      user_role: ["admin", "tech", "analyst"],
    },
  },
} as const
