import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pet Quest',
  description: 'Gamified productivity cockpit with a virtual companion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
