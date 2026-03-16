# Multi-Image & GIF Support for UAT Steps

## Summary

Extend the UAT step model to support multiple numbered photos and one GIF per step. When a GIF is uploaded, it is automatically decomposed into individual frame photos using `sharp`. A new UAT Viewer tab provides a presentation-style walkthrough that plays the GIF at each step. The PDF is updated to render step images in a 2-per-row grid with flow arrows.

## Database Changes

### New table: `step_images`

| Column       | Type          | Notes                                      |
|-------------|---------------|---------------------------------------------|
| `id`        | UUID (PK)     | `gen_random_uuid()`                         |
| `step_id`   | UUID (FK)     | References `steps.id`, `ON DELETE CASCADE`  |
| `file_name` | VARCHAR(500)  | Basename without extension (UUID-prefixed)  |
| `sequence`  | INTEGER       | Auto-assigned in upload order: 1, 2, 3...   |
| `created_at`| TIMESTAMP     | Auto-set                                    |

### Modified table: `steps`

| Column          | Change       | Notes                                    |
|----------------|--------------|------------------------------------------|
| `gif_file_name`| ADD column   | VARCHAR(500), nullable. GIF basename.    |
| `image_file_name` | DROP column | No longer needed; photos live in `step_images` |

No data migration required — existing data will be re-imported from YAML.

### New model: `StepImage`

```typescript
class StepImage extends BaseModel {
  static table = 'step_images'

  id: string           // UUID PK
  stepId: string       // FK to steps
  fileName: string     // basename without extension
  sequence: number     // ordering
  createdAt: DateTime

  @belongsTo(() => Step)
  step: BelongsTo<typeof Step>
}
```

### Modified model: `Step`

- Remove `imageFileName: string | null`
- Add `gifFileName: string | null`
- Add `@hasMany(() => StepImage)` relationship

## Backend API

### New endpoints

| Method   | Path                        | Description                              |
|----------|-----------------------------|------------------------------------------|
| `GET`    | `/api/steps/:stepId/images` | List all images for a step (by sequence) |
| `POST`   | `/api/steps/:stepId/images` | Upload a photo, auto-assign next sequence |
| `DELETE` | `/api/step-images/:id`      | Delete a single step image               |
| `GET`    | `/api/step-images/:id/file` | Download a single image file             |
| `POST`   | `/api/steps/:stepId/gif`    | Upload GIF + extract frames to step_images |
| `GET`    | `/api/steps/:stepId/gif`    | Download the GIF file                    |
| `DELETE` | `/api/steps/:stepId/gif`    | Delete the GIF file only                 |

### Removed endpoints

| Method   | Path                        | Reason                                   |
|----------|-----------------------------|------------------------------------------|
| `GET`    | `/api/steps/:id/image`      | Replaced by `/images` and `/step-images` |
| `POST`   | `/api/steps/:id/image`      | Replaced by `POST /steps/:stepId/images` |
| `DELETE` | `/api/steps/:id/image`      | Replaced by `DELETE /step-images/:id`    |

### New service: `StepImageService`

Responsibilities:
- CRUD operations on `step_images` table
- File I/O for photo uploads (same `yaml/{project}/photos/` directory)
- Auto-sequence assignment: query `MAX(sequence)` for the step, increment by 1
- File deletion from disk when a `step_image` record is deleted

### GIF upload flow (in `StepImageService` or `StepService`)

1. Accept GIF file upload
2. Save GIF to `yaml/{project}/photos/` as `{uuid}-{original-name}.gif`
3. Store basename in `step.gifFileName`
4. Use `sharp` to extract all frames:
   ```typescript
   const metadata = await sharp(gifPath, { animated: true }).metadata()
   const pageCount = metadata.pages || 1
   for (let i = 0; i < pageCount; i++) {
     await sharp(gifPath, { page: i })
       .flatten({ background: { r: 255, g: 255, b: 255 } })
       .jpeg({ quality: 95 })
       .toFile(outputPath)
     // Create step_images row with sequence = i + 1
   }
   ```
5. Each extracted frame creates a `step_images` row with auto-incrementing sequence
6. Trigger `YamlSyncService.syncUat()` fire-and-forget

### Modified services

**StepService:**
- Remove `uploadImage`, `deleteImage`, `getImagePath` methods (moved to `StepImageService`)
- Add `uploadGif`, `deleteGif`, `getGifPath` methods

**StepsController:**
- Remove old image endpoints
- Add new image/gif endpoint handlers
- Wire up new routes

### Transformer changes

**StepTransformer:**
- Remove `imageFileName` from output
- Add `gifFileName: string | null`
- Add `images: StepImageTransformer[]` (array of `{ id, fileName, sequence }`)

**New StepImageTransformer:**
- Fields: `id`, `stepId`, `fileName`, `sequence`, `createdAt`

## YAML Changes

### Updated YAML schema for steps

```yaml
steps:
  - name: "Navigate to E-Office Supplies"
    description: "Click on dropdown..."
    sequence: 0
    gifFileName: "f1-flow0-step0-navigate-eoffice-supplies"
    imageFileNames:
      - "f1-flow0-step0-navigate-eoffice-supplies (1)"
      - "f1-flow0-step0-navigate-eoffice-supplies (2)"
      - "f1-flow0-step0-navigate-eoffice-supplies (3)"
```

**Previous format (replaced):**
```yaml
steps:
  - name: "Navigate to E-Office Supplies"
    imageFileName: "f1-flow0-step0-navigate-eoffice-supplies"
```

### YamlWriterService changes

- Update `UatStepYaml` interface:
  - Remove `imageFileName: string | null`
  - Add `gifFileName: string | null`
  - Add `imageFileNames: string[]`

### YamlSyncService changes

- When syncing UAT, preload `step.stepImages` (ordered by sequence)
- Map `step.stepImages` to `imageFileNames` array
- Map `step.gifFileName` to `gifFileName`

### YamlReaderService changes

- Update `UatStepYaml` interface to match writer

### YamlImportService changes

- When importing UAT steps:
  - Read `imageFileNames` array and create `step_images` rows
  - Read `gifFileName` and set on step record

## PDF Changes

### Updated `PdfStep` interface

```typescript
interface PdfStep {
  id: string
  name: string
  description: string | null
  sequence: number
  imagePaths: string[]  // was: imagePath: string | null
}
```

### UatPdfService changes

- Preload `step.stepImages` (ordered by sequence) alongside steps
- Resolve each `stepImage.fileName` to a filesystem path
- Pass `imagePaths: string[]` to PDF document component

### UatPdfDocument layout changes

Replace single `<Image>` with a grid layout:

```
Step 1: Navigate to E-Office Supplies
Description text here...

  ┌─────────┐    →    ┌─────────┐
  │  (1)    │         │  (2)    │
  └─────────┘         └─────────┘
         ↓
  ┌─────────┐    →    ┌─────────┐
  │  (3)    │         │  (4)    │
  └─────────┘         └─────────┘
```

- 2 images per row
- Each image has a numbered label `(1)`, `(2)`, etc.
- Right-arrow (`→`) between left and right images in each row
- Down-arrow between rows connecting last image of previous row to first of next
- Odd image count: last row has one image on the left only
- Image size: ~220px wide each with gap for arrows (fits A4 with 50px padding)

## Frontend Changes

### New tab: "UAT Viewer"

Added to project tabs as `uat-viewer` with label "UAT Viewer".

**Component:** `inertia/pages/projects/tabs/uat-viewer-tab.tsx`

**Presentation-style viewer:**
- Breadcrumb: "Feature Name > Flow Name > Step 3 of N"
- Large centered GIF display (plays automatically)
- Step name and description above the GIF
- Previous/Next navigation buttons
- Keyboard navigation: left/right arrow keys
- Step counter: "Step 3 of 12"
- Steps flattened across all features/flows into linear sequence
- Placeholder shown if step has no GIF

**Data source:** Fetches project tree via `/api/projects/:id/tree`, flattens all steps, displays GIF via `/api/steps/:stepId/gif`.

### Modified: `uat-flows-tab.tsx` StepsSection

- Replace single image upload/display with multi-image support
- Show thumbnails of all uploaded images in sequence order
- "Upload Photo" button adds next image
- Individual delete button per image
- Separate "Upload GIF" button
- GIF thumbnail/indicator shown when present

### Modified: `use-steps.ts` hook

- Remove `useUploadStepImage`, `useDeleteStepImage`
- Add `useStepImages(stepId)` — fetch images for a step
- Add `useUploadStepPhoto(projectId)` — upload photo to step
- Add `useDeleteStepImage(projectId)` — delete individual image
- Add `useUploadStepGif(projectId)` — upload GIF to step
- Add `useDeleteStepGif(projectId)` — delete GIF from step

### Modified: `show.tsx` tab registration

- Add `'uat-viewer'` to `Tab` union type
- Add `{ key: 'uat-viewer', label: 'UAT Viewer' }` to tabs array
- Add case in `TabContent` switch

## File Storage

No changes to directory structure. All files (photos + GIFs) continue to live in `yaml/{project-slug}-{first8-uuid}/photos/`.

- Photos: `{uuid}-{original-name}.jpg` (or original extension)
- GIFs: `{uuid}-{original-name}.gif`
- Extracted frames: `{uuid}-frame-{sequence}.jpg`

## Dependencies

- `sharp` — already available as a dev dependency or needs to be added for GIF frame extraction

## Testing Considerations

- Unit test `StepImageService` CRUD and sequence auto-assignment
- Unit test GIF frame extraction (mock `sharp`)
- Functional test new API endpoints
- Verify YAML sync includes new fields
- Verify YAML import creates `step_images` rows
- Verify PDF renders grid layout correctly
