import './globals.css'

export const metadata = {
  title: 'OMBIM',
  description: 'Tu descripción aquí',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
