import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Project } from '../types/project'

export const useProjects = () =>
  useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => (await api.get('/projects')).data,
  })

