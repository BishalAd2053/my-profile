import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { UserProfile } from '../types/profile'

export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<UserProfile | null> => (await api.get('/profile')).data,
  })

