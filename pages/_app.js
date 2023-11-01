import "dotenv/config";
import "components/styles/globals.css";
import localFont from "next/font/local";
import Nav from "../components/Nav";

const geistMono = localFont({
  src: [
    {
      path: "../public/GeistMono/GeistMono-Regular.otf",
      weight: "400",
    },

    {
      path: "../public/GeistMono/GeistMono-Bold.otf",
      weight: "700",
    },
  ],
  variable: "--font-geist-mono",
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${geistMono.variable} font-mono`}>
      <Nav />
      <Component {...pageProps} />
    </main>
  );
}
