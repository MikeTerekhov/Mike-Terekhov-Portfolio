import Link from "next/link";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicy() {
  return (
    <main className="site-shell editorial">
      <p className="eyebrow">Portfolio / Privacy</p>
      <h1>Privacy policy</h1>
      <p className="muted">Last updated: November 16, 2026</p>
      <div className="article-body">
        <p>This personal portfolio is operated by Mike Terekhov. This policy explains how the optional WHOOP integration handles information.</p>

        <h2>Information accessed</h2>
        <p>With the WHOOP account holder&apos;s authorization, the integration requests read-only access to recovery scores, sleep performance, and daily strain. WHOOP may provide supporting sleep, recovery, and cycle records to calculate the displayed snapshot. The integration does not request permission to modify WHOOP data.</p>

        <h2>How information is used</h2>
        <p>The integration retrieves the latest available WHOOP metrics solely to display a personal physiological snapshot on this public portfolio. The displayed recovery, sleep performance, and strain values are publicly visible to anyone visiting the homepage once the integration is connected. Do not authorize an account unless you are comfortable with those values being public.</p>

        <h2>Storage and service providers</h2>
        <p>OAuth access and refresh tokens are stored server-side in a configured Redis data store, rather than in the public website or source code. The site uses hosting and storage providers to operate the integration and makes authorized requests to WHOOP. API responses may be temporarily cached to reduce repeated requests. The integration does not intentionally store a permanent history of WHOOP health metrics.</p>

        <h2>Sharing and advertising</h2>
        <p>The selected metrics are displayed publicly as described above. This integration does not sell WHOOP data or use it for advertising. Information is processed by the services needed to host the website, store authorization tokens, and retrieve data from WHOOP.</p>

        <h2>Access and revocation</h2>
        <p>The account holder can revoke the application&apos;s authorization through WHOOP&apos;s connected-app controls. To request removal of the integration&apos;s stored authorization tokens or stop public display, contact the portfolio owner using the link below. Revocation stops future authorized access, but previously cached values may remain visible briefly until caches expire.</p>

        <h2>Contact</h2>
        <p>For questions or requests concerning this integration, contact me through <a href="https://www.linkedin.com/in/miketerekhov/" target="_blank" rel="noopener noreferrer">LinkedIn</a>.</p>
        <p><Link href="/">Return to homepage</Link></p>
      </div>
    </main>
  );
}
