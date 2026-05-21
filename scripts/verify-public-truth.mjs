import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const root = process.cwd()
const baseUrl = (process.env.VERIFY_BASE_URL ?? "http://127.0.0.1:3005").replace(/\/$/, "")
const routes = [
  "/en/platform",
  "/en/docs",
  "/en/research",
  "/en/company",
  "/en/company/press",
  "/en/pricing",
  "/en/solutions",
  "/en/architecture",
  "/en/integration",
]
const scanRoots = ["app", "components", "content", "messages", "lib"]
const stalePattern = /99\.98%|v5\.4\.5|4,849|62 microservices|Production v[0-9]+\.[0-9]+\.[0-9]+/i
const allowedContextPattern = /public sdk verified|enterprise private snapshot|research \/ benchmark scope|benchmark evidence|controlled workload|availability target|operational target|public snapshot|public-safe|design goal|current public sdk checkpoint|public sdk proof lane|enterprise environment/i

function walkFiles(dirPath) {
  const entries = readdirSync(dirPath)
  const files = []

  for (const entry of entries) {
    const fullPath = join(dirPath, entry)
    const stats = statSync(fullPath)
    if (stats.isDirectory()) {
      files.push(...walkFiles(fullPath))
      continue
    }
    files.push(fullPath)
  }

  return files
}

async function checkRoutes() {
  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route}`, {
      headers: {
        "cache-control": "no-cache",
        pragma: "no-cache",
      },
    })
    if (!response.ok) {
      throw new Error(`[verify:public] route health check failed for ${route} -> HTTP ${response.status}`)
    }

    const html = await response.text()
    const matches = html.match(new RegExp(stalePattern, "gi"))
    if (matches && matches.length > 0 && !allowedContextPattern.test(html)) {
      throw new Error(`[verify:public] rendered page contains stale tokens for ${route}: ${matches.join(", ")}`)
    }
  }
}

function checkSources() {
  const matches = []
  for (const scanRoot of scanRoots) {
    for (const filePath of walkFiles(join(root, scanRoot))) {
      const content = readFileSync(filePath, "utf8")
      if (stalePattern.test(content) && !allowedContextPattern.test(content)) {
        matches.push(relative(root, filePath).replaceAll("\\", "/"))
      }
    }
  }
  if (matches.length > 0) {
    throw new Error(`[verify:public] source scan found stale tokens in: ${matches.join(", ")}`)
  }
}

await checkRoutes()
checkSources()
console.log(`[verify:public] verified ${routes.length} public routes at ${baseUrl} with clean source scan`)