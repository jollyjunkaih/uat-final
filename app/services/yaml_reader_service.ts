import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import { slugify } from '#utils/slugify'
import type { PrdYamlData, UatYamlData } from '#services/yaml_writer_service'

export default class YamlReaderService {
  private basePath: string

  constructor(basePath?: string) {
    this.basePath = basePath || join(process.cwd(), 'yaml')
  }

  private getProjectDir(projectName: string, projectId: string): string {
    const slug = slugify(projectName) || 'unnamed'
    const shortId = projectId.substring(0, 8)
    return join(this.basePath, `${slug}-${shortId}`)
  }

  readPrd(projectName: string, projectId: string): PrdYamlData | null {
    const filePath = join(this.getProjectDir(projectName, projectId), 'prd.yaml')
    if (!existsSync(filePath)) return null

    const content = readFileSync(filePath, 'utf-8')
    const parsed = parse(content)
    if (!parsed) return null

    const { _projectId: _, _generatedAt: __, ...data } = parsed
    return data as PrdYamlData
  }

  readUat(projectName: string, projectId: string): UatYamlData | null {
    const filePath = join(this.getProjectDir(projectName, projectId), 'uat.yaml')
    if (!existsSync(filePath)) return null

    const content = readFileSync(filePath, 'utf-8')
    const parsed = parse(content)
    if (!parsed) return null

    const { _projectId: _, _generatedAt: __, ...data } = parsed
    return data as UatYamlData
  }

  readPrdFromPath(filePath: string): PrdYamlData | null {
    if (!existsSync(filePath)) return null

    const content = readFileSync(filePath, 'utf-8')
    const parsed = parse(content)
    if (!parsed) return null

    const { _projectId: _, _generatedAt: __, ...data } = parsed
    return data as PrdYamlData
  }

  readUatFromPath(filePath: string): UatYamlData | null {
    if (!existsSync(filePath)) return null

    const content = readFileSync(filePath, 'utf-8')
    const parsed = parse(content)
    if (!parsed) return null

    const { _projectId: _, _generatedAt: __, ...data } = parsed
    return data as UatYamlData
  }

  listProjects(): string[] {
    if (!existsSync(this.basePath)) return []
    return readdirSync(this.basePath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  }

  projectExists(projectName: string, projectId: string): boolean {
    return existsSync(this.getProjectDir(projectName, projectId))
  }
}
