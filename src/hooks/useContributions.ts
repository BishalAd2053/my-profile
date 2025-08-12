import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Contribution } from '../types/contribution'

export const useContributions = (year?: number) =>
  useQuery({
    queryKey: ['contributions', year],
    queryFn: async (): Promise<{ year: number; items: Contribution[] }> =>
      (await api.get('/stats/contributions', { params: year ? { year } : {} })).data,
  })

