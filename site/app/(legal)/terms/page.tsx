import type { Metadata } from "next";
import { Company, LegalDoc } from "@/components/legal";

export const metadata: Metadata = { title: "Terms of sale", description: "Terms of sale for HermiteCut and Hermite Labs products." };

export default function Terms() {
  return (
    <LegalDoc title="Terms of sale">
      <Company />
      <h2>1. What you are buying</h2>
      <p>When you buy HermiteCut you get a licence to download and use the software, its templates and its sound library under the <a href="/eula">licence agreement (EULA)</a>. You are not buying the software itself; it remains ours.</p>
      <h2>2. Price and payment</h2>
      <p>Prices are shown at checkout and include any VAT or sales tax that applies to you. Payments are processed by our payment provider, which acts as the merchant of record, issues your receipt and handles tax.</p>
      <h2>3. Delivery</h2>
      <p>HermiteCut is delivered digitally. You can download it straight away after payment, and download updates from the same place.</p>
      <h2>4. Your right to cancel</h2>
      <p>Because HermiteCut is digital content supplied immediately, you agree at checkout that delivery starts straight away. We still offer refunds as set out in our <a href="/refunds">refund policy</a>.</p>
      <h2>5. Updates and support</h2>
      <p>We publish fixes and improvements through updates. Support is provided through our support page on a reasonable-efforts basis.</p>
      <h2>6. Requirements</h2>
      <p>HermiteCut needs a compatible computer and a compatible version of DaVinci Resolve, as listed on the product page. Please check these before buying.</p>
      <h2>7. Our liability</h2>
      <p>Nothing in these terms limits liability that cannot be limited by law, including your statutory rights as a consumer. Otherwise, our total liability to you is limited to the price you paid. We are not responsible for loss of data or projects; keep backups of your work.</p>
      <h2>8. Changes and law</h2>
      <p>We may update these terms; the version shown at the time of your purchase applies to it. These terms are governed by the law of England and Wales.</p>
    </LegalDoc>
  );
}
