import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';
import z from 'zod';

import { router, publicProcedure, createHTTPServer } from './trpc';
import prisma from './db';

import 'dotenv/config';
import { createRepeatSlots } from './helpers';

const Doctor = z.object({
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email()
});

const SlotCreate = z.object({
  doctor_id: z.string(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  duration: z.coerce.number().min(15).max(60),
  repeat: z.string().optional()
});

const SlotGet = z.object({
  doctor_id: z.string(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date()
});

const SlotBook = z.object({
  slot_id: z.string()
});

const appRouter = router({
  // Show all doctors
  doctorList: publicProcedure.query(async () => {
    return prisma.doctor.findMany({});
  }),

  // Create a Doctor
  doctorCreate: publicProcedure.input(Doctor).mutation(async (opts) => {
    const { input } = opts;

    try {
      const doctor = await prisma.doctor.create({
        data: input
      });

      return doctor.id;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists.'
          });
        }
      }
    }

    return null;
  }),

  // Set/Create Slots
  slotCreate: publicProcedure.input(SlotCreate).mutation(async (opts) => {
    const { input } = opts;

    const startTime = input.start_time;
    const endTime = input.end_time;
    const day = 24 * 60 * 60 * 1000;
    const duration = input.duration * 60 * 1000;
    const repeat = input.repeat;

    if (
      endTime.getTime() - startTime.getTime() >= day ||
      startTime.getDate() !== endTime.getDate()
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Start and end time is longer then a day.'
      });
    }

    if (endTime.getTime() - startTime.getTime() < duration) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid date range.'
      });
    }

    const doctor = await prisma.doctor.findFirst({
      where: { id: input.doctor_id }
    });

    if (!doctor) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Doctor with doctor_id not exists.'
      });
    }

    const slots = createRepeatSlots(startTime, endTime, duration, repeat);

    return Promise.all(
      slots.map(async (slot) => {
        try {
          const created = await prisma.slots.create({
            data: {
              doctor_id: input.doctor_id,
              start_time: new Date(slot[0]),
              end_time: new Date(slot[1])
            }
          });

          return [...slot, created.id];
        } catch (err) {
          // This constrain is on DB level, and it
          // prevents creating slots with time crossover
          if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            if (err.message.match(/no_date_overlap/)) {
              return [...slot, undefined, 'Slot is already busy'];
            }
          }

          return slot;
        }
      })
    );
  }),

  // Create an Appointment (Book a Slot)
  appointmentCreate: publicProcedure.input(SlotBook).mutation(async (opts) => {
    const { input } = opts;

    try {
      await prisma.slots.update({
        data: {
          booked: new Date()
        },
        where: {
          id: input.slot_id,
          booked: null
        }
      });

      return true;
    } catch (err) {
      return false;
    }
  }),

  // Show All Booked Appointments
  showAllBooked: publicProcedure.input(SlotGet).query(async (opts) => {
    const { input } = opts;

    return prisma.slots.findMany({
      where: {
        booked: {
          not: null
        },
        doctor_id: input.doctor_id,
        start_time: {
          gte: input.start_time
        },
        end_time: {
          lte: input.end_time
        }
      }
    });
  }),

  // Show All Available Slots
  showAllAvailable: publicProcedure.input(SlotGet).query(async (opts) => {
    const { input } = opts;

    return prisma.slots.findMany({
      where: {
        booked: null,
        doctor_id: input.doctor_id,
        start_time: {
          gte: input.start_time
        },
        end_time: {
          lte: input.end_time
        }
      }
    });
  })
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter
});

server.listen(3000);
