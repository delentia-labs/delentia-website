import type { Metadata } from "next"
import { createBilingualMetadata } from "@/lib/seo-bilingual"
import { getAllBlogPosts } from "@/lib/blog"
import { getRequestLocale } from "@/lib/request-locale"
import { getBreadcrumbSchema } from "@/lib/schema"
import { BlogPageClient } from "./BlogPageClient"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()

  return createBilingualMetadata(
    locale,
    "Blog — Delentia Labs AI Research, Insights & Technical Deep-Dives",
    "บล็อก — งานวิจัย AI, ข้อมูลเชิงลึก และบทความเทคนิคจาก Delentia Labs",
    "Read the latest AI research, technical deep-dives, and industry insights from Delentia Labs. Topics include AI hallucination prevention, constitutional AI governance, FDIA equation, and enterprise LLM deployment.",
    "อ่านงานวิจัย AI ล่าสุด บทวิเคราะห์เชิงลึก และข้อมูลเชิงลึกจาก Delentia Labs ครอบคลุม AI Hallucination Prevention, Constitutional AI Governance, สมการ FDIA และ Enterprise LLM Deployment",
    "/blog",
    ["AI research blog", "AI hallucination articles", "constitutional AI insights", "enterprise AI guides"]
  )
}

export default async function BlogPage() {
  const locale = await getRequestLocale()
  const posts = getAllBlogPosts(locale)
  const localePrefix = locale === "th" ? "/th" : "/en"

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Delentia Labs Research Blog",
    "url": `https://delentia.com${localePrefix}/blog`,
    "publisher": { "@type": "Organization", "name": "Delentia Labs", "url": "https://delentia.com" },
    "blogPost": posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://delentia.com${localePrefix}/blog/${post.slug}`,
      "datePublished": post.date,
      "author": { "@type": "Person", "name": post.author }
    }))
  }
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `https://delentia.com${localePrefix}` },
    { name: "Blog", url: `https://delentia.com${localePrefix}/blog` },
  ])

  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BlogPageClient posts={posts} localePrefix={localePrefix} />
    </>
  )
}

