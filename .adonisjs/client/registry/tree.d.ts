/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  dashboard: {
    index: typeof routes['dashboard.index']
  }
  projects: {
    index: typeof routes['projects.index']
    store: typeof routes['projects.store']
    show: typeof routes['projects.show']
    update: typeof routes['projects.update']
    destroy: typeof routes['projects.destroy']
    tree: typeof routes['projects.tree']
    prd: typeof routes['projects.prd']
    uat: typeof routes['projects.uat']
  }
  features: {
    index: typeof routes['features.index']
    store: typeof routes['features.store']
    show: typeof routes['features.show']
    update: typeof routes['features.update']
    destroy: typeof routes['features.destroy']
    reorder: typeof routes['features.reorder']
  }
  uatFlows: {
    index: typeof routes['uat_flows.index']
    store: typeof routes['uat_flows.store']
    show: typeof routes['uat_flows.show']
    update: typeof routes['uat_flows.update']
    destroy: typeof routes['uat_flows.destroy']
    reorder: typeof routes['uat_flows.reorder']
  }
  events: {
    index: typeof routes['events.index']
    store: typeof routes['events.store']
    show: typeof routes['events.show']
    update: typeof routes['events.update']
    destroy: typeof routes['events.destroy']
    reorder: typeof routes['events.reorder']
  }
  versions: {
    index: typeof routes['versions.index']
    store: typeof routes['versions.store']
    show: typeof routes['versions.show']
  }
  signOff: {
    index: typeof routes['sign_off.index']
    show: typeof routes['sign_off.show']
    initiate: typeof routes['sign_off.initiate']
    revoke: typeof routes['sign_off.revoke']
  }
  viewOnlyLinks: {
    index: typeof routes['view_only_links.index']
    store: typeof routes['view_only_links.store']
    revoke: typeof routes['view_only_links.revoke']
  }
  export: {
    exportPrd: typeof routes['export.export_prd']
    exportUat: typeof routes['export.export_uat']
  }
  settings: {
    show: typeof routes['settings.show']
    update: typeof routes['settings.update']
  }
  integration: {
    syncTriggers: typeof routes['integration.sync_triggers']
    getStatus: typeof routes['integration.get_status']
  }
  publicView: {
    show: typeof routes['public_view.show']
  }
  publicSignOff: {
    show: typeof routes['public_sign_off.show']
    submit: typeof routes['public_sign_off.submit']
  }
}
