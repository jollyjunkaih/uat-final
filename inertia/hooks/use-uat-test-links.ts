import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'

export interface UatTestLink {
  id: string
  projectId: string
  token: string
  isActive: boolean
  expiresAt: string | null
  createdById: number
  createdAt: string
  updatedAt: string | null
}

export function useUatTestLinks(projectId: string) {
  return useQuery({
    queryKey: ['uat-test-links', projectId],
    queryFn: () =>
      apiFetch<{ data: UatTestLink[] }>(`/api/uat-test-links?projectId=${projectId}`),
  })
}

export function useCreateUatTestLink(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { projectId: string; expiresAt?: string }) =>
      apiFetch<{ data: { link: UatTestLink; url: string } }>('/api/uat-test-links', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uat-test-links', projectId] })
    },
  })
}

export function useRevokeUatTestLink(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/uat-test-links/${id}/revoke`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uat-test-links', projectId] })
    },
  })
}
