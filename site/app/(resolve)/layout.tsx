import { Header } from "@/components/header";
import { Footer } from "@/components/site";

/**
 * Chrome for the HermiteCut product pages.
 *
 * These keep the existing Clay design while the parent site (`app/page.tsx`)
 * runs on the Hermite brand system. Route groups do not affect URLs, so every
 * path here is unchanged — /motion, /subs, /cut and so on.
 *
 * When these pages move to cut.hermitelabs.com they should be re-themed to the
 * brand system with the HermiteCut accent (#FF7A45), at which point this
 * layout and the parent layout converge.
 */
export default function ResolveLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
