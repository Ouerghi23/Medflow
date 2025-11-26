import { z } from 'zod';

export const appointmentSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  date: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()).optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).default('PENDING'),
});

export const consultationSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  diagnosis: z.string(),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
});

export const patientSchema = z.object({
  userId: z.string().uuid(),
  clinicId: z.string().uuid(),
  dateOfBirth: z.string().datetime().or(z.date()).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  bloodType: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE']).optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT']),
  clinicName: z.string().min(1),
});