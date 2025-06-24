import './globals.css';
import { Poppins, Raleway } from 'next/font/google';
import type { Metadata } from 'next';
import AuthProvider from '@/hooks/useAuth';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-raleway',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Blog App Using NextJs",
  description: "No 1, blog app for daily updates and best solutions for your day to day life problems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${raleway.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
