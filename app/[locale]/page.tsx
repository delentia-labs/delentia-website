import type { Metadata } from "next"
import { createBilingualMetadata } from "@/lib/seo-bilingual"
import { getBreadcrumbSchema, getFAQSchema, getOrganizationSchema, getSoftwareApplicationSchema } from "@/lib/schema"
import HomePageClient from "../HomePageClient"
import { HeroServer } from "@/components/sections/hero-server"
import { Navbar } from "@/components/navbar"
import { SITE_ENTERPRISE_EVIDENCE_LABEL, SITE_PUBLIC_SDK_EVIDENCE_LABEL } from "@/lib/site-config"

// ISR: cache the homepage for 1 hour, then regenerate in the background.
// No headers() call here — root layout is also headers()-free → statically renderable.
export const revalidate = 3600

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "th" }]
}

type LocalePageProps = {
  params: Promise<{ locale: "en" | "th" }>
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params

  return createBilingualMetadata(
    locale,
    "RCT Labs — Constitutional AI Operating System | Public SDK + Enterprise Evidence Lanes",
    "RCT Labs — ระบบปฏิบัติการ AI แบบรัฐธรรมนูญ | Public SDK + Enterprise Evidence Lanes",
    `RCT Labs presents a constitutional AI operating system with 10-layer architecture, a 41-algorithm framework, and explicit evidence lanes that separate ${SITE_PUBLIC_SDK_EVIDENCE_LABEL.toLowerCase()} from ${SITE_ENTERPRISE_EVIDENCE_LABEL.toLowerCase()} and benchmark disclosures.`,
    `RCT Labs นำเสนอระบบปฏิบัติการ AI แบบรัฐธรรมนูญที่มีสถาปัตยกรรม 10 ชั้น กรอบอัลกอริทึม 41 รายการ และแยก evidence lanes อย่างชัดเจนระหว่าง ${SITE_PUBLIC_SDK_EVIDENCE_LABEL.toLowerCase()} กับ ${SITE_ENTERPRISE_EVIDENCE_LABEL.toLowerCase()} รวมถึง benchmark disclosures.`,
    "/",
    locale === "th"
      ? ["ระบบ AI สำหรับองค์กร", "ป้องกัน AI hallucination", "ระบบตรวจสอบผลลัพธ์ AI", "โครงสร้างพื้นฐาน AI ประเทศไทย", "AI governance"]
      : ["FDIA equation", "intent operating system", "AI hallucination solution", "enterprise AI Thailand", "AI governance platform"]
  )
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params
  const localePrefix = locale === "th" ? "/th" : "/en"

  const breadcrumbSchema = getBreadcrumbSchema([{ name: "Home", url: `https://rctlabs.co${localePrefix}` }])
  const orgSchema = getOrganizationSchema(locale)
  const softwareSchema = getSoftwareApplicationSchema(locale)

  const faqSchema = getFAQSchema(
    locale === "th"
      ? [
          {
            question: "RCT Labs ช่วยองค์กรเรื่องใดได้บ้าง?",
            answer:
              "RCT Labs ช่วยองค์กรลดความเสี่ยงจาก AI hallucination เพิ่มผลลัพธ์ที่ตรวจสอบได้ เสริมระบบหน่วยความจำ และวางโครงสร้างการใช้งาน AI ให้สอดคล้องกับ governance และข้อกำหนดด้านความปลอดภัย",
          },
          {
            question: "ควรเริ่มประเมินแพลตฟอร์มจากส่วนใดก่อน?",
            answer:
              "โดยทั่วไปควรเริ่มจาก whitepaper เพื่อเข้าใจสถาปัตยกรรม จากนั้นดู solutions, pricing และ research เพื่อประเมินความเหมาะสมเชิงธุรกิจและเชิงเทคนิค",
          },
          {
            question: "RCT Labs รองรับการใช้งานระดับองค์กรหรือไม่?",
            answer:
              "รองรับ โดยเน้นสถาปัตยกรรม 10 ชั้น การตรวจสอบหลายโมเดล ระบบหน่วยความจำ RCTDB และแนวทางการ deploy ที่เหมาะกับงานระดับองค์กร",
          },
        ]
      : [
          {
            question: "What problems does RCT Labs solve for enterprise teams?",
            answer:
              "RCT Labs helps enterprises reduce hallucination risk, add verifiable outputs, strengthen memory and orchestration, and improve AI governance for production environments.",
          },
          {
            question: "How should teams evaluate the platform?",
            answer:
              "Most teams should begin with the whitepaper, then compare solutions, review pricing, and inspect research releases to evaluate technical and commercial fit.",
          },
          {
            question: "Is RCT Labs designed for enterprise deployment?",
            answer:
              "Yes. The platform is positioned around a 10-layer architecture, multi-model verification, RCTDB memory, and deployment paths suitable for enterprise requirements.",
          },
        ]
  )

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: locale === "th" ? "RCT Labs หน้าแรก" : "RCT Labs Homepage",
    url: `https://rctlabs.co${localePrefix}`,
    inLanguage: locale,
    description:
      locale === "th"
        ? "หน้าแรกของ RCT Labs สำหรับสำรวจสถาปัตยกรรม เอกสารวิจัย โซลูชัน ราคา และแนวทางการใช้งาน AI ระดับองค์กร"
        : "Homepage for exploring RCT Labs architecture, whitepapers, solutions, pricing, and enterprise AI evaluation paths.",
  }

  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <HomePageClient locale={locale} navSlot={<Navbar locale={locale} />} heroSlot={<HeroServer locale={locale} />} />
    </>
  )
}
