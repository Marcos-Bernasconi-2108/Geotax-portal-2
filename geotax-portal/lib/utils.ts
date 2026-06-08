export function diasRestantes(fechaStr: string): number {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fecha = new Date(fechaStr + 'T00:00:00')
  return Math.round((fecha.getTime() - hoy.getTime()) / 86400000)
}

export function formatFecha(str: string): string {
  if (!str) return '—'
  const [y, m, d] = str.split('-')
  return `${d}/${m}/${y}`
}

const MESES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export function formatPeriodo(str: string): string {
  const [y, m] = str.split('-')
  return `${MESES[parseInt(m)]} ${y}`
}

export function formatPeso(n: number): string {
  return '$ ' + Number(n).toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
