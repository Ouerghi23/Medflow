import { PrismaClient, UserRole, Gender, BloodType, AppointmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a clinic
  const clinic = await prisma.clinic.upsert({
    where: { id: 'clinic-1' },
    update: {},
    create: {
      id: 'clinic-1',
      name: 'MedFlow Clinic',
      address: '123 Medical Street, Health City',
      phone: '+1234567890',
      email: 'contact@medflow.com',
    },
  });

  console.log('✓ Clinic created');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medflow.com' },
    update: {},
    create: {
      email: 'admin@medflow.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      clinicId: clinic.id,
    },
  });

  console.log('✓ Admin user created');

  // Create doctor user
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@medflow.com' },
    update: {},
    create: {
      email: 'doctor@medflow.com',
      password: await bcrypt.hash('doctor123', 10),
      role: UserRole.DOCTOR,
      firstName: 'John',
      lastName: 'Smith',
      phone: '+1234567891',
      clinicId: clinic.id,
    },
  });

  // Create doctor profile
  await prisma.doctor.upsert({
    where: { userId: doctor.id },
    update: {},
    create: {
      userId: doctor.id,
      speciality: 'General Practice',
      licenseNumber: 'DOC-12345',
    },
  });

  console.log('✓ Doctor created');

  // Create patient user
  const patient = await prisma.user.upsert({
    where: { email: 'patient@medflow.com' },
    update: {},
    create: {
      email: 'patient@medflow.com',
      password: await bcrypt.hash('patient123', 10),
      role: UserRole.PATIENT,
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '+1234567892',
      clinicId: clinic.id,
    },
  });

  // Create patient profile
  await prisma.patient.upsert({
    where: { userId: patient.id },
    update: {},
    create: {
      userId: patient.id,
      clinicId: clinic.id,
      gender: Gender.FEMALE,
      bloodType: BloodType.A_POSITIVE,
      dateOfBirth: new Date('1990-01-01'),
      address: '456 Patient Avenue',
      emergencyContact: '+1234567893',
    },
  });

  console.log('✓ Patient created');

  // Create services
  await prisma.service.createMany({
    data: [
      {
        clinicId: clinic.id,
        name: 'General Consultation',
        description: 'Standard medical consultation',
        price: 50.0,
      },
      {
        clinicId: clinic.id,
        name: 'Follow-up Visit',
        description: 'Follow-up consultation',
        price: 30.0,
      },
      {
        clinicId: clinic.id,
        name: 'Blood Test',
        description: 'Complete blood count',
        price: 75.0,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✓ Services created');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });