import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'dashboard': ExtractProps<(typeof import('../../inertia/pages/dashboard.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'projects/index': ExtractProps<(typeof import('../../inertia/pages/projects/index.tsx'))['default']>
    'projects/show': ExtractProps<(typeof import('../../inertia/pages/projects/show.tsx'))['default']>
    'projects/tabs/features-tab': ExtractProps<(typeof import('../../inertia/pages/projects/tabs/features-tab.tsx'))['default']>
    'projects/tabs/prd-edit-tab': ExtractProps<(typeof import('../../inertia/pages/projects/tabs/prd-edit-tab.tsx'))['default']>
    'projects/tabs/prd-view-tab': ExtractProps<(typeof import('../../inertia/pages/projects/tabs/prd-view-tab.tsx'))['default']>
    'projects/tabs/uat-flows-tab': ExtractProps<(typeof import('../../inertia/pages/projects/tabs/uat-flows-tab.tsx'))['default']>
    'projects/tabs/uat-view-tab': ExtractProps<(typeof import('../../inertia/pages/projects/tabs/uat-view-tab.tsx'))['default']>
    'projects/tabs/uat-viewer-tab': ExtractProps<(typeof import('../../inertia/pages/projects/tabs/uat-viewer-tab.tsx'))['default']>
    'projects/tabs/user-guide-edit-tab': ExtractProps<(typeof import('../../inertia/pages/projects/tabs/user-guide-edit-tab.tsx'))['default']>
    'projects/tabs/user-guide-pdf-tab': ExtractProps<(typeof import('../../inertia/pages/projects/tabs/user-guide-pdf-tab.tsx'))['default']>
    'projects/tabs/user-guide-view-tab': ExtractProps<(typeof import('../../inertia/pages/projects/tabs/user-guide-view-tab.tsx'))['default']>
    'projects/tabs/versions-tab': ExtractProps<(typeof import('../../inertia/pages/projects/tabs/versions-tab.tsx'))['default']>
    'settings/index': ExtractProps<(typeof import('../../inertia/pages/settings/index.tsx'))['default']>
    'share/confirmed': ExtractProps<(typeof import('../../inertia/pages/share/confirmed.tsx'))['default']>
    'share/expired': ExtractProps<(typeof import('../../inertia/pages/share/expired.tsx'))['default']>
    'share/password': ExtractProps<(typeof import('../../inertia/pages/share/password.tsx'))['default']>
    'share/sign': ExtractProps<(typeof import('../../inertia/pages/share/sign.tsx'))['default']>
    'share/view': ExtractProps<(typeof import('../../inertia/pages/share/view.tsx'))['default']>
    'sign-off/panel': ExtractProps<(typeof import('../../inertia/pages/sign-off/panel.tsx'))['default']>
    'versions/index': ExtractProps<(typeof import('../../inertia/pages/versions/index.tsx'))['default']>
    'versions/show': ExtractProps<(typeof import('../../inertia/pages/versions/show.tsx'))['default']>
  }
}
