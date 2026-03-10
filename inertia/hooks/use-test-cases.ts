import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'

export interface TestCase {
  id: string
  uatFlowId: string
  testNo: number
  descriptionOfTasks: string
  stepsToExecute: string
  expectedResults: string
  pass: boolean
  fail: boolean
  defectComments: string | null
  sequence: number
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
}

interface PaginatedResponse {
  data: TestCase[]
  metadata: { total: number; perPage: number; currentPage: number }
}

export function useTestCases(uatFlowId: string | null) {
  return useQuery({
    queryKey: ['test-cases', uatFlowId],
    queryFn: () => apiFetch<PaginatedResponse>(`/api/test-cases?uatFlowId=${uatFlowId}&limit=100`),
    enabled: !!uatFlowId,
  })
}

export function useCreateTestCase(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      uatFlowId: string
      testNo: number
      descriptionOfTasks: string
      stepsToExecute: string
      expectedResults: string
      pass?: boolean
      fail?: boolean
      defectComments?: string
    }) => apiFetch('/api/test-cases', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['test-cases', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useUpdateTestCase(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      uatFlowId: _uatFlowId,
      ...data
    }: { id: string; uatFlowId: string } & Record<string, unknown>) =>
      apiFetch(`/api/test-cases/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['test-cases', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}

export function useDeleteTestCase(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, uatFlowId: _uatFlowId }: { id: string; uatFlowId: string }) =>
      apiFetch(`/api/test-cases/${id}`, { method: 'DELETE' }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['test-cases', variables.uatFlowId] })
      queryClient.invalidateQueries({ queryKey: ['project-tree', projectId] })
    },
  })
}
