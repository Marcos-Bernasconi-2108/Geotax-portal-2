// ============================================================
// DATOS DE DEMOSTRACIÓN
// TODO: Reemplazar por consultas a Supabase
// ============================================================
import type { User, ClientDataMap } from './types'

export const USERS: Record<string, User> = {
  'admin':    { name: 'GeoTax Admin', role: 'admin', cuit: '' },
  'client-1': { name: 'Juan Pérez', role: 'client', cuit: 'CUIT: 20-12345678-9' },
  'client-2': { name: 'María González', role: 'client', cuit: 'CUIT: 27-87654321-4' },
  'client-3': { name: 'Empresa Demo SRL', role: 'client', cuit: 'CUIT: 30-99887766-5' },
}

export const MOCK_DATA: ClientDataMap = {
  'client-1': {
    iva: [
      { periodo: '2026-04', archivo: 'WP_IVA_Abril2026.xlsx' },
      { periodo: '2026-03', archivo: 'WP_IVA_Marzo2026.xlsx' },
      { periodo: '2026-02', archivo: 'WP_IVA_Febrero2026.xlsx' },
    ],
    ddjj: [
      { tipo: 'IVA', periodo: 'Abril 2026', fecha: '2026-05-20', nro: '9876543210', archivo: 'DDJJ_IVA_Abr2026.pdf' },
      { tipo: 'IVA', periodo: 'Marzo 2026', fecha: '2026-04-21', nro: '9876543100', archivo: 'DDJJ_IVA_Mar2026.pdf' },
      { tipo: 'IVA', periodo: 'Febrero 2026', fecha: '2026-03-20', nro: '9876542900', archivo: 'DDJJ_IVA_Feb2026.pdf' },
      { tipo: 'Ganancias Personas Físicas', periodo: 'Anual 2025', fecha: '2026-06-01', nro: '1234500001', archivo: 'DDJJ_Ganancias_2025.pdf' },
      { tipo: 'Ganancias Personas Físicas', periodo: 'Anticipo 3/2026', fecha: '2026-05-14', nro: '1234500002', archivo: 'DDJJ_Ganancias_Ant3_2026.pdf' },
      { tipo: 'Autónomos', periodo: 'Mayo 2026', fecha: '2026-05-15', nro: '5551112223', archivo: 'Autonomos_May2026.pdf' },
    ],
    veps: [
      { concepto: 'IVA', periodo: 'Mayo 2026', importe: 270000, vencimiento: '2026-06-18', pagado: false },
      { concepto: 'Ganancias', periodo: 'Anticipo 4/2026', importe: 85000, vencimiento: '2026-06-10', pagado: false },
      { concepto: 'Autónomos', periodo: 'Mayo 2026', importe: 32000, vencimiento: '2026-06-07', pagado: false },
      { concepto: 'IVA', periodo: 'Abril 2026', importe: 270000, vencimiento: '2026-05-20', pagado: true, fechaPago: '2026-05-19' },
      { concepto: 'Ganancias', periodo: 'Anticipo 3/2026', importe: 85000, vencimiento: '2026-05-12', pagado: true, fechaPago: '2026-05-12' },
    ],
    arca: [
      { fecha: '2026-05-28', asunto: 'Solicitud documentación respaldatoria', tipo: 'Requerimiento', desc: 'AFIP solicita comprobantes de compras del período enero-marzo 2026.', leido: false },
      { fecha: '2026-04-15', asunto: 'Información sobre cambio de categoría monotributo', tipo: 'Notificación', desc: 'Se informa que según la facturación registrada correspondería recategorización.', leido: true },
    ],
  },
  'client-2': {
    iva: [
      { periodo: '2026-04', archivo: 'WP_IVA_Abril2026_MG.xlsx' },
    ],
    ddjj: [
      { tipo: 'Monotributo', periodo: 'Recategorización Ene 2026', fecha: '2026-01-20', nro: '5551234567', archivo: 'Recategorizacion_Ene2026.pdf' },
      { tipo: 'Bienes Personales', periodo: 'Anual 2025', fecha: '2026-06-03', nro: '5559876543', archivo: 'DDJJ_BP_2025.pdf' },
    ],
    veps: [
      { concepto: 'Monotributo', periodo: 'Junio 2026', importe: 18500, vencimiento: '2026-06-20', pagado: false },
      { concepto: 'Bienes Personales', periodo: 'Anual 2025', importe: 95000, vencimiento: '2026-06-06', pagado: false },
      { concepto: 'Monotributo', periodo: 'Mayo 2026', importe: 18500, vencimiento: '2026-05-20', pagado: true, fechaPago: '2026-05-18' },
    ],
    arca: [
      { fecha: '2026-06-01', asunto: 'Vencimiento Bienes Personales 2025', tipo: 'Notificación', desc: 'Recordatorio: vencimiento para presentación y pago de Bienes Personales 2025 es el 06/06/2026.', leido: false },
    ],
  },
  'client-3': {
    iva: [
      { periodo: '2026-04', archivo: 'WP_IVA_Abril2026_Demo.xlsx' },
      { periodo: '2026-03', archivo: 'WP_IVA_Marzo2026_Demo.xlsx' },
    ],
    ddjj: [
      { tipo: 'IVA', periodo: 'Abril 2026', fecha: '2026-05-21', nro: '7771234567', archivo: 'DDJJ_IVA_Abr2026_Demo.pdf' },
      { tipo: 'IIBB Convenio Multilateral', periodo: 'Abril 2026', fecha: '2026-05-25', nro: '7779876543', archivo: 'DDJJ_IIBB_Abr2026.pdf' },
    ],
    veps: [
      { concepto: 'IVA', periodo: 'Mayo 2026', importe: 930000, vencimiento: '2026-06-18', pagado: false },
      { concepto: 'IIBB', periodo: 'Mayo 2026', importe: 145000, vencimiento: '2026-06-15', pagado: false },
    ],
    arca: [],
  },
}
