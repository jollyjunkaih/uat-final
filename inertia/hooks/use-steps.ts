import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch, apiUpload } from '~/lib/api'

export interface StepImage {
  id: string
  stepId: string
  fileName: string
  sequence: number
  source: 'upload' | 'gif_extraction'
  createdAt: string
}

export interface Step {
  id: string
  uatFlowId: string
  name: string
  description: string | null
  sequence: number
  gifFileName: string | null
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

export function useStepImages(stepId: string | null) {
  return useQuery({
    queryKey: ['step-images', stepId],
    queryFn: () => apiFetch<{ data: StepImage[] }>(`/api/steps/${stepId}/images`),
    enabled: !!stepId,
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

export function useUploadStepPhoto(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ stepId, uatFlowId: _uatFlowId, file }: { stepId: string; uatFlowId: string; file: File }) => {
      const formData = new FormData()
      formData.append('image', file)
      return apiUpload(`/api/steps/${stepId}/images`, formData)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['step-images', variables.stepId] })
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useDeleteStepImage(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ imageId, stepId: _stepId, uatFlowId: _uatFlowId }: { imageId: string; stepId: string; uatFlowId: string }) =>
      apiFetch(`/api/step-images/${imageId}`, { method: 'DELETE' }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['step-images', variables.stepId] })
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useUploadStepGif(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ stepId, uatFlowId: _uatFlowId, file }: { stepId: string; uatFlowId: string; file: File }) => {
      const formData = new FormData()
      formData.append('gif', file)
      return apiUpload(`/api/steps/${stepId}/gif`, formData)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['step-images', variables.stepId] })
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useDeleteStepGif(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ stepId, uatFlowId: _uatFlowId }: { stepId: string; uatFlowId: string }) =>
      apiFetch(`/api/steps/${stepId}/gif`, { method: 'DELETE' }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['step-images', variables.stepId] })
      queryClient.invalidateQueries({ queryKey: ['steps', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}
