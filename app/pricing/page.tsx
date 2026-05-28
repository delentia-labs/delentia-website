import { Metadata } from "next"
import { createBilingualMetadata } from "@/lib/seo-bilingual"
import { getRequestLocale } from "@/lib/request-locale"
import { getBreadcrumbSchema, getFAQSchema, getProductOfferSchema } from "@/lib/schema"
import PricingClient from "./PricingClient"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()

  return createBilingualMetadata(
    locale,
    "Pricing",
    "ราคา",
    "Transparent enterprise pricing for Delentia Labs. Delentia Platform testing platform, Delentia AI, and Signed AI — custom enterprise plans with no hidden fees. Contact sales for quotes.",
    "ราคาสำหรับองค์กรที่โปร่งใส Delentia Platform, Delentia AI และ Signed AI — แผนสำหรับองค์กรแบบกำหนดเอง ไม่มีค่าใช้จ่ายซ่อนเร้น",
    "/pricing",
    ["enterprise pricing", "AI platform pricing", "Delentia Platform pricing", "contact sales", "AI subscription"]
  )
}

export default async function PricingPage() {
  const locale = await getRequestLocale()
  const localePrefix = locale === "th" ? "/th" : "/en"
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `https://delentia.com${localePrefix}` },
    { name: "Pricing", url: `https://delentia.com${localePrefix}/pricing` },
  ])
  const productSchema = getProductOfferSchema(locale)

  const faqSchema = getFAQSchema([
    {
      question: "How does pricing work for Delentia Labs?",
      answer:
        "Delentia Labs offers custom enterprise pricing based on the selected product, deployment model, support needs, and expected usage volume.",
    },
    {
      question: "Which product should enterprise teams evaluate first?",
      answer:
        "Teams focused on verification should begin with SignedAI, teams needing long-term memory should begin with Enterprise AI Memory, and teams coordinating multiple models should begin with Delentia Platform or Dynamic AI Routing.",
    },
    {
      question: "Can Delentia Labs support private or on-premise deployment?",
      answer:
        "Yes. Enterprise engagements can include on-premise deployment, custom SLAs, and dedicated support depending on requirements.",
    },
  ])

  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <PricingClient />
    </>
  )
}

