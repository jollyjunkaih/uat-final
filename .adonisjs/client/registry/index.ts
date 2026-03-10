/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'dashboard.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard.index']['types'],
  },
  'projects.index': {
    methods: ["GET","HEAD"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.index']['types'],
  },
  'projects.store': {
    methods: ["POST"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.store']['types'],
  },
  'projects.show': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.show']['types'],
  },
  'projects.update': {
    methods: ["PATCH"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.update']['types'],
  },
  'projects.destroy': {
    methods: ["DELETE"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.destroy']['types'],
  },
  'features.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/features',
    tokens: [{"old":"/api/features","type":0,"val":"api","end":""},{"old":"/api/features","type":0,"val":"features","end":""}],
    types: placeholder as Registry['features.index']['types'],
  },
  'features.store': {
    methods: ["POST"],
    pattern: '/api/features',
    tokens: [{"old":"/api/features","type":0,"val":"api","end":""},{"old":"/api/features","type":0,"val":"features","end":""}],
    types: placeholder as Registry['features.store']['types'],
  },
  'features.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/features/:id',
    tokens: [{"old":"/api/features/:id","type":0,"val":"api","end":""},{"old":"/api/features/:id","type":0,"val":"features","end":""},{"old":"/api/features/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['features.show']['types'],
  },
  'features.update': {
    methods: ["PATCH"],
    pattern: '/api/features/:id',
    tokens: [{"old":"/api/features/:id","type":0,"val":"api","end":""},{"old":"/api/features/:id","type":0,"val":"features","end":""},{"old":"/api/features/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['features.update']['types'],
  },
  'features.destroy': {
    methods: ["DELETE"],
    pattern: '/api/features/:id',
    tokens: [{"old":"/api/features/:id","type":0,"val":"api","end":""},{"old":"/api/features/:id","type":0,"val":"features","end":""},{"old":"/api/features/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['features.destroy']['types'],
  },
  'features.reorder': {
    methods: ["POST"],
    pattern: '/api/features/reorder',
    tokens: [{"old":"/api/features/reorder","type":0,"val":"api","end":""},{"old":"/api/features/reorder","type":0,"val":"features","end":""},{"old":"/api/features/reorder","type":0,"val":"reorder","end":""}],
    types: placeholder as Registry['features.reorder']['types'],
  },
  'uat_flows.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/uat-flows',
    tokens: [{"old":"/api/uat-flows","type":0,"val":"api","end":""},{"old":"/api/uat-flows","type":0,"val":"uat-flows","end":""}],
    types: placeholder as Registry['uat_flows.index']['types'],
  },
  'uat_flows.store': {
    methods: ["POST"],
    pattern: '/api/uat-flows',
    tokens: [{"old":"/api/uat-flows","type":0,"val":"api","end":""},{"old":"/api/uat-flows","type":0,"val":"uat-flows","end":""}],
    types: placeholder as Registry['uat_flows.store']['types'],
  },
  'uat_flows.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/uat-flows/:id',
    tokens: [{"old":"/api/uat-flows/:id","type":0,"val":"api","end":""},{"old":"/api/uat-flows/:id","type":0,"val":"uat-flows","end":""},{"old":"/api/uat-flows/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['uat_flows.show']['types'],
  },
  'uat_flows.update': {
    methods: ["PATCH"],
    pattern: '/api/uat-flows/:id',
    tokens: [{"old":"/api/uat-flows/:id","type":0,"val":"api","end":""},{"old":"/api/uat-flows/:id","type":0,"val":"uat-flows","end":""},{"old":"/api/uat-flows/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['uat_flows.update']['types'],
  },
  'uat_flows.destroy': {
    methods: ["DELETE"],
    pattern: '/api/uat-flows/:id',
    tokens: [{"old":"/api/uat-flows/:id","type":0,"val":"api","end":""},{"old":"/api/uat-flows/:id","type":0,"val":"uat-flows","end":""},{"old":"/api/uat-flows/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['uat_flows.destroy']['types'],
  },
  'uat_flows.reorder': {
    methods: ["POST"],
    pattern: '/api/uat-flows/reorder',
    tokens: [{"old":"/api/uat-flows/reorder","type":0,"val":"api","end":""},{"old":"/api/uat-flows/reorder","type":0,"val":"uat-flows","end":""},{"old":"/api/uat-flows/reorder","type":0,"val":"reorder","end":""}],
    types: placeholder as Registry['uat_flows.reorder']['types'],
  },
  'events.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/events',
    tokens: [{"old":"/api/events","type":0,"val":"api","end":""},{"old":"/api/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['events.index']['types'],
  },
  'events.store': {
    methods: ["POST"],
    pattern: '/api/events',
    tokens: [{"old":"/api/events","type":0,"val":"api","end":""},{"old":"/api/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['events.store']['types'],
  },
  'events.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/events/:id',
    tokens: [{"old":"/api/events/:id","type":0,"val":"api","end":""},{"old":"/api/events/:id","type":0,"val":"events","end":""},{"old":"/api/events/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['events.show']['types'],
  },
  'events.update': {
    methods: ["PATCH"],
    pattern: '/api/events/:id',
    tokens: [{"old":"/api/events/:id","type":0,"val":"api","end":""},{"old":"/api/events/:id","type":0,"val":"events","end":""},{"old":"/api/events/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['events.update']['types'],
  },
  'events.destroy': {
    methods: ["DELETE"],
    pattern: '/api/events/:id',
    tokens: [{"old":"/api/events/:id","type":0,"val":"api","end":""},{"old":"/api/events/:id","type":0,"val":"events","end":""},{"old":"/api/events/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['events.destroy']['types'],
  },
  'events.reorder': {
    methods: ["POST"],
    pattern: '/api/events/reorder',
    tokens: [{"old":"/api/events/reorder","type":0,"val":"api","end":""},{"old":"/api/events/reorder","type":0,"val":"events","end":""},{"old":"/api/events/reorder","type":0,"val":"reorder","end":""}],
    types: placeholder as Registry['events.reorder']['types'],
  },
  'versions.index': {
    methods: ["GET","HEAD"],
    pattern: '/versions',
    tokens: [{"old":"/versions","type":0,"val":"versions","end":""}],
    types: placeholder as Registry['versions.index']['types'],
  },
  'versions.store': {
    methods: ["POST"],
    pattern: '/versions',
    tokens: [{"old":"/versions","type":0,"val":"versions","end":""}],
    types: placeholder as Registry['versions.store']['types'],
  },
  'versions.show': {
    methods: ["GET","HEAD"],
    pattern: '/versions/:id',
    tokens: [{"old":"/versions/:id","type":0,"val":"versions","end":""},{"old":"/versions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['versions.show']['types'],
  },
  'sign_off.index': {
    methods: ["GET","HEAD"],
    pattern: '/sign-off',
    tokens: [{"old":"/sign-off","type":0,"val":"sign-off","end":""}],
    types: placeholder as Registry['sign_off.index']['types'],
  },
  'sign_off.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/sign-off/:id',
    tokens: [{"old":"/api/sign-off/:id","type":0,"val":"api","end":""},{"old":"/api/sign-off/:id","type":0,"val":"sign-off","end":""},{"old":"/api/sign-off/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['sign_off.show']['types'],
  },
  'sign_off.initiate': {
    methods: ["POST"],
    pattern: '/sign-off/initiate',
    tokens: [{"old":"/sign-off/initiate","type":0,"val":"sign-off","end":""},{"old":"/sign-off/initiate","type":0,"val":"initiate","end":""}],
    types: placeholder as Registry['sign_off.initiate']['types'],
  },
  'sign_off.revoke': {
    methods: ["POST"],
    pattern: '/sign-off/:id/revoke',
    tokens: [{"old":"/sign-off/:id/revoke","type":0,"val":"sign-off","end":""},{"old":"/sign-off/:id/revoke","type":1,"val":"id","end":""},{"old":"/sign-off/:id/revoke","type":0,"val":"revoke","end":""}],
    types: placeholder as Registry['sign_off.revoke']['types'],
  },
  'view_only_links.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/view-links',
    tokens: [{"old":"/api/view-links","type":0,"val":"api","end":""},{"old":"/api/view-links","type":0,"val":"view-links","end":""}],
    types: placeholder as Registry['view_only_links.index']['types'],
  },
  'view_only_links.store': {
    methods: ["POST"],
    pattern: '/api/view-links',
    tokens: [{"old":"/api/view-links","type":0,"val":"api","end":""},{"old":"/api/view-links","type":0,"val":"view-links","end":""}],
    types: placeholder as Registry['view_only_links.store']['types'],
  },
  'view_only_links.revoke': {
    methods: ["POST"],
    pattern: '/api/view-links/:id/revoke',
    tokens: [{"old":"/api/view-links/:id/revoke","type":0,"val":"api","end":""},{"old":"/api/view-links/:id/revoke","type":0,"val":"view-links","end":""},{"old":"/api/view-links/:id/revoke","type":1,"val":"id","end":""},{"old":"/api/view-links/:id/revoke","type":0,"val":"revoke","end":""}],
    types: placeholder as Registry['view_only_links.revoke']['types'],
  },
  'export.export_prd': {
    methods: ["GET","HEAD"],
    pattern: '/export/prd/:projectId',
    tokens: [{"old":"/export/prd/:projectId","type":0,"val":"export","end":""},{"old":"/export/prd/:projectId","type":0,"val":"prd","end":""},{"old":"/export/prd/:projectId","type":1,"val":"projectId","end":""}],
    types: placeholder as Registry['export.export_prd']['types'],
  },
  'export.export_uat': {
    methods: ["GET","HEAD"],
    pattern: '/export/uat/:projectId',
    tokens: [{"old":"/export/uat/:projectId","type":0,"val":"export","end":""},{"old":"/export/uat/:projectId","type":0,"val":"uat","end":""},{"old":"/export/uat/:projectId","type":1,"val":"projectId","end":""}],
    types: placeholder as Registry['export.export_uat']['types'],
  },
  'settings.show': {
    methods: ["GET","HEAD"],
    pattern: '/settings/:projectId',
    tokens: [{"old":"/settings/:projectId","type":0,"val":"settings","end":""},{"old":"/settings/:projectId","type":1,"val":"projectId","end":""}],
    types: placeholder as Registry['settings.show']['types'],
  },
  'settings.update': {
    methods: ["PATCH"],
    pattern: '/settings/:projectId',
    tokens: [{"old":"/settings/:projectId","type":0,"val":"settings","end":""},{"old":"/settings/:projectId","type":1,"val":"projectId","end":""}],
    types: placeholder as Registry['settings.update']['types'],
  },
  'integration.sync_triggers': {
    methods: ["POST"],
    pattern: '/api/integration/sync',
    tokens: [{"old":"/api/integration/sync","type":0,"val":"api","end":""},{"old":"/api/integration/sync","type":0,"val":"integration","end":""},{"old":"/api/integration/sync","type":0,"val":"sync","end":""}],
    types: placeholder as Registry['integration.sync_triggers']['types'],
  },
  'integration.get_status': {
    methods: ["GET","HEAD"],
    pattern: '/api/integration/status/:projectId',
    tokens: [{"old":"/api/integration/status/:projectId","type":0,"val":"api","end":""},{"old":"/api/integration/status/:projectId","type":0,"val":"integration","end":""},{"old":"/api/integration/status/:projectId","type":0,"val":"status","end":""},{"old":"/api/integration/status/:projectId","type":1,"val":"projectId","end":""}],
    types: placeholder as Registry['integration.get_status']['types'],
  },
  'test_cases.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/test-cases',
    tokens: [{"old":"/api/test-cases","type":0,"val":"api","end":""},{"old":"/api/test-cases","type":0,"val":"test-cases","end":""}],
    types: placeholder as Registry['test_cases.index']['types'],
  },
  'test_cases.store': {
    methods: ["POST"],
    pattern: '/api/test-cases',
    tokens: [{"old":"/api/test-cases","type":0,"val":"api","end":""},{"old":"/api/test-cases","type":0,"val":"test-cases","end":""}],
    types: placeholder as Registry['test_cases.store']['types'],
  },
  'test_cases.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/test-cases/:id',
    tokens: [{"old":"/api/test-cases/:id","type":0,"val":"api","end":""},{"old":"/api/test-cases/:id","type":0,"val":"test-cases","end":""},{"old":"/api/test-cases/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['test_cases.show']['types'],
  },
  'test_cases.update': {
    methods: ["PATCH"],
    pattern: '/api/test-cases/:id',
    tokens: [{"old":"/api/test-cases/:id","type":0,"val":"api","end":""},{"old":"/api/test-cases/:id","type":0,"val":"test-cases","end":""},{"old":"/api/test-cases/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['test_cases.update']['types'],
  },
  'test_cases.destroy': {
    methods: ["DELETE"],
    pattern: '/api/test-cases/:id',
    tokens: [{"old":"/api/test-cases/:id","type":0,"val":"api","end":""},{"old":"/api/test-cases/:id","type":0,"val":"test-cases","end":""},{"old":"/api/test-cases/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['test_cases.destroy']['types'],
  },
  'test_cases.reorder': {
    methods: ["POST"],
    pattern: '/api/test-cases/reorder',
    tokens: [{"old":"/api/test-cases/reorder","type":0,"val":"api","end":""},{"old":"/api/test-cases/reorder","type":0,"val":"test-cases","end":""},{"old":"/api/test-cases/reorder","type":0,"val":"reorder","end":""}],
    types: placeholder as Registry['test_cases.reorder']['types'],
  },
  'uploads.store': {
    methods: ["POST"],
    pattern: '/api/uploads',
    tokens: [{"old":"/api/uploads","type":0,"val":"api","end":""},{"old":"/api/uploads","type":0,"val":"uploads","end":""}],
    types: placeholder as Registry['uploads.store']['types'],
  },
  'uploads.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/uploads',
    tokens: [{"old":"/api/uploads","type":0,"val":"api","end":""},{"old":"/api/uploads","type":0,"val":"uploads","end":""}],
    types: placeholder as Registry['uploads.index']['types'],
  },
  'uploads.destroy': {
    methods: ["DELETE"],
    pattern: '/api/uploads/:id',
    tokens: [{"old":"/api/uploads/:id","type":0,"val":"api","end":""},{"old":"/api/uploads/:id","type":0,"val":"uploads","end":""},{"old":"/api/uploads/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['uploads.destroy']['types'],
  },
  'prd.competitors_index': {
    methods: ["GET","HEAD"],
    pattern: '/api/prd/competitors',
    tokens: [{"old":"/api/prd/competitors","type":0,"val":"api","end":""},{"old":"/api/prd/competitors","type":0,"val":"prd","end":""},{"old":"/api/prd/competitors","type":0,"val":"competitors","end":""}],
    types: placeholder as Registry['prd.competitors_index']['types'],
  },
  'prd.competitors_store': {
    methods: ["POST"],
    pattern: '/api/prd/competitors',
    tokens: [{"old":"/api/prd/competitors","type":0,"val":"api","end":""},{"old":"/api/prd/competitors","type":0,"val":"prd","end":""},{"old":"/api/prd/competitors","type":0,"val":"competitors","end":""}],
    types: placeholder as Registry['prd.competitors_store']['types'],
  },
  'prd.competitors_update': {
    methods: ["PATCH"],
    pattern: '/api/prd/competitors/:id',
    tokens: [{"old":"/api/prd/competitors/:id","type":0,"val":"api","end":""},{"old":"/api/prd/competitors/:id","type":0,"val":"prd","end":""},{"old":"/api/prd/competitors/:id","type":0,"val":"competitors","end":""},{"old":"/api/prd/competitors/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['prd.competitors_update']['types'],
  },
  'prd.competitors_destroy': {
    methods: ["DELETE"],
    pattern: '/api/prd/competitors/:id',
    tokens: [{"old":"/api/prd/competitors/:id","type":0,"val":"api","end":""},{"old":"/api/prd/competitors/:id","type":0,"val":"prd","end":""},{"old":"/api/prd/competitors/:id","type":0,"val":"competitors","end":""},{"old":"/api/prd/competitors/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['prd.competitors_destroy']['types'],
  },
  'prd.milestones_index': {
    methods: ["GET","HEAD"],
    pattern: '/api/prd/milestones',
    tokens: [{"old":"/api/prd/milestones","type":0,"val":"api","end":""},{"old":"/api/prd/milestones","type":0,"val":"prd","end":""},{"old":"/api/prd/milestones","type":0,"val":"milestones","end":""}],
    types: placeholder as Registry['prd.milestones_index']['types'],
  },
  'prd.milestones_store': {
    methods: ["POST"],
    pattern: '/api/prd/milestones',
    tokens: [{"old":"/api/prd/milestones","type":0,"val":"api","end":""},{"old":"/api/prd/milestones","type":0,"val":"prd","end":""},{"old":"/api/prd/milestones","type":0,"val":"milestones","end":""}],
    types: placeholder as Registry['prd.milestones_store']['types'],
  },
  'prd.milestones_update': {
    methods: ["PATCH"],
    pattern: '/api/prd/milestones/:id',
    tokens: [{"old":"/api/prd/milestones/:id","type":0,"val":"api","end":""},{"old":"/api/prd/milestones/:id","type":0,"val":"prd","end":""},{"old":"/api/prd/milestones/:id","type":0,"val":"milestones","end":""},{"old":"/api/prd/milestones/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['prd.milestones_update']['types'],
  },
  'prd.milestones_destroy': {
    methods: ["DELETE"],
    pattern: '/api/prd/milestones/:id',
    tokens: [{"old":"/api/prd/milestones/:id","type":0,"val":"api","end":""},{"old":"/api/prd/milestones/:id","type":0,"val":"prd","end":""},{"old":"/api/prd/milestones/:id","type":0,"val":"milestones","end":""},{"old":"/api/prd/milestones/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['prd.milestones_destroy']['types'],
  },
  'prd.open_questions_index': {
    methods: ["GET","HEAD"],
    pattern: '/api/prd/open-questions',
    tokens: [{"old":"/api/prd/open-questions","type":0,"val":"api","end":""},{"old":"/api/prd/open-questions","type":0,"val":"prd","end":""},{"old":"/api/prd/open-questions","type":0,"val":"open-questions","end":""}],
    types: placeholder as Registry['prd.open_questions_index']['types'],
  },
  'prd.open_questions_store': {
    methods: ["POST"],
    pattern: '/api/prd/open-questions',
    tokens: [{"old":"/api/prd/open-questions","type":0,"val":"api","end":""},{"old":"/api/prd/open-questions","type":0,"val":"prd","end":""},{"old":"/api/prd/open-questions","type":0,"val":"open-questions","end":""}],
    types: placeholder as Registry['prd.open_questions_store']['types'],
  },
  'prd.open_questions_update': {
    methods: ["PATCH"],
    pattern: '/api/prd/open-questions/:id',
    tokens: [{"old":"/api/prd/open-questions/:id","type":0,"val":"api","end":""},{"old":"/api/prd/open-questions/:id","type":0,"val":"prd","end":""},{"old":"/api/prd/open-questions/:id","type":0,"val":"open-questions","end":""},{"old":"/api/prd/open-questions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['prd.open_questions_update']['types'],
  },
  'prd.open_questions_destroy': {
    methods: ["DELETE"],
    pattern: '/api/prd/open-questions/:id',
    tokens: [{"old":"/api/prd/open-questions/:id","type":0,"val":"api","end":""},{"old":"/api/prd/open-questions/:id","type":0,"val":"prd","end":""},{"old":"/api/prd/open-questions/:id","type":0,"val":"open-questions","end":""},{"old":"/api/prd/open-questions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['prd.open_questions_destroy']['types'],
  },
  'prd.contacts_index': {
    methods: ["GET","HEAD"],
    pattern: '/api/prd/contacts',
    tokens: [{"old":"/api/prd/contacts","type":0,"val":"api","end":""},{"old":"/api/prd/contacts","type":0,"val":"prd","end":""},{"old":"/api/prd/contacts","type":0,"val":"contacts","end":""}],
    types: placeholder as Registry['prd.contacts_index']['types'],
  },
  'prd.contacts_store': {
    methods: ["POST"],
    pattern: '/api/prd/contacts',
    tokens: [{"old":"/api/prd/contacts","type":0,"val":"api","end":""},{"old":"/api/prd/contacts","type":0,"val":"prd","end":""},{"old":"/api/prd/contacts","type":0,"val":"contacts","end":""}],
    types: placeholder as Registry['prd.contacts_store']['types'],
  },
  'prd.contacts_update': {
    methods: ["PATCH"],
    pattern: '/api/prd/contacts/:id',
    tokens: [{"old":"/api/prd/contacts/:id","type":0,"val":"api","end":""},{"old":"/api/prd/contacts/:id","type":0,"val":"prd","end":""},{"old":"/api/prd/contacts/:id","type":0,"val":"contacts","end":""},{"old":"/api/prd/contacts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['prd.contacts_update']['types'],
  },
  'prd.contacts_destroy': {
    methods: ["DELETE"],
    pattern: '/api/prd/contacts/:id',
    tokens: [{"old":"/api/prd/contacts/:id","type":0,"val":"api","end":""},{"old":"/api/prd/contacts/:id","type":0,"val":"prd","end":""},{"old":"/api/prd/contacts/:id","type":0,"val":"contacts","end":""},{"old":"/api/prd/contacts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['prd.contacts_destroy']['types'],
  },
  'yaml_import.import_prd': {
    methods: ["POST"],
    pattern: '/api/yaml/import/prd/:projectId',
    tokens: [{"old":"/api/yaml/import/prd/:projectId","type":0,"val":"api","end":""},{"old":"/api/yaml/import/prd/:projectId","type":0,"val":"yaml","end":""},{"old":"/api/yaml/import/prd/:projectId","type":0,"val":"import","end":""},{"old":"/api/yaml/import/prd/:projectId","type":0,"val":"prd","end":""},{"old":"/api/yaml/import/prd/:projectId","type":1,"val":"projectId","end":""}],
    types: placeholder as Registry['yaml_import.import_prd']['types'],
  },
  'yaml_import.import_uat': {
    methods: ["POST"],
    pattern: '/api/yaml/import/uat/:projectId',
    tokens: [{"old":"/api/yaml/import/uat/:projectId","type":0,"val":"api","end":""},{"old":"/api/yaml/import/uat/:projectId","type":0,"val":"yaml","end":""},{"old":"/api/yaml/import/uat/:projectId","type":0,"val":"import","end":""},{"old":"/api/yaml/import/uat/:projectId","type":0,"val":"uat","end":""},{"old":"/api/yaml/import/uat/:projectId","type":1,"val":"projectId","end":""}],
    types: placeholder as Registry['yaml_import.import_uat']['types'],
  },
  'projects.tree': {
    methods: ["GET","HEAD"],
    pattern: '/api/projects/:id/tree',
    tokens: [{"old":"/api/projects/:id/tree","type":0,"val":"api","end":""},{"old":"/api/projects/:id/tree","type":0,"val":"projects","end":""},{"old":"/api/projects/:id/tree","type":1,"val":"id","end":""},{"old":"/api/projects/:id/tree","type":0,"val":"tree","end":""}],
    types: placeholder as Registry['projects.tree']['types'],
  },
  'projects.prd': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:id/prd',
    tokens: [{"old":"/projects/:id/prd","type":0,"val":"projects","end":""},{"old":"/projects/:id/prd","type":1,"val":"id","end":""},{"old":"/projects/:id/prd","type":0,"val":"prd","end":""}],
    types: placeholder as Registry['projects.prd']['types'],
  },
  'projects.uat': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:id/uat',
    tokens: [{"old":"/projects/:id/uat","type":0,"val":"projects","end":""},{"old":"/projects/:id/uat","type":1,"val":"id","end":""},{"old":"/projects/:id/uat","type":0,"val":"uat","end":""}],
    types: placeholder as Registry['projects.uat']['types'],
  },
  'public_view.show': {
    methods: ["GET","HEAD"],
    pattern: '/share/view/:token',
    tokens: [{"old":"/share/view/:token","type":0,"val":"share","end":""},{"old":"/share/view/:token","type":0,"val":"view","end":""},{"old":"/share/view/:token","type":1,"val":"token","end":""}],
    types: placeholder as Registry['public_view.show']['types'],
  },
  'public_sign_off.show': {
    methods: ["GET","HEAD"],
    pattern: '/share/sign/:token',
    tokens: [{"old":"/share/sign/:token","type":0,"val":"share","end":""},{"old":"/share/sign/:token","type":0,"val":"sign","end":""},{"old":"/share/sign/:token","type":1,"val":"token","end":""}],
    types: placeholder as Registry['public_sign_off.show']['types'],
  },
  'public_sign_off.submit': {
    methods: ["POST"],
    pattern: '/share/sign/:token',
    tokens: [{"old":"/share/sign/:token","type":0,"val":"share","end":""},{"old":"/share/sign/:token","type":0,"val":"sign","end":""},{"old":"/share/sign/:token","type":1,"val":"token","end":""}],
    types: placeholder as Registry['public_sign_off.submit']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
