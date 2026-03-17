#!/usr/bin/env node

/**
 * Build script for the Astro documentation site.
 *
 * Reads user-guide.yaml + images from yaml/ directory,
 * generates JSON data files and copies images into docs-site/,
 * then builds the Astro static site.
 *
 * Usage:
 *   node scripts/build-docs.mjs            # Build only
 *   node scripts/build-docs.mjs --deploy   # Build + git commit & push
 *   node scripts/build-docs.mjs --no-git   # Build without git operations
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, cpSync, statSync } from 'fs'
import { join, parse as parsePath } from 'path'
import { execSync } from 'child_process'
import { parse as parseYaml } from 'yaml'

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '')
const YAML_DIR = join(ROOT, 'yaml')
const DOCS_DIR = join(ROOT, 'docs-site')
const DATA_DIR = join(DOCS_DIR, 'src', 'data', 'projects')
const PUBLIC_IMAGES = join(DOCS_DIR, 'public', 'images')

const args = process.argv.slice(2)
const shouldDeploy = args.includes('--deploy')
const noGit = args.includes('--no-git')

// ── Helpers ──

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
}

function copyDirIfExists(src, dest) {
  if (!existsSync(src)) return 0
  ensureDir(dest)
  const files = readdirSync(src)
  let copied = 0
  for (const file of files) {
    const srcPath = join(src, file)
    const destPath = join(dest, file)
    // Skip if destination exists and has same size + mtime
    if (existsSync(destPath)) {
      const srcStat = statSync(srcPath)
      const destStat = statSync(destPath)
      if (srcStat.size === destStat.size && srcStat.mtimeMs <= destStat.mtimeMs) {
        continue
      }
    }
    cpSync(srcPath, destPath)
    copied++
  }
  return copied
}

function buildImageManifest(slug) {
  const manifest = {}
  const imageDir = join(PUBLIC_IMAGES, slug)

  for (const [subDir, urlPrefix] of [
    ['gifs', `/images/${slug}/gifs`],
    ['photos', `/images/${slug}/photos`],
  ]) {
    const dir = join(imageDir, subDir)
    if (!existsSync(dir)) continue
    for (const file of readdirSync(dir)) {
      const { name } = parsePath(file)
      // GIFs take priority — only set if not already mapped from gifs/
      if (!manifest[name]) {
        manifest[name] = `${urlPrefix}/${file}`
      }
    }
  }

  return manifest
}

function extractProjectName(dirName) {
  // Directory format: {slug}-{first8uuid}
  // Remove the last 9 chars (dash + 8-char uuid)
  const parts = dirName.split('-')
  if (parts.length <= 1) return dirName
  // Last part is the 8-char uuid
  const uuid = parts[parts.length - 1]
  if (uuid.length === 8 && /^[a-f0-9]+$/.test(uuid)) {
    return parts.slice(0, -1).join('-')
  }
  return dirName
}

// ── Main ──

console.log('=== Docs Site Builder ===\n')

// 1. Scan yaml/ for project directories
if (!existsSync(YAML_DIR)) {
  console.error('Error: yaml/ directory not found')
  process.exit(1)
}

const projectDirs = readdirSync(YAML_DIR).filter((d) => {
  return statSync(join(YAML_DIR, d)).isDirectory()
})

if (projectDirs.length === 0) {
  console.error('Error: No project directories found in yaml/')
  process.exit(1)
}

console.log(`Found ${projectDirs.length} project(s): ${projectDirs.join(', ')}\n`)

const projectsIndex = []

// 2. Process each project
for (const dirName of projectDirs) {
  const projectDir = join(YAML_DIR, dirName)
  const guideFile = join(projectDir, 'user-guide.yaml')

  if (!existsSync(guideFile)) {
    console.log(`  [skip] ${dirName}: no user-guide.yaml`)
    continue
  }

  console.log(`Processing: ${dirName}`)
  const slug = dirName

  // Parse user-guide.yaml
  const yamlContent = readFileSync(guideFile, 'utf-8')
  const guideData = parseYaml(yamlContent)

  // Remove internal fields
  delete guideData._projectId
  delete guideData._generatedAt

  // Write JSON data
  const projectDataDir = join(DATA_DIR, slug)
  ensureDir(projectDataDir)
  writeFileSync(join(projectDataDir, 'user-guide.json'), JSON.stringify(guideData, null, 2))
  console.log(`  -> user-guide.json written`)

  // Copy images
  const photosDir = join(projectDir, 'photos', 'docs')
  const gifsDir = join(projectDir, 'gifs', 'docs')
  const destPhotos = join(PUBLIC_IMAGES, slug, 'photos')
  const destGifs = join(PUBLIC_IMAGES, slug, 'gifs')

  const photosCopied = copyDirIfExists(photosDir, destPhotos)
  const gifsCopied = copyDirIfExists(gifsDir, destGifs)
  console.log(`  -> images: ${photosCopied} photos, ${gifsCopied} gifs copied`)

  // Build image manifest
  const manifest = buildImageManifest(slug)
  writeFileSync(join(projectDataDir, 'image-manifest.json'), JSON.stringify(manifest, null, 2))
  console.log(`  -> image-manifest.json: ${Object.keys(manifest).length} entries`)

  // Add to index
  const name = extractProjectName(dirName)
  projectsIndex.push({
    slug,
    name: guideData.metadata?.title || name,
    description: guideData.metadata?.description || '',
    version: guideData.metadata?.version || '1.0',
  })
}

// 3. Write projects index
ensureDir(join(DOCS_DIR, 'src', 'data'))
writeFileSync(
  join(DOCS_DIR, 'src', 'data', 'projects-index.json'),
  JSON.stringify(projectsIndex, null, 2)
)
console.log(`\nProjects index: ${projectsIndex.length} project(s)\n`)

// 4. Build Astro site
console.log('Building Astro site...')
try {
  execSync('npm run build', { cwd: DOCS_DIR, stdio: 'inherit' })
  console.log('\nBuild complete!\n')
} catch (err) {
  console.error('Build failed!')
  process.exit(1)
}

// 5. Deploy (optional)
if (shouldDeploy && !noGit) {
  console.log('Deploying to git...')

  if (!existsSync(join(DOCS_DIR, '.git'))) {
    console.log('Initializing git repo in docs-site/...')
    execSync('git init', { cwd: DOCS_DIR, stdio: 'inherit' })
    console.log('\nPlease set up the remote:')
    console.log('  cd docs-site && git remote add origin <your-repo-url>')
    console.log('\nThen re-run: npm run docs:deploy')
    process.exit(0)
  }

  const date = new Date().toISOString().split('T')[0]
  try {
    execSync('git add -A', { cwd: DOCS_DIR, stdio: 'inherit' })

    // Check if there are changes to commit
    const status = execSync('git status --porcelain', { cwd: DOCS_DIR, encoding: 'utf-8' })
    if (status.trim().length === 0) {
      console.log('No changes to commit.')
    } else {
      execSync(`git commit -m "Update docs: ${date}"`, { cwd: DOCS_DIR, stdio: 'inherit' })
      execSync('git push', { cwd: DOCS_DIR, stdio: 'inherit' })
      console.log('\nDeployed successfully!')
    }
  } catch (err) {
    console.error('Deploy failed:', err.message)
    process.exit(1)
  }
}

console.log('Done.')
