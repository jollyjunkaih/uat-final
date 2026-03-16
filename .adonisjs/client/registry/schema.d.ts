/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'dashboard.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
    }
  }
  'projects.index': {
    methods: ["GET","HEAD"]
    pattern: '/projects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['index']>>>
    }
  }
  'projects.store': {
    methods: ["POST"]
    pattern: '/projects'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').createProjectValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').createProjectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'projects.show': {
    methods: ["GET","HEAD"]
    pattern: '/projects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
    }
  }
  'projects.update': {
    methods: ["PATCH"]
    pattern: '/projects/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').updateProjectValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').updateProjectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'projects.destroy': {
    methods: ["DELETE"]
    pattern: '/projects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['destroy']>>>
    }
  }
  'features.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/features'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/features_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/features_controller').default['index']>>>
    }
  }
  'features.store': {
    methods: ["POST"]
    pattern: '/api/features'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/feature_validator').createFeatureValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/feature_validator').createFeatureValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/features_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/features_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'features.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/features/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/features_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/features_controller').default['show']>>>
    }
  }
  'features.update': {
    methods: ["PATCH"]
    pattern: '/api/features/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/feature_validator').updateFeatureValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/feature_validator').updateFeatureValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/features_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/features_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'features.destroy': {
    methods: ["DELETE"]
    pattern: '/api/features/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/features_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/features_controller').default['destroy']>>>
    }
  }
  'features.reorder': {
    methods: ["POST"]
    pattern: '/api/features/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/event_validator').reorderEventsValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/event_validator').reorderEventsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/features_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/features_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'uat_flows.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/uat-flows'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/uat_flows_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/uat_flows_controller').default['index']>>>
    }
  }
  'uat_flows.store': {
    methods: ["POST"]
    pattern: '/api/uat-flows'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/uat_flow_validator').createUatFlowValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/uat_flow_validator').createUatFlowValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/uat_flows_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/uat_flows_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'uat_flows.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/uat-flows/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/uat_flows_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/uat_flows_controller').default['show']>>>
    }
  }
  'uat_flows.update': {
    methods: ["PATCH"]
    pattern: '/api/uat-flows/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/uat_flow_validator').updateUatFlowValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/uat_flow_validator').updateUatFlowValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/uat_flows_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/uat_flows_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'uat_flows.destroy': {
    methods: ["DELETE"]
    pattern: '/api/uat-flows/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/uat_flows_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/uat_flows_controller').default['destroy']>>>
    }
  }
  'uat_flows.reorder': {
    methods: ["POST"]
    pattern: '/api/uat-flows/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/event_validator').reorderEventsValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/event_validator').reorderEventsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/uat_flows_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/uat_flows_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'versions.index': {
    methods: ["GET","HEAD"]
    pattern: '/versions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/versions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/versions_controller').default['index']>>>
    }
  }
  'versions.store': {
    methods: ["POST"]
    pattern: '/versions'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/version_validator').createVersionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/version_validator').createVersionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/versions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/versions_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'versions.show': {
    methods: ["GET","HEAD"]
    pattern: '/versions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/versions_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/versions_controller').default['show']>>>
    }
  }
  'sign_off.index': {
    methods: ["GET","HEAD"]
    pattern: '/sign-off'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sign_off_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sign_off_controller').default['index']>>>
    }
  }
  'sign_off.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/sign-off/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sign_off_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sign_off_controller').default['show']>>>
    }
  }
  'sign_off.initiate': {
    methods: ["POST"]
    pattern: '/sign-off/initiate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/sign_off_validator').initiateSignOffValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/sign_off_validator').initiateSignOffValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sign_off_controller').default['initiate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sign_off_controller').default['initiate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'sign_off.revoke': {
    methods: ["POST"]
    pattern: '/sign-off/:id/revoke'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sign_off_controller').default['revoke']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sign_off_controller').default['revoke']>>>
    }
  }
  'view_only_links.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/view-links'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/view_only_links_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/view_only_links_controller').default['index']>>>
    }
  }
  'view_only_links.store': {
    methods: ["POST"]
    pattern: '/api/view-links'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/view_only_link_validator').createViewOnlyLinkValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/view_only_link_validator').createViewOnlyLinkValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/view_only_links_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/view_only_links_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'view_only_links.revoke': {
    methods: ["POST"]
    pattern: '/api/view-links/:id/revoke'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/view_only_links_controller').default['revoke']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/view_only_links_controller').default['revoke']>>>
    }
  }
  'export.export_prd': {
    methods: ["GET","HEAD"]
    pattern: '/export/prd/:projectId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/export_controller').default['exportPrd']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/export_controller').default['exportPrd']>>>
    }
  }
  'export.export_uat': {
    methods: ["GET","HEAD"]
    pattern: '/export/uat/:projectId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/export_controller').default['exportUat']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/export_controller').default['exportUat']>>>
    }
  }
  'settings.show': {
    methods: ["GET","HEAD"]
    pattern: '/settings/:projectId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['show']>>>
    }
  }
  'settings.update': {
    methods: ["PATCH"]
    pattern: '/settings/:projectId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').updateProjectValidator)>>
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').updateProjectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'integration.sync_triggers': {
    methods: ["POST"]
    pattern: '/api/integration/sync'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/integration_controller').default['syncTriggers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/integration_controller').default['syncTriggers']>>>
    }
  }
  'integration.get_status': {
    methods: ["GET","HEAD"]
    pattern: '/api/integration/status/:projectId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/integration_controller').default['getStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/integration_controller').default['getStatus']>>>
    }
  }
  'steps.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/steps'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['index']>>>
    }
  }
  'steps.store': {
    methods: ["POST"]
    pattern: '/api/steps'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/step_validator').createStepValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/step_validator').createStepValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'steps.reorder': {
    methods: ["POST"]
    pattern: '/api/steps/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/step_validator').reorderStepsValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/step_validator').reorderStepsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'steps.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/steps/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['show']>>>
    }
  }
  'steps.update': {
    methods: ["PATCH"]
    pattern: '/api/steps/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/step_validator').updateStepValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/step_validator').updateStepValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'steps.destroy': {
    methods: ["DELETE"]
    pattern: '/api/steps/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['destroy']>>>
    }
  }
  'steps.list_images': {
    methods: ["GET","HEAD"]
    pattern: '/api/steps/:stepId/images'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { stepId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['listImages']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['listImages']>>>
    }
  }
  'steps.upload_photo': {
    methods: ["POST"]
    pattern: '/api/steps/:stepId/images'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { stepId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['uploadPhoto']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['uploadPhoto']>>>
    }
  }
  'steps.delete_step_image': {
    methods: ["DELETE"]
    pattern: '/api/step-images/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['deleteStepImage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['deleteStepImage']>>>
    }
  }
  'steps.get_step_image_file': {
    methods: ["GET","HEAD"]
    pattern: '/api/step-images/:id/file'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['getStepImageFile']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['getStepImageFile']>>>
    }
  }
  'steps.upload_gif': {
    methods: ["POST"]
    pattern: '/api/steps/:stepId/gif'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { stepId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['uploadGif']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['uploadGif']>>>
    }
  }
  'steps.get_gif': {
    methods: ["GET","HEAD"]
    pattern: '/api/steps/:stepId/gif'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { stepId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['getGif']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['getGif']>>>
    }
  }
  'steps.delete_gif': {
    methods: ["DELETE"]
    pattern: '/api/steps/:stepId/gif'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { stepId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['deleteGif']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/steps_controller').default['deleteGif']>>>
    }
  }
  'uploads.store': {
    methods: ["POST"]
    pattern: '/api/uploads'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/uploads_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/uploads_controller').default['store']>>>
    }
  }
  'uploads.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/uploads'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/uploads_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/uploads_controller').default['index']>>>
    }
  }
  'uploads.destroy': {
    methods: ["DELETE"]
    pattern: '/api/uploads/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/uploads_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/uploads_controller').default['destroy']>>>
    }
  }
  'prd.competitors_index': {
    methods: ["GET","HEAD"]
    pattern: '/api/prd/competitors'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['competitorsIndex']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['competitorsIndex']>>>
    }
  }
  'prd.competitors_store': {
    methods: ["POST"]
    pattern: '/api/prd/competitors'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/prd_validator').createCompetitorValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/prd_validator').createCompetitorValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['competitorsStore']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['competitorsStore']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'prd.competitors_update': {
    methods: ["PATCH"]
    pattern: '/api/prd/competitors/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/prd_validator').updateCompetitorValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/prd_validator').updateCompetitorValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['competitorsUpdate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['competitorsUpdate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'prd.competitors_destroy': {
    methods: ["DELETE"]
    pattern: '/api/prd/competitors/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['competitorsDestroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['competitorsDestroy']>>>
    }
  }
  'prd.milestones_index': {
    methods: ["GET","HEAD"]
    pattern: '/api/prd/milestones'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['milestonesIndex']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['milestonesIndex']>>>
    }
  }
  'prd.milestones_store': {
    methods: ["POST"]
    pattern: '/api/prd/milestones'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/prd_validator').createMilestoneValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/prd_validator').createMilestoneValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['milestonesStore']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['milestonesStore']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'prd.milestones_update': {
    methods: ["PATCH"]
    pattern: '/api/prd/milestones/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/prd_validator').updateMilestoneValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/prd_validator').updateMilestoneValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['milestonesUpdate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['milestonesUpdate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'prd.milestones_destroy': {
    methods: ["DELETE"]
    pattern: '/api/prd/milestones/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['milestonesDestroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['milestonesDestroy']>>>
    }
  }
  'prd.open_questions_index': {
    methods: ["GET","HEAD"]
    pattern: '/api/prd/open-questions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['openQuestionsIndex']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['openQuestionsIndex']>>>
    }
  }
  'prd.open_questions_store': {
    methods: ["POST"]
    pattern: '/api/prd/open-questions'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/prd_validator').createOpenQuestionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/prd_validator').createOpenQuestionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['openQuestionsStore']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['openQuestionsStore']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'prd.open_questions_update': {
    methods: ["PATCH"]
    pattern: '/api/prd/open-questions/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/prd_validator').updateOpenQuestionValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/prd_validator').updateOpenQuestionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['openQuestionsUpdate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['openQuestionsUpdate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'prd.open_questions_destroy': {
    methods: ["DELETE"]
    pattern: '/api/prd/open-questions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['openQuestionsDestroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['openQuestionsDestroy']>>>
    }
  }
  'prd.contacts_index': {
    methods: ["GET","HEAD"]
    pattern: '/api/prd/contacts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['contactsIndex']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['contactsIndex']>>>
    }
  }
  'prd.contacts_store': {
    methods: ["POST"]
    pattern: '/api/prd/contacts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/prd_validator').createContactValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/prd_validator').createContactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['contactsStore']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['contactsStore']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'prd.contacts_update': {
    methods: ["PATCH"]
    pattern: '/api/prd/contacts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/prd_validator').updateContactValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/prd_validator').updateContactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['contactsUpdate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['contactsUpdate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'prd.contacts_destroy': {
    methods: ["DELETE"]
    pattern: '/api/prd/contacts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['contactsDestroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/prd_controller').default['contactsDestroy']>>>
    }
  }
  'yaml_import.import_prd': {
    methods: ["POST"]
    pattern: '/api/yaml/import/prd/:projectId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/yaml_import_controller').default['importPrd']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/yaml_import_controller').default['importPrd']>>>
    }
  }
  'yaml_import.import_uat': {
    methods: ["POST"]
    pattern: '/api/yaml/import/uat/:projectId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/yaml_import_controller').default['importUat']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/yaml_import_controller').default['importUat']>>>
    }
  }
  'yaml_import.refetch_from_disk': {
    methods: ["POST"]
    pattern: '/api/yaml/refetch/:projectId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { projectId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/yaml_import_controller').default['refetchFromDisk']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/yaml_import_controller').default['refetchFromDisk']>>>
    }
  }
  'projects.tree': {
    methods: ["GET","HEAD"]
    pattern: '/api/projects/:id/tree'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['tree']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['tree']>>>
    }
  }
  'projects.uat_pdf': {
    methods: ["GET","HEAD"]
    pattern: '/api/projects/:id/uat-pdf'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['uatPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['uatPdf']>>>
    }
  }
  'projects.prd': {
    methods: ["GET","HEAD"]
    pattern: '/projects/:id/prd'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
    }
  }
  'projects.uat': {
    methods: ["GET","HEAD"]
    pattern: '/projects/:id/uat'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
    }
  }
  'public_view.show': {
    methods: ["GET","HEAD"]
    pattern: '/share/view/:token'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { token: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public_view_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public_view_controller').default['show']>>>
    }
  }
  'public_sign_off.show': {
    methods: ["GET","HEAD"]
    pattern: '/share/sign/:token'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { token: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public_sign_off_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public_sign_off_controller').default['show']>>>
    }
  }
  'public_sign_off.submit': {
    methods: ["POST"]
    pattern: '/share/sign/:token'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/sign_off_link_validator').submitSignOffValidator)>>
      paramsTuple: [ParamValue]
      params: { token: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/sign_off_link_validator').submitSignOffValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public_sign_off_controller').default['submit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public_sign_off_controller').default['submit']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
