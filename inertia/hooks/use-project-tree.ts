import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'
import type { Feature } from './use-features'

export interface TreeEvent {
  id: string
  uatFlowId: string
  model: string
  name: string
  description: string | null
  triggerType: string
  condition: string | null
  sequence: number
  expectedOutcome: string
  testStatus: string
  notes: string | null
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
  events: TreeEvent[]
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
