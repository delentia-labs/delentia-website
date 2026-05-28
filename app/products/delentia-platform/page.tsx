import { Metadata } from "next"
import { createBilingualMetadata } from "@/lib/seo-bilingual"
import { getRequestLocale } from "@/lib/request-locale"
import { getBreadcrumbSchema } from "@/lib/schema"
import { SITE_ENTERPRISE_EVIDENCE_LABEL, SITE_PUBLIC_SDK_EVIDENCE_LABEL, SITE_PUBLIC_SDK_TESTS, SITE_URL } from "@/lib/site-config"
import DelentiaPlatformPage from "./DelentiaPlatformClient"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  return createBilingualMetadata(
    locale,
    "Delentia Platform — Constitutional AI Operating Environment | Public SDK + Enterprise Snapshot",
    "Delentia Platform — Constitutional AI Operating Environment | Public SDK + Enterprise Snapshot",
    `Constitutional AI operating environment powered by the Delentia OS. Public pages separate ${SITE_PUBLIC_SDK_EVIDENCE_LABEL.toLowerCase()} from ${SITE_ENTERPRISE_EVIDENCE_LABEL.toLowerCase()} instead of presenting the entire private runtime as one public proof surface.`,
    `Constitutional AI Operating Environment ที่ขับเคลื่อนโดย Delentia OS โดยหน้า public จะแยก ${SITE_PUBLIC_SDK_EVIDENCE_LABEL.toLowerCase()} ออกจาก ${SITE_ENTERPRISE_EVIDENCE_LABEL.toLowerCase()} แทนการนำ private runtime ทั้งก้อนมาเล่าเป็น public proof เดียว.`,
    "/products/delentia-platform",
    ["constitutional AI OS", "public SDK verified", "FDIA equation", "7 genome system", "AI operating environment"]
  )
}

export default async function Page() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Products", url: `/products` },
    { name: "Delentia Platform", url: `/products/delentia-platform` },
  ])
  const productSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", "name": "Delentia Platform Constitutional AI Operating Environment", "applicationCategory": "DeveloperApplication", "operatingSystem": "Any", "description": `Constitutional AI operating environment with ${SITE_PUBLIC_SDK_TESTS} public SDK verified tests, 41 production algorithms, FDIA scoring, and a separately disclosed enterprise runtime snapshot.`, "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }, "featureList": `${SITE_PUBLIC_SDK_TESTS} ${SITE_PUBLIC_SDK_EVIDENCE_LABEL}, 41 Production Algorithms, FDIA Constitutional Scoring, Intent Loop Engine, 7 Genome System, separate ${SITE_ENTERPRISE_EVIDENCE_LABEL.toLowerCase()}`, "url": `/products/delentia-platform`, "publisher": { "@type": "Organization", "name": "Delentia Labs", "url": SITE_URL } }
  return (
    <>
      <script type={"application/ld+json"} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type={"application/ld+json"} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <DelentiaPlatformPage />
    </>
  )
}

