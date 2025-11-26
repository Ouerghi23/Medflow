import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12);

    // Create clinic and admin user
    const clinic = await prisma.clinic.create({
      data: {
        name: validatedData.clinicName,
        email: validatedData.email,
        phone: validatedData.phone,
        staff: {
          create: {
            email: validatedData.email,
            password: hashedPassword,
            role: 'ADMIN',
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            phone: validatedData.phone,
          },
        },
      },
      include: {
        staff: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      data: { userId: clinic.staff[0].id },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du compte' },
      { status: 500 }
    );
  }
}