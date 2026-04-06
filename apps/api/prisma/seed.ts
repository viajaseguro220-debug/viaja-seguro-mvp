import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type Role = 'admin' | 'driver' | 'passenger';

type QaUser = {
  alias: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  driverProfileStatus?: 'pending' | 'approved' | 'rejected';
  passengerProfileStatus?: 'pending' | 'approved' | 'rejected';
  createVehicle?: boolean;
};

const QA_PASSWORD = 'Test1234!';

const qaUsers: QaUser[] = [
  {
    alias: 'ADM-001',
    fullName: 'ADM-001 Admin QA',
    email: 'admin@viajaseguro.com',
    phone: '+5215500000000',
    role: 'admin',
    verificationStatus: 'approved'
  },
  {
    alias: 'DRV-001',
    fullName: 'DRV-001 Conductor QA',
    email: 'conductor1@hola.com',
    phone: '+5215500001001',
    role: 'driver',
    verificationStatus: 'approved',
    driverProfileStatus: 'approved',
    createVehicle: true
  },
  {
    alias: 'DRV-002',
    fullName: 'DRV-002 Conductor QA',
    email: 'conductor2@hola.com',
    phone: '+5215500001002',
    role: 'driver',
    verificationStatus: 'approved',
    driverProfileStatus: 'approved',
    createVehicle: true
  },
  {
    alias: 'DRV-003',
    fullName: 'DRV-003 Conductor QA',
    email: 'conductor3@hola.com',
    phone: '+5215500001003',
    role: 'driver',
    verificationStatus: 'pending',
    driverProfileStatus: 'pending'
  },
  {
    alias: 'DRV-004',
    fullName: 'DRV-004 Conductor QA',
    email: 'conductor4@hola.com',
    phone: '+5215500001004',
    role: 'driver',
    verificationStatus: 'rejected',
    driverProfileStatus: 'rejected'
  },
  {
    alias: 'DRV-005',
    fullName: 'DRV-005 Conductor QA',
    email: 'conductor5@hola.com',
    phone: '+5215500001005',
    role: 'driver',
    verificationStatus: 'approved',
    driverProfileStatus: 'approved',
    createVehicle: true
  },
  {
    alias: 'PAS-001',
    fullName: 'PAS-001 Pasajero QA',
    email: 'pasajero1@hola.com',
    phone: '+5215500002001',
    role: 'passenger',
    verificationStatus: 'approved',
    passengerProfileStatus: 'approved'
  },
  {
    alias: 'PAS-002',
    fullName: 'PAS-002 Pasajero QA',
    email: 'pasajero2@hola.com',
    phone: '+5215500002002',
    role: 'passenger',
    verificationStatus: 'approved',
    passengerProfileStatus: 'approved'
  },
  {
    alias: 'PAS-003',
    fullName: 'PAS-003 Pasajero QA',
    email: 'pasajero3@hola.com',
    phone: '+5215500002003',
    role: 'passenger',
    verificationStatus: 'pending',
    passengerProfileStatus: 'pending'
  },
  {
    alias: 'PAS-004',
    fullName: 'PAS-004 Pasajero QA',
    email: 'pasajero4@hola.com',
    phone: '+5215500002004',
    role: 'passenger',
    verificationStatus: 'rejected',
    passengerProfileStatus: 'rejected'
  },
  {
    alias: 'PAS-005',
    fullName: 'PAS-005 Pasajero QA',
    email: 'pasajero5@hola.com',
    phone: '+5215500002005',
    role: 'passenger',
    verificationStatus: 'approved',
    passengerProfileStatus: 'approved'
  }
];

function makeVehicleSeed(alias: string, userId: string, index: number) {
  return {
    driverUserId: userId,
    plates: `VSQ${(index + 1).toString().padStart(3, '0')}`,
    brand: 'Nissan',
    model: `Urvan ${alias}`,
    year: 2020 + (index % 4),
    color: 'Blanco',
    seatCount: 14,
    insurancePolicy: `POL-${alias}-2026`,
    status: 'approved'
  };
}

async function main() {
  const passwordHash = await bcrypt.hash(QA_PASSWORD, 10);

  const createdUsers: Array<{ alias: string; id: string; email: string; role: Role; verificationStatus: string }> = [];

  for (const [index, qaUser] of qaUsers.entries()) {
    const user = await prisma.user.upsert({
      where: { email: qaUser.email },
      update: {
        fullName: qaUser.fullName,
        phone: qaUser.phone,
        role: qaUser.role,
        verificationStatus: qaUser.verificationStatus,
        passwordHash,
        emergencyContactName: 'Soporte Viaja Seguro',
        emergencyContactPhone: '+5215500000099'
      },
      create: {
        fullName: qaUser.fullName,
        phone: qaUser.phone,
        email: qaUser.email,
        passwordHash,
        role: qaUser.role,
        verificationStatus: qaUser.verificationStatus,
        emergencyContactName: 'Soporte Viaja Seguro',
        emergencyContactPhone: '+5215500000099'
      }
    });

    if (qaUser.role === 'driver') {
      await prisma.driverProfile.upsert({
        where: { userId: user.id },
        update: {
          status: qaUser.driverProfileStatus ?? qaUser.verificationStatus
        },
        create: {
          userId: user.id,
          status: qaUser.driverProfileStatus ?? qaUser.verificationStatus
        }
      });

      if (qaUser.createVehicle) {
        await prisma.vehicle.upsert({
          where: { driverUserId: user.id },
          update: {
            ...makeVehicleSeed(qaUser.alias, user.id, index)
          },
          create: makeVehicleSeed(qaUser.alias, user.id, index)
        });
      }
    }

    if (qaUser.role === 'passenger') {
      await prisma.passengerProfile.upsert({
        where: { userId: user.id },
        update: {
          status: qaUser.passengerProfileStatus ?? qaUser.verificationStatus
        },
        create: {
          userId: user.id,
          status: qaUser.passengerProfileStatus ?? qaUser.verificationStatus
        }
      });
    }

    createdUsers.push({
      alias: qaUser.alias,
      id: user.id,
      email: user.email,
      role: qaUser.role,
      verificationStatus: user.verificationStatus
    });
  }

  console.table(createdUsers);
  console.log(`Seed QA listo. Password unica: ${QA_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
