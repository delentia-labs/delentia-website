import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const root = process.cwd()
const blogRoot = join(root, "content", "blog")

const reviewedFiles = new Set([
  "content/blog/rct-platform-open-source-launch.mdx",
  "content/blog/rct-platform-open-source-launch.th.mdx",
  "content/blog/rct-platform-roadmap-preview.mdx",
  "content/blog/rct-platform-roadmap-preview.th.mdx",
  "content/blog/artentai-autonomous-enterprise-agent.mdx",
  "content/blog/asean-enterprise-ai-deployment-guide.mdx",
  "content/blog/evaluation-harnesses-enterprise-llm.mdx",
  "content/blog/evaluation-harnesses-enterprise-llm.th.mdx",
  "content/blog/rct-ecosystem-4849-tests-methodology.mdx",
  "content/blog/rct-ecosystem-4849-tests-methodology.th.mdx",
  "content/blog/hexacore-7-model-ai-infrastructure.mdx",
  "content/blog/hexacore-7-model-ai-infrastructure.th.mdx",
  "content/blog/regional-language-adapter-thai-nlp.mdx",
  "content/blog/regional-language-adapter-thai-nlp.th.mdx",
])

const staleSdkPattern = /\b(?:723(?:\s+passing\s+tests?)?|1,193|1,272|89%\s+coverage|94%\+\s+coverage|v1\.0\.2a0)\b/i
const riskyEnterprisePattern = /4,849|62 microservices/i
const riskyBenchmarkPattern = /0\.3%|99\.98%/i
const requiredFrontmatterKeys = ["claimScope:", "evidenceLane:", "lastEvidenceReview:"]
const benchmarkFramingPattern = /benchmark scope|benchmark-scoped|research \/ benchmark scope|controlled workload/i
const enterpriseFramingPattern = /enterprise-private|enterprise private snapshot|enterprise environment|enterprise-side|enterprise contexts/i

function walkMdxFiles(dirPath) {
  const entries = readdirSync(dirPath)
  const files = []

  for (const entry of entries) {
    const fullPath = join(dirPath, entry)
    const stats = statSync(fullPath)
    if (stats.isDirectory()) {
      files.push(...walkMdxFiles(fullPath))
      continue
    }
    if (entry.endsWith(".mdx")) {
      files.push(fullPath)
    }
  }

  return files
}

const mode = process.argv.includes("--corpus") ? "corpus" : "reviewed"
const allBlogFiles = walkMdxFiles(blogRoot).map((filePath) =>
  relative(root, filePath).replaceAll("\\", "/")
)
const targetFiles =
  mode === "corpus"
    ? allBlogFiles
    : allBlogFiles.filter((file) => reviewedFiles.has(file))

const errors = []
const warnings = []

for (const relativePath of targetFiles) {
  const filePath = join(root, relativePath)
  const content = readFileSync(filePath, "utf8")
  const hasRiskyToken =
    staleSdkPattern.test(content) ||
    riskyEnterprisePattern.test(content) ||
    riskyBenchmarkPattern.test(content)

  for (const key of requiredFrontmatterKeys) {
    if (!content.includes(`\n${key}`)) {
      const message = `${relativePath}: missing frontmatter key ${key.slice(0, -1)}`
      if (mode === "reviewed" || hasRiskyToken) {
        errors.push(message)
      } else {
        warnings.push(message)
      }
    }
  }

  if (staleSdkPattern.test(content)) {
    errors.push(`${relativePath}: contains stale SDK token matched by ${staleSdkPattern}`)
  }

  if (riskyEnterprisePattern.test(content) && !enterpriseFramingPattern.test(content)) {
    const message = `${relativePath}: contains enterprise-scale numbers without enterprise framing`
    if (mode === "reviewed") {
      errors.push(message)
    } else {
      warnings.push(message)
    }
  }

  if (riskyBenchmarkPattern.test(content) && !benchmarkFramingPattern.test(content)) {
    const message = `${relativePath}: contains benchmark-style figures without benchmark framing`
    if (mode === "reviewed") {
      errors.push(message)
    } else {
      warnings.push(message)
    }
  }
}

if (warnings.length > 0) {
  console.warn(`[audit:claims] ${warnings.length} corpus warning(s)`)
  for (const warning of warnings) {
    console.warn(`- ${warning}`)
  }
}

if (errors.length > 0) {
  console.error("[audit:claims] claim drift detected")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(
  `[audit:claims] checked ${targetFiles.length} ${mode === "corpus" ? "blog files" : "reviewed blog files"}; no guarded drift found`
)