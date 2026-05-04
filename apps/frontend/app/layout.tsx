import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { APP_NAME } from '@/lib/constants';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { MuiThemeProvider } from '@/providers/MuiThemeProvider';
import { CartProvider } from '@/providers/CartProvider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `${APP_NAME} - %s`,
  },
  description: 'ThinkShop — Il tuo negozio online',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getCurrentLocale();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MuiThemeProvider>
          <CartProvider>{children}</CartProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
