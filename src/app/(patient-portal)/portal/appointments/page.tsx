'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/shared/DataTable'
import { formatDate } from '@/lib/utils'

interface Appointment {
  id: string
  date: Date
  startTime: Date
  status: string
  doctor: {
    name: string
  }
  service: {
    name: string
  }
}

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  async function fetchAppointments() {
    try {
      const response = await fetch('/api/portal/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data.data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statusColors = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  const columns = [
    {
      key: 'date',
      header: 'Date',
      render: (appointment: Appointment) => formatDate(appointment.date, 'PP'),
    },
    {
      key: 'time',
      header: 'Heure',
      render: (appointment: Appointment) =>
        formatDate(appointment.startTime, 'HH:mm'),
    },
    {
      key: 'doctor',
      header: 'Médecin',
      render: (appointment: Appointment) => appointment.doctor.name,
    },
    {
      key: 'service',
      header: 'Service',
      render: (appointment: Appointment) => appointment.service.name,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (appointment: Appointment) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[appointment.status as keyof typeof statusColors]
          }`}
        >
          {appointment.status}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Rendez-vous</h1>
          <p className="text-gray-600 mt-1">Consultez et gérez vos rendez-vous</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Prendre Rendez-vous
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={appointments}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="Aucun rendez-vous trouvé"
          />
        </CardContent>
      </Card>
    </div>
  )
}

console.log('Patient portal and PDF generation created successfully!');