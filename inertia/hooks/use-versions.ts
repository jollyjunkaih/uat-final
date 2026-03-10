import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'
import { type Data } from '@generated/data'

export type Version = Data.Version

interface PaginatedResponse {
  data: Version[]
  meta: { total: number; perPage: number; currentPage: number }
}

export function useVersions(projectId: string) {
  return useQuery({
    queryKey: ['versions', projectId],
    queryFn: () => apiFetch<PaginatedResponse>(`/versions?projectId=${projectId}&limit=100`),
  })
}

export function useCreateVersion(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { projectId: string; documentType: string }) =>
      apiFetch('/versions', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['versions', projectId] }),
  })
}
