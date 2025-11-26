import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generatePrescriptionPDF } from '@/lib/pdf-generator'
import { formatDate } from '@/lib/utils'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const consultation = await prisma.consultation.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
      },
      include: {
        patient: true,
        doctor: true,
        prescriptions: true,
      },
    })

    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation non trouvée' },
        { status: 404 }
      )
    }

    const pdfData = {
      consultationId: consultation.id,
      date: formatDate(consultation.createdAt, 'PP'),
      patient: {
        firstName: consultation.patient.firstName,
        lastName: consultation.patient.lastName,
        dateOfBirth: formatDate(consultation.patient.dateOfBirth, 'PP'),
      },
      doctor: {
        name: consultation.doctor.name,
        specialization: consultation.doctor.specialization,
        licenseNumber: consultation.doctor.licenseNumber,
      },
      diagnosis: consultation.diagnosis,
      prescriptions: consultation.prescriptions,
    }

    const pdfBlob = await generatePrescriptionPDF(pdfData)
    const buffer = await pdfBlob.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ordonnance-${consultation.id}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Generate PDF error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du PDF' },
      { status: 500 }
    )
  }
}
