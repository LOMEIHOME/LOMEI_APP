// Tipos de la base de datos Supabase
// TODO: Reemplazar con tipos auto-generados via `npx supabase gen types typescript`
// Por ahora, definidos manualmente para que el código compile.

export type Database = {
  public: {
    Tables: {
      perfiles_admin: {
        Row: {
          id: string;
          nombre: string;
          rol: "admin" | "asistente";
          creado_en: string;
          editado_en: string;
        };
        Insert: {
          id: string;
          nombre: string;
          rol?: "admin" | "asistente";
          creado_en?: string;
          editado_en?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          rol?: "admin" | "asistente";
          creado_en?: string;
          editado_en?: string;
        };
      };
      productos: {
        Row: {
          id: string;
          nombre: string;
          slug: string;
          categoria: string;
          sku: string | null;
          precio_costo: number;
          precio_venta: number;
          descripcion: string | null;
          dimensiones: string | null;
          materiales: string[] | null;
          acabados: string[] | null;
          imagen_url: string | null;
          activo: boolean;
          creado_en: string;
          editado_en: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          slug: string;
          categoria: string;
          sku?: string | null;
          precio_costo?: number;
          precio_venta?: number;
          descripcion?: string | null;
          dimensiones?: string | null;
          materiales?: string[] | null;
          acabados?: string[] | null;
          imagen_url?: string | null;
          activo?: boolean;
          creado_en?: string;
          editado_en?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          slug?: string;
          categoria?: string;
          sku?: string | null;
          precio_costo?: number;
          precio_venta?: number;
          descripcion?: string | null;
          dimensiones?: string | null;
          materiales?: string[] | null;
          acabados?: string[] | null;
          imagen_url?: string | null;
          activo?: boolean;
          creado_en?: string;
          editado_en?: string;
        };
      };
      inventario: {
        Row: {
          id: string;
          producto_id: string;
          cantidad: number;
          ubicacion: string;
          stock_minimo: number;
          editado_en: string;
        };
        Insert: {
          id?: string;
          producto_id: string;
          cantidad?: number;
          ubicacion?: string;
          stock_minimo?: number;
          editado_en?: string;
        };
        Update: {
          id?: string;
          producto_id?: string;
          cantidad?: number;
          ubicacion?: string;
          stock_minimo?: number;
          editado_en?: string;
        };
      };
      movimientos: {
        Row: {
          id: string;
          producto_id: string;
          tipo: "entrada" | "salida" | "ajuste" | "devolucion";
          cantidad: number;
          cantidad_antes: number;
          cantidad_despues: number;
          nota: string | null;
          usuario_id: string | null;
          creado_en: string;
        };
        Insert: {
          id?: string;
          producto_id: string;
          tipo: "entrada" | "salida" | "ajuste" | "devolucion";
          cantidad: number;
          cantidad_antes: number;
          cantidad_despues: number;
          nota?: string | null;
          usuario_id?: string | null;
          creado_en?: string;
        };
        Update: {
          id?: string;
          producto_id?: string;
          tipo?: "entrada" | "salida" | "ajuste" | "devolucion";
          cantidad?: number;
          cantidad_antes?: number;
          cantidad_despues?: number;
          nota?: string | null;
          usuario_id?: string | null;
          creado_en?: string;
        };
      };
      ordenes: {
        Row: {
          id: string;
          numero: number;
          cliente_nombre: string | null;
          cliente_email: string | null;
          cliente_tel: string | null;
          estado: "pendiente" | "completada" | "cancelada";
          subtotal: number;
          descuento: number;
          total: number;
          nota: string | null;
          usuario_id: string | null;
          creado_en: string;
          editado_en: string;
        };
        Insert: {
          id?: string;
          numero?: number;
          cliente_nombre?: string | null;
          cliente_email?: string | null;
          cliente_tel?: string | null;
          estado?: "pendiente" | "completada" | "cancelada";
          subtotal?: number;
          descuento?: number;
          total?: number;
          nota?: string | null;
          usuario_id?: string | null;
          creado_en?: string;
          editado_en?: string;
        };
        Update: {
          id?: string;
          numero?: number;
          cliente_nombre?: string | null;
          cliente_email?: string | null;
          cliente_tel?: string | null;
          estado?: "pendiente" | "completada" | "cancelada";
          subtotal?: number;
          descuento?: number;
          total?: number;
          nota?: string | null;
          usuario_id?: string | null;
          creado_en?: string;
          editado_en?: string;
        };
      };
      orden_items: {
        Row: {
          id: string;
          orden_id: string;
          producto_id: string;
          cantidad: number;
          precio_unitario: number;
          subtotal: number;
        };
        Insert: {
          id?: string;
          orden_id: string;
          producto_id: string;
          cantidad: number;
          precio_unitario: number;
          subtotal: number;
        };
        Update: {
          id?: string;
          orden_id?: string;
          producto_id?: string;
          cantidad?: number;
          precio_unitario?: number;
          subtotal?: number;
        };
      };
      alertas_config: {
        Row: {
          id: string;
          notificar_email: boolean;
          notificar_whatsapp: boolean;
          email_destino: string | null;
          telefono_destino: string | null;
          frecuencia_horas: number;
          activo: boolean;
          editado_en: string;
        };
        Insert: {
          id?: string;
          notificar_email?: boolean;
          notificar_whatsapp?: boolean;
          email_destino?: string | null;
          telefono_destino?: string | null;
          frecuencia_horas?: number;
          activo?: boolean;
          editado_en?: string;
        };
        Update: {
          id?: string;
          notificar_email?: boolean;
          notificar_whatsapp?: boolean;
          email_destino?: string | null;
          telefono_destino?: string | null;
          frecuencia_horas?: number;
          activo?: boolean;
          editado_en?: string;
        };
      };
      alertas_log: {
        Row: {
          id: string;
          producto_id: string;
          cantidad_actual: number;
          stock_minimo: number;
          canal: string;
          enviado: boolean;
          creado_en: string;
        };
        Insert: {
          id?: string;
          producto_id: string;
          cantidad_actual: number;
          stock_minimo: number;
          canal: string;
          enviado?: boolean;
          creado_en?: string;
        };
        Update: {
          id?: string;
          producto_id?: string;
          cantidad_actual?: number;
          stock_minimo?: number;
          canal?: string;
          enviado?: boolean;
          creado_en?: string;
        };
      };
    };
    Views: {
      vista_stock_bajo: {
        Row: {
          id: string;
          nombre: string;
          slug: string;
          categoria: string;
          sku: string | null;
          cantidad: number;
          stock_minimo: number;
          ubicacion: string;
          alerta_activa: boolean;
        };
      };
      vista_ventas_resumen: {
        Row: {
          fecha: string;
          num_ordenes: number;
          total_ventas: number;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: {
      tipo_movimiento: "entrada" | "salida" | "ajuste" | "devolucion";
      estado_orden: "pendiente" | "completada" | "cancelada";
    };
  };
};
