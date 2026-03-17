import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'

export interface Signator {
  id: string
  projectId: string
  name: string
  title: string | null
  sequence: number
}

export function useSignators(projectId: string) {
  return useQuery({
    queryKey: ['signators', projectId],
    queryFn: () =>
      apiFetch<{ data: Signator[] }>(`/api/signators?projectId=${projectId}`),
  })
}

export function useCreateSignator(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { projectId: string; name: string; title?: string }) =>
      apiFetch('/api/signators', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signators', projectId] })
    },
  })
}

export function useUpdateSignator(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Record<string, unknown>) =>
      apiFetch(`/api/signators/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signators', projectId] })
    },
  })
}

export function useDeleteSignator(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/signators/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signators', projectId] })
    },
  })
}
