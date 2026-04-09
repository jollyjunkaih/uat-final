# Feature Mock Screens & Process Flows

## Context

The KKIP Asset Management PRD has features with detailed scope but no visual mockups or process flow diagrams. Users need to attach two types of images per feature:

1. **Mock Screens** — UI mockup images showing what the feature looks like
2. **Process Flows** — Diagrams showing the workflow/process for the feature

These images should appear in the features tab UI and in the exported PRD PDF. Process flows render immediately after mock screens.

Currently, images exist only at the project level (uploads) and step level (step_images). Features have no image support.

## Design

### Storage

Two separate directories per feature:

- Mock screens: `yaml/{projectDir}/img/features/{featureId}/`
- Process flows: `yaml/{projectDir}/img/process-flows/{featureId}/`

Both follow the existing YAML directory convention. Files named with UUID prefix: `{uuid}-{originalName}.{ext}`

### Database

New migration: add two JSONB columns to `features` table:

- `mock_screens` — default `'[]'::jsonb`
- `process_flows` — default `'[]'::jsonb`

Each entry in both arrays:
```json
{ "fileName": "abc123-login-screen", "sequence": 1 }
```

- `fileName` is the UUID-prefixed basename without extension (matches StepImage convention)
- `sequence` is the display order (1-based)
- Physical file on disk retains its extension for serving

### Backend Changes

#### New Service: `app/services/feature_image_service.ts`

Single service handling both image types. Follows `StepImageService` pattern:

- `type FeatureImageType = 'mock-screens' | 'process-flows'`
- `getImgDir(projectName, projectId, featureId, type)`:
  - mock-screens → `yaml/{projectDir}/img/features/{featureId}/`
  - process-flows → `yaml/{projectDir}/img/process-flows/{featureId}/`
- `uploadImage(featureId, projectName, projectId, file, type)` — saves file to correct dir, appends entry to the corresponding JSON column, returns updated feature
- `deleteImage(featureId, projectName, projectId, fileName, type)` — deletes physical file + removes entry, recompacts sequences
- `findImageFile(dir, fileName)` — find file by basename regardless of extension

#### Controller: `app/controllers/features_controller.ts`

Add 6 new actions (3 per image type):

| Method | Route | Action |
|--------|-------|--------|
| POST | `/api/features/:id/mock-screens` | Upload mock screen |
| DELETE | `/api/features/:id/mock-screens/:fileName` | Delete mock screen |
| POST | `/api/features/:id/mock-screens/reorder` | Reorder mock screens |
| POST | `/api/features/:id/process-flows` | Upload process flow |
| DELETE | `/api/features/:id/process-flows/:fileName` | Delete process flow |
| POST | `/api/features/:id/process-flows/reorder` | Reorder process flows |

Upload accepts: jpg, jpeg, png, webp, svg (max 10MB).

#### Routes: `start/routes.ts`

Two new static file serving routes (no auth, like existing `photos/` route):

```
GET /feature-images/:projectDir/:featureId/*
```
Serves from `yaml/{projectDir}/img/features/{featureId}/`

```
GET /process-flow-images/:projectDir/:featureId/*
```
Serves from `yaml/{projectDir}/img/process-flows/{featureId}/`

#### Model: `app/models/feature.ts`

Add two columns:
```typescript
@column({ columnName: 'mock_screens' })
declare mockScreens: Array<{ fileName: string; sequence: number }>

@column({ columnName: 'process_flows' })
declare processFlows: Array<{ fileName: string; sequence: number }>
```

#### Transformer: `app/transformers/feature_transformer.ts`

Include `mockScreens` and `processFlows` in transform output.

#### YAML Sync: `app/services/yaml_writer_service.ts`

Add `mockScreens` and `processFlows` to `PrdFeatureYamlData` interface.

### Frontend Changes

#### Hooks: `inertia/hooks/use-features.ts`

Add 4 mutations:
- `useUploadMockScreen(projectId)` — POST to `/api/features/:id/mock-screens`
- `useDeleteMockScreen(projectId)` — DELETE `/api/features/:id/mock-screens/:fileName`
- `useUploadProcessFlow(projectId)` — POST to `/api/features/:id/process-flows`
- `useDeleteProcessFlow(projectId)` — DELETE `/api/features/:id/process-flows/:fileName`

#### UI: `inertia/pages/projects/tabs/features-tab.tsx`

For each feature (in view or edit mode), add two image sections:

**Mock Screens section:**
- Upload button for mock screen images
- Thumbnail grid of current mock screens
- Delete button (X) per thumbnail
- Images via `/feature-images/{projectDir}/{featureId}/{fileName}.{ext}`

**Process Flows section (below mock screens):**
- Same pattern as mock screens
- Images via `/process-flow-images/{projectDir}/{featureId}/{fileName}.{ext}`

The `projectDir` is derived from project name + ID (slugify + first 8 chars of UUID).

#### PDF: `inertia/components/pdf/prd-document.tsx`

In each feature card, after UAT flows, render both image types:

1. Mock Screens — labeled "Mock Screens", using `imageRow` + `uploadImage` styles
2. Process Flows — labeled "Process Flows", same styles, rendered after mock screens

### Data Flow

```
Upload: User → features-tab.tsx → POST /api/features/:id/{mock-screens|process-flows}
         → FeatureImageService.uploadImage()
         → saves file to yaml/{dir}/img/{features|process-flows}/{featureId}/
         → updates feature JSON column
         → YamlSyncService.syncAll()
         → returns updated feature

Display: features-tab.tsx reads feature.mockScreens / feature.processFlows
         → renders thumbnails via serving routes

PDF: prd-document.tsx reads both arrays
     → renders <Image> elements via serving routes
```

## Files to Modify

| File | Change |
|------|--------|
| `database/migrations/XXXX_add_feature_images.ts` | New migration (both columns) |
| `app/models/feature.ts` | Add `mockScreens` + `processFlows` columns |
| `app/services/feature_image_service.ts` | New service (handles both types) |
| `app/controllers/features_controller.ts` | Add 6 new actions |
| `app/transformers/feature_transformer.ts` | Include both fields |
| `app/services/yaml_writer_service.ts` | Add both to YAML data interface |
| `app/services/yaml_sync_service.ts` | Map both fields in sync |
| `start/routes.ts` | Add 2 serving routes + 6 API routes |
| `inertia/hooks/use-features.ts` | Add 4 mutations |
| `inertia/pages/projects/tabs/features-tab.tsx` | Add both image sections |
| `inertia/components/pdf/prd-document.tsx` | Render both in PDF |

## Verification

1. Run migration: `node ace migration:run`
2. Upload mock screen + process flow images via features tab
3. Verify files in `yaml/asset-management-cedce6f3/img/features/{featureId}/` and `img/process-flows/{featureId}/`
4. Thumbnails render correctly in features tab
5. Delete images — files removed, UI updated
6. Export PRD PDF — both image types visible per feature
7. `npm run typecheck` passes
8. YAML sync includes both mockScreens and processFlows
