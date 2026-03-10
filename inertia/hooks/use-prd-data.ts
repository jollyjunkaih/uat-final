import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'

// --- Competitors ---
export interface PrdCompetitor {
  id: string
  projectId: string
  competitorName: string
  productNameOrLink: string | null
  sequence: number
}

export function useCompetitors(projectId: string) {
  return useQuery({
    queryKey: ['prd-competitors', projectId],
    queryFn: () =>
      apiFetch<{ data: PrdCompetitor[] }>(`/api/prd/competitors?projectId=${projectId}`),
  })
}

export function useCreateCompetitor(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { projectId: string; competitorName: string; productNameOrLink?: string }) =>
      apiFetch('/api/prd/competitors', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prd-competitors', projectId] })
    },
  })
}

export function useUpdateCompetitor(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Record<string, unknown>) =>
      apiFetch(`/api/prd/competitors/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prd-competitors', projectId] })
    },
  })
}

export function useDeleteCompetitor(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/prd/competitors/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prd-competitors', projectId] })
    },
  })
}

// --- Milestones ---
export interface PrdMilestone {
  id: string
  projectId: string
  department: string
  startDate: string | null
  status: string
  completionDate: string | null
  sequence: number
}

export function useMilestones(projectId: string) {
  return useQuery({
    queryKey: ['prd-milestones', projectId],
    queryFn: () =>
      apiFetch<{ data: PrdMilestone[] }>(`/api/prd/milestones?projectId=${projectId}`),
  })
}

export function useCreateMilestone(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      projectId: string
      department: string
      startDate?: string
      status?: string
      completionDate?: string
    }) => apiFetch('/api/prd/milestones', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prd-milestones', projectId] })
    },
  })
}

export function useUpdateMilestone(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Record<string, unknown>) =>
      apiFetch(`/api/prd/milestones/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prd-milestones', projectId] })
    },
  })
}

export function useDeleteMilestone(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/prd/milestones/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prd-milestones', projectId] })
    },
  })
}

// --- Open Questions ---
export interface PrdOpenQuestion {
  id: string
  projectId: string
  question: string
  answer: string | null
  dateAnswered: string | null
  sequence: number
}

export function useOpenQuestions(projectId: string) {
  return useQuery({
    queryKey: ['prd-open-questions', projectId],
    queryFn: () =>
      apiFetch<{ data: PrdOpenQuestion[] }>(`/api/prd/open-questions?projectId=${projectId}`),
  })
}

export function useCreateOpenQuestion(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      projectId: string
      question: string
      answer?: string
      dateAnswered?: string
    }) => apiFetch('/api/prd/open-questions', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prd-open-questions', projectId] })
    },
  })
}

export function useUpdateOpenQuestion(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Record<string, unknown>) =>
      apiFetch(`/api/prd/open-questions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prd-open-questions', projectId] })
    },
  })
}

export function useDeleteOpenQuestion(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/prd/open-questions/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prd-open-questions', projectId] })
    },
  })
}

// --- Contacts ---
export interface PrdContact {
  id: string
  projectId: string
  name: string
  title: string | null
  email: string | null
  phone: string | null
  sequence: number
}

export function useContacts(projectId: string) {
  return useQuery({
    queryKey: ['prd-contacts', projectId],
    queryFn: () => apiFetch<{ data: PrdContact[] }>(`/api/prd/contacts?projectId=${projectId}`),
  })
}

export function useCreateContact(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      projectId: string
      name: string
      title?: string
      email?: string
      phone?: string
    }) => apiFetch('/api/prd/contacts', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prd-contacts', projectId] })
    },
  })
}

export function useUpdateContact(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Record<string, unknown>) =>
      apiFetch(`/api/prd/contacts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prd-contacts', projectId] })
    },
  })
}

export function useDeleteContact(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/prd/contacts/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prd-contacts', projectId] })
    },
  })
}
