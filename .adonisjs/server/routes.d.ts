import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features.index': { paramsTuple?: []; params?: {} }
    'features.store': { paramsTuple?: []; params?: {} }
    'features.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features.reorder': { paramsTuple?: []; params?: {} }
    'uat_flows.index': { paramsTuple?: []; params?: {} }
    'uat_flows.store': { paramsTuple?: []; params?: {} }
    'uat_flows.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uat_flows.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uat_flows.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uat_flows.reorder': { paramsTuple?: []; params?: {} }
    'versions.index': { paramsTuple?: []; params?: {} }
    'versions.store': { paramsTuple?: []; params?: {} }
    'versions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sign_off.index': { paramsTuple?: []; params?: {} }
    'sign_off.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sign_off.initiate': { paramsTuple?: []; params?: {} }
    'sign_off.revoke': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'view_only_links.index': { paramsTuple?: []; params?: {} }
    'view_only_links.store': { paramsTuple?: []; params?: {} }
    'view_only_links.revoke': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'export.export_prd': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'export.export_uat': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'settings.show': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'settings.update': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'integration.sync_triggers': { paramsTuple?: []; params?: {} }
    'integration.get_status': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'steps.index': { paramsTuple?: []; params?: {} }
    'steps.store': { paramsTuple?: []; params?: {} }
    'steps.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'steps.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'steps.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'steps.reorder': { paramsTuple?: []; params?: {} }
    'steps.upload_image': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'steps.delete_image': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uploads.store': { paramsTuple?: []; params?: {} }
    'uploads.index': { paramsTuple?: []; params?: {} }
    'uploads.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.competitors_index': { paramsTuple?: []; params?: {} }
    'prd.competitors_store': { paramsTuple?: []; params?: {} }
    'prd.competitors_update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.competitors_destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.milestones_index': { paramsTuple?: []; params?: {} }
    'prd.milestones_store': { paramsTuple?: []; params?: {} }
    'prd.milestones_update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.milestones_destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.open_questions_index': { paramsTuple?: []; params?: {} }
    'prd.open_questions_store': { paramsTuple?: []; params?: {} }
    'prd.open_questions_update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.open_questions_destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.contacts_index': { paramsTuple?: []; params?: {} }
    'prd.contacts_store': { paramsTuple?: []; params?: {} }
    'prd.contacts_update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.contacts_destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'yaml_import.import_prd': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'yaml_import.import_uat': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'projects.tree': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.prd': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.uat': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'public_view.show': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'public_sign_off.show': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'public_sign_off.submit': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features.index': { paramsTuple?: []; params?: {} }
    'features.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uat_flows.index': { paramsTuple?: []; params?: {} }
    'uat_flows.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'versions.index': { paramsTuple?: []; params?: {} }
    'versions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sign_off.index': { paramsTuple?: []; params?: {} }
    'sign_off.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'view_only_links.index': { paramsTuple?: []; params?: {} }
    'export.export_prd': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'export.export_uat': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'settings.show': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'integration.get_status': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'steps.index': { paramsTuple?: []; params?: {} }
    'steps.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uploads.index': { paramsTuple?: []; params?: {} }
    'prd.competitors_index': { paramsTuple?: []; params?: {} }
    'prd.milestones_index': { paramsTuple?: []; params?: {} }
    'prd.open_questions_index': { paramsTuple?: []; params?: {} }
    'prd.contacts_index': { paramsTuple?: []; params?: {} }
    'projects.tree': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.prd': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.uat': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'public_view.show': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'public_sign_off.show': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features.index': { paramsTuple?: []; params?: {} }
    'features.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uat_flows.index': { paramsTuple?: []; params?: {} }
    'uat_flows.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'versions.index': { paramsTuple?: []; params?: {} }
    'versions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sign_off.index': { paramsTuple?: []; params?: {} }
    'sign_off.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'view_only_links.index': { paramsTuple?: []; params?: {} }
    'export.export_prd': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'export.export_uat': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'settings.show': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'integration.get_status': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'steps.index': { paramsTuple?: []; params?: {} }
    'steps.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uploads.index': { paramsTuple?: []; params?: {} }
    'prd.competitors_index': { paramsTuple?: []; params?: {} }
    'prd.milestones_index': { paramsTuple?: []; params?: {} }
    'prd.open_questions_index': { paramsTuple?: []; params?: {} }
    'prd.contacts_index': { paramsTuple?: []; params?: {} }
    'projects.tree': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.prd': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.uat': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'public_view.show': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'public_sign_off.show': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'features.store': { paramsTuple?: []; params?: {} }
    'features.reorder': { paramsTuple?: []; params?: {} }
    'uat_flows.store': { paramsTuple?: []; params?: {} }
    'uat_flows.reorder': { paramsTuple?: []; params?: {} }
    'versions.store': { paramsTuple?: []; params?: {} }
    'sign_off.initiate': { paramsTuple?: []; params?: {} }
    'sign_off.revoke': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'view_only_links.store': { paramsTuple?: []; params?: {} }
    'view_only_links.revoke': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'integration.sync_triggers': { paramsTuple?: []; params?: {} }
    'steps.store': { paramsTuple?: []; params?: {} }
    'steps.reorder': { paramsTuple?: []; params?: {} }
    'steps.upload_image': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uploads.store': { paramsTuple?: []; params?: {} }
    'prd.competitors_store': { paramsTuple?: []; params?: {} }
    'prd.milestones_store': { paramsTuple?: []; params?: {} }
    'prd.open_questions_store': { paramsTuple?: []; params?: {} }
    'prd.contacts_store': { paramsTuple?: []; params?: {} }
    'yaml_import.import_prd': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'yaml_import.import_uat': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'public_sign_off.submit': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
  }
  PATCH: {
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uat_flows.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.update': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'steps.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.competitors_update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.milestones_update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.open_questions_update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.contacts_update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uat_flows.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'steps.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'steps.delete_image': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uploads.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.competitors_destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.milestones_destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.open_questions_destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'prd.contacts_destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}