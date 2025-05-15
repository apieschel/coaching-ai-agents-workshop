// app/layout.tsx
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Spell Library Management System',
  description: 'Manage your Harry Potter spell collection',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div className="container">
          <h1>Spell Library</h1>
          <nav>
            <Link href="/spells">Spell List</Link>
            <Link href="/spells/add">Add New Spell</Link>
          </nav>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
