import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'
import type { Feature } from './use-features'

export interface TreeStep {
  id: string
  uatFlowId: string
  name: string
  description: string | null
  sequence: number
  imageFileName: string | null
}

export interface TreeUatFlow {
  id: string
  featureId: string
  name: string
  description: string | null
  preconditions: string | null
  status: string
  version: number
  sequence: number
  steps: TreeStep[]
}

export interface TreeFeature extends Feature {
  uatFlows: TreeUatFlow[]
}

interface TreeResponse {
  data: TreeFeature[]
}

export function useProjectTree(projectId: string) {
  return useQuery({
    queryKey: ['project-tree', projectId],
    queryFn: () => apiFetch<TreeResponse>(`/api/projects/${projectId}/tree`),
  })
}
