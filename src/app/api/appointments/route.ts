import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { appointmentSchema } from '@/lib/validations';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    const where: any = {};

    // If user has a clinic, filter by clinic
    if (session.user.clinicId) {
      where.patient = {
        clinicId: session.user.clinicId,
      };
    }

    if (doctorId) where.doctorId = doctorId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      where.date = { gte: startDate, lt: endDate };
    }
    if (status) where.status = status;

    // If user is a doctor, only show their appointments
    if (session.user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: session.user.id },
      });
      if (doctor) {
        where.doctorId = doctor.id;
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ data: appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des rendez-vous' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = appointmentSchema.parse(body);

    // Check for conflicts
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId: validatedData.doctorId,
        date: validatedData.date,
        status: { not: 'CANCELLED' },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: 'Ce créneau horaire est déjà réservé' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: validatedData,
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du rendez-vous' },
      { status: 500 }
    );
  }
}