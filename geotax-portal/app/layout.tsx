import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GeoTax | Portal de Clientes',
  description: 'Portal de clientes GeoTax — acceso a liquidaciones, DDJJ, VEPs y mensajes ARCA.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
