import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'
import { type Data } from '@generated/data'

export type UatFlow = Data.UatFlow

interface PaginatedResponse {
  data: UatFlow[]
  metadata: { total: number; perPage: number; currentPage: number }
}

export function useUatFlows(featureId: string | null) {
  return useQuery({
    queryKey: ['uat-flows', featureId],
    queryFn: () => apiFetch<PaginatedResponse>(`/api/uat-flows?featureId=${featureId}&limit=100`),
    enabled: !!featureId,
  })
}

export function useCreateUatFlow(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      featureId: string
      name: string
      description?: string
      preconditions?: string
    }) => apiFetch('/api/uat-flows', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['uat-flows', variables.featureId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useUpdateUatFlow(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      featureId,
      ...data
    }: { id: string; featureId: string } & Record<string, unknown>) =>
      apiFetch(`/api/uat-flows/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['uat-flows', variables.featureId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useDeleteUatFlow(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, featureId: _featureId }: { id: string; featureId: string }) =>
      apiFetch(`/api/uat-flows/${id}`, { method: 'DELETE' }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['uat-flows', variables.featureId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}
