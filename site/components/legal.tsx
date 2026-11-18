import { COMPANY, CUT_SUPPORT } from "@/lib/config";

export const UPDATED = "18 November 2026";

export function Company() {
  return (
    <p>
      HermiteCut and hermitelabs.com are provided by {COMPANY.name}, trading as {COMPANY.brand}
      {COMPANY.companyNumber ? `, a company registered in England and Wales (company number ${COMPANY.companyNumber})` : ""}
      {COMPANY.address ? `, registered office ${COMPANY.address}` : ""}.
      {" "}Contact us {COMPANY.email ? <>at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or </> : ""}
      through <a href={CUT_SUPPORT}>HermiteCut support</a>.
    </p>
  );
}

export function LegalDoc({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main id="main" className="legal h-wrap">
      <span className="h-label">Legal</span>
      <h1 className="h-h2">{title}</h1>
      <p className="h-label">Last updated {UPDATED}</p>
      <div className="legal-body">{children}</div>
    </main>
  );
}
