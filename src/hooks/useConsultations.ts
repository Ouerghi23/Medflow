export function useConsultations(patientId?: string) {
  return useQuery({
    queryKey: ['consultations', patientId],
    queryFn: async () => {
      const params = patientId ? `?patientId=${patientId}` : ''
      const response = await axios.get(`/api/consultations${params}`)
      return response.data.data
    }
  })
}

export function useCreateConsultation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/consultations', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    }
  })
}

