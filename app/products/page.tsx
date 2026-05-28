import { Metadata } from "next"
import { createBilingualMetadata } from "@/lib/seo-bilingual"
import { getRequestLocale } from "@/lib/request-locale"
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/schema"
import ProductsClient from "./ProductsClient"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()

  return createBilingualMetadata(
    locale,
    "Products",
    "ผลิตภัณฑ์",
    "Delentia Labs products: Delentia Platform testing platform, Delentia AI creative engine, and Signed AI verification system. Enterprise AI solutions built on constitutional AI principles.",
    "ผลิตภัณฑ์ Delentia Labs: แพลตฟอร์มทดสอบ Delentia Platform, Delentia AI และระบบตรวจสอบ Signed AI สำหรับองค์กร",
    "/products",
    ["Delentia Platform platform", "Delentia AI", "Signed AI", "AI verification", "AI testing platform"]
  )
}

export default async function ProductsPage() {
  const locale = await getRequestLocale()
  const localePrefix = locale === "th" ? "/th" : "/en"
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `https://delentia.com${localePrefix}` },
    { name: "Products", url: `https://delentia.com${localePrefix}/products` },
  ])

  const faqSchema = getFAQSchema([
    {
      question: "What products does Delentia Labs currently offer?",
      answer:
        "Delentia Labs currently presents three core products: Delentia Platform for AI testing and benchmarking, Delentia AI for intent-aligned creative generation, and SignedAI for verification, traceability, and hallucination reduction.",
    },
    {
      question: "How are the products related to the RCT platform?",
      answer:
        "All products are built on the same RCT operating system foundation, including the 10-layer architecture, FDIA Equation, JITNA Protocol, and shared verification and memory infrastructure.",
    },
  ])

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Delentia Labs Products",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Delentia Platform", url: `https://delentia.com${localePrefix}/products/delentia-platform` },
      { "@type": "ListItem", position: 2, name: "Delentia AI", url: `https://delentia.com${localePrefix}/products/delentia-ai` },
      { "@type": "ListItem", position: 3, name: "SignedAI", url: `https://delentia.com${localePrefix}/products/signed-ai` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <ProductsClient />
    </>
  )
}

