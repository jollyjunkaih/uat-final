# Multi-Image & GIF Support for UAT Steps — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend UAT steps to support multiple numbered photos and one GIF per step, with auto frame extraction, updated PDF grid layout, YAML sync, and a new presentation-style UAT Viewer tab.

**Architecture:** New `step_images` table stores ordered photos per step. `gif_file_name` column on `steps` stores the GIF. On GIF upload, `sharp` extracts frames into `step_images`. PDF renders images in a 2-per-row grid with arrows. New UAT Viewer tab shows GIFs in a presentation-style slideshow.

**Tech Stack:** AdonisJS V7, Lucid ORM, PostgreSQL, sharp, @react-pdf/renderer, React 19, TanStack React Query

**Spec:** `docs/superpowers/specs/2026-03-16-multi-image-gif-steps-design.md`

---

## Chunk 1: Database, Models, and Backend Services

### Task 1: Install sharp dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install sharp as production dependency**

Run: `npm install sharp`

- [ ] **Step 2: Verify installation**

Run: `node -e "const sharp = require('sharp'); console.log('sharp version:', sharp.versions.sharp)"`
Expected: Prints sharp version without errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add sharp for GIF frame extraction"
```

---

### Task 2: Create database migrations

**Files:**
- Create: `database/migrations/1761886000022_create_step_images_table.ts`
- Create: `database/migrations/1761886000023_add_gif_file_name_to_steps.ts`
- Create: `database/migrations/1761886000024_drop_image_file_name_from_steps.ts`

- [ ] **Step 1: Create step_images table migration**

```typescript
// database/migrations/1761886000022_create_step_images_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'step_images'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('step_id').notNullable().references('id').inTable('steps').onDelete('CASCADE')
      table.string('file_name', 500).notNullable()
      table.integer('sequence').notNullable()
      table.string('source', 20).notNullable().defaultTo('upload')
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.index(['step_id', 'sequence'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

- [ ] **Step 2: Create add gif_file_name migration**

```typescript
// database/migrations/1761886000023_add_gif_file_name_to_steps.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'steps'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('gif_file_name', 500).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('gif_file_name')
    })
  }
}
```

- [ ] **Step 3: Create drop image_file_name migration**

```typescript
// database/migrations/1761886000024_drop_image_file_name_from_steps.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'steps'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('image_file_name')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('image_file_name', 500).nullable()
    })
  }
}
```

- [ ] **Step 4: Run migrations**

Run: `npm run migrate`
Expected: All three migrations run successfully.

- [ ] **Step 5: Commit**

```bash
git add database/migrations/1761886000022_create_step_images_table.ts database/migrations/1761886000023_add_gif_file_name_to_steps.ts database/migrations/1761886000024_drop_image_file_name_from_steps.ts
git commit -m "feat: add step_images table and gif_file_name column, drop image_file_name"
```

---

### Task 3: Create StepImage model

**Files:**
- Create: `app/models/step_image.ts`
- Modify: `app/models/step.ts` (lines 1-39)

- [ ] **Step 1: Create StepImage model**

```typescript
// app/models/step_image.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Step from '#models/step'

export default class StepImage extends BaseModel {
  static table = 'step_images'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare stepId: string

  @column()
  declare fileName: string

  @column()
  declare sequence: number

  @column()
  declare source: 'upload' | 'gif_extraction'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Step)
  declare step: BelongsTo<typeof Step>
}
```

- [ ] **Step 2: Update Step model**

Replace the entire contents of `app/models/step.ts` with:

```typescript
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import UatFlow from '#models/uat_flow'
import StepImage from '#models/step_image'

export default class Step extends BaseModel {
  static table = 'steps'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare uatFlowId: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare sequence: number

  @column()
  declare gifFileName: string | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => UatFlow)
  declare uatFlow: BelongsTo<typeof UatFlow>

  @hasMany(() => StepImage)
  declare stepImages: HasMany<typeof StepImage>
}
```

- [ ] **Step 3: Commit**

```bash
git add app/models/step_image.ts app/models/step.ts
git commit -m "feat: add StepImage model and update Step model with gif support"
```

---

### Task 4: Create StepImageService

**Files:**
- Create: `app/services/step_image_service.ts`
- Modify: `app/services/step_service.ts` (lines 86-157 — remove old image methods)

- [ ] **Step 1: Create StepImageService**

```typescript
// app/services/step_image_service.ts
import StepImage from '#models/step_image'
import Step from '#models/step'
import { randomUUID } from 'node:crypto'
import { unlink, mkdir, readdir } from 'node:fs/promises'
import { join, parse as parsePath } from 'node:path'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import YamlWriterService from '#services/yaml_writer_service'

export default class StepImageService {
  private getPhotosDir(projectName: string, projectId: string): string {
    const writer = new YamlWriterService()
    return join(writer.getProjectDir(projectName, projectId), 'photos')
  }

  async findImageFile(photosDir: string, fileName: string): Promise<string | null> {
    try {
      const files = await readdir(photosDir)
      const match = files.find((f) => parsePath(f).name === fileName)
      return match ? join(photosDir, match) : null
    } catch {
      return null
    }
  }

  async findByStepId(stepId: string): Promise<StepImage[]> {
    return StepImage.query()
      .where('step_id', stepId)
      .orderBy('sequence', 'asc')
  }

  async findById(id: string): Promise<StepImage> {
    return StepImage.findOrFail(id)
  }

  async getNextSequence(stepId: string): Promise<number> {
    const result = await StepImage.query()
      .where('step_id', stepId)
      .max('sequence as maxSeq')
    const maxSeq = result[0]?.$extras?.maxSeq
    return (maxSeq ?? 0) + 1
  }

  async uploadPhoto(
    stepId: string,
    projectName: string,
    projectId: string,
    file: MultipartFile
  ): Promise<StepImage> {
    const photosDir = this.getPhotosDir(projectName, projectId)
    await mkdir(photosDir, { recursive: true })

    const parsed = parsePath(file.clientName)
    const baseName = `${randomUUID()}-${parsed.name}`
    const fullName = `${baseName}${parsed.ext}`
    await file.move(photosDir, { name: fullName })

    if (!file.filePath) {
      throw new Error('File upload failed')
    }

    const sequence = await this.getNextSequence(stepId)

    return StepImage.create({
      stepId,
      fileName: baseName,
      sequence,
      source: 'upload' as const,
    })
  }

  async deleteImage(id: string, projectName: string, projectId: string): Promise<void> {
    const image = await this.findById(id)
    const stepId = image.stepId
    const photosDir = this.getPhotosDir(projectName, projectId)

    // Delete file from disk
    const filePath = await this.findImageFile(photosDir, image.fileName)
    if (filePath) {
      try {
        await unlink(filePath)
      } catch {
        // File may already be deleted
      }
    }

    await image.delete()

    // Re-compact sequences
    await this.recompactSequences(stepId)
  }

  async recompactSequences(stepId: string): Promise<void> {
    const images = await StepImage.query()
      .where('step_id', stepId)
      .orderBy('sequence', 'asc')

    for (let i = 0; i < images.length; i++) {
      if (images[i].sequence !== i + 1) {
        images[i].sequence = i + 1
        await images[i].save()
      }
    }
  }

  async getImageFilePath(
    imageId: string,
    projectName: string,
    projectId: string
  ): Promise<string | null> {
    const image = await this.findById(imageId)
    const photosDir = this.getPhotosDir(projectName, projectId)
    return this.findImageFile(photosDir, image.fileName)
  }

  async uploadGif(
    stepId: string,
    projectName: string,
    projectId: string,
    file: MultipartFile
  ): Promise<Step> {
    const step = await Step.findOrFail(stepId)
    const photosDir = this.getPhotosDir(projectName, projectId)
    await mkdir(photosDir, { recursive: true })

    // Clean up old GIF if exists
    if (step.gifFileName) {
      await this.deleteGifFiles(step, photosDir)
    }

    // Save GIF file
    const parsed = parsePath(file.clientName)
    const baseName = `${randomUUID()}-${parsed.name}`
    const fullName = `${baseName}${parsed.ext}`
    await file.move(photosDir, { name: fullName })

    if (!file.filePath) {
      throw new Error('File upload failed')
    }

    step.gifFileName = baseName
    await step.save()

    // Extract frames using sharp
    const sharp = (await import('sharp')).default
    const gifPath = join(photosDir, fullName)
    const metadata = await sharp(gifPath, { animated: true }).metadata()
    const pageCount = Math.min(metadata.pages || 1, 100)

    // Delete existing gif_extraction images
    await StepImage.query()
      .where('step_id', stepId)
      .where('source', 'gif_extraction')
      .delete()

    for (let i = 0; i < pageCount; i++) {
      const frameBaseName = `${randomUUID()}-frame-${i + 1}`
      const framePath = join(photosDir, `${frameBaseName}.jpg`)

      await sharp(gifPath, { page: i })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .jpeg({ quality: 95 })
        .toFile(framePath)

      const sequence = await this.getNextSequence(stepId)
      await StepImage.create({
        stepId,
        fileName: frameBaseName,
        sequence,
        source: 'gif_extraction' as const,
      })
    }

    return step
  }

  async deleteGif(
    stepId: string,
    projectName: string,
    projectId: string
  ): Promise<Step> {
    const step = await Step.findOrFail(stepId)
    const photosDir = this.getPhotosDir(projectName, projectId)

    if (step.gifFileName) {
      await this.deleteGifFiles(step, photosDir)
      step.gifFileName = null
      await step.save()
    }

    // Re-compact sequences on remaining images
    await this.recompactSequences(stepId)

    return step
  }

  async getGifPath(
    stepId: string,
    projectName: string,
    projectId: string
  ): Promise<string | null> {
    const step = await Step.findOrFail(stepId)
    if (!step.gifFileName) return null

    const photosDir = this.getPhotosDir(projectName, projectId)
    return this.findImageFile(photosDir, step.gifFileName)
  }

  private async deleteGifFiles(step: Step, photosDir: string): Promise<void> {
    // Delete GIF file from disk
    if (step.gifFileName) {
      const gifPath = await this.findImageFile(photosDir, step.gifFileName)
      if (gifPath) {
        try {
          await unlink(gifPath)
        } catch {
          // File may already be deleted
        }
      }
    }

    // Delete extracted frame images from disk and DB
    const extractedImages = await StepImage.query()
      .where('step_id', step.id)
      .where('source', 'gif_extraction')

    for (const img of extractedImages) {
      const filePath = await this.findImageFile(photosDir, img.fileName)
      if (filePath) {
        try {
          await unlink(filePath)
        } catch {
          // ignore
        }
      }
    }

    await StepImage.query()
      .where('step_id', step.id)
      .where('source', 'gif_extraction')
      .delete()
  }
}
```

- [ ] **Step 2: Remove old image methods from StepService**

In `app/services/step_service.ts`, remove lines 86-157 (everything from `private getPhotosDir` through end of `deleteImage`). The file should end after the `reorder` method at line 84.

- [ ] **Step 3: Commit**

```bash
git add app/services/step_image_service.ts app/services/step_service.ts
git commit -m "feat: add StepImageService for multi-image and GIF support"
```

---

### Task 5: Create StepImageTransformer and update StepTransformer

**Files:**
- Create: `app/transformers/step_image_transformer.ts`
- Modify: `app/transformers/step_transformer.ts` (lines 1-18)

- [ ] **Step 1: Create StepImageTransformer**

```typescript
// app/transformers/step_image_transformer.ts
import type StepImage from '#models/step_image'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class StepImageTransformer extends BaseTransformer<StepImage> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'stepId',
      'fileName',
      'sequence',
      'source',
      'createdAt',
    ])
  }
}
```

- [ ] **Step 2: Update StepTransformer**

Replace `app/transformers/step_transformer.ts` with:

```typescript
import type Step from '#models/step'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class StepTransformer extends BaseTransformer<Step> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'uatFlowId',
      'name',
      'description',
      'sequence',
      'gifFileName',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ])
  }
}
```

**Note:** The spec mentions including a nested `images` array in the StepTransformer, but the codebase's `BaseTransformer.pick()` pattern doesn't support nested relation mapping. Instead, step images are fetched via a separate `GET /api/steps/:stepId/images` endpoint. The frontend uses `useStepImages(stepId)` per step, which is consistent with how the codebase handles other sub-resources.

- [ ] **Step 3: Commit**

```bash
git add app/transformers/step_image_transformer.ts app/transformers/step_transformer.ts
git commit -m "feat: add StepImageTransformer and update StepTransformer for gif support"
```

---

### Task 6: Update StepsController and routes

**Files:**
- Modify: `app/controllers/steps_controller.ts` (lines 1-135)
- Modify: `start/routes.ts` (lines 123-132)

- [ ] **Step 1: Rewrite StepsController**

Replace `app/controllers/steps_controller.ts` with:

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import StepService from '#services/step_service'
import StepImageService from '#services/step_image_service'
import StepTransformer from '#transformers/step_transformer'
import StepImageTransformer from '#transformers/step_image_transformer'
import {
  createStepValidator,
  updateStepValidator,
  reorderStepsValidator,
} from '#validators/step_validator'
import YamlSyncService from '#services/yaml_sync_service'
import Project from '#models/project'

export default class StepsController {
  async index(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const limit = ctx.request.input('limit', 20)
    const uatFlowId = ctx.request.input('uatFlowId')
    const service = new StepService()
    const params: Record<string, unknown> = {}
    if (uatFlowId) params.uatFlowId = uatFlowId
    const paginated = await service.findPaginated(params, page, limit)
    const data = paginated.all()
    const meta = paginated.getMeta()
    const response = await ctx.serialize(StepTransformer.paginate(data, meta))
    return ctx.response.json(response)
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new StepService()
    const step = await service.findById(id)
    return ctx.response.json({ data: StepTransformer.transform(step) })
  }

  async store(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(createStepValidator)
    const service = new StepService()
    const step = await service.create(data)
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(step.id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: StepTransformer.transform(step) })
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await ctx.request.validateUsing(updateStepValidator)
    const service = new StepService()
    const step = await service.update(id, data)
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(step.id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: StepTransformer.transform(step) })
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(id)
    const service = new StepService()
    await service.delete(id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: { success: true } })
  }

  async reorder(ctx: HttpContext) {
    const { ids } = await ctx.request.validateUsing(reorderStepsValidator)
    const service = new StepService()
    await service.reorder(ids)
    if (ids.length > 0) {
      const yamlSync = new YamlSyncService()
      const projectId = await yamlSync.getProjectIdFromStep(ids[0])
      yamlSync.syncUat(projectId).catch(() => {})
    }
    return ctx.response.json({ data: { success: true } })
  }

  // --- Step Images ---

  async listImages(ctx: HttpContext) {
    const stepId = ctx.params.stepId
    const service = new StepImageService()
    const images = await service.findByStepId(stepId)
    return ctx.response.json({ data: images.map((img) => StepImageTransformer.transform(img)) })
  }

  async uploadPhoto(ctx: HttpContext) {
    const stepId = ctx.params.stepId
    const file = ctx.request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
    })

    if (!file) {
      return ctx.response.badRequest({ error: 'No image file provided' })
    }
    if (file.hasErrors) {
      return ctx.response.badRequest({ error: file.errors[0]?.message || 'Invalid file' })
    }

    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(stepId)
    const project = await Project.findOrFail(projectId)

    const service = new StepImageService()
    const image = await service.uploadPhoto(stepId, project.name, projectId, file)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: StepImageTransformer.transform(image) })
  }

  async deleteStepImage(ctx: HttpContext) {
    const imageId = ctx.params.id
    const service = new StepImageService()
    const image = await service.findById(imageId)

    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(image.stepId)
    const project = await Project.findOrFail(projectId)

    await service.deleteImage(imageId, project.name, projectId)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: { success: true } })
  }

  async getStepImageFile(ctx: HttpContext) {
    const imageId = ctx.params.id
    const service = new StepImageService()
    const image = await service.findById(imageId)

    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(image.stepId)
    const project = await Project.findOrFail(projectId)

    const filePath = await service.getImageFilePath(imageId, project.name, projectId)
    if (!filePath) {
      return ctx.response.notFound({ error: 'Image file not found' })
    }
    return ctx.response.download(filePath)
  }

  // --- GIF ---

  async uploadGif(ctx: HttpContext) {
    const stepId = ctx.params.stepId
    const file = ctx.request.file('gif', {
      size: '50mb',
      extnames: ['gif'],
    })

    if (!file) {
      return ctx.response.badRequest({ error: 'No GIF file provided' })
    }
    if (file.hasErrors) {
      return ctx.response.badRequest({ error: file.errors[0]?.message || 'Invalid file' })
    }

    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(stepId)
    const project = await Project.findOrFail(projectId)

    const service = new StepImageService()
    const step = await service.uploadGif(stepId, project.name, projectId, file)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: StepTransformer.transform(step) })
  }

  async getGif(ctx: HttpContext) {
    const stepId = ctx.params.stepId
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(stepId)
    const project = await Project.findOrFail(projectId)

    const service = new StepImageService()
    const gifPath = await service.getGifPath(stepId, project.name, projectId)
    if (!gifPath) {
      return ctx.response.notFound({ error: 'No GIF for this step' })
    }
    return ctx.response.download(gifPath)
  }

  async deleteGif(ctx: HttpContext) {
    const stepId = ctx.params.stepId
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(stepId)
    const project = await Project.findOrFail(projectId)

    const service = new StepImageService()
    const step = await service.deleteGif(stepId, project.name, projectId)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: StepTransformer.transform(step) })
  }
}
```

- [ ] **Step 2: Update routes**

In `start/routes.ts`, replace lines 123-132 (the Steps section) with:

```typescript
    // Steps
    router.get('api/steps', [StepsController, 'index'])
    router.post('api/steps', [StepsController, 'store'])
    router.post('api/steps/reorder', [StepsController, 'reorder'])
    router.get('api/steps/:id', [StepsController, 'show'])
    router.patch('api/steps/:id', [StepsController, 'update'])
    router.delete('api/steps/:id', [StepsController, 'destroy'])

    // Step Images
    router.get('api/steps/:stepId/images', [StepsController, 'listImages'])
    router.post('api/steps/:stepId/images', [StepsController, 'uploadPhoto'])
    router.delete('api/step-images/:id', [StepsController, 'deleteStepImage'])
    router.get('api/step-images/:id/file', [StepsController, 'getStepImageFile'])

    // Step GIF
    router.post('api/steps/:stepId/gif', [StepsController, 'uploadGif'])
    router.get('api/steps/:stepId/gif', [StepsController, 'getGif'])
    router.delete('api/steps/:stepId/gif', [StepsController, 'deleteGif'])
```

- [ ] **Step 3: Commit**

```bash
git add app/controllers/steps_controller.ts start/routes.ts
git commit -m "feat: add step images and GIF endpoints, remove old single image endpoints"
```

---

### Task 7: Update YAML services

**Files:**
- Modify: `app/services/yaml_writer_service.ts` (lines 98-103 — UatStepYaml interface)
- Modify: `app/services/yaml_sync_service.ts` (lines 111-148 — syncUat step mapping)
- Modify: `app/services/yaml_import_service.ts` (lines 172-181 — importUat step creation)

- [ ] **Step 1: Update UatYamlData interface in yaml_writer_service.ts**

In `app/services/yaml_writer_service.ts`, replace lines 98-102:

```typescript
// Old:
      steps: Array<{
        name: string
        description: string | null
        sequence: number
        imageFileName: string | null
      }>

// New:
      steps: Array<{
        name: string
        description: string | null
        sequence: number
        gifFileName: string | null
        imageFileNames: string[]
      }>
```

- [ ] **Step 2: Update syncUat in yaml_sync_service.ts**

In `app/services/yaml_sync_service.ts`, replace lines 111-112 (the step preload) to also preload stepImages:

```typescript
// Old:
          .preload('steps', (stepQuery) => {
            stepQuery.whereNull('deleted_at').orderBy('sequence', 'asc')
          })

// New:
          .preload('steps', (stepQuery) => {
            stepQuery.whereNull('deleted_at').orderBy('sequence', 'asc')
              .preload('stepImages', (imgQuery) => {
                imgQuery.orderBy('sequence', 'asc')
              })
          })
```

Then replace lines 143-148 (the step mapping):

```typescript
// Old:
          steps: flow.steps.map((step) => ({
            name: step.name,
            description: step.description,
            sequence: step.sequence,
            imageFileName: step.imageFileName,
          })),

// New:
          steps: flow.steps.map((step) => ({
            name: step.name,
            description: step.description,
            sequence: step.sequence,
            gifFileName: step.gifFileName,
            imageFileNames: (step.stepImages || []).map((img) => img.fileName),
          })),
```

- [ ] **Step 3: Update importUat in yaml_import_service.ts**

In `app/services/yaml_import_service.ts`, add import at top of file:

```typescript
import StepImage from '#models/step_image'
```

Then replace lines 172-181 (step creation block):

```typescript
// Old:
        if (flowData.steps?.length) {
          for (const stepData of flowData.steps) {
            await Step.create({
              uatFlowId: flow.id,
              name: stepData.name,
              description: stepData.description ?? null,
              sequence: stepData.sequence,
              imageFileName: stepData.imageFileName ?? null,
            })
          }
        }

// New:
        if (flowData.steps?.length) {
          for (const stepData of flowData.steps) {
            const step = await Step.create({
              uatFlowId: flow.id,
              name: stepData.name,
              description: stepData.description ?? null,
              sequence: stepData.sequence,
              gifFileName: (stepData as any).gifFileName ?? null,
            })

            // Support new imageFileNames array format
            const imageFileNames: string[] = (stepData as any).imageFileNames ?? []

            // Backward compatibility: old imageFileName (singular) format
            if (imageFileNames.length === 0 && (stepData as any).imageFileName) {
              imageFileNames.push((stepData as any).imageFileName)
            }

            for (let imgIdx = 0; imgIdx < imageFileNames.length; imgIdx++) {
              await StepImage.create({
                stepId: step.id,
                fileName: imageFileNames[imgIdx],
                sequence: imgIdx + 1,
                source: 'upload',
              })
            }
          }
        }
```

- [ ] **Step 4: Commit**

```bash
git add app/services/yaml_writer_service.ts app/services/yaml_sync_service.ts app/services/yaml_import_service.ts
git commit -m "feat: update YAML services for multi-image and GIF fields"
```

---

### Task 8: Update VersionService

**Files:**
- Modify: `app/services/version_service.ts` (lines 70-72)

- [ ] **Step 1: Add stepImages preload in createSnapshot**

In `app/services/version_service.ts`, replace lines 70-72:

```typescript
// Old:
        uatFlowQuery.whereNull('deleted_at').preload('steps', (stepQuery) => {
          stepQuery.whereNull('deleted_at').orderBy('sequence', 'asc')
        }).orderBy('sequence', 'asc')

// New:
        uatFlowQuery.whereNull('deleted_at').preload('steps', (stepQuery) => {
          stepQuery.whereNull('deleted_at').orderBy('sequence', 'asc')
            .preload('stepImages', (imgQuery) => {
              imgQuery.orderBy('sequence', 'asc')
            })
        }).orderBy('sequence', 'asc')
```

- [ ] **Step 2: Commit**

```bash
git add app/services/version_service.ts
git commit -m "feat: include stepImages in version snapshots"
```

---

## Chunk 2: PDF Changes

### Task 9: Update UAT PDF service and document

**Files:**
- Modify: `app/services/pdf/uat_pdf_service.ts` (lines 1-93)
- Modify: `app/services/pdf/uat_pdf_document.tsx` (lines 186-192, 313-328)

- [ ] **Step 1: Update UatPdfService to resolve multiple image paths**

In `app/services/pdf/uat_pdf_service.ts`, replace the step mapping (lines 45-54):

```typescript
// Old:
            steps: await Promise.all(
              (flow.steps || []).map(async (step) => ({
                id: step.id,
                name: step.name,
                description: step.description,
                sequence: step.sequence,
                imagePath: step.imageFileName
                  ? await this.resolveImagePath(photosDir, step.imageFileName)
                  : null,
              }))
            ),

// New:
            steps: await Promise.all(
              (flow.steps || []).map(async (step) => ({
                id: step.id,
                name: step.name,
                description: step.description,
                sequence: step.sequence,
                imagePaths: await this.resolveStepImagePaths(photosDir, step.stepImages || []),
              }))
            ),
```

Also update the preload query (lines 22-23) to include stepImages:

```typescript
// Old:
            stepQuery.whereNull('deleted_at').orderBy('sequence', 'asc')

// New:
            stepQuery.whereNull('deleted_at').orderBy('sequence', 'asc')
              .preload('stepImages', (imgQuery) => {
                imgQuery.orderBy('sequence', 'asc')
              })
```

Add new method and update `resolveImagePath` → `resolveStepImagePaths`:

```typescript
  private async resolveStepImagePaths(
    photosDir: string,
    stepImages: { fileName: string }[]
  ): Promise<string[]> {
    if (!existsSync(photosDir) || stepImages.length === 0) return []
    const paths: string[] = []
    for (const img of stepImages) {
      const resolved = await this.resolveImagePath(photosDir, img.fileName)
      if (resolved) paths.push(resolved)
    }
    return paths
  }
```

- [ ] **Step 2: Update PdfStep interface and rendering in uat_pdf_document.tsx**

In `app/services/pdf/uat_pdf_document.tsx`, update the `PdfStep` interface (lines 186-192):

```typescript
// Old:
export interface PdfStep {
  id: string
  name: string
  description: string | null
  sequence: number
  imagePath: string | null
}

// New:
export interface PdfStep {
  id: string
  name: string
  description: string | null
  sequence: number
  imagePaths: string[]
}
```

Add new styles for the image grid (add after `stepImage` style at line 141):

```typescript
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
    marginBottom: 4,
  },
  imageGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  imageGridItem: {
    alignItems: 'center',
  },
  imageGridLabel: {
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 2,
  },
  imageGridImage: {
    width: 220,
    maxHeight: 160,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    objectFit: 'contain' as const,
  },
  imageGridArrowRight: {
    fontSize: 14,
    color: '#94a3b8',
    marginHorizontal: 8,
    paddingTop: 10,
  },
  imageGridArrowDown: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginVertical: 2,
    paddingLeft: 100,
  },
```

Then replace the step image rendering (lines 322-327):

```typescript
// Old:
                        {step.imagePath && (
                          <Image
                            src={step.imagePath}
                            style={styles.stepImage}
                          />
                        )}

// New:
                        {step.imagePaths.length > 0 && (
                          <View>
                            {(() => {
                              const rows: string[][] = []
                              for (let i = 0; i < step.imagePaths.length; i += 2) {
                                rows.push(step.imagePaths.slice(i, i + 2))
                              }
                              return rows.map((row, rowIdx) => (
                                <View key={rowIdx}>
                                  {rowIdx > 0 && (
                                    <Text style={styles.imageGridArrowDown}>&#8595;</Text>
                                  )}
                                  <View style={styles.imageGridRow}>
                                    {row.map((imgPath, colIdx) => (
                                      <View key={colIdx} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {colIdx > 0 && (
                                          <Text style={styles.imageGridArrowRight}>&#8594;</Text>
                                        )}
                                        <View style={styles.imageGridItem}>
                                          <Text style={styles.imageGridLabel}>
                                            ({rowIdx * 2 + colIdx + 1})
                                          </Text>
                                          <Image src={imgPath} style={styles.imageGridImage} />
                                        </View>
                                      </View>
                                    ))}
                                  </View>
                                </View>
                              ))
                            })()}
                          </View>
                        )}
```

Also update the step container to keep title/description together but allow the image grid to wrap across pages:

```typescript
// Old (line 315):
                      <View key={step.id} style={styles.stepContainer} wrap={false}>

// New — split into two views: title/description stays together, image grid wraps:
                      <View key={step.id} style={styles.stepContainer}>
                        <View wrap={false}>
```

And move the closing `</View>` for this inner wrap-protected view to right after the description (before the image grid rendering):

```tsx
                        {step.description && (
                          <Text style={styles.stepDescription}>{step.description}</Text>
                        )}
                        </View>{/* end wrap={false} for title+description */}
                        {step.imagePaths.length > 0 && (
                          // ... image grid code as above ...
                        )}
                      </View>
```

- [ ] **Step 3: Commit**

```bash
git add app/services/pdf/uat_pdf_service.ts app/services/pdf/uat_pdf_document.tsx
git commit -m "feat: update UAT PDF to render multi-image grid with arrows"
```

---

## Chunk 3: Frontend Changes

### Task 10: Update frontend hooks

**Files:**
- Modify: `inertia/hooks/use-steps.ts` (lines 1-98)

- [ ] **Step 1: Rewrite use-steps.ts**

Replace `inertia/hooks/use-steps.ts` with:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch, apiUpload } from '~/lib/api'

export interface StepImage {
  id: string
  stepId: string
  fileName: string
  sequence: number
  source: 'upload' | 'gif_extraction'
  createdAt: string
}

export interface Step {
  id: string
  uatFlowId: string
  name: string
  description: string | null
  sequence: number
  gifFileName: string | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

interface PaginatedResponse {
  data: Step[]
  metadata: { total: number; perPage: number; currentPage: number }
}

export function useSteps(uatFlowId: string | null) {
  return useQuery({
    queryKey: ['steps', uatFlowId],
    queryFn: () => apiFetch<PaginatedResponse>(`/api/steps?uatFlowId=${uatFlowId}&limit=100`),
    enabled: !!uatFlowId,
  })
}

export function useStepImages(stepId: string | null) {
  return useQuery({
    queryKey: ['step-images', stepId],
    queryFn: () => apiFetch<{ data: StepImage[] }>(`/api/steps/${stepId}/images`),
    enabled: !!stepId,
  })
}

export function useCreateStep(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      uatFlowId: string
      name: string
      description?: string
    }) => apiFetch('/api/steps', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useUpdateStep(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      uatFlowId: _uatFlowId,
      ...data
    }: { id: string; uatFlowId: string } & Record<string, unknown>) =>
      apiFetch(`/api/steps/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useDeleteStep(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, uatFlowId: _uatFlowId }: { id: string; uatFlowId: string }) =>
      apiFetch(`/api/steps/${id}`, { method: 'DELETE' }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useUploadStepPhoto(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ stepId, uatFlowId: _uatFlowId, file }: { stepId: string; uatFlowId: string; file: File }) => {
      const formData = new FormData()
      formData.append('image', file)
      return apiUpload(`/api/steps/${stepId}/images`, formData)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['step-images', variables.stepId] })
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useDeleteStepImage(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ imageId, stepId: _stepId, uatFlowId: _uatFlowId }: { imageId: string; stepId: string; uatFlowId: string }) =>
      apiFetch(`/api/step-images/${imageId}`, { method: 'DELETE' }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['step-images', variables.stepId] })
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useUploadStepGif(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ stepId, uatFlowId: _uatFlowId, file }: { stepId: string; uatFlowId: string; file: File }) => {
      const formData = new FormData()
      formData.append('gif', file)
      return apiUpload(`/api/steps/${stepId}/gif`, formData)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['step-images', variables.stepId] })
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useDeleteStepGif(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ stepId, uatFlowId: _uatFlowId }: { stepId: string; uatFlowId: string }) =>
      apiFetch(`/api/steps/${stepId}/gif`, { method: 'DELETE' }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['step-images', variables.stepId] })
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add inertia/hooks/use-steps.ts
git commit -m "feat: update use-steps hooks for multi-image and GIF support"
```

---

### Task 11: Update UAT Flows tab for multi-image support

**Files:**
- Modify: `inertia/pages/projects/tabs/uat-flows-tab.tsx` (lines 145-317 — StepsSection)

- [ ] **Step 1: Update StepsSection component**

In `inertia/pages/projects/tabs/uat-flows-tab.tsx`:

Update the import at line 5 to use the new hooks:

```typescript
// Old:
import { useSteps, useCreateStep, useUpdateStep, useDeleteStep, useUploadStepImage, useDeleteStepImage, type Step } from '~/hooks/use-steps'

// New:
import { useSteps, useStepImages, useCreateStep, useUpdateStep, useDeleteStep, useUploadStepPhoto, useDeleteStepImage, useUploadStepGif, useDeleteStepGif, type Step, type StepImage } from '~/hooks/use-steps'
```

Replace the `StepsSection` component (lines 145-317) with:

```tsx
function StepImagesDisplay({ step, flow, projectId }: { step: Step; flow: UatFlow; projectId: string }) {
  const { data } = useStepImages(step.id)
  const deleteImage = useDeleteStepImage(projectId)
  const images = data?.data || []

  if (images.length === 0) return null

  return (
    <div className="mt-2 ml-7 flex flex-wrap gap-2">
      {images.map((img) => (
        <div key={img.id} className="relative group">
          <img
            src={`/api/step-images/${img.id}/file`}
            alt={`Step image ${img.sequence}`}
            className="h-20 w-20 rounded border border-border object-cover"
          />
          <span className="absolute bottom-0 left-0 rounded-tr bg-black/60 px-1 text-[10px] text-white">
            ({img.sequence})
          </span>
          <button
            onClick={() => deleteImage.mutate({ imageId: img.id, stepId: step.id, uatFlowId: flow.id })}
            className="absolute -top-1 -right-1 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
          >
            x
          </button>
        </div>
      ))}
    </div>
  )
}

function StepsSection({ flow, projectId }: { flow: UatFlow; projectId: string }) {
  const { data, isLoading } = useSteps(flow.id)
  const createStep = useCreateStep(projectId)
  const updateStep = useUpdateStep(projectId)
  const deleteStep = useDeleteStep(projectId)
  const uploadPhoto = useUploadStepPhoto(projectId)
  const uploadGif = useUploadStepGif(projectId)
  const deleteGif = useDeleteStepGif(projectId)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const photoInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const gifInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const steps = data?.data || []

  function handleCreate(stepData: { name: string; description: string }) {
    createStep.mutate(
      { uatFlowId: flow.id, name: stepData.name, description: stepData.description || undefined },
      {
        onSuccess: () => { setShowAddForm(false); toast.success('Step added') },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleUpdate(step: Step, stepData: { name: string; description: string }) {
    updateStep.mutate(
      { id: step.id, uatFlowId: flow.id, name: stepData.name, description: stepData.description || null },
      {
        onSuccess: () => { setEditingId(null); toast.success('Step updated') },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleDelete(step: Step) {
    deleteStep.mutate(
      { id: step.id, uatFlowId: flow.id },
      {
        onSuccess: () => { setDeletingId(null); toast.success('Step deleted') },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handlePhotoUpload(step: Step, file: File) {
    uploadPhoto.mutate(
      { stepId: step.id, uatFlowId: flow.id, file },
      {
        onSuccess: () => toast.success('Photo uploaded'),
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleGifUpload(step: Step, file: File) {
    uploadGif.mutate(
      { stepId: step.id, uatFlowId: flow.id, file },
      {
        onSuccess: () => toast.success('GIF uploaded & frames extracted'),
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleGifDelete(step: Step) {
    deleteGif.mutate(
      { stepId: step.id, uatFlowId: flow.id },
      {
        onSuccess: () => toast.success('GIF removed'),
        onError: (err) => toast.error(err.message),
      }
    )
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Steps</span>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
        >
          {showAddForm ? 'Cancel' : '+ Add Step'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-3 rounded border border-border bg-muted/30 p-3">
          <StepForm
            onSubmit={handleCreate}
            onCancel={() => setShowAddForm(false)}
            submitting={createStep.isPending}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      ) : steps.length === 0 ? (
        <p className="text-xs italic text-muted-foreground">No steps yet.</p>
      ) : (
        <div className="space-y-2">
          {steps.map((step, index) =>
            editingId === step.id ? (
              <div key={step.id} className="rounded border border-border bg-muted/30 p-3">
                <StepForm
                  initial={step}
                  onSubmit={(stepData) => handleUpdate(step, stepData)}
                  onCancel={() => setEditingId(null)}
                  submitting={updateStep.isPending}
                />
              </div>
            ) : (
              <div key={step.id} className="rounded border border-border bg-background p-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground">{step.name}</span>
                      {step.gifFileName && (
                        <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700">
                          GIF
                        </span>
                      )}
                    </div>
                    {step.description && (
                      <p className="mt-1 ml-7 text-xs text-muted-foreground">{step.description}</p>
                    )}
                    <StepImagesDisplay step={step} flow={flow} projectId={projectId} />
                  </div>
                  <div className="ml-3 flex items-center gap-1">
                    {/* Photo upload */}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      className="hidden"
                      ref={(el) => { photoInputRefs.current[step.id] = el }}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handlePhotoUpload(step, file)
                        e.target.value = ''
                      }}
                    />
                    <button
                      onClick={() => photoInputRefs.current[step.id]?.click()}
                      className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                      title="Upload photo"
                    >
                      {uploadPhoto.isPending ? '...' : 'Photo'}
                    </button>
                    {/* GIF upload */}
                    <input
                      type="file"
                      accept="image/gif"
                      className="hidden"
                      ref={(el) => { gifInputRefs.current[step.id] = el }}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleGifUpload(step, file)
                        e.target.value = ''
                      }}
                    />
                    <button
                      onClick={() => gifInputRefs.current[step.id]?.click()}
                      className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                      title="Upload GIF"
                    >
                      {uploadGif.isPending ? '...' : 'GIF'}
                    </button>
                    {step.gifFileName && (
                      <button
                        onClick={() => handleGifDelete(step)}
                        className="rounded px-1 py-0.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
                        title="Remove GIF"
                      >
                        xGIF
                      </button>
                    )}
                    <button onClick={() => setEditingId(step.id)} className="text-xs text-primary hover:underline">Edit</button>
                    {deletingId === step.id ? (
                      <>
                        <button onClick={() => handleDelete(step)} className="text-xs text-red-600 hover:underline">Yes</button>
                        <button onClick={() => setDeletingId(null)} className="text-xs text-muted-foreground hover:underline">No</button>
                      </>
                    ) : (
                      <button onClick={() => setDeletingId(step.id)} className="text-xs text-red-600 hover:underline">Del</button>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add inertia/pages/projects/tabs/uat-flows-tab.tsx
git commit -m "feat: update StepsSection for multi-image and GIF upload UI"
```

---

### Task 12: Create UAT Viewer tab

**Files:**
- Create: `inertia/pages/projects/tabs/uat-viewer-tab.tsx`
- Modify: `inertia/pages/projects/show.tsx` (lines 19, 21-28, 49-69)

- [ ] **Step 1: Create uat-viewer-tab.tsx**

```tsx
// inertia/pages/projects/tabs/uat-viewer-tab.tsx
import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'

interface TreeStep {
  id: string
  name: string
  description: string | null
  sequence: number
  gifFileName: string | null
}

interface TreeFlow {
  id: string
  name: string
  steps: TreeStep[]
}

interface TreeFeature {
  id: string
  name: string
  uatFlows: TreeFlow[]
}

interface FlatStep {
  step: TreeStep
  flowName: string
  featureName: string
  globalIndex: number
}

interface UatViewerTabProps {
  projectId: string
}

export default function UatViewerTab({ projectId }: UatViewerTabProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['project-tree', projectId],
    queryFn: () => apiFetch<{ data: { features: TreeFeature[] } }>(`/api/projects/${projectId}/tree`),
  })

  // Flatten all steps across features/flows
  const flatSteps: FlatStep[] = []
  if (data?.data?.features) {
    let idx = 0
    for (const feature of data.data.features) {
      for (const flow of feature.uatFlows || []) {
        for (const step of flow.steps || []) {
          flatSteps.push({
            step,
            flowName: flow.name,
            featureName: feature.name,
            globalIndex: idx++,
          })
        }
      }
    }
  }

  const totalSteps = flatSteps.length
  const current = flatSteps[currentIndex] || null

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-card py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    )
  }

  if (totalSteps === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No steps found. Add features, functions, and steps first.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Breadcrumb */}
      {current && (
        <div className="border-b border-border px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{current.featureName}</span>
            <span>&gt;</span>
            <span>{current.flowName}</span>
            <span>&gt;</span>
            <span className="font-medium text-foreground">
              Step {currentIndex + 1} of {totalSteps}
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      {current && (
        <div className="p-6">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-foreground">{current.step.name}</h3>
            {current.step.description && (
              <p className="mt-2 text-sm text-muted-foreground">{current.step.description}</p>
            )}
          </div>

          {/* GIF display */}
          <div className="flex items-center justify-center rounded-lg border border-border bg-muted/20 p-4" style={{ minHeight: '400px' }}>
            {current.step.gifFileName ? (
              <img
                key={current.step.id}
                src={`/api/steps/${current.step.id}/gif`}
                alt={`GIF for ${current.step.name}`}
                className="max-h-[500px] max-w-full rounded-lg object-contain"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-lg">No GIF available for this step</p>
                <p className="mt-1 text-sm">Upload a GIF in the Functions tab</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border px-6 py-4">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span>&larr;</span> Previous
        </button>

        <div className="flex items-center gap-1">
          {flatSteps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 w-2 rounded-full transition-colors ${
                idx === currentIndex ? 'bg-primary' : 'bg-border hover:bg-muted-foreground'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex === totalSteps - 1}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next <span>&rarr;</span>
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Register UAT Viewer tab in show.tsx**

In `inertia/pages/projects/show.tsx`:

Add import after line 11:

```typescript
import UatViewerTab from './tabs/uat-viewer-tab'
```

Update the `Tab` type at line 19:

```typescript
// Old:
type Tab = 'features' | 'uat-flows' | 'prd-edit' | 'prd-view' | 'uat-view' | 'versions'

// New:
type Tab = 'features' | 'uat-flows' | 'prd-edit' | 'prd-view' | 'uat-view' | 'uat-viewer' | 'versions'
```

Add to tabs array (after line 26, before versions):

```typescript
  { key: 'uat-viewer', label: 'UAT Viewer' },
```

Add case in `TabContent` switch (after line 66):

```typescript
    case 'uat-viewer':
      return <UatViewerTab projectId={project.id} />
```

Update `validTabs` at line 75 to include `'uat-viewer'`.

- [ ] **Step 3: Commit**

```bash
git add inertia/pages/projects/tabs/uat-viewer-tab.tsx inertia/pages/projects/show.tsx
git commit -m "feat: add UAT Viewer tab with presentation-style GIF walkthrough"
```

---

### Task 13: Verify and test

- [ ] **Step 1: Run typecheck**

Run: `npm run typecheck`
Expected: No TypeScript errors.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No lint errors (fix any that appear).

- [ ] **Step 3: Start dev server and manually test**

Run: `npm run dev`

Test checklist:
1. Navigate to a project with existing steps
2. Upload multiple photos to a step — verify thumbnails appear numbered
3. Delete an individual photo — verify sequences re-compact
4. Upload a GIF — verify frames are extracted and appear as photos
5. Delete a GIF — verify extracted frames are removed
6. Check "UAT Viewer" tab — verify presentation-style GIF display
7. Use arrow keys to navigate between steps
8. Download UAT PDF — verify images render in 2-per-row grid with arrows
9. Click REFETCH — verify data re-imports from YAML correctly

- [ ] **Step 4: Fix any issues found during testing**

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "fix: address issues found during manual testing"
```
