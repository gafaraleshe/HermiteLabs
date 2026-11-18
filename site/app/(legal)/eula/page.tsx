import type { Metadata } from "next";
import { Company, LegalDoc } from "@/components/legal";

export const metadata: Metadata = { title: "Licence (EULA)", description: "The end-user licence agreement for HermiteCut." };

export default function Eula() {
  return (
    <LegalDoc title="Licence agreement (EULA)">
      <p>This agreement is between you and Gaffy Studios Ltd (trading as Hermite Labs) and covers your use of HermiteCut, including its app, Resolve panel, templates and sound library (&ldquo;the Software&rdquo;).</p>
      <h2>1. Your licence</h2>
      <ul>
        <li>You may install and use the Software on up to <strong>two computers</strong> that you own or control, for personal and commercial work.</li>
        <li>Anything you make with the Software is yours, including videos that use its templates and sound effects. You do not owe us anything for using them in your work.</li>
      </ul>
      <h2>2. What you may not do</h2>
      <ul>
        <li>Resell, share or redistribute the Software, its templates or its sound effects as they are, or as part of another template, preset or sound pack.</li>
        <li>Share your licence or download link with other people.</li>
      </ul>
      <h2>3. Open-source parts</h2>
      <p>Parts of HermiteCut are published under the MIT licence on GitHub. Those parts are covered by the MIT licence, and nothing here limits your rights under it.</p>
      <h2>4. Updates</h2>
      <p>Updates are covered by this agreement unless they come with new terms.</p>
      <h2>5. No warranty beyond the law</h2>
      <p>We work hard to make the Software reliable, but it is provided as it is, beyond the rights you have by law. Keep backups of your projects.</p>
      <h2>6. Ending the licence</h2>
      <p>Your licence ends if you break this agreement or get a refund. You must then stop using and delete the Software.</p>
      <h2>Who we are</h2>
      <Company />
    </LegalDoc>
  );
}
