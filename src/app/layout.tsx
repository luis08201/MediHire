import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/chrome";
import { FinsweetListBridge } from "@/components/finsweet";
import { copy } from "@/i18n/en";
import { readCredits } from "@/lib/cms/store";
import { isPreview } from "@/lib/preview";
import { siteUrl } from "@/lib/site";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "MediHire", template: "%s · MediHire" },
  description: "MediHire connects hospitals and clinics with healthcare professionals for temporary staffing, shift coverage, and permanent placement.",
  applicationName: "MediHire",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const preview = await isPreview();
  const credits = readCredits();
  return (
    <html lang="en" className={sans.variable}>
      <body className={sans.className}>
        <a className="skip" href="#content">{copy.skip}</a>
        {preview ? (
          <div className="preview-banner">
            <span>Editorial preview. Drafts are visible on this browser only and are not indexed.</span>
            <Link href="/api/preview/exit">Exit preview</Link>
          </div>
        ) : null}
        <div className="demo-banner">{copy.demoBanner}</div>
        <SiteHeader />
        <FinsweetListBridge />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.Webflow=window.Webflow||[];if(Array.isArray(window.Webflow)&&!window.Webflow.flushed){var queue=window.Webflow;var enqueue=queue.push.bind(queue);queue.push=function(callback){enqueue(callback);if(typeof callback==='function'){queue.flushed=true;callback();}};queue.flushed=true;}",
          }}
        />
        <script async type="module" src="https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js" {...{ "fs-list": "" }} />
        <main id="content">{children}</main>
        <SiteFooter credits={credits} />
      </body>
    </html>
  );
}
