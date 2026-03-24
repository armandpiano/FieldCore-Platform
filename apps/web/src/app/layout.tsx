import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: { default: 'FieldCore', template: '%s | FieldCore' },
  description: 'Plataforma SaaS B2B para gestión de operaciones de campo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body className='antialiased'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
