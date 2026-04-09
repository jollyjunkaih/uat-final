import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'
import { type Data } from '@generated/data'

export type Feature = Data.Feature

interface PaginatedResponse {
  data: Feature[]
  metadata: { total: number; perPage: number; currentPage: number }
}

export function useFeatures(projectId: string) {
  return useQuery({
    queryKey: ['features', projectId],
    queryFn: () => apiFetch<PaginatedResponse>(`/api/features?projectId=${projectId}&limit=100`),
  })
}

export function useCreateFeature(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      projectId: string
      name: string
      description?: string
      module?: string
      priority: string
      ownerId: string
      ecosystem?: string
      inScope?: string
      outOfScope?: string
    }) => apiFetch('/api/features', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useUpdateFeature(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Record<string, unknown>) =>
      apiFetch(`/api/features/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useDeleteFeature(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/features/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useUploadFeatureImage(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ featureId, file, type }: { featureId: string; file: File; type: 'mock-screens' | 'process-flows' }) => {
      const formData = new FormData()
      formData.append('image', file)
      return fetch(`/api/features/${featureId}/${type}`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      }).then((res) => {
        if (!res.ok) throw new Error('Upload failed')
        return res.json()
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useDeleteFeatureImage(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ featureId, fileName, type }: { featureId: string; fileName: string; type: 'mock-screens' | 'process-flows' }) =>
      apiFetch(`/api/features/${featureId}/${type}/${fileName}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}
