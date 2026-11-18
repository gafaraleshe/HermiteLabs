import { LabsNav } from "@/components/labs-nav";
import { SiteFooter } from "@/components/footer";
import "../brand.css";
import "./legal.css";

export default function LegalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="hermite">
      <a className="skip-link" href="#main">Skip to content</a>
      <LabsNav />
      {children}
      <SiteFooter />
    </div>
  );
}
