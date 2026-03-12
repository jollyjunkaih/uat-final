import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch, apiUpload } from '~/lib/api'

export interface Step {
  id: string
  uatFlowId: string
  name: string
  description: string | null
  sequence: number
  imageFileName: string | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

interface PaginatedResponse {
  data: Step[]
  metadata: { total: number; perPage: number; currentPage: number }
}

export function useSteps(uatFlowId: string | null) {
  return useQuery({
    queryKey: ['steps', uatFlowId],
    queryFn: () => apiFetch<PaginatedResponse>(`/api/steps?uatFlowId=${uatFlowId}&limit=100`),
    enabled: !!uatFlowId,
  })
}

export function useCreateStep(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      uatFlowId: string
      name: string
      description?: string
    }) => apiFetch('/api/steps', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useUpdateStep(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      uatFlowId: _uatFlowId,
      ...data
    }: { id: string; uatFlowId: string } & Record<string, unknown>) =>
      apiFetch(`/api/steps/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useDeleteStep(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, uatFlowId: _uatFlowId }: { id: string; uatFlowId: string }) =>
      apiFetch(`/api/steps/${id}`, { method: 'DELETE' }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useUploadStepImage(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ stepId, uatFlowId: _uatFlowId, file }: { stepId: string; uatFlowId: string; file: File }) => {
      const formData = new FormData()
      formData.append('image', file)
      return apiUpload(`/api/steps/${stepId}/image`, formData)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useDeleteStepImage(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ stepId, uatFlowId: _uatFlowId }: { stepId: string; uatFlowId: string }) =>
      apiFetch(`/api/steps/${stepId}/image`, { method: 'DELETE' }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}
