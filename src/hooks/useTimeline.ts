import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Experience } from '../types/experience'

export const useTimeline = () =>
  useQuery({
    queryKey: ['timeline'],
    queryFn: async (): Promise<Experience[]> => (await api.get('/timeline')).data,
  })

