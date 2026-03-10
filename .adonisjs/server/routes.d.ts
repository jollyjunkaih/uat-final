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
    'events.index': { paramsTuple?: []; params?: {} }
    'events.store': { paramsTuple?: []; params?: {} }
    'events.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'events.reorder': { paramsTuple?: []; params?: {} }
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
    'events.index': { paramsTuple?: []; params?: {} }
    'events.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'versions.index': { paramsTuple?: []; params?: {} }
    'versions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sign_off.index': { paramsTuple?: []; params?: {} }
    'sign_off.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'view_only_links.index': { paramsTuple?: []; params?: {} }
    'export.export_prd': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'export.export_uat': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'settings.show': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'integration.get_status': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
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
    'events.index': { paramsTuple?: []; params?: {} }
    'events.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'versions.index': { paramsTuple?: []; params?: {} }
    'versions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sign_off.index': { paramsTuple?: []; params?: {} }
    'sign_off.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'view_only_links.index': { paramsTuple?: []; params?: {} }
    'export.export_prd': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'export.export_uat': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'settings.show': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'integration.get_status': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
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
    'events.store': { paramsTuple?: []; params?: {} }
    'events.reorder': { paramsTuple?: []; params?: {} }
    'versions.store': { paramsTuple?: []; params?: {} }
    'sign_off.initiate': { paramsTuple?: []; params?: {} }
    'sign_off.revoke': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'view_only_links.store': { paramsTuple?: []; params?: {} }
    'view_only_links.revoke': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'integration.sync_triggers': { paramsTuple?: []; params?: {} }
    'public_sign_off.submit': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
  }
  PATCH: {
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uat_flows.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.update': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
  }
  DELETE: {
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'features.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'uat_flows.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}