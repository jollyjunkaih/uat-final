/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

// Lazy-loaded controllers
const DashboardController = () => import('#controllers/dashboard_controller')
const ProjectsController = () => import('#controllers/projects_controller')
const FeaturesController = () => import('#controllers/features_controller')
const UatFlowsController = () => import('#controllers/uat_flows_controller')
// const EventsController = () => import('#controllers/events_controller')
const VersionsController = () => import('#controllers/versions_controller')
const SignOffController = () => import('#controllers/sign_off_controller')
const ViewOnlyLinksController = () => import('#controllers/view_only_links_controller')
const ExportController = () => import('#controllers/export_controller')
const IntegrationController = () => import('#controllers/integration_controller')
const SettingsController = () => import('#controllers/settings_controller')
const PublicViewController = () => import('#controllers/public_view_controller')
const PublicSignOffController = () => import('#controllers/public_sign_off_controller')
const SessionController = () => import('#controllers/session_controller')
const NewAccountController = () => import('#controllers/new_account_controller')
// const TestCasesController = () => import('#controllers/test_cases_controller')
const StepsController = () => import('#controllers/steps_controller')
const UploadsController = () => import('#controllers/uploads_controller')
const PrdController = () => import('#controllers/prd_controller')
const YamlImportController = () => import('#controllers/yaml_import_controller')

// Home
router.on('/').renderInertia('home', {}).as('home')

// Guest routes (login/signup)
router
  .group(() => {
    router.get('signup', [NewAccountController, 'create'])
    router.post('signup', [NewAccountController, 'store'])
    router.get('login', [SessionController, 'create'])
    router.post('login', [SessionController, 'store'])
  })
  .use(middleware.guest())

// Authenticated routes
router
  .group(() => {
    router.post('logout', [SessionController, 'destroy'])

    // Dashboard
    router.get('dashboard', [DashboardController, 'index'])

    // Projects
    router.get('projects', [ProjectsController, 'index'])
    router.post('projects', [ProjectsController, 'store'])
    router.get('projects/:id', [ProjectsController, 'show'])
    router.patch('projects/:id', [ProjectsController, 'update'])
    router.delete('projects/:id', [ProjectsController, 'destroy'])

    // Features
    router.get('api/features', [FeaturesController, 'index'])
    router.post('api/features', [FeaturesController, 'store'])
    router.get('api/features/:id', [FeaturesController, 'show'])
    router.patch('api/features/:id', [FeaturesController, 'update'])
    router.delete('api/features/:id', [FeaturesController, 'destroy'])
    router.post('api/features/reorder', [FeaturesController, 'reorder'])

    // UAT Flows
    router.get('api/uat-flows', [UatFlowsController, 'index'])
    router.post('api/uat-flows', [UatFlowsController, 'store'])
    router.get('api/uat-flows/:id', [UatFlowsController, 'show'])
    router.patch('api/uat-flows/:id', [UatFlowsController, 'update'])
    router.delete('api/uat-flows/:id', [UatFlowsController, 'destroy'])
    router.post('api/uat-flows/reorder', [UatFlowsController, 'reorder'])

    // Events (deprecated — replaced by Steps)
    // router.get('api/events', [EventsController, 'index'])
    // router.post('api/events', [EventsController, 'store'])
    // router.get('api/events/:id', [EventsController, 'show'])
    // router.patch('api/events/:id', [EventsController, 'update'])
    // router.delete('api/events/:id', [EventsController, 'destroy'])
    // router.post('api/events/reorder', [EventsController, 'reorder'])

    // Versions
    router.get('versions', [VersionsController, 'index'])
    router.post('versions', [VersionsController, 'store'])
    router.get('versions/:id', [VersionsController, 'show'])

    // Sign-Off
    router.get('sign-off', [SignOffController, 'index'])
    router.get('api/sign-off/:id', [SignOffController, 'show'])
    router.post('sign-off/initiate', [SignOffController, 'initiate'])
    router.post('sign-off/:id/revoke', [SignOffController, 'revoke'])

    // View-Only Links
    router.get('api/view-links', [ViewOnlyLinksController, 'index'])
    router.post('api/view-links', [ViewOnlyLinksController, 'store'])
    router.post('api/view-links/:id/revoke', [ViewOnlyLinksController, 'revoke'])

    // Export
    router.get('export/prd/:projectId', [ExportController, 'exportPrd'])
    router.get('export/uat/:projectId', [ExportController, 'exportUat'])

    // Settings
    router.get('settings/:projectId', [SettingsController, 'show'])
    router.patch('settings/:projectId', [SettingsController, 'update'])

    // Integration
    router.post('api/integration/sync', [IntegrationController, 'syncTriggers'])
    router.get('api/integration/status/:projectId', [IntegrationController, 'getStatus'])

    // Test Cases (deprecated — replaced by Steps)
    // router.get('api/test-cases', [TestCasesController, 'index'])
    // router.post('api/test-cases', [TestCasesController, 'store'])
    // router.get('api/test-cases/:id', [TestCasesController, 'show'])
    // router.patch('api/test-cases/:id', [TestCasesController, 'update'])
    // router.delete('api/test-cases/:id', [TestCasesController, 'destroy'])
    // router.post('api/test-cases/reorder', [TestCasesController, 'reorder'])

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

    // Uploads
    router.post('api/uploads', [UploadsController, 'store'])
    router.get('api/uploads', [UploadsController, 'index'])
    router.delete('api/uploads/:id', [UploadsController, 'destroy'])

    // PRD Sub-resources (Competitors, Milestones, Open Questions, Contacts)
    router.get('api/prd/competitors', [PrdController, 'competitorsIndex'])
    router.post('api/prd/competitors', [PrdController, 'competitorsStore'])
    router.patch('api/prd/competitors/:id', [PrdController, 'competitorsUpdate'])
    router.delete('api/prd/competitors/:id', [PrdController, 'competitorsDestroy'])

    router.get('api/prd/milestones', [PrdController, 'milestonesIndex'])
    router.post('api/prd/milestones', [PrdController, 'milestonesStore'])
    router.patch('api/prd/milestones/:id', [PrdController, 'milestonesUpdate'])
    router.delete('api/prd/milestones/:id', [PrdController, 'milestonesDestroy'])

    router.get('api/prd/open-questions', [PrdController, 'openQuestionsIndex'])
    router.post('api/prd/open-questions', [PrdController, 'openQuestionsStore'])
    router.patch('api/prd/open-questions/:id', [PrdController, 'openQuestionsUpdate'])
    router.delete('api/prd/open-questions/:id', [PrdController, 'openQuestionsDestroy'])

    router.get('api/prd/contacts', [PrdController, 'contactsIndex'])
    router.post('api/prd/contacts', [PrdController, 'contactsStore'])
    router.patch('api/prd/contacts/:id', [PrdController, 'contactsUpdate'])
    router.delete('api/prd/contacts/:id', [PrdController, 'contactsDestroy'])

    // YAML Import
    router.post('api/yaml/import/prd/:projectId', [YamlImportController, 'importPrd'])
    router.post('api/yaml/import/uat/:projectId', [YamlImportController, 'importUat'])
    router.post('api/yaml/refetch/:projectId', [YamlImportController, 'refetchFromDisk'])

    // Project tree (features + UAT flows + events in one request)
    router.get('api/projects/:id/tree', [ProjectsController, 'tree'])

    // PDF generation
    router.get('api/projects/:id/uat-pdf', [ProjectsController, 'uatPdf'])

    // PRD View (Inertia page)
    router.get('projects/:id/prd', [ProjectsController, 'show']).as('projects.prd')
    // UAT View (Inertia page)
    router.get('projects/:id/uat', [ProjectsController, 'show']).as('projects.uat')
  })
  .use(middleware.auth())

// Serve uploaded files
router.get('uploads/*', async (ctx) => {
  const filePath = ctx.params['*'].join('/')
  const { join } = await import('node:path')
  const app = (await import('@adonisjs/core/services/app')).default
  const fullPath = join(app.makePath('storage/uploads'), filePath)
  return ctx.response.download(fullPath)
})

// Serve photos from YAML project directories
router.get('photos/:projectDir/*', async (ctx) => {
  const projectDir = ctx.params.projectDir
  const filePath = ctx.params['*'].join('/')
  const { join } = await import('node:path')
  const app = (await import('@adonisjs/core/services/app')).default
  const fullPath = join(app.makePath('yaml'), projectDir, 'photos', filePath)
  return ctx.response.download(fullPath)
})

// Public routes (no auth required)
router.get('share/view/:token', [PublicViewController, 'show'])
router.get('share/sign/:token', [PublicSignOffController, 'show'])
router.post('share/sign/:token', [PublicSignOffController, 'submit'])
