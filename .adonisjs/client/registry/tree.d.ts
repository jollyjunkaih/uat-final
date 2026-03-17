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
    uatPdf: typeof routes['projects.uat_pdf']
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
  steps: {
    index: typeof routes['steps.index']
    store: typeof routes['steps.store']
    reorder: typeof routes['steps.reorder']
    show: typeof routes['steps.show']
    update: typeof routes['steps.update']
    destroy: typeof routes['steps.destroy']
    listImages: typeof routes['steps.list_images']
    uploadPhoto: typeof routes['steps.upload_photo']
    deleteStepImage: typeof routes['steps.delete_step_image']
    getStepImageFile: typeof routes['steps.get_step_image_file']
    uploadGif: typeof routes['steps.upload_gif']
    getGif: typeof routes['steps.get_gif']
    deleteGif: typeof routes['steps.delete_gif']
  }
  uploads: {
    store: typeof routes['uploads.store']
    index: typeof routes['uploads.index']
    destroy: typeof routes['uploads.destroy']
  }
  prd: {
    competitorsIndex: typeof routes['prd.competitors_index']
    competitorsStore: typeof routes['prd.competitors_store']
    competitorsUpdate: typeof routes['prd.competitors_update']
    competitorsDestroy: typeof routes['prd.competitors_destroy']
    milestonesIndex: typeof routes['prd.milestones_index']
    milestonesStore: typeof routes['prd.milestones_store']
    milestonesUpdate: typeof routes['prd.milestones_update']
    milestonesDestroy: typeof routes['prd.milestones_destroy']
    openQuestionsIndex: typeof routes['prd.open_questions_index']
    openQuestionsStore: typeof routes['prd.open_questions_store']
    openQuestionsUpdate: typeof routes['prd.open_questions_update']
    openQuestionsDestroy: typeof routes['prd.open_questions_destroy']
    contactsIndex: typeof routes['prd.contacts_index']
    contactsStore: typeof routes['prd.contacts_store']
    contactsUpdate: typeof routes['prd.contacts_update']
    contactsDestroy: typeof routes['prd.contacts_destroy']
  }
  userGuide: {
    index: typeof routes['user_guide.index']
    grouped: typeof routes['user_guide.grouped']
    store: typeof routes['user_guide.store']
    show: typeof routes['user_guide.show']
    update: typeof routes['user_guide.update']
    destroy: typeof routes['user_guide.destroy']
    pdf: typeof routes['user_guide.pdf']
  }
  yamlImport: {
    importPrd: typeof routes['yaml_import.import_prd']
    importUat: typeof routes['yaml_import.import_uat']
    importUserGuide: typeof routes['yaml_import.import_user_guide']
    refetchFromDisk: typeof routes['yaml_import.refetch_from_disk']
  }
  publicView: {
    show: typeof routes['public_view.show']
  }
  publicSignOff: {
    show: typeof routes['public_sign_off.show']
    submit: typeof routes['public_sign_off.submit']
  }
}
