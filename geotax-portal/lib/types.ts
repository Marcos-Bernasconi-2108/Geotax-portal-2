export type UserRole = 'admin' | 'client'

export interface User {
  name: string
  role: UserRole
  cuit: string
}

export interface IVARecord {
  periodo: string   // formato: "2026-04"
  archivo: string
}

export interface DDJJRecord {
  tipo: string
  periodo: string
  fecha: string     // formato: "2026-05-20"
  nro: string
  archivo: string
}

export interface VEPRecord {
  concepto: string
  periodo: string
  importe: number
  vencimiento: string  // formato: "2026-06-18"
  pagado: boolean
  fechaPago?: string
}

export interface ARCAMessage {
  fecha: string
  asunto: string
  tipo: string
  desc: string
  leido: boolean
}

export interface ClientData {
  iva: IVARecord[]
  ddjj: DDJJRecord[]
  veps: VEPRecord[]
  arca: ARCAMessage[]
}

export type ClientDataMap = Record<string, ClientData>

export type Page = 'dashboard' | 'arca' | 'iva' | 'ddjj' | 'veps' | 'chatbot'
