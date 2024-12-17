import '@/app/_styles/globals.css';

import { Josefin_Sans } from 'next/font/google';
import Header from './_components/Header';
import { ReservationProvider } from './_components/ReservationContext';
const josefin = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: {
    template: '%s / Hotel-website',
    default: 'Welcome / The Hotel-website',
  },
  description: 'Luxurious cabin hotel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} text-primary-100 min-h-screen bg-primary-950 flex flex-col antialiased`}
      >
        <Header />
        <div className=" flex-1 px-8 py-12  grid">
          <main className=" max-w-7xl  mx-auto w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
