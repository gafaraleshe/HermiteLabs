import type { Metadata } from "next";
import { Company, LegalDoc } from "@/components/legal";

export const metadata: Metadata = { title: "Privacy policy", description: "How Hermite Labs handles personal data." };

export default function Privacy() {
  return (
    <LegalDoc title="Privacy policy">
      <Company />
      <h2>The HermiteCut software</h2>
      <p>HermiteCut runs on your computer and works through DaVinci Resolve on that computer. It does not upload your footage, projects, audio or files, and it does not need an account. The folders you add to its library are read where they are and are never copied to us.</p>
      <h2>This website</h2>
      <p>The site does not use advertising or tracking cookies. Our hosting provider keeps standard server logs (such as IP address, pages requested and time) for security and to keep the site running, for a short period.</p>
      <h2>When you buy</h2>
      <p>Purchases are handled by our payment provider, the merchant of record. It processes your name, email, billing details and payment information to take payment, issue receipts and meet tax law, and shares with us what we need to deliver your licence and support you (your name, email and order details).</p>
      <h2>When you contact us</h2>
      <p>If you ask for support, we use what you send us to help you. Messages on GitHub are public; do not post personal details there.</p>
      <h2>Your rights</h2>
      <p>Under UK GDPR you can ask to see, correct or delete the personal data we hold about you, or object to how we use it. Contact us to do so. You can also complain to the Information Commissioner&apos;s Office (ico.org.uk).</p>
      <h2>How long we keep it</h2>
      <p>Order records are kept for as long as tax law requires (usually six years). Support messages are kept for as long as they are useful to help you.</p>
    </LegalDoc>
  );
}
