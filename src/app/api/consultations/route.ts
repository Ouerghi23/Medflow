export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['ADMIN', 'DOCTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = consultationSchema.parse(body);

    const consultation = await prisma.consultation.create({
      data: {
        appointmentId: validatedData.appointmentId,
        patientId: validatedData.patientId,
        doctorId: validatedData.doctorId,
        diagnosis: validatedData.diagnosis,
        symptoms: validatedData.symptoms,
        examination: validatedData.examination,
        notes: validatedData.notes,
        followUpDate: validatedData.followUpDate,
        tenantId: session.user.tenantId,
        prescriptions: {
          create: validatedData.prescriptions || [],
        },
      },
      include: {
        prescriptions: true,
      },
    });

    // Update appointment status
    await prisma.appointment.update({
      where: { id: validatedData.appointmentId },
      data: { status: 'COMPLETED' },
    });

    return NextResponse.json({
      success: true,
      data: consultation,
    });
  } catch (error: any) {
    console.error('Create consultation error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la consultation' },
      { status: 500 }
    );
  }
}

console.log('API Routes created successfully!');