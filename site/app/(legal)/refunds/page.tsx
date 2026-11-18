import type { Metadata } from "next";
import { Company, LegalDoc } from "@/components/legal";

export const metadata: Metadata = { title: "Refund policy", description: "The refund policy for HermiteCut." };

export default function Refunds() {
  return (
    <LegalDoc title="Refund policy">
      <p>If HermiteCut does not work for you, you can ask for a full refund within <strong>14 days</strong> of purchase.</p>
      <h2>How to ask</h2>
      <ul>
        <li>Contact us with your order number and, if you can, what went wrong (your operating system and DaVinci Resolve version help us fix it for everyone).</li>
        <li>We refund to your original payment method, usually within 5 to 10 working days.</li>
      </ul>
      <h2>After a refund</h2>
      <p>Your licence ends when the refund is made. Please uninstall HermiteCut and delete your copies.</p>
      <h2>After 14 days</h2>
      <p>We look at later requests case by case, for example if an update stops HermiteCut working for you and we cannot fix it. This does not affect your statutory rights.</p>
      <h2>Who we are</h2>
      <Company />
    </LegalDoc>
  );
}
