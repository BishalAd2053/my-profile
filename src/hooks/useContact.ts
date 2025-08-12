import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { ContactRequest, ContactResponse } from '../types/message'

export function useContact() {
  return useMutation({
    mutationFn: async (payload: ContactRequest): Promise<ContactResponse> =>
      (await api.post('/contact', payload)).data,
  })
}

