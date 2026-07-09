import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Gym56 Privacy Policy — how we collect, use, and protect your data.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: July 8, 2026</p>

        <section className="space-y-8 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              Gym56 (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the website at{" "}
              <a href="https://gym56.vercel.app" className="text-[#DC2626] hover:underline">
                gym56.vercel.app
              </a>{" "}
              (the &ldquo;Site&rdquo;). This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our Site or use our services, including the AI
              Coach, exercise encyclopedia, member dashboard, and contact form.
            </p>
            <p className="mt-3">
              By using the Site, you agree to the collection and use of information in accordance with
              this policy. If you do not agree, please do not use the Site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-white mt-4 mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Account Data:</strong> When you sign up or log in via Supabase Auth, we collect
                your email address and password (hashed). You may optionally provide your full name and
                phone number in your profile.
              </li>
              <li>
                <strong>Profile Data:</strong> Full name, phone number, and avatar image stored in your
                member profile.
              </li>
              <li>
                <strong>Contact Form Data:</strong> When you submit a contact inquiry, we collect your
                name, email address, phone number (optional), and message.
              </li>
              <li>
                <strong>AI Coach Messages:</strong> Chat messages you send to the AI Coach are
                transmitted to our AI provider (NVIDIA) for processing. Conversations are stored locally
                in your browser (localStorage) and are not persisted on our servers.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-4 mb-2">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Usage Data:</strong> We use Vercel Analytics and Speed Insights to collect
                anonymized page views, referrer information, browser type, device type, and web
                performance metrics (LCP, CLS, INP). This data is anonymous and does not identify you
                personally.
              </li>
              <li>
                <strong>Google Analytics (with consent):</strong> If you accept cookies, we load Google
                Analytics 4 (GA4) to track page views, user behavior, and session data. GA4 may use
                cookies and collect anonymized IP addresses.
              </li>
              <li>
                <strong>Microsoft Clarity (with consent):</strong> If you accept cookies, we load
                Microsoft Clarity to capture session replays and heatmaps for usability analysis. Clarity
                may record mouse movements, clicks, and scrolls. No keystroke data is captured on
                password fields.
              </li>
              <li>
                <strong>Cookies:</strong> Supabase Auth sets essential session cookies
                (sb-*-auth-token) to maintain your login state. These are necessary for the Site to
                function. Google Analytics may set additional cookies only after you accept the cookie
                consent banner.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-4 mb-2">2.3 Local Storage</h3>
            <p>
              We use browser localStorage for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cookie consent preference (gym56-cookie-consent)</li>
              <li>AI Coach chat history persistence</li>
              <li>Admin panel mock data (gym56_* keys) for demonstration purposes</li>
            </ul>
            <p className="mt-2">
              This data remains on your device and is not transmitted to our servers except where noted.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>To provide and maintain the Site and its features (account management, exercise library, AI Coach)</li>
              <li>To respond to contact inquiries and membership questions</li>
              <li>To analyze and improve the Site&apos;s performance, usability, and content</li>
              <li>To detect, prevent, and address technical issues and abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services that process your data:</p>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 font-semibold text-white">Service</th>
                    <th className="text-left py-2 pr-4 font-semibold text-white">Purpose</th>
                    <th className="text-left py-2 font-semibold text-white">Data Shared</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4">Supabase</td>
                    <td className="py-2 pr-4">Database, Authentication, Storage</td>
                    <td className="py-2">Account data, profile data, contact messages, session cookies</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4">NVIDIA (via API)</td>
                    <td className="py-2 pr-4">AI Coach chat completions</td>
                    <td className="py-2">Chat messages sent by users</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4">Vercel</td>
                    <td className="py-2 pr-4">Hosting, Analytics, Speed Insights</td>
                    <td className="py-2">Anonymized usage data, IP addresses (anonymized)</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4">Google Analytics</td>
                    <td className="py-2 pr-4">Page view analytics (with consent only)</td>
                    <td className="py-2">Page views, behavior data, anonymized IP</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4">Microsoft Clarity</td>
                    <td className="py-2 pr-4">Session replays, heatmaps (with consent only)</td>
                    <td className="py-2">Mouse movements, clicks, scrolls, anonymized IP</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">ImageKit</td>
                    <td className="py-2 pr-4">Exercise GIF image CDN</td>
                    <td className="py-2">None (static image delivery)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4">
              Each third-party service operates under its own privacy policy. We encourage you to review
              them:
            </p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>
                <a href="https://supabase.com/privacy" className="text-[#DC2626] hover:underline" target="_blank" rel="noopener noreferrer">
                  Supabase Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://www.nvidia.com/en-us/privacy/" className="text-[#DC2626] hover:underline" target="_blank" rel="noopener noreferrer">
                  NVIDIA Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://vercel.com/legal/privacy" className="text-[#DC2626] hover:underline" target="_blank" rel="noopener noreferrer">
                  Vercel Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://policies.google.com/privacy" className="text-[#DC2626] hover:underline" target="_blank" rel="noopener noreferrer">
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://privacy.microsoft.com/en-us/privacystatement" className="text-[#DC2626] hover:underline" target="_blank" rel="noopener noreferrer">
                  Microsoft Privacy Statement
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Storage and Security</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Database:</strong> Your account and profile data is stored in Supabase
                PostgreSQL, hosted on Google Cloud Platform (GCP) infrastructure. Data is encrypted at
                rest and in transit (TLS 1.3).
              </li>
              <li>
                <strong>Authentication:</strong> Passwords are hashed using bcrypt by Supabase Auth. We
                never store or have access to your plaintext password.
              </li>
              <li>
                <strong>AI Messages:</strong> Chat messages sent to the AI Coach are processed by NVIDIA
                and are not retained on our servers. Conversations persist in your browser&apos;s
                localStorage only.
              </li>
              <li>
                <strong>Contact Form:</strong> Submissions are stored in Supabase and accessible only to
                authorized gym administrators.
              </li>
              <li>
                <strong>Security Measures:</strong> We implement HTTPS, HSTS, and Row-Level Security
                (RLS) in the database to protect your data. However, no method of transmission over the
                Internet is 100% secure.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">6. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Account Data:</strong> Retained for as long as your account is active. You may
                request deletion at any time (see Section 8).
              </li>
              <li>
                <strong>Contact Submissions:</strong> Retained indefinitely for record-keeping unless
                deleted by an administrator or upon your request.
              </li>
              <li>
                <strong>Analytics Data:</strong> Vercel Analytics retains data for 38 months. Google
                Analytics retains data for 26 months. Clarity retains session data for 13 months.
              </li>
              <li>
                <strong>Local Storage:</strong> Cleared when you clear your browser data. AI Coach chat
                history can be deleted via the &ldquo;Clear Chat&rdquo; button on the AI Coach page.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">7. Cookies</h2>
            <p>Our Site uses the following types of cookies:</p>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 font-semibold text-white">Type</th>
                    <th className="text-left py-2 pr-4 font-semibold text-white">Purpose</th>
                    <th className="text-left py-2 font-semibold text-white">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4">Essential (Supabase Auth)</td>
                    <td className="py-2 pr-4">Session management, login state</td>
                    <td className="py-2">Session / persistent</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4">Google Analytics (with consent)</td>
                    <td className="py-2 pr-4">Page view tracking, user behavior</td>
                    <td className="py-2">Up to 26 months</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Microsoft Clarity (with consent)</td>
                    <td className="py-2 pr-4">Session recording, heatmap analysis</td>
                    <td className="py-2">Up to 13 months</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4">
              You can control cookie preferences through our cookie consent banner (displayed on your
              first visit) or by adjusting your browser settings. Essential cookies cannot be disabled as
              they are necessary for the Site to function.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">8. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have the following rights regarding your personal
              data:
            </p>

            <h3 className="text-lg font-semibold text-white mt-4 mb-2">8.1 General Rights</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Access:</strong> Request a copy of the personal data we hold about you.
              </li>
              <li>
                <strong>Correction:</strong> Update your profile information at any time via the member
                dashboard.
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and associated data. Contact
                us at the email below.
              </li>
              <li>
                <strong>Data Portability:</strong> Request a machine-readable export of your data.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-4 mb-2">8.2 GDPR (EU/EEA Users)</h3>
            <p>
              If you are located in the European Economic Area, you have additional rights under the
              General Data Protection Regulation (GDPR), including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Right to withdraw consent at any time</li>
              <li>Right to restrict processing</li>
              <li>Right to object to processing</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-4 mb-2">8.3 CCPA (California Users)</h3>
            <p>
              If you are a California resident, the California Consumer Privacy Act (CCPA) grants you
              the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Know what personal information we collect, use, and share</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of the sale of your personal information (we do not sell personal data)</li>
              <li>Non-discrimination for exercising your CCPA rights</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-4 mb-2">8.4 Exercising Your Rights</h3>
            <p>
              To exercise any of these rights, please contact us at the email address below. We will
              respond within 30 days. We may need to verify your identity before processing your
              request.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">9. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 13 (or 16 in the European
              Economic Area). We do not knowingly collect personal information from children. If we
              become aware that a child has provided us with personal data, we will take steps to delete
              it. If you believe a child has submitted data to us, please contact us immediately.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">10. International Data Transfers</h2>
            <p>
              Your data may be transferred to and processed in countries other than your own. Our
              infrastructure providers (Vercel, Supabase/GCP, NVIDIA) operate globally. When we transfer
              data, we rely on appropriate safeguards such as Standard Contractual Clauses (SCCs)
              approved by the European Commission or equivalent mechanisms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date at
              the top. Material changes may also be communicated via email (if you have an account) or a
              site notice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">12. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us:</p>
            <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <p><strong>Email:</strong> gym56.gandhinagar@gmail.com</p>
              <p><strong>Phone:</strong> +91 94294 21772</p>
              <p><strong>Address:</strong> 2nd Floor, Yogi Mall, Behind D-Mart, Green City, Sector 26, Gandhinagar, Gujarat 382028, India</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
