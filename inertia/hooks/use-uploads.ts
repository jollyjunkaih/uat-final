import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch, apiUpload } from '~/lib/api'

export interface Upload {
  id: string
  projectId: string
  fileName: string
  filePath: string
  mimeType: string
  size: number
  context: string
  createdAt: string
  updatedAt: string | null
}

interface UploadsResponse {
  data: Upload[]
}

export function useUploads(projectId: string, context = 'prd_additional_info') {
  return useQuery({
    queryKey: ['uploads', projectId, context],
    queryFn: () =>
      apiFetch<UploadsResponse>(`/api/uploads?projectId=${projectId}&context=${context}`),
  })
}

export function useUploadFile(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { file: File; context?: string }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('projectId', projectId)
      if (data.context) formData.append('context', data.context)
      return apiUpload<{ data: Upload }>('/api/uploads', formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads', projectId] })
    },
  })
}

export function useDeleteUpload(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/uploads/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads', projectId] })
    },
  })
}
